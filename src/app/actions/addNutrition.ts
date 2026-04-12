'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabaseServer';

const Input = z.object({ quickItemId: z.string().uuid() });

export async function addNutrition(input: z.infer<typeof Input>) {
  const { quickItemId } = Input.parse(input);
  const supabase = createServerSupabase();

  const { data: item } = await supabase
    .from('nutrition_quick_items')
    .select('*')
    .eq('id', quickItemId)
    .single();

  if (!item) throw new Error('Quick item not found');

  await supabase.from('nutrition_logs').insert({
    title: item.title,
    protein_g: item.protein_g,
    calories: item.calories,
  });

  revalidatePath('/');
  return { success: true };
}
