export const dynamic = 'force-dynamic';
import React from "react";
import { format, subDays } from "date-fns";
import { isRhythmActiveToday, getRhythmVariantForDay } from "@/data/rhythmSchedule";

import { DailyShell } from "@/components/daily/DailyShell";
import { FinanceShell } from "@/components/finance/FinanceShell";
import { getEnergy } from "@/app/actions/setEnergy";

import { Greeting } from "@/components/daily/Greeting";
import { DailyMotto } from "@/components/dashboard/DailyMotto";
import { TodayEnergyCard } from "@/components/daily/TodayEnergyCard";
import { CriticalRoutinesSection } from "@/components/daily/CriticalRoutinesSection";
import { DailyPeakCard } from "@/components/daily/DailyPeakCard";
import { TodayTasksSection } from "@/components/daily/TodayTasksSection";
import { RhythmSummarySection } from "@/components/daily/RhythmSummarySection";

import { createServerSupabase } from "@/lib/supabaseServer";
import { computeFinanceSummary } from "@/lib/financeCalc";
import { getCurrentISOWeekKey, getCurrentWeekRange, formatDateForDB } from '@/lib/weekUtils';

// New Weekly Components
import { WeeklyShell } from "@/components/weekly/WeeklyShell";
import { WeeklyMetricCard } from "@/components/weekly/WeeklyMetricCard";
import { WeeklyHeatmap } from "@/components/weekly/WeeklyHeatmap";
import { MinimumGainsCard } from "@/components/weekly/MinimumGainsCard";
import { ChargeDayCard } from "@/components/weekly/ChargeDayCard";

// New Sport Components
import { SportShell } from "@/components/sport/SportShell";
import { WorkoutPlanColumn } from "@/components/sport/WorkoutPlanColumn";
import { MealPlanSection } from "@/components/sport/MealPlanSection";

// Nutrition Components
import { NutritionShell } from "@/components/nutrition/NutritionShell";
import { NutritionCard } from "@/components/dashboard/NutritionCard";
import { FinanceWidget } from "@/components/dashboard/FinanceWidget";

// New Career Components
import { CareerShell } from "@/components/career/CareerShell";
import { CareerPhaseCard } from "@/components/career/CareerPhaseCard";

