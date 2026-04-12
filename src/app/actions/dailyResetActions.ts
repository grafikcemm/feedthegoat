'use server'

import { createServerSupabase } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'

export async function ensureTodayTasks(): Promise<void> {
  const supabase = createServerSupabase()
  const today = new Date().toISOString().slice(0, 10)

  // Bugün için template'ten gelmiş task var mı?
  // (production/aktif görevler hariç — onlar kullanıcı tarafından yönetilir)
  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('date', today)
    .neq('category', 'production')  // aktif görevlere bakma

  if (count && count > 0) return  // Zaten oluşturulmuş

  // Sadece is_active = true olan şablonları çek
  const { data: templates } = await supabase
    .from('task_templates')
    .select('*')
    .eq('is_active', true)

  if (!templates || templates.length === 0) return

  const newTasks = templates.map(t => ({
    title:       t.title,
    category:    t.category,
    time_of_day: t.time_of_day,
    points:      t.points,
    priority:    t.priority,
    is_bonus:    t.is_bonus,
    is_done:     false,
    date:        today,
    notes:       t.notes,
    system_type: t.system_type,
  }))

  await supabase.from('tasks').insert(newTasks)
  revalidatePath('/')
}
