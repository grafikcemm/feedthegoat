export const dynamic = 'force-dynamic';
import React from "react";
import { format, subDays } from "date-fns";

import { DailyShell } from "@/components/daily/DailyShell";
import { TopBar } from "@/components/daily/TopBar";
import { TabNav } from "@/components/daily/TabNav";
import { HeroZone } from "@/components/daily/HeroZone";
import { TaskGroup } from "@/components/daily/TaskGroup";
import { EnergyCheckIn } from "@/components/daily/EnergyCheckIn";
import { QuoteBar } from "@/components/daily/QuoteBar";
import { XPostSection } from "@/components/daily/XPostSection";
import { FinanceShell } from "@/components/finance/FinanceShell";

// Legacy components for other tabs
import RightPanel from "@/components/RightPanel";

import { createServerSupabase } from "@/lib/supabaseServer";
import { computeFinanceSummary } from "@/lib/financeCalc";
import { getCurrentISOWeekKey, getCurrentWeekRange, formatDateForDB, DAY_LABELS_TR } from '@/lib/weekUtils';

// New Weekly Components
import { WeeklyShell } from "@/components/weekly/WeeklyShell";
import { WeeklyMetricCard } from "@/components/weekly/WeeklyMetricCard";
import { WeeklyHeatmap } from "@/components/weekly/WeeklyHeatmap";
import { MinimumGainsCard } from "@/components/weekly/MinimumGainsCard";
import { ChargeDayCard } from "@/components/weekly/ChargeDayCard";

// New Sport Components
import { SportShell } from "@/components/sport/SportShell";
import { WorkoutPlanColumn } from "@/components/sport/WorkoutPlanColumn";
import { NutritionPanel } from "@/components/sport/NutritionPanel";
import { MealPlanSection } from "@/components/sport/MealPlanSection";
import { DailySystemsCard } from "@/components/sport/DailySystemsCard";

// New Career Components
import { CAREER_PHASES, getPhaseCompletionPct, computeCurrentPhase } from '@/lib/careerConfig';
import { CareerShell } from "@/components/career/CareerShell";
import { KariyerOmurgasiCard } from "@/components/career/KariyerOmurgasiCard";
import { FocusStrip } from "@/components/career/FocusStrip";
import { ApiMetricsRow } from "@/components/career/ApiMetricsRow";
import { FilterSearchRow } from "@/components/career/FilterSearchRow";
import { PhaseTimeline } from "@/components/career/PhaseTimeline";
import { ActivePhaseDetail } from "@/components/career/ActivePhaseDetail";
import { OtherPhasesAccordion } from "@/components/career/OtherPhasesAccordion";

