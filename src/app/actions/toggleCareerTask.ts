'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';
import { CAREER_PHASES, computeCurrentPhase } from '@/lib/careerConfig';

const Input = z.object({ taskKey: z.string() });

export async function toggleCareerTask(input: z.infer<typeof Input>) {
  const { taskKey } = Input.parse(input);
  const supabase = createServerSupabase();

  // Check if already completed
  const { data: existing } = await supabase
    .from('career_task_completions')
    .select('id')
    .eq('task_key', taskKey)
    .maybeSingle();

  if (existing) {
    await supabase.from('career_task_completions').delete().eq('id', existing.id);
  } else {
    await supabase.from('career_task_completions').insert({ task_key: taskKey });
  }

  // Recompute current phase if not in override mode
  const { data: state } = await supabase
    .from('career_state')
    .select('override_active')
    .eq('id', 1)
    .single();

  if (state && !state.override_active) {
    const { data: allCompletions } = await supabase
      .from('career_task_completions')
      .select('task_key');

    const completedSet = new Set(allCompletions?.map(c => c.task_key) ?? []);
    const newPhase = computeCurrentPhase(completedSet);

    await supabase
      .from('career_state')
      .update({ current_phase: newPhase, updated_at: new Date().toISOString() })
      .eq('id', 1);
  }

  revalidatePath('/');
  return { success: true };
}
