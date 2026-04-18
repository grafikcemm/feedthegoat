export const dynamic = 'force-dynamic';
import React from "react";
import { createServerSupabase } from "@/lib/supabaseServer";
import { getCurrentWeekRange, formatDateForDB, getCurrentISOWeekKey } from '@/lib/weekUtils';

import { WeeklyShell } from "@/components/weekly/WeeklyShell";
import { WeeklyMetricCard } from "@/components/weekly/WeeklyMetricCard";
import { WeeklyHeatmap } from "@/components/weekly/WeeklyHeatmap";
import { MinimumGainsCard } from "@/components/weekly/MinimumGainsCard";
import { ChargeDayCard } from "@/components/weekly/ChargeDayCard";

export default async function HaftalikArchivePage() {
  const supabase = createServerSupabase();

  const { start, end, days: weekDays } = getCurrentWeekRange();
  const startStr = formatDateForDB(start);
  const endStr = formatDateForDB(end);
  const isoWeek = getCurrentISOWeekKey();

  const [
    { data: scores },
    { data: gains },
    { data: completions },
    { data: weeklyGoatState },
  ] = await Promise.all([
    supabase.from("daily_scores").select("date, total_score, completion_rate, finalized").gte("date", startStr).lte("date", endStr),
    supabase.from("weekly_minimum_gains").select("id, title, due_day, sort_order, is_active").eq("is_active", true).order("sort_order"),
    supabase.from("weekly_gain_completions").select("gain_id").eq("iso_week", isoWeek),
    supabase.from("goat_state").select("current_streak, longest_streak, weekly_consistency").eq("id", 1).single(),
  ]);

  const scoresByDate: Record<string, { date: string; total_score: number; completion_rate: number }> = {};
  scores?.forEach((s) => {
    scoresByDate[s.date] = {
      date: s.date,
      total_score: s.total_score ?? 0,
      completion_rate: s.completion_rate ?? 0,
    };
  });

  const completedDays = scores?.filter((s) => s.finalized && (s.completion_rate ?? 0) >= 70).length ?? 0;
  const weeklyTotal = scores?.reduce((sum, s) => sum + (s.finalized ? (s.total_score ?? 0) : 0), 0) ?? 0;
  const weeklyConsistency = weeklyGoatState?.weekly_consistency ?? 0;

  const completedGainIds = new Set(completions?.map((c) => c.gain_id) ?? []);
  const totalGains = gains?.length ?? 0;
  const gainsWithStatus = gains?.map((g) => ({
    id: g.id,
    title: g.title,
    due_day: g.due_day ?? undefined,
    isCompleted: completedGainIds.has(g.id),
  })) ?? [];
  const gainsCompleted = completedGainIds.size;

  const isTodayCharge = new Date().getDay() === 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="pt-8 pl-4 pr-4">
        <WeeklyShell>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeeklyMetricCard label="TAMAMLANAN GÜN" value={completedDays} total={7} />
            <WeeklyMetricCard label="HAFTALIK TOPLAM PUAN" value={weeklyTotal} />
            <WeeklyMetricCard label="TUTARLILIK" value={`%${weeklyConsistency}`} />
          </div>

          <WeeklyHeatmap weekDays={weekDays} scoresByDate={scoresByDate} />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            <MinimumGainsCard gains={gainsWithStatus} completedCount={gainsCompleted} totalCount={totalGains} />
            <ChargeDayCard isTodayCharge={isTodayCharge} />
          </div>
        </WeeklyShell>
      </div>
    </div>
  );
}
