export const dynamic = 'force-dynamic';
import React from "react";
import { format, subDays } from "date-fns";
import { isRhythmActiveToday, getRhythmVariantForDay } from "@/data/rhythmSchedule";

import { DailyShell } from "@/components/daily/DailyShell";
import { FinanceCommandCenter } from "@/components/finance/FinanceCommandCenter";
import { getEnergy } from "@/app/actions/setEnergy";

import { Greeting } from "@/components/daily/Greeting";
import { DailyMotto } from "@/components/dashboard/DailyMotto";
import { TodayEnergyCard } from "@/components/daily/TodayEnergyCard";
import { TodayLockCard } from "@/components/daily/TodayLockCard";
import { CriticalRoutinesSection } from "@/components/daily/CriticalRoutinesSection";
import { DailyPeakCard } from "@/components/daily/DailyPeakCard";
import { TodayTasksSection } from "@/components/daily/TodayTasksSection";
import { RhythmSummarySection } from "@/components/daily/RhythmSummarySection";

import { createServerSupabase } from "@/lib/supabaseServer";
import { getCurrentISOWeekKey, getCurrentWeekRange, formatDateForDB } from '@/lib/weekUtils';

// Weekly Components
import { WeeklyShell } from "@/components/weekly/WeeklyShell";
import { WeeklyMetricCard } from "@/components/weekly/WeeklyMetricCard";
import { WeeklyHeatmap } from "@/components/weekly/WeeklyHeatmap";
import { MinimumGainsCard } from "@/components/weekly/MinimumGainsCard";
import { ChargeDayCard } from "@/components/weekly/ChargeDayCard";

// Sport Components
import { SportShell } from "@/components/sport/SportShell";
import { WorkoutPlanColumn } from "@/components/sport/WorkoutPlanColumn";
import { MealPlanSection } from "@/components/sport/MealPlanSection";

// Nutrition (legacy — kept for BESLENME route alias)
import { NutritionShell } from "@/components/nutrition/NutritionShell";
import { NutritionCard } from "@/components/dashboard/NutritionCard";

// Health
import { HealthPage } from "@/components/health/HealthPage";

// Career / Gelişim Merdiveni
import { CareerShell } from "@/components/career/CareerShell";
import { CareerPhaseCard } from "@/components/career/CareerPhaseCard";
import { CareerLadderHero } from "@/components/career/CareerLadderHero";
import { ActiveStepCard } from "@/components/career/ActiveStepCard";

// Rhythms
import { RhythmsShell } from "@/components/rhythms/RhythmsShell";

// Analysis
import { AnalysisShell } from "@/components/analysis/AnalysisShell";

// Assistant
import { AssistantShell } from "@/components/assistant/AssistantShell";

// Library
import { LibraryShell } from "@/components/library/LibraryShell";
import { LibraryTodayCard } from "@/components/daily/LibraryTodayCard";

import {
  getTodayDayKey,
  getEnglishGroupForToday
} from '@/lib/dayUtils';
import { ensureTodayQuote } from "@/app/actions/quoteActions";
import { ensureWeekTEDRecommendations } from "@/app/actions/tedActions";
import { calculateTodayEnergy } from "@/lib/todayEnergy";
import { DuaPanel } from "@/components/daily/DuaPanel";
import { EndDayButton } from "@/components/daily/EndDayButton";

