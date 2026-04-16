'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Skill tamamla/geri al
export async function toggleCareerSkill(
  skillId: string,
  isDone: boolean
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('career_skills')
    .update({ is_done: !isDone })
    .eq('id', skillId)
  revalidatePath('/')
}

// Not ekle
export async function addCareerNote(
  phaseId: number,
  content: string
): Promise<void> {
  const supabase = createClient()
  if (!content.trim()) return
  await supabase.from('career_notes').insert({ phase_id: phaseId, content: content.trim() })
  revalidatePath('/')
}

// Faz tamamlandı — bir sonrakini aç
export async function completePhase(phaseId: number): Promise<void> {
  const supabase = createClient()

  // Mevcut fazı deaktif et
  await supabase
    .from('career_phases')
    .update({ is_active: false })
    .eq('id', phaseId)

  // Bir sonraki fazı aç ve aktif yap
  await supabase
    .from('career_phases')
    .update({ is_active: true, is_unlocked: true })
    .eq('id', phaseId + 1)

  revalidatePath('/')
}
