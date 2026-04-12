"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { calculateDailyScore } from "@/lib/scoring";
import { calculateStage, calculateMood, type GoatStage } from "@/lib/goatState";
import { evaluateStreak } from "@/lib/streakLogic";

export async function endDay() {
  const supabase = createServerSupabase();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const todayIsSunday = new Date().getDay() === 0;

  // 1. Fetch today's tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("category, points, is_done, is_bonus")
    .eq("date", today);

  if (tasksError) {
    return { success: false as const, error: tasksError.message };
  }

  // 2. Calculate today's score
  const scoreBreakdown = calculateDailyScore(tasks || []);

  // 3. Upsert into daily_scores
  const { error: scoreError } = await supabase
    .from("daily_scores")
    .upsert(
      {
        date: today,
        discipline_points: scoreBreakdown.discipline,
        production_points: scoreBreakdown.production,
        health_points: scoreBreakdown.health,
        bonus_points: scoreBreakdown.bonus,
        total_score: scoreBreakdown.total,
        finalized: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "date" }
    );

  if (scoreError) {
    return { success: false as const, error: scoreError.message };
  }

  // 4. Fetch goat_state
  const { data: goatState, error: goatError } = await supabase
    .from("goat_state")
    .select("*")
    .eq("id", 1)
    .single();

  if (goatError || !goatState) {
    return { success: false as const, error: "Goat state not found" };
  }

  // 5. Fetch yesterday's score for streak calculation
  const { data: yesterdayScore } = await supabase
    .from("daily_scores")
    .select("total_score, finalized")
    .eq("date", yesterday)
    .single();

  const streakResult = evaluateStreak({
    currentStreak: goatState.current_streak,
    yesterdayScoreFinalized: yesterdayScore?.finalized ?? false,
    yesterdayScore: yesterdayScore?.total_score ?? 0,
    todayIsSunday,
    ritimKorumaUsed: false,
  });

  // 6. Consistency days
  let newConsistencyDays = goatState.consistency_days;
  if (scoreBreakdown.total >= 50) {
    newConsistencyDays += 1;
  }

  // 7. Stage calculation
  const oldStage = goatState.current_stage as GoatStage;
  const newStage = calculateStage(newConsistencyDays);
  const leveledUp = newStage !== oldStage;

  // 8. Mood for next state (score resets to 0 conceptually for "next day")
  const newMood = calculateMood({
    todayScore: 0,
    consecutiveLowDays: 0,
    hasCompletedP1Today: false,
  });

  // 9. Ritim koruma reset on new ISO week
  let ritimKoruma = goatState.ritim_koruma_count;
  const todayDate = new Date();
  if (todayDate.getDay() === 1) {
    ritimKoruma = 1;
  }

  // 10. Update goat_state
  const newStreak = streakResult.newStreak;
  const longestStreak = Math.max(goatState.longest_streak, newStreak);

  const { error: updateError } = await supabase
    .from("goat_state")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      consistency_days: newConsistencyDays,
      current_stage: newStage,
      current_mood: newMood,
      last_finalized_date: today,
      ritim_koruma_count: streakResult.ritimKorumaConsumed
        ? ritimKoruma - 1
        : ritimKoruma,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (updateError) {
    return { success: false as const, error: updateError.message };
  }

  revalidatePath("/");

  return {
    success: true as const,
    finalizedScore: scoreBreakdown.total,
    newStage,
    leveledUp,
  };
}
