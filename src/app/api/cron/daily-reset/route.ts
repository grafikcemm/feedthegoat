import { createServerSupabase } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabase()
  const today = new Date().toISOString().slice(0, 10)

  // Bugün template task'ları var mı?
  // (aktif görevler hariç)
  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('date', today)
    .neq('category', 'production')

  if (count && count > 0) {
    return NextResponse.json({ message: 'Tasks already exist for today' })
  }

  const { data: templates } = await supabase
    .from('task_templates')
    .select('*')
    .eq('is_active', true)

  if (!templates || templates.length === 0) {
    return NextResponse.json({ error: 'No active templates found' }, { status: 500 })
  }

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

  const { error } = await supabase.from('tasks').insert(newTasks)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: `Created ${newTasks.length} tasks for ${today}`
  })
}
