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
  const { data: allActive } = await supabase
    .from('vitamin_packages')
    .select('id')
    .eq('is_active', true);

  // 3. Count completions today
  const { data: takenToday } = await supabase
    .from('vitamin_package_completions')
    .select('package_id')
    .eq('date', today);

  const activeIds = new Set(allActive?.map(a => a.id) ?? []);
  const takenActiveCount = takenToday?.filter(t => activeIds.has(t.package_id)).length ?? 0;
  const totalActiveCount = activeIds.size;

  const allTaken = totalActiveCount > 0 && takenActiveCount === totalActiveCount;

  // 4. Update parent Vitamin task if all active packages are taken
  if (allTaken) {
    const { error: taskError } = await supabase
      .from('daily_completions')
      .upsert({ 
        template_id: parentTaskId, 
        date: today 
      }, { onConflict: 'template_id,date' });
      
    if (taskError) {
      console.error('[vitaminActions] Task Update Error:', taskError);
    }
  }

  revalidatePath('/');
  return { success: true, allTaken };
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