import { 
  getTodayDayKey, 
  getEnglishGroupForToday 
} from '@/lib/dayUtils';
import { ensureTodayQuote } from "@/app/actions/quoteActions";
import { DuaPanel } from "@/components/daily/DuaPanel";
import { EndDayButton } from "@/components/daily/EndDayButton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await ensureTodayQuote();
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

    // Parallelize all SPOR data fetching — Cleanup: removed nutrition/water logs
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
      <div className="min-h-screen">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
          <SportShell>
            {/* Left Column: Workout Plan */}
            <WorkoutPlanColumn
              days={sortedDays}
              completedDayIds={completedDayIds}
              todayDayKey={todayDayKey}
            />

            {/* Right Column: Nutrition + Systems */}
            <div className="flex flex-col gap-6">
              <NutritionPanel
                todayProtein={0}
                todayCalories={0}
                todayWater={0}
                proteinTarget={sportState?.protein_target_g || 180}
                calorieTarget={sportState?.calorie_target || 1600}
                waterTarget={sportState?.water_target_ml || 3000}
                avgProtein={0}
                avgCalories={0}
                avgWater={0}
              />

              <MealPlanSection meals={meals || []} />

              <DailySystemsCard
                ceo_breakfast_note={sportState?.ceo_breakfast_note}
              />
            </div>
          </SportShell>
        </div>
      </div>
    );
  }

  if (tab === "HAFTALIK") {
    const { start, end, days: weekDays } = getCurrentWeekRange();
    const isoWeek = getCurrentISOWeekKey();
    const startStr = formatDateForDB(start);
    const endStr = formatDateForDB(end);

    // Parallelize all HAFTALIK data fetching
    const [
      { data: scores },
      { data: gains },
      { data: completions },
      { data: rituals }
    ] = await Promise.all([
      supabase.from("daily_scores").select("date, total_score, finalized").gte("date", startStr).lte("date", endStr),
      supabase.from("weekly_minimum_gains").select("id, title, sort_order, is_active").eq("is_active", true).order("sort_order"),
      supabase.from("weekly_gain_completions").select("gain_id").eq("iso_week", isoWeek),
      supabase.from("charge_day_rituals").select("id, title, description, sort_order").order("sort_order")
    ]);

    // Build a date -> score map
    const scoresByDate: Record<string, number> = {};
    scores?.forEach((s) => {
      scoresByDate[s.date] = s.total_score;
    });

    // Compute metrics
    const completedDays =
      scores?.filter((s) => s.finalized && s.total_score >= 50).length ?? 0;
    const weeklyTotal =
      scores?.reduce((sum, s) => sum + (s.finalized ? s.total_score : 0), 0) ?? 0;

    let bestDayLabel = "—";
    let bestDayScore = 0;
    if (scores && scores.length > 0) {
      const best = scores.reduce((max, s) =>
        s.total_score > max.total_score ? s : max
      );
      if (best.total_score > 0) {
        const dayIndex = weekDays.findIndex((d) => formatDateForDB(d) === best.date);
        if (dayIndex >= 0) {
          bestDayLabel = DAY_LABELS_TR[dayIndex];
          bestDayScore = best.total_score;
        }
      }
    }

    const completedGainIds = new Set(completions?.map((c) => c.gain_id) ?? []);
    const gainsWithStatus =
      gains?.map((g) => ({
        id: g.id,
        title: g.title,
        isCompleted: completedGainIds.has(g.id),
      })) ?? [];
    const gainsCompleted = completedGainIds.size;

    const isTodayCharge = new Date().getDay() === 0; // 0 Sunday

    return (
      <div className="min-h-screen">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
          <WeeklyShell>
            {/* Zone 1: Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                label="MİNİMUM KAZANIM"
                value={gainsCompleted}
                total={5}
              />
              <WeeklyMetricCard
                label="EN İYİ GÜN"
                value={bestDayLabel}
                subValue={bestDayLabel !== "—" ? `${bestDayScore} puan` : ""}
              />
            </div>

            {/* Zone 2: 7-Day Heatmap Strip */}
            <WeeklyHeatmap weekDays={weekDays} scoresByDate={scoresByDate} />

            {/* Zone 3: Two-Column Layout — Minimum Gains + Şarj Günü */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
              <MinimumGainsCard
                gains={gainsWithStatus}
                completedCount={gainsCompleted}
              />
              <ChargeDayCard
                rituals={rituals || []}
                isTodayCharge={isTodayCharge}
              />
            </div>
          </WeeklyShell>
        </div>
      </div>
    );
  }

  if (tab === "KARIYER") {

    // Parallelize all KARIYER data fetching
    const [
      { data: backbone },
      { data: completions },
      { data: state }
    ] = await Promise.all([
      supabase.from("career_backbone").select("id, title, subtitle, su_an_odaklanilacak, simdilik_dokunma, ana_yon, ana_gelir_motoru, yardimci_motor, fiziksel_sigorta, karar_filtresi").eq("id", 1).single(),
      supabase.from("career_task_completions").select("task_key"),
      supabase.from("career_state").select("id, override_active, current_phase").eq("id", 1).single()
    ]);

    const completedKeys = new Set(completions?.map((c) => c.task_key) ?? []);

    // 4. Determine current phase
    const currentPhaseNumber = state?.override_active
      ? state.current_phase
      : computeCurrentPhase(completedKeys);

    const activePhase =
      CAREER_PHASES.find((p) => p.number === currentPhaseNumber) ||
      CAREER_PHASES[0];
    const otherPhases = CAREER_PHASES.filter(
      (p) => p.number !== currentPhaseNumber
    );

    // 5. Compute completion % for each phase (for the timeline dots)
    const completionsByPhase: Record<number, number> = {};
    CAREER_PHASES.forEach((p) => {
      completionsByPhase[p.number] = getPhaseCompletionPct(p, completedKeys);
    });

    return (
      <div className="min-h-screen">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
          <CareerShell>
            {/* Zone 1: Backbone & Focus */}
            <div className="flex flex-col gap-6">
              {backbone && <KariyerOmurgasiCard backbone={backbone} />}
              {backbone && (
                <FocusStrip
                  su_an_odaklanilacak={backbone.su_an_odaklanilacak}
                  simdilik_dokunma={backbone.simdilik_dokunma}
                />
              )}
            </div>

            {/* Zone 2: Static Placeholders */}
            <ApiMetricsRow />
            <FilterSearchRow />

            {/* Zone 3: Roadmap Timeline */}
            <PhaseTimeline
              phases={CAREER_PHASES}
              currentPhase={currentPhaseNumber}
              completionsByPhase={completionsByPhase}
            />

            {/* Zone 4: Active Phase Detail */}
            <ActivePhaseDetail
              phase={activePhase}
              completedKeys={completedKeys}
            />

            {/* Zone 5: Other Phases */}
            <OtherPhasesAccordion
              phases={otherPhases}
              completedKeys={completedKeys}
            />
          </CareerShell>
        </div>
      </div>
    );
  }

  if (tab === "FINANS") {
    const currentMonth = format(new Date(), "yyyy-MM");

    // 1. Parallelize all FINANS data fetching
    const [
      { data: financeState },
      { data: transactions = [] },
      { data: subscriptions = [] }
    ] = await Promise.all([
      supabase.from("finance_state").select("net_balance, status_label, status_description, severity").eq("id", 1).single(),
      supabase.from("finance_transactions").select("id, amount, type, description, category, created_at, month").eq("month", currentMonth).order("created_at", { ascending: false }),
      supabase.from("finance_subscriptions").select("id, name, amount, is_active, billing_day").eq("is_active", true).order("amount", { ascending: false })
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
      <div className="min-h-screen">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
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

  const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
  const englishGroupKey = getEnglishGroupForToday();

  // Parallelize primary Daily tab fetches — new architecture
  const [
    { data: goatState },
    { data: templates },
    { data: completions },
    { data: rawActiveTasks },
    { data: energyCheckIn },
    _, // Focus removal placeholder
    __, // 7-day scores removal placeholder
    { data: quote },
    { data: todayWorkout },
    { data: vitaminPackagesData },
    { data: vitaminCompletions },
    { data: skincareCompletions }
  ] = await Promise.all([
    supabase.from("goat_state").select("*").eq("id", 1).single(),
    supabase.from("task_templates").select("*").order("sort_order"),
    supabase.from("daily_completions").select("template_id").eq("date", today),
    supabase.from("active_tasks").select("*").order("sort_order"),
    supabase.from("energy_checkins").select("*").eq("date", today).maybeSingle(),
    null, // Focus removal
    null, // 7-day scores removal (HeatmapMini delete)
    supabase.from("daily_quotes").select("*").eq("date", today).maybeSingle(),
    supabase.from('workout_days').select('*').eq('day_of_week', todayDayKey).maybeSingle(),
    supabase.from('vitamin_packages').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('vitamin_package_completions').select('*').eq('date', today),
    supabase.from('skincare_completions').select('package_id').eq('date', today)
  ]);

  // Handle dependent subtasks
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

  const isTreadmillActive = todayWorkout?.day_type !== 'strength';

  // Vitamin Packages
  const takenVitaminSet = new Set(vitaminCompletions?.map(c => c.package_id) ?? []);
  const vitaminPackages = vitaminPackagesData?.map(p => ({
    ...p,
    isTaken: takenVitaminSet.has(p.id),
  })) ?? [];

  // Skincare Packages
  const completedSkincareIds = skincareCompletions?.map(c => c.package_id) ?? [];

  // --- Energy Selection: Cap + Tema ---
  const ENERGY_CONFIG = {
    LOW:    { label: 'DÜŞÜK', cap: 40, theme: 'muted'  },
    MID:    { label: 'ORTA',  cap: 55, theme: 'normal' },
    HIGH:   { label: 'YÜKSEK', cap: 70, theme: 'vivid' },
  } as const;

  const rawEnergy = (energyCheckIn?.energy as 'LOW' | 'MID' | 'HIGH') || 'HIGH';
  const energyLevel = rawEnergy === 'LOW' ? 'low' : rawEnergy === 'MID' ? 'medium' : 'high';
  const energyCap = ENERGY_CONFIG[rawEnergy]?.cap ?? 70;

  // --- New template-based scoring ---
  const completedIds = new Set(completions?.map(c => c.template_id) ?? []);
  const allTemplates = templates ?? [];

  const todayScore = allTemplates
    .filter(t => completedIds.has(t.id))
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  // --- IYILEŞTİRME 1 — Category-based Scores ---
  const disciplineMax = allTemplates
    .filter(t => t.category === 'discipline')
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  const healthMax = allTemplates
    .filter(t => t.category === 'health')
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  const disciplineScore = allTemplates
    .filter(t => t.category === 'discipline' && completedIds.has(t.id))
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  const healthScore = allTemplates
    .filter(t => t.category === 'health' && completedIds.has(t.id))
    .reduce((sum, t) => sum + (t.points ?? 0), 0);

  // Production bar: active_tasks (is_done = true) / total active_tasks
  const activeTasks = rawActiveTasks ?? [];
  const productionDone = activeTasks.filter(t => t.is_done).length;
  const productionTotal = activeTasks.length;

  const kritikTasks = allTemplates.filter(t => t.section === 'kritik');
  const xPostTask = allTemplates.find(t => t.section === 'x_post');
  const sistemTasks = allTemplates.filter(t => t.section === 'sistem');

  const remainingTasks = allTemplates.filter(t => !completedIds.has(t.id)).length;

  // Safe state
  const safeGoatState = goatState || {
    current_stage: "OGLAK" as const,
    current_streak: 0,
    consistency_days: 0,
    current_mood: "AC" as const
  };

  return (
    <div className="min-h-screen bg-ftg-bg font-mono">
      <DailyShell>
        <TopBar state={safeGoatState} />
        <TabNav />

        {/* --- YENİ SIRALAMA: Tek Sütun --- */}
        <div className="flex flex-col gap-0">
          {/* 1. DuaPanel */}
          <div className="px-8 pt-4">
            <DuaPanel />
          </div>

          {/* 2. QuoteBar */}
          <QuoteBar quote={quote} />

          {/* 3. HeroZone (Tam genişlik) */}
          <HeroZone 
            total={todayScore}
            disciplineScore={disciplineScore}
            disciplineMax={disciplineMax}
            healthScore={healthScore}
            healthMax={healthMax}
            productionDone={productionDone}
            productionTotal={productionTotal}
            mood={safeGoatState.current_mood}
            remainingTaskCount={remainingTasks}
            energyLevel={energyLevel}
            energyCap={energyCap}
          />

          {/* 4. BUGÜNÜN ENERJİSİ (HeroZone'un hemen altına taşındı) */}
          <div className="px-8 mt-4">
            <EnergyCheckIn currentEnergy={energyCheckIn?.energy || null} />
          </div>

          {/* 5. X PAYLAŞIMI */}
          <div className="px-8 mt-6">
            <XPostSection
              task={xPostTask}
              isDone={xPostTask ? completedIds.has(xPostTask.id) : false}
            />
          </div>

          {/* 6. RUTİNLER, GÖREVLER, SİSTEMLER (Tek sütun layout) */}
          <div className="px-8 py-8 flex flex-col gap-10">
            <TaskGroup
              kritikTasks={kritikTasks}
              sistemTasks={sistemTasks}
              activeTasks={activeTasks}
              completedIds={completedIds}
              englishSubtasks={englishSubtasks}
              isTreadmillActive={isTreadmillActive}
              vitaminPackages={vitaminPackages}
              completedSkincareIds={completedSkincareIds}
            />
            
            {/* 7. GÜNÜ BİTİR butonu (Sistemlerin altında) */}
            <div className="mt-4 border-t border-zinc-800 pt-8">
              <EndDayButton />
            </div>
          </div>
        </div>
      </DailyShell>
    </div>
  );
}
