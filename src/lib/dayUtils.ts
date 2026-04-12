export type DayKey = 'PZT' | 'SAL' | 'CAR' | 'PER' | 'CUM' | 'CMT' | 'PAZ';

const DAY_MAP: DayKey[] = ['PAZ', 'PZT', 'SAL', 'CAR', 'PER', 'CUM', 'CMT'];

export function getTodayDayKey(): DayKey {
  return DAY_MAP[new Date().getDay()];
}

export const ENGLISH_GROUP_BY_DAY: Partial<Record<DayKey, string>> = {
  PZT: 'english_monday',
  CAR: 'english_wednesday',
  CUM: 'english_friday',
  CMT: 'english_saturday',
};

export function getEnglishGroupForToday(): string | null {
  const day = getTodayDayKey();
  return ENGLISH_GROUP_BY_DAY[day] ?? null;
}

export function isEnglishActiveToday(): boolean {
  return getEnglishGroupForToday() !== null;
}
