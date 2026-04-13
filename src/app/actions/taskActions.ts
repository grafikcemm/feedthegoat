'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Template task'ı tamamla/geri al
export async function toggleTemplateTask(
  templateId: string,
  isCompleted: boolean
): Promise<void> {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)

  if (isCompleted) {
    await supabase
      .from('daily_completions')
      .delete()
      .eq('template_id', templateId)
      .eq('date', today)
  } else {
    await supabase
      .from('daily_completions')
      .upsert(
        { template_id: templateId, date: today },
        { onConflict: 'template_id,date' }
      )
  }
  revalidatePath('/')
}

// Aktif görev ekle
export async function addActiveTask(title: string): Promise<void> {
  const supabase = createClient()
  if (!title.trim()) return
  await supabase.from('active_tasks').insert({ title: title.trim() })
  revalidatePath('/')
}

// Aktif görevi sil
export async function deleteActiveTask(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('active_tasks').delete().eq('id', id)
  revalidatePath('/')
}

// Aktif görevi tamamla/geri al
export async function toggleActiveTask(
  id: string,
  isCurrentlyDone: boolean
): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('active_tasks')
    .update({ is_done: !isCurrentlyDone })
    .eq('id', id)
  revalidatePath('/')
}
