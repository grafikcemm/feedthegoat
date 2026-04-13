'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function takeVitaminPackage(packageId: string, parentTaskId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabase();

  // 1. Log the package as taken for today (ignore conflict if already exists)
  const { error: insertError } = await supabase
    .from('vitamin_package_completions')
    .upsert({ package_id: packageId, date: today }, { onConflict: 'package_id,date' });

  if (insertError) {
    console.error('[vitaminActions] Insert Error:', insertError);
    return { success: false, error: insertError.message };
  }

  // 2. Count active packages
  const { count: totalCount } = await supabase
    .from('vitamin_packages')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true);

  // 3. Count completions today
  const { count: completedCount } = await supabase
    .from('vitamin_package_completions')
    .select('id', { count: 'exact', head: true })
    .eq('date', today);

  // 4. Update parent Vitamin task if all active packages are taken
  if (completedCount !== null && totalCount !== null && completedCount >= totalCount) {
    // Find the template ID specifically for vitamin to be safe
    const { data: vitaminTemplate } = await supabase
      .from('task_templates')
      .select('id')
      .eq('system_type', 'vitamin')
      .single();

    if (vitaminTemplate) {
      const { error: taskError } = await supabase
        .from('daily_completions')
        .upsert({ 
          template_id: vitaminTemplate.id, 
          date: today 
        }, { onConflict: 'template_id,date' });
        
      if (taskError) {
        console.error('[vitaminActions] Task Upsert Error:', taskError);
      }
    }
  }

  revalidatePath('/');
  return { 
    success: true, 
    allTaken: (completedCount !== null && totalCount !== null && completedCount >= totalCount) 
  };
}

export async function getVitaminPackages() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('vitamin_packages')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('[vitaminActions] Fetch Error:', error);
    return [];
  }
  return data;
}
