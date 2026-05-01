'use server';

import { createServerSupabase } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function toggleSkillCompletion(skillId: number, isCompleted: boolean) {
  const supabase = createServerSupabase();
  
  const { error } = await supabase
    .from('career_skills')
    .update({ is_completed: isCompleted })
    .eq('id', skillId);

  if (error) {
    console.error('Error updating skill:', error);
    throw new Error('Failed to update skill');
  }

  revalidatePath('/');
}
