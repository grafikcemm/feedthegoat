'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

const Input = z.object({
  subtaskId: z.string().uuid(),
  parentTaskId: z.string().uuid(),
});

export async function toggleSubtask(input: z.infer<typeof Input>) {
  const parsed = Input.safeParse(input);
  if (!parsed.success) return { success: false };
  
  const { subtaskId, parentTaskId } = parsed.data;
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabase();

  // 1. Check current state of this subtask completion
  const { data: existing } = await supabase
    .from('task_subtask_completions')
    .select('id')
    .eq('subtask_id', subtaskId)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    await supabase.from('task_subtask_completions').delete().eq('id', existing.id);
  } else {
    await supabase.from('task_subtask_completions').insert({
      subtask_id: subtaskId,
      date: today,
    });
  }

  // 2. Refresh parent task completion state
  // Check if all subtasks for parent's group are complete
  const { data: parentTask } = await supabase
    .from('tasks')
    .select('system_type')
    .eq('id', parentTaskId)
    .single();

  if (parentTask?.system_type === 'english') {
    const dayMap: Record<number, string | null> = {
      1: 'english_monday', 
      3: 'english_wednesday', 
      5: 'english_friday', 
      6: 'english_saturday',
      0: null, 2: null, 4: null // Passive days
    };
    const groupKey = dayMap[new Date().getDay()];

    if (groupKey) {
      const { data: allSubtasks } = await supabase
        .from('task_subtasks')
        .select('id')
        .eq('subtask_group', groupKey);

      const subtaskIds = allSubtasks?.map(s => s.id) ?? [];

      const { data: completedToday } = await supabase
        .from('task_subtask_completions')
        .select('subtask_id')
        .eq('date', today)
        .in('subtask_id', subtaskIds);

      const allCompleted = subtaskIds.length > 0
        && (completedToday?.length ?? 0) === subtaskIds.length;

      await supabase
        .from('tasks')
        .update({ is_done: allCompleted, updated_at: new Date().toISOString() })
        .eq('id', parentTaskId);
    }
  }

  revalidatePath('/');
  return { success: true };
}
