'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function takeSkincarePackage(packageId: string, parentTaskId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabase();

  // 1. Log the package as completed for today
  const { error: insertError } = await supabase.from('skincare_completions').upsert(
    { package_id: packageId, date: today },
    { onConflict: 'package_id,date' }
  );

  if (insertError) {
    console.error('[skincareActions] Insert Error:', insertError);
    return { success: false, error: insertError.message };
  }

  // 2. Count active packages
  const { data: allPackages } = await supabase
    .from('skincare_packages')
    .select('id');

  // 3. Count completions today
  const { data: completionsToday } = await supabase
    .from('skincare_completions')
    .select('package_id')
    .eq('date', today);

  const totalCount = allPackages?.length ?? 0;
  const completedCount = completionsToday?.length ?? 0;

  // 4. Update parent Skincare task if all packages are completed
  if (totalCount > 0 && completedCount === totalCount) {
    await supabase
      .from('daily_completions')
      .upsert({ 
        template_id: parentTaskId, 
        date: today 
      }, { onConflict: 'template_id,date' });
  }

  revalidatePath('/');
  return { success: true, allCompleted: completedCount === totalCount };
}

export async function getSkincarePackages() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('skincare_packages')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[skincareActions] Fetch Error:', error);
    return [];
  }
  return data;
}
