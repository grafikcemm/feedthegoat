"use server";

import { createClient } from "@/lib/supabase/server";

// Haftanın Pazartesi'sini hesapla
function getWeekStartDate(): string {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day; // Pazar ise geçen Pzt
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

export async function saveWeeklyAction(text: string) {
  const supabase = createClient();
  const weekStart = getWeekStartDate();

  const { error } = await supabase
    .from('weekly_actions')
    .upsert(
      { week_start_date: weekStart, action_taken: text.trim() },
      { onConflict: 'week_start_date' }
    );

  if (error) {
    console.error('[saveWeeklyAction] error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getThisWeekAction() {
  const supabase = createClient();
  const weekStart = getWeekStartDate();

  const { data } = await supabase
    .from('weekly_actions')
    .select('action_taken')
    .eq('week_start_date', weekStart)
    .single();

  return data?.action_taken || null;
}
