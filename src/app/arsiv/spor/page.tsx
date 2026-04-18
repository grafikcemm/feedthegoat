export const dynamic = 'force-dynamic';
import React from "react";
import { createServerSupabase } from "@/lib/supabaseServer";
import { getCurrentWeekRange, formatDateForDB } from '@/lib/weekUtils';
import { getTodayDayKey } from '@/lib/dayUtils';

import { SportShell } from "@/components/sport/SportShell";
import { WorkoutPlanColumn } from "@/components/sport/WorkoutPlanColumn";
import { MealPlanSection } from "@/components/sport/MealPlanSection";

export default async function SporArchievePage() {
  const supabase = createServerSupabase();
  const todayDayKey = getTodayDayKey();

  const { start, end } = getCurrentWeekRange();
  const startStr = formatDateForDB(start);
  const endStr = formatDateForDB(end);

  const [
    { data: days },
    { data: completionsThisWeek },
    { data: sportState },
    { data: meals }
  ] = await Promise.all([
    supabase.from("workout_days").select("id, day_type, day_of_week, sort_order, title, is_required, is_bonus, amac, exercises:workout_exercises(id, name, sets_reps, sort_order)").order("sort_order"),
    supabase.from("workout_completions").select("day_id, date").gte("date", startStr).lte("date", endStr),
    supabase.from("sport_state").select("id, protein_target_g, calorie_target, water_target_ml, ceo_breakfast_note").eq("id", 1).single(),
    supabase.from("meal_plan").select("id, meal_time, meal_label, items, total_protein_g, sort_order").order("sort_order", { ascending: true })
  ]);

  const sortedDays =
    days?.map((d) => ({
      ...d,
      exercises:
        d.exercises?.sort((a, b: any) => a.sort_order - b.sort_order) ?? [],
    })) ?? [];

  const completedDayIds = new Set(
    completionsThisWeek?.map((c) => c.day_id) ?? []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="pt-8 pl-4 pr-4">
        <SportShell>
          {/* Left Column: Workout Plan */}
          <WorkoutPlanColumn
            days={sortedDays}
            completedDayIds={completedDayIds}
            todayDayKey={todayDayKey}
          />

          {/* Right Column: Meal Plan Only */}
          <div className="flex flex-col gap-6">
            <MealPlanSection meals={meals || []} />
          </div>
        </SportShell>
      </div>
    </div>
  );
}