// DayKey → JS dayIndex helper
const DAY_KEY_MAP: Record<string, string> = {
  sun: "sunday", mon: "monday", tue: "tuesday",
  wed: "wednesday", thu: "thursday", fri: "friday", sat: "saturday",
};

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

  // ── SPOR ─────────────────────────────────────────────────────────────────
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

  // ── HAFTALIK ──────────────────────────────────────────────────────────────
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

  // ── GELİŞİM MERDİVENİ ─────────────────────────────────────────────────────
  if (tab === "GELISIM" || tab === "KARIYER") {
    const [
      { data: phases },
      { data: skills },
    ] = await Promise.all([
      supabase.from('career_phases').select('*').order('sort_order'),
      supabase.from('career_skills').select('*').order('sort_order'),
    ]);

    const ARCHIVED_TITLES = [
      "AgencyOS'u Tamamla ve Aktif Et",
      "Grafikcem Detaylı Branding Planlaması",
    ];

    const phasesWithSkills = phases?.map(phase => ({
      ...phase,
      skills: (skills?.filter(s => s.phase_id === phase.id) ?? []),
    })) || [];

    const activePhase = phasesWithSkills.find(p => p.is_active);
    const sortedPhases = [...phasesWithSkills].sort((a, b) => a.sort_order - b.sort_order);

    // For hero stats — exclude archived skills
    type RawSkill = { title: string; is_completed: boolean; sort_order: number };
    const activeSkillsFiltered: RawSkill[] = ((activePhase?.skills ?? []) as RawSkill[])
      .filter((s: RawSkill) => !ARCHIVED_TITLES.includes(s.title))
      .sort((a: RawSkill, b: RawSkill) => a.sort_order - b.sort_order);

    const activeSkillTitle = activeSkillsFiltered.find((s: RawSkill) => !s.is_completed)?.title ?? null;
    const nextSkillTitle = activeSkillsFiltered.filter((s: RawSkill) => !s.is_completed)[1]?.title ?? null;

    const completedLevels = sortedPhases.filter(p => {
      const phaseSkills = p.skills.filter((s: { title: string; is_completed: boolean }) => !ARCHIVED_TITLES.includes(s.title));
      return phaseSkills.length > 0 && phaseSkills.every((s: { is_completed: boolean }) => s.is_completed);
    }).length;

    const currentLevel = activePhase?.phase_number ?? 1;
    const totalLevels = sortedPhases.length;

    const activeProgressPct = activeSkillsFiltered.length > 0
      ? Math.round(activeSkillsFiltered.filter((s: RawSkill) => s.is_completed).length / activeSkillsFiltered.length * 100)
      : 0;

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <CareerShell>
            {/* 1. Ladder Hero */}
            <CareerLadderHero
              currentLevel={currentLevel}
              totalLevels={totalLevels}
              completedLevels={completedLevels}
              activeLevelTitle={activePhase?.title ?? ""}
              progressPercent={activeProgressPct}
            />

            {/* 2. Active Step Card */}
            {activePhase && (
              <ActiveStepCard
                phaseTitle={activePhase.title}
                activeSkillTitle={activeSkillTitle}
                nextSkillTitle={nextSkillTitle}
                phaseNumber={currentLevel}
              />
            )}

            {/* 3. All Levels Accordion */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#333] font-bold block mb-3">
                Tüm Seviyeler
              </span>
              <div className="space-y-3">
                {sortedPhases.map(phase => (
                  <CareerPhaseCard key={phase.id} phase={phase} />
                ))}
              </div>
            </div>
          </CareerShell>
        </div>
      </div>
    );
  }

  // ── SAĞLIK ────────────────────────────────────────────────────────────────
  if (tab === "SAGLIK" || tab === "BESLENME") {
    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <HealthPage />
        </div>
      </div>
    );
  }

  // ── FİNANS KOMUTA MERKEZİ ────────────────────────────────────────────────
  if (tab === "FINANS") {
    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <FinanceCommandCenter />
        </div>
      </div>
    );
  }

  // ── RİTİMLER ──────────────────────────────────────────────────────────────
  if (tab === "RITIMLER") {
    // Map todayDayKey (PZT/SAL etc.) to DayKey (monday/tuesday etc.)
    const dayIndexMap: Record<number, string> = {
      0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday",
      4: "thursday", 5: "friday", 6: "saturday",
    };
    const todayDayKeyFull = dayIndexMap[new Date().getDay()];

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <RhythmsShell todayDayKey={todayDayKeyFull} />
        </div>
      </div>
    );
  }

  // ── ANALİZ ────────────────────────────────────────────────────────────────
  if (tab === "ANALIZ") {
    const sevenDaysAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");

    const [
      { data: last7Scores },
      { data: peakLogs },
      { data: waitingTasks },
    ] = await Promise.all([
      supabase.from("daily_scores").select("date, total_score, completion_rate, finalized").gte("date", sevenDaysAgo).lte("date", today).order("date"),
      supabase.from("bad_habit_logs").select("log_date, success").gte("log_date", sevenDaysAgo).lte("log_date", today),
      supabase.from("active_tasks").select("id").eq("category", "waiting"),
    ]);

    // Ensure 7 days array (fill missing days)
    const scoreMap: Record<string, { date: string; total_score: number; completion_rate: number; finalized: boolean }> = {};
    last7Scores?.forEach(s => { scoreMap[s.date] = s as { date: string; total_score: number; completion_rate: number; finalized: boolean }; });

    const filledScores = Array.from({ length: 7 }, (_, i) => {
      const d = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      return scoreMap[d] ?? { date: d, total_score: 0, completion_rate: 0, finalized: false };
    });

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <AnalysisShell
            last7Scores={filledScores}
            peakLogs={peakLogs ?? []}
            waitingTasksCount={waitingTasks?.length ?? 0}
          />
        </div>
      </div>
    );
  }

  // ── KÜTÜPHANE ────────────────────────────────────────────────────────────
  if (tab === "KUTUPHANE") {
    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <LibraryShell />
        </div>
      </div>
    );
  }

  // ── ASİSTAN ───────────────────────────────────────────────────────────────
  if (tab === "ASISTAN") {
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    const [
      { data: templates },
      { data: completions },
      { data: rawActiveTasks },
      { data: yesterdayCompletions },
      { data: yesterdayPeakLogs },
    ] = await Promise.all([
      supabase.from("task_templates").select("*").order("sort_order"),
      supabase.from("daily_completions").select("template_id").eq("date", today),
      supabase.from("active_tasks").select("*").order("is_priority", { ascending: false }).order("sort_order"),
      supabase.from("daily_completions").select("template_id").eq("date", yesterday),
      supabase.from("bad_habit_logs").select("success").eq("log_date", yesterday),
    ]);

    const allTemplates = templates ?? [];
    const completedIds = new Set(completions?.map(c => c.template_id) ?? []);
    const kritikTasks = allTemplates.filter(t => t.section === 'kritik');
    const kritikCompletedCount = kritikTasks.filter(t => completedIds.has(t.id)).length;
    const criticalRoutineCompletionRate = kritikTasks.length > 0 ? kritikCompletedCount / kritikTasks.length : 0;

    const activeTasks = rawActiveTasks ?? [];
    const activeOnlyCount = activeTasks.filter(t => t.category === 'active' && !t.is_done).length;
    const waitingCount = activeTasks.filter(t => t.category === 'waiting').length;

    const dailyPeakClean: boolean | null =
      yesterdayPeakLogs && yesterdayPeakLogs.length > 0
        ? yesterdayPeakLogs.every(l => l.success)
        : null;

    const energyInput = {
      completedTasksYesterday: yesterdayCompletions?.length ?? 0,
      criticalRoutineCompletionRate,
      dailyPeakClean,
      activeTasksCount: activeOnlyCount,
      waitingTasksCount: waitingCount,
      rhythmCountToday: 0,
    };

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <AssistantShell energyInput={energyInput} today={today} />
        </div>
      </div>
    );
  }

  // ── GÜNLÜK (Default) ──────────────────────────────────────────────────────
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
      active_days: ['wed', 'sat', 'sun'],
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

        {/* 5. BUGÜNÜN KİLİDİ */}
        <TodayLockCard activeTasks={activeTasks} />

        {/* 6. KRİTİK RUTİNLER */}
        <CriticalRoutinesSection {...sharedTaskProps} />

        {/* 7. GÜNLÜK PEAK */}
        <DailyPeakCard />

        {/* 7.5. BUGÜNKÜ OKUMA */}
        <LibraryTodayCard />

        {/* 8. AKTİF GÖREVLER */}
        <TodayTasksSection {...sharedTaskProps} />

        {/* 9. RİTİMLER */}
        <RhythmSummarySection {...sharedTaskProps} />

        {/* 10. GÜNÜ BİTİR */}
        <EndDayButton score={initialTotalScore} isAlreadyFinalized={isAlreadyFinalized} />
      </DailyShell>
    </div>
  );
}
