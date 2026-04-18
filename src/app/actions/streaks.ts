"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordBadHabit(habitKey: string, success: boolean) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. Log upsert
  const { error: logError } = await supabase
    .from('bad_habit_logs')
    .upsert(
      { habit_key: habitKey, log_date: today, success },
      { onConflict: 'habit_key,log_date' }
    );
  
  if (logError) {
    console.error('[recordBadHabit] log error:', logError);
    return { success: false, error: logError.message };
  }

  // 2. Mevcut streak al
  const { data: streak, error: fetchError } = await supabase
    .from('bad_habit_streaks')
    .select('*')
    .eq('habit_key', habitKey)
    .single();

  if (fetchError || !streak) {
    console.error('[recordBadHabit] fetch error:', fetchError);
    return { success: false, error: 'Streak not found' };
  }

  // 3. Streak hesapla
  let newStreak: number;
  if (success) {
    newStreak = (streak.current_streak || 0) + 1;
  } else {
    newStreak = Math.floor((streak.current_streak || 0) * 0.5); // %50 küçülme
  }

  // 4. Streak güncelle
  const { error: updateError } = await supabase
    .from('bad_habit_streaks')
    .update({
      current_streak: newStreak,
      best_streak: Math.max(streak.best_streak || 0, newStreak),
      last_check_date: today
    })
    .eq('habit_key', habitKey);

  if (updateError) {
    console.error('[recordBadHabit] update error:', updateError);
    return { success: false, error: updateError.message };
  }

  return { 
    success: true, 
    newStreak, 
    bestStreak: Math.max(streak.best_streak || 0, newStreak) 
  };
}

export async function getBadHabitData() {
  const supabase = createClient();
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6); // Son 7 gün

  // Tüm streak'leri çek
  const { data: streaks } = await supabase
    .from('bad_habit_streaks')
    .select('*');

  // Son 7 günün loglarını çek
  const { data: logs } = await supabase
    .from('bad_habit_logs')
    .select('*')
    .gte('log_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('log_date', { ascending: true });

  return { streaks: streaks || [], logs: logs || [] };
}
