'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

const AddInput = z.object({ amountMl: z.number().int().positive() });

export async function addWater(input: z.infer<typeof AddInput>) {
  const { amountMl } = AddInput.parse(input);
  const supabase = createServerSupabase();
  await supabase.from('water_logs').insert({ amount_ml: amountMl });
  revalidatePath('/');
  return { success: true };
}

export async function resetWater() {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createServerSupabase();
  await supabase.from('water_logs').delete().eq('date', today);
  revalidatePath('/');
  return { success: true };
}
