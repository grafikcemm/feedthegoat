'use server';

import { createServerSupabase } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function saveRealityCheck({
  date,
  workHours,
  tasksTotal,
  tasksCompleted,
  score,
}: {
  date: string;
  workHours: number;
  tasksTotal: number;
  tasksCompleted: number;
  score: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabase();

  const { error } = await supabase.from('daily_scores').upsert(
    {
      date,
      total_score: score,
      work_hours: workHours,
      tasks_total: tasksTotal,
      tasks_completed: tasksCompleted,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'date' }
  );

  if (error) {
    console.error('[realityCheckActions] Error saving:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
