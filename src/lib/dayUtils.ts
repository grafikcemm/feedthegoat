export type DayKey = 'PZT' | 'SAL' | 'CAR' | 'PER' | 'CUM' | 'CMT' | 'PAZ';

const DAY_MAP: DayKey[] = ['PAZ', 'PZT', 'SAL', 'CAR', 'PER', 'CUM', 'CMT'];

export function getTodayDayKey(): DayKey {
  return DAY_MAP[new Date().getDay()];
}

// İngilizce ritim: Salı (mikro), Perşembe (ana), Pazar (tekrar+konuşma)
export const ENGLISH_GROUP_BY_DAY: Partial<Record<DayKey, string>> = {
  SAL: 'english_tuesday',
  PER: 'english_thursday',
  PAZ: 'english_sunday',
};

export function getEnglishGroupForToday(): string | null {
  const day = getTodayDayKey();
  return ENGLISH_GROUP_BY_DAY[day] ?? null;
}

export function isEnglishActiveToday(): boolean {
  return getEnglishGroupForToday() !== null;
}
