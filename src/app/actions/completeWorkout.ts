'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

const Input = z.object({ dayId: z.string().uuid() });

export async function completeWorkout(input: z.infer<typeof Input>) {
  const { dayId } = Input.parse(input);
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from('workout_completions')
    .insert({ day_id: dayId, date: today });

  if (error && !error.message.includes('duplicate')) {
    throw error;
  }

  revalidatePath('/');
  return { success: true };
}