import { 
  getTodayDayKey, 
  getEnglishGroupForToday 
} from '@/lib/dayUtils';
import { ensureTodayQuote } from "@/app/actions/quoteActions";
import { ensureWeekTEDRecommendations } from "@/app/actions/tedActions";
import { calculateTodayEnergy } from "@/lib/todayEnergy";
import { DuaPanel } from "@/components/daily/DuaPanel";
import { EndDayButton } from "@/components/daily/EndDayButton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await Promise.all([
    ensureTodayQuote(),
    ensureWeekTEDRecommendations(),
  ]);
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "GUNLUK";
  const supabase = createServerSupabase();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDayKey = getTodayDayKey();

  // Tab routing
  if (tab === "SPOR") {
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
          d.exercises?.sort((a, b) => a.sort_order - b.sort_order) ?? [],
      })) ?? [];

    const completedDayIds = new Set(
      completionsThisWeek?.map((c) => c.day_id) ?? []
    );

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <SportShell>
            <WorkoutPlanColumn
              days={sortedDays}
              completedDayIds={completedDayIds}
              todayDayKey={todayDayKey}
            />
            <div className="flex flex-col gap-6">
              <MealPlanSection meals={meals || []} />
            </div>
          </SportShell>
        </div>
      </div>
    );
  }

  if (tab === "HAFTALIK") {
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

    const completedDays =
      scores?.filter((s) => s.finalized && (s.completion_rate ?? 0) >= 70).length ?? 0;
    const weeklyTotal =
      scores?.reduce((sum, s) => sum + (s.finalized ? (s.total_score ?? 0) : 0), 0) ?? 0;
    const weeklyConsistency = weeklyGoatState?.weekly_consistency ?? 0;

    const completedGainIds = new Set(completions?.map((c) => c.gain_id) ?? []);
    const totalGains = gains?.length ?? 0;
    const gainsWithStatus =
      gains?.map((g) => ({
        id: g.id,
        title: g.title,
        due_day: g.due_day ?? undefined,
        isCompleted: completedGainIds.has(g.id),
      })) ?? [];
    const gainsCompleted = completedGainIds.size;

    const isTodayCharge = new Date().getDay() === 0;

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <WeeklyShell>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WeeklyMetricCard
                label="TAMAMLANAN GÜN"
                value={completedDays}
                total={7}
              />
              <WeeklyMetricCard
                label="HAFTALIK TOPLAM PUAN"
                value={weeklyTotal}
              />
              <WeeklyMetricCard
                label="TUTARLILIK"
                value={`%${weeklyConsistency}`}
              />
            </div>
            <WeeklyHeatmap weekDays={weekDays} scoresByDate={scoresByDate} />
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
              <MinimumGainsCard
                gains={gainsWithStatus}
                completedCount={gainsCompleted}
                totalCount={totalGains}
              />
              <ChargeDayCard
                isTodayCharge={isTodayCharge}
              />
            </div>
          </WeeklyShell>
        </div>
      </div>
    );
  }

  if (tab === "KARIYER") {
    const [
      { data: phases },
      { data: skills },
    ] = await Promise.all([
      supabase.from('career_phases').select('*').order('sort_order'),
      supabase.from('career_skills').select('*').order('sort_order'),
    ]);

    const phasesWithSkills = phases?.map(phase => ({
      ...phase,
      skills: skills?.filter(s => s.phase_id === phase.id) ?? [],
    })) || [];

    const activePhase = phasesWithSkills.find(p => p.is_active);
    const sortedPhases = [...phasesWithSkills].sort((a, b) => a.sort_order - b.sort_order);

    const todayDevStep = activePhase
      ? [...(activePhase.skills ?? [])].sort((a, b) => a.sort_order - b.sort_order).find(s => !s.is_completed)?.title ?? null
      : null;

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <CareerShell>
            <div className="mb-2">
              <span className="text-[#444444] text-[10px] uppercase tracking-widest block font-medium">
                GELİŞİM YOLU
              </span>
              {todayDevStep ? (
                <p className="text-xs text-[#555555] mt-1">
                  Bugünkü adım:{" "}
                  <span className="text-[#888888]">{todayDevStep}</span>
                </p>
              ) : (
                <p className="text-xs text-[#555555] mt-1">Aktif görev yok</p>
              )}
            </div>

            <div className="space-y-3">
              {sortedPhases.map(phase => (
                <CareerPhaseCard key={phase.id} phase={phase} />
              ))}
            </div>
          </CareerShell>
        </div>
      </div>
    );
  }

  if (tab === "BESLENME") {
    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <NutritionShell>
            <NutritionCard defaultOpen />
          </NutritionShell>
        </div>
      </div>
    );
  }

  if (tab === "FINANS") {
    const currentMonth = format(new Date(), "yyyy-MM");
    const [
      { data: financeState },
      { data: transactions = [] },
      { data: subscriptions = [] }
    ] = await Promise.all([
      supabase.from("finance_state").select("net_balance, status_label, status_description, severity").eq("id", 1).single(),
      supabase.from("finance_transactions").select("id, amount, type, title, created_at, month").eq("month", currentMonth).order("created_at", { ascending: false }),
      supabase.from("finance_subscriptions").select("id, title, amount, currency, is_active, notes, created_at").eq("is_active", true).order("amount", { ascending: false })
    ]);

    const incomeItems = (transactions || []).filter((t) => t.type === "income");
    const expenseItems = (transactions || []).filter((t) => t.type === "expense");
    const sumIncome = incomeItems.reduce((acc, t) => acc + (t.amount || 0), 0);
    const sumExpense = expenseItems.reduce((acc, t) => acc + (t.amount || 0), 0);
    const sumSubs = (subscriptions || []).reduce(
      (acc, s) => acc + (s.amount || 0),
      0
    );
    const summary = computeFinanceSummary(sumIncome, sumExpense, sumSubs);
    const safeState = financeState || {
      net_balance: 0,
      status_label: "VERİ BEKLENİYOR",
      status_description: "Henüz bir finansal veri girişi yapılmadı.",
      severity: "neutral",
    };

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <FinanceShell
            summary={summary}
            status={{
              label: safeState.status_label,
              description: safeState.status_description,
              severity: safeState.severity as "neutral" | "warning" | "danger" | "positive",
            }}
            incomeItems={incomeItems}
            expenseItems={expenseItems}
            subscriptionItems={subscriptions || []}
          />
        </div>
      </div>
    );
  }

  // Daily Tab (Default)
  const englishGroupKey = getEnglishGroupForToday();
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  const [
    { data: goatState },
    { data: templates },
    { data: completions },
    { data: rawActiveTasks },
    { data: quote },
    { data: vitaminPackagesData },
    { data: vitaminCompletions },
    { data: skincareCompletions },
    { data: yesterdayCompletions },
    { data: yesterdayPeakLogs },
    initialEnergy
  ] = await Promise.all([
    supabase.from("goat_state").select("last_finalized, current_streak").eq("id", 1).single(),
    supabase.from("task_templates").select("*").order("sort_order"),
    supabase.from("daily_completions").select("template_id").eq("date", today),
    supabase.from("active_tasks").select("*").order("is_priority", { ascending: false }).order("sort_order"),
    supabase.from("daily_quotes").select("*").eq("date", today).maybeSingle(),
    supabase.from('vitamin_packages').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('vitamin_package_completions').select('*').eq('date', today),
    supabase.from('skincare_completions').select('package_id').eq('date', today),
    supabase.from("daily_completions").select("template_id").eq("date", yesterday),
    supabase.from("bad_habit_logs").select("success").eq("log_date", yesterday),
    getEnergy()
  ]);

  let englishSubtasks: { id: string; title: string; isCompleted: boolean }[] = [];
  if (englishGroupKey) {
    const [
      { data: subtasks },
      { data: subCompletions }
    ] = await Promise.all([
      supabase.from('task_subtasks').select('*').eq('subtask_group', englishGroupKey).order('sort_order'),
      supabase.from('task_subtask_completions').select('*').eq('date', today)
    ]);
    const completedSet = new Set(subCompletions?.map(c => c.subtask_id) ?? []);
    englishSubtasks = subtasks?.map((s: any) => ({ ...s, isCompleted: completedSet.has(s.id) })) ?? [];
  }

  const todayDate = new Date();
  const dayOfWeekCheck = todayDate.getDay();
  const isTreadmillActive = isRhythmActiveToday('treadmill', todayDate);

  const takenVitaminSet = new Set(vitaminCompletions?.map(c => c.package_id) ?? []);
  const vitaminPackages = vitaminPackagesData?.map(p => ({
    ...p,
    isTaken: takenVitaminSet.has(p.id),
  })) ?? [];

  const completedSkincareIds = skincareCompletions?.map(c => c.package_id) ?? [];

  const completedIds = new Set(completions?.map(c => c.template_id) ?? []);
  const allTemplates = templates ?? [];
  const baseScore = allTemplates
    .filter(t => completedIds.has(t.id))
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  const activeTasks = rawActiveTasks ?? [];
  const kritikTasks = allTemplates.filter(t => t.section === 'kritik');

  // dailyPeakClean: dünkü 4 alışkanlığın tümü success ise true
  const dailyPeakClean: boolean | null =
    yesterdayPeakLogs && yesterdayPeakLogs.length > 0
      ? yesterdayPeakLogs.every(l => l.success)
      : null;

  const dayMap: Record<number, string> = {
    0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed',
    4: 'thu', 5: 'fri', 6: 'sat'
  };
  const currentDayKey = dayMap[new Date().getDay()];

  const englishVariant = getRhythmVariantForDay('english', todayDate);
  const treadmillVariant = getRhythmVariantForDay('treadmill', todayDate);
  const sazVariant = getRhythmVariantForDay('saz', todayDate);

  const sistemTasks = allTemplates
    .filter(t => {
      if (t.section !== 'sistem') return false;
      if (!t.active_days || t.active_days.length === 0) return true;
      return t.active_days.includes(currentDayKey);
    })
    .map(t => {
      if (t.system_type === 'english' && englishVariant) {
        return { ...t, title: englishVariant.optional
          ? `${englishVariant.label} (Opsiyonel)`
          : englishVariant.label };
      }
      if (t.system_type === 'treadmill' && treadmillVariant) {
        return { ...t, title: treadmillVariant.optional
          ? `${treadmillVariant.label} (Opsiyonel)`
          : treadmillVariant.label };
      }
      if (t.system_type === 'saz' && sazVariant) {
        return { ...t, title: sazVariant.optional
          ? `${sazVariant.label} (Opsiyonel)`
          : sazVariant.label };
      }
      return t;
    });

  // Inject virtual tasks for sport/saz when active but no DB record exists
  const sportVariant = getRhythmVariantForDay('sport', todayDate);
  if (isRhythmActiveToday('sport', todayDate) && !sistemTasks.some((t: any) => t.system_type === 'sport')) {
    sistemTasks.push({
      id: '__virtual_sport__',
      title: sportVariant?.label ?? 'Spor',
      section: 'sistem',
      system_type: 'sport',
      category: 'health',
      points: 20,
      active_days: ['mon', 'wed', 'fri', 'sat'],
      sort_order: 99,
    } as any);
  }
  if (isRhythmActiveToday('saz', todayDate) && !sistemTasks.some((t: any) => t.system_type === 'saz')) {
    sistemTasks.push({
      id: '__virtual_saz__',
      title: sazVariant?.optional
        ? `${sazVariant.label} (Opsiyonel)`
        : (sazVariant?.label ?? 'Saz'),
      section: 'sistem',
      system_type: 'saz',
      category: 'health',
      points: 5,
      active_days: ['sat', 'sun'],
      sort_order: 100,
    } as any);
  }

  const kritikCompletedCount = kritikTasks.filter(t => completedIds.has(t.id)).length;
  const criticalRoutineCompletionRate =
    kritikTasks.length > 0 ? kritikCompletedCount / kritikTasks.length : 0;

  const activeOnlyCount = activeTasks.filter(t => t.category === 'active' && !t.is_done).length;
  const waitingCount = activeTasks.filter(t => t.category === 'waiting').length;

  const energyData = calculateTodayEnergy({
    completedTasksYesterday: yesterdayCompletions?.length ?? 0,
    criticalRoutineCompletionRate,
    dailyPeakClean,
    activeTasksCount: activeOnlyCount,
    waitingTasksCount: waitingCount,
    rhythmCountToday: sistemTasks.length,
  });

  const safeGoatState = goatState || { last_finalized: null };

  const initialEnergyBonus =
    initialEnergy === 'HIGH' ? 10 :
    initialEnergy === 'MID'  ? 5  : 0;

  const initialTotalScore = Math.min(baseScore + initialEnergyBonus, 70);

  const isAlreadyFinalized = safeGoatState.last_finalized === today;

  const sharedTaskProps = {
    kritikTasks,
    sistemTasks,
    activeTasks,
    completedIds,
    englishSubtasks,
    isTreadmillActive,
    vitaminPackages,
    completedSkincareIds,
  };

  return (
    <div className="min-h-screen font-sans">
      <DailyShell>
        {/* 1. GREETING */}
        <Greeting />

        {/* 2. GECE DUASI + ALINTI */}
        <DuaPanel quote={quote?.quote} author={quote?.author} />

        {/* 3. GÜNLÜK MOTTO */}
        <DailyMotto />

        {/* 4. ENERJİ SEVİYESİ */}
        <TodayEnergyCard
          initialEnergy={initialEnergy}
          energyData={energyData}
          today={today}
          energyInput={{
            completedTasksYesterday: yesterdayCompletions?.length ?? 0,
            criticalRoutineCompletionRate,
            dailyPeakClean,
            activeTasksCount: activeOnlyCount,
            waitingTasksCount: waitingCount,
            rhythmCountToday: sistemTasks.length,
          }}
        />

        {/* 5. KRİTİK RUTİNLER */}
        <CriticalRoutinesSection {...sharedTaskProps} />

        {/* 6. GÜNLÜK PEAK */}
        <DailyPeakCard />

        {/* 7. AKTİF GÖREVLER */}
        <TodayTasksSection {...sharedTaskProps} />

        {/* 8. RİTİMLER */}
        <RhythmSummarySection {...sharedTaskProps} />

        {/* 9. BESLENME */}
        <NutritionCard />

        {/* 10. GÜNÜ BİTİR */}
        <EndDayButton score={initialTotalScore} isAlreadyFinalized={isAlreadyFinalized} />

        {/* FİNANS WİDGET (sabit sağ alt) */}
        <FinanceWidget />
      </DailyShell>
    </div>
  );
}
