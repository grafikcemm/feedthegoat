export const dynamic = 'force-dynamic';
import React from "react";
import { format, subDays } from "date-fns";

import { DailyShell } from "@/components/daily/DailyShell";
import { TopBar } from "@/components/daily/TopBar";
import { TabNav } from "@/components/daily/TabNav";
import { HeroZone } from "@/components/daily/HeroZone";
import { TaskGroup } from "@/components/daily/TaskGroup";
import { EnergyCheckIn } from "@/components/daily/EnergyCheckIn";
import { QuoteCard } from "@/components/daily/QuoteCard";
import { XPostSection } from "@/components/daily/XPostSection";
import { ScoringBars } from "@/components/daily/ScoringBars";
import { FinanceShell } from "@/components/finance/FinanceShell";

// Legacy components for other tabs
import RightPanel from "@/components/RightPanel";

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

// New Career Components
import { CareerShell } from "@/components/career/CareerShell";
import { ActivePhaseCard } from "@/components/career/ActivePhaseCard";
import { PhaseCollapse } from "@/components/career/PhaseCollapse";
import { PhaseProgressBar } from "@/components/career/PhaseProgressBar";

import { 
  getTodayDayKey, 
  getEnglishGroupForToday 
} from '@/lib/dayUtils';
import { ensureTodayQuote } from "@/app/actions/quoteActions";
import { ensureWeekTEDRecommendations } from "@/app/actions/tedActions";
import { getWeekStart } from "@/lib/dates";
import { DuaPanel } from "@/components/daily/DuaPanel";
import { EndDayButton } from "@/components/daily/EndDayButton";
import { TEDCard } from "@/components/daily/TEDCard";
import { EveningAlert } from "@/components/daily/EveningAlert";

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
      <div className="min-h-screen bg-[#000000]">
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

            {/* Right Column: Meal Plan Only */}
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

    // Parallelize all HAFTALIK data fetching
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

    // Build a date -> full score data map (for heatmap colors)
    const scoresByDate: Record<string, { date: string; total_score: number; completion_rate: number }> = {};
    scores?.forEach((s) => {
      scoresByDate[s.date] = {
        date: s.date,
        total_score: s.total_score ?? 0,
        completion_rate: s.completion_rate ?? 0,
      };
    });

    // Compute metrics
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

    const isTodayCharge = new Date().getDay() === 0; // 0 Sunday

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
          <WeeklyShell>
            {/* Zone 1: Top Metric Cards */}
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

            {/* Zone 2: 7-Day Heatmap Strip */}
            <WeeklyHeatmap weekDays={weekDays} scoresByDate={scoresByDate} />

            {/* Zone 3: Two-Column Layout — Minimum Gains + Şarj Günü */}
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

    // Parallelize all KARIYER data fetching — new DB-driven architecture
    const [
      { data: phases },
      { data: skills },
      { data: notes },
    ] = await Promise.all([
      supabase.from('career_phases').select('*').order('sort_order'),
      supabase.from('career_skills').select('*').order('sort_order'),
      supabase.from('career_notes').select('*').order('created_at', { ascending: false }),
    ]);

    // Fazlara skill ve notları bağla
    const phasesWithData = phases?.map(phase => ({
      ...phase,
      skills: skills?.filter(s => s.phase_id === phase.id) ?? [],
      notes: notes?.filter(n => n.phase_id === phase.id) ?? [],
    })) ?? [];

    const activePhase = phasesWithData.find(p => p.is_active);
    const otherPhases = phasesWithData.filter(p => !p.is_active);

    return (
      <div className="min-h-screen bg-[#000000]">
        <div className="pt-8">
          <nav className="mb-6 px-8 max-w-5xl mx-auto">
            <TabNav />
          </nav>
          <CareerShell>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-[#ffffff] text-xl font-bold tracking-tight uppercase">
                KARİYER YOL HARİTASI
              </h1>
              <p className="text-xs text-[#666666] mt-1">
                B2B AaaS Builder & AI-Native Creative Orchestrator
              </p>
            </div>

            {/* Phase Progress Bar */}
            <PhaseProgressBar phases={phasesWithData} />

            {/* Active Phase */}
            {activePhase && <ActivePhaseCard phase={activePhase} />}

            {/* Other Phases */}
            {otherPhases.length > 0 && <PhaseCollapse phases={otherPhases} />}
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
      <div className="min-h-screen bg-[#000000]">
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

  // Treadmill is passive on Sundays (0) and Wednesdays (3)
  const dayOfWeekCheck = new Date().getDay();
  const isTreadmillPassive = dayOfWeekCheck === 0 || dayOfWeekCheck === 3;
  const isTreadmillActive = !isTreadmillPassive;

  // Vitamin Packages
  const takenVitaminSet = new Set(vitaminCompletions?.map(c => c.package_id) ?? []);
  const vitaminPackages = vitaminPackagesData?.map(p => ({
    ...p,
    isTaken: takenVitaminSet.has(p.id),
  })) ?? [];

  // Skincare Packages
  const completedSkincareIds = skincareCompletions?.map(c => c.package_id) ?? [];

  // TED Recommendation — weekend only
  const todayDate = new Date();
  const dayOfWeek = todayDate.getDay(); // 0=Pazar, 6=Cumartesi
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;
  const isWeekend = isSaturday || isSunday;

  let tedRecommendation: { title: string; speaker: string; description: string; url: string | null; language: 'tr' | 'en'; day: 'saturday' | 'sunday' } | null = null;
  if (isWeekend) {
    const weekStartStr = getWeekStart(todayDate);
    const tedDay = isSaturday ? 'saturday' : 'sunday';
    const { data } = await supabase
      .from('ted_recommendations')
      .select('*')
      .eq('week_start', weekStartStr)
      .eq('day', tedDay)
      .maybeSingle();
    tedRecommendation = data;
  }

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

  // Production bar: active_tasks (is_done = true) / total active_tasks (only 'active' category)
  const activeTasks = rawActiveTasks ?? [];
  const activeOnlyTasks = activeTasks.filter(t => t.category === 'active');
  const productionDone = activeOnlyTasks.filter(t => t.is_done).length;
  const productionTotal = activeOnlyTasks.length;

  const kritikTasks = allTemplates.filter(t => t.section === 'kritik');
  const xPostTask = allTemplates.find(t => t.section === 'x_post');
  const sistemTasks = allTemplates.filter(t => t.section === 'sistem');

  const remainingTasks = allTemplates.filter(t => !completedIds.has(t.id)).length;

  // Safe state
  const safeGoatState = goatState || {
    current_stage: "OGLAK" as const,
    current_streak: 0,
    consistency_days: 0,
    current_mood: "AC" as const,
    weekly_consistency: 0,
    last_finalized: null,
  };

  // Streak & finalization data
  const isAlreadyFinalized = safeGoatState.last_finalized === today;
  const incompleteCriticalTasks = kritikTasks
    .filter(t => !completedIds.has(t.id))
    .map(t => t.title);

  return (
    <div className="min-h-screen font-sans">
      <DailyShell>
        {/* Karşılama Header */}
        <div className="mb-0 px-2 lg:px-10">
          <h1 className="text-2xl font-bold text-[#ffffff]">
            Merhaba, <span className="text-[#6366f1]">Ali Cem!</span> 👋
          </h1>
          <p className="text-[#666666] text-sm mt-1">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>

        {/* --- Top Section --- */}
        <div className="px-2 lg:px-10 pt-4">
          <DuaPanel />
        </div>
        
        <HeroZone 
          total={todayScore}
          mood={safeGoatState.current_mood}
          remainingTaskCount={remainingTasks}
          energyLevel={energyLevel}
          energyCap={energyCap}
          currentStreak={safeGoatState.current_streak ?? 0}
          weeklyConsistency={safeGoatState.weekly_consistency ?? 0}
        />

        {/* --- Grid Section: 2 Columns --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 px-10 py-10">
          
          {/* Left Column (col-span-2): Tasks */}
          <div className="xl:col-span-2 flex flex-col gap-10">
            <EveningAlert
              incompleteCriticalTasks={incompleteCriticalTasks}
              score={todayScore}
              isFinalized={isAlreadyFinalized}
            />
            <XPostSection
              task={xPostTask}
              isDone={xPostTask ? completedIds.has(xPostTask.id) : false}
            />
            
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
            
            {isWeekend && tedRecommendation && (
              <TEDCard
                title={tedRecommendation.title}
                speaker={tedRecommendation.speaker}
                description={tedRecommendation.description}
                url={tedRecommendation.url}
                language={tedRecommendation.language}
                day={tedRecommendation.day}
              />
            )}

            <div className="mt-4 border-t border-[#2a2a2a] pt-8">
              <EndDayButton score={todayScore} isAlreadyFinalized={isAlreadyFinalized} />
            </div>
          </div>

          {/* Right Column (col-span-1): Stats, Energy & Quote (Sticky) */}
          <div className="xl:col-span-1 flex flex-col gap-4 self-start sticky top-6">
            <EnergyCheckIn currentEnergy={energyCheckIn?.energy || null} />
            <ScoringBars 
              disciplineScore={disciplineScore}
              disciplineMax={disciplineMax}
              healthScore={healthScore}
              healthMax={healthMax}
              productionDone={productionDone}
              productionTotal={productionTotal}
            />
            <QuoteCard 
              quote={quote?.quote} 
              author={quote?.author} 
            />
          </div>

        </div>
      </DailyShell>
    </div>
  );
}
