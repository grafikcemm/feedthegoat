"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementWater() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  // Mevcut row'u al veya oluştur
  const { data: existing } = await supabase
    .from('water_log')
    .select('*')
    .eq('log_date', today)
    .single();

  if (existing) {
    // Max 3, daha fazla arttırma
    if (existing.bottles_completed >= 3) {
      return { success: true, bottlesCompleted: 3 };
    }
    const newCount = existing.bottles_completed + 1;
    await supabase
      .from('water_log')
      .update({ bottles_completed: newCount })
      .eq('log_date', today);
    return { success: true, bottlesCompleted: newCount };
  } else {
    // İlk tıklama — row oluştur
    await supabase
      .from('water_log')
      .insert({ log_date: today, bottles_completed: 1 });
    return { success: true, bottlesCompleted: 1 };
  }
}

export async function getTodayWater() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data } = await supabase
    .from('water_log')
    .select('bottles_completed')
    .eq('log_date', today)
    .single();

  return data?.bottles_completed || 0;
}

// Legacy exports for compatibility with old components
export async function addWater(params?: any) {
  return incrementWater();
}

export async function resetWater() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('water_log').delete().eq('log_date', today);
  return { success: true };
}
