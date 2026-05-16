'use client';

import { useState, useCallback } from 'react';
import {
  PROTOCOL_START_DATE,
  getProtocolDay,
  getPhase,
  getProtocolWeek,
  getTodayShampoo,
  getTodayFocusLine,
  WORKOUT_DAYS,
} from '@/data/healthProtocol';

export interface DailyHealthCompletion {
  date: string;
  waterDone: boolean;
  proteinDone: boolean;
  noDairyGlutenSugar: boolean;
  shampooDone: boolean;
  faceMorningDone: boolean;
  faceEveningDone: boolean;
  psylliumDone: boolean;
  creatineDone: boolean;
  hygieneDone: boolean;
  noPickingDone: boolean;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    snack: boolean;
    dinner: boolean;
    night: boolean;
  };
  supplements: {
    d3k2: boolean;
    omega3: boolean;
    veganProtein: boolean;
    creatine: boolean;
    magnimore: boolean;
    psyllium: boolean;
    optionalGlutamine: boolean;
    optionalTyrosine: boolean;
  };
  backRoutine: boolean;
}

export interface WeeklyHealthCheck {
  date: string;
  itching: number;
  redness: number;
  dandruff: number;
  acne: number;
  dietCompliance: number;
}

const COMPLETIONS_KEY = 'feed-the-goat-health-completions-v1';
const WEEKLY_KEY = 'feed-the-goat-health-weekly-checks-v1';

export const CHECKLIST_FIELDS = [
  'waterDone', 'proteinDone', 'noDairyGlutenSugar', 'shampooDone',
  'faceMorningDone', 'faceEveningDone', 'psylliumDone', 'creatineDone',
  'hygieneDone', 'noPickingDone',
] as const;

export type ChecklistField = typeof CHECKLIST_FIELDS[number];

function emptyCompletion(date: string): DailyHealthCompletion {
  return {
    date,
    waterDone: false,
    proteinDone: false,
    noDairyGlutenSugar: false,
    shampooDone: false,
    faceMorningDone: false,
    faceEveningDone: false,
    psylliumDone: false,
    creatineDone: false,
    hygieneDone: false,
    noPickingDone: false,
    meals: { breakfast: false, lunch: false, snack: false, dinner: false, night: false },
    supplements: {
      d3k2: false, omega3: false, veganProtein: false, creatine: false,
      magnimore: false, psyllium: false, optionalGlutamine: false, optionalTyrosine: false,
    },
    backRoutine: false,
  };
}

function loadCompletions(): Record<string, DailyHealthCompletion> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COMPLETIONS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, DailyHealthCompletion>;
  } catch {}
  return {};
}

function loadWeeklyChecks(): Record<string, WeeklyHealthCheck> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (raw) return JSON.parse(raw) as Record<string, WeeklyHealthCheck>;
  } catch {}
  return {};
}

export function useHealthProtocol() {
  const today = new Date().toISOString().slice(0, 10);
  const dow = new Date().getDay();

  const [completions, setCompletions] = useState<Record<string, DailyHealthCompletion>>(loadCompletions);
  const [weeklyChecks, setWeeklyChecks] = useState<Record<string, WeeklyHealthCheck>>(loadWeeklyChecks);

  const protocolDay = getProtocolDay(today);
  const phase = getPhase(protocolDay);
  const protocolWeek = getProtocolWeek(protocolDay);
  const todayShampoo = getTodayShampoo(phase, dow, protocolWeek);
  const isWorkoutDay = WORKOUT_DAYS.has(dow);
  const isSunday = dow === 0;
  const focusLine = getTodayFocusLine(phase, todayShampoo);
  const protocolStarted = protocolDay >= 1;

  const todayCompletion = completions[today] ?? emptyCompletion(today);

  const completedCount = CHECKLIST_FIELDS.filter(f => todayCompletion[f]).length;
  const totalCount = CHECKLIST_FIELDS.length;

  const persistCompletions = useCallback((next: Record<string, DailyHealthCompletion>) => {
    setCompletions(next);
    try { localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const toggle = useCallback((field: ChecklistField) => {
    const current = completions[today] ?? emptyCompletion(today);
    persistCompletions({ ...completions, [today]: { ...current, [field]: !current[field] } });
  }, [completions, today, persistCompletions]);

  const toggleMeal = useCallback((meal: keyof DailyHealthCompletion['meals']) => {
    const current = completions[today] ?? emptyCompletion(today);
    persistCompletions({
      ...completions,
      [today]: { ...current, meals: { ...current.meals, [meal]: !current.meals[meal] } },
    });
  }, [completions, today, persistCompletions]);

  const toggleSupplement = useCallback((supp: keyof DailyHealthCompletion['supplements']) => {
    const current = completions[today] ?? emptyCompletion(today);
    persistCompletions({
      ...completions,
      [today]: { ...current, supplements: { ...current.supplements, [supp]: !current.supplements[supp] } },
    });
  }, [completions, today, persistCompletions]);

  const toggleBackRoutine = useCallback(() => {
    const current = completions[today] ?? emptyCompletion(today);
    persistCompletions({ ...completions, [today]: { ...current, backRoutine: !current.backRoutine } });
  }, [completions, today, persistCompletions]);

  const saveWeeklyCheck = useCallback((check: WeeklyHealthCheck) => {
    const next = { ...weeklyChecks, [check.date]: check };
    setWeeklyChecks(next);
    try { localStorage.setItem(WEEKLY_KEY, JSON.stringify(next)); } catch {}
  }, [weeklyChecks]);

  return {
    today,
    dow,
    protocolDay,
    phase,
    protocolWeek,
    todayShampoo,
    isWorkoutDay,
    isSunday,
    focusLine,
    protocolStarted,
    todayCompletion,
    completedCount,
    totalCount,
    toggle,
    toggleMeal,
    toggleSupplement,
    toggleBackRoutine,
    weeklyChecks,
    todayWeeklyCheck: weeklyChecks[today] ?? null,
    saveWeeklyCheck,
    PROTOCOL_START_DATE,
  };
}
