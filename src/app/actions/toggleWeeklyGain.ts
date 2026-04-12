'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';
import { getCurrentISOWeekKey } from '@/lib/weekUtils';

const Input = z.object({ gainId: z.string().uuid() });

export async function toggleWeeklyGain(input: z.infer<typeof Input>) {
  const { gainId } = Input.parse(input);
  const isoWeek = getCurrentISOWeekKey();
  const supabase = createServerSupabase();

  const { data: existing } = await supabase
    .from('weekly_gain_completions')
    .select('id')
    .eq('gain_id', gainId)
    .eq('iso_week', isoWeek)
    .maybeSingle();

  if (existing) {
    await supabase.from('weekly_gain_completions').delete().eq('id', existing.id);
  } else {
    await supabase.from('weekly_gain_completions').insert({
      gain_id: gainId,
      iso_week: isoWeek,
    });
  }

  revalidatePath('/');
  return { success: true };
}
