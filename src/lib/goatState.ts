export type GoatStage = 'OGLAK' | 'GENC_KECI' | 'DAG_KECISI' | 'ALFA_KECI' | 'MISTIK_KECI' | 'GOAT';
export type GoatMood = 'AC' | 'TOK' | 'ALFA' | 'DURGUN';

export const STAGE_LABELS: Record<GoatStage, string> = {
  OGLAK: '01 — OĞLAK',
  GENC_KECI: '02 — GENÇ KEÇİ',
  DAG_KECISI: '03 — DAĞ KEÇİSİ',
  ALFA_KECI: '04 — ALFA KEÇİ',
  MISTIK_KECI: '05 — MİSTİK KEÇİ',
  GOAT: '06 — G.O.A.T',
};

export const STAGE_THRESHOLDS: Array<{ stage: GoatStage; minDays: number }> = [
  { stage: 'GOAT', minDays: 365 },
  { stage: 'MISTIK_KECI', minDays: 181 },
  { stage: 'ALFA_KECI', minDays: 61 },
  { stage: 'DAG_KECISI', minDays: 22 },
  { stage: 'GENC_KECI', minDays: 8 },
  { stage: 'OGLAK', minDays: 0 },
];

export function calculateStage(consistencyDays: number): GoatStage {
  for (const { stage, minDays } of STAGE_THRESHOLDS) {
    if (consistencyDays >= minDays) return stage;
  }
  return 'OGLAK';
}

export interface MoodInput {
  todayScore: number;
  consecutiveLowDays: number;
  hasCompletedP1Today: boolean;
}

export function calculateMood(input: MoodInput): GoatMood {
  if (input.consecutiveLowDays >= 2) return 'DURGUN';
  if (input.todayScore >= 80 && input.hasCompletedP1Today) return 'ALFA';
  if (input.todayScore >= 30) return 'TOK';
  return 'AC';
}

export function moodLineFor(mood: GoatMood, todayScore: number, remainingTaskCount: number): string {
  switch (mood) {
    case 'ALFA':
      return 'Alfa modu aktif. Kimse seni durduramaz.';
    case 'TOK':
      return `Keçin tok. ${remainingTaskCount} görev daha kaldı.`;
    case 'DURGUN':
      return 'Keçin durgun. 2 gündür yetersiz besleniyor.';
    case 'AC':
    default:
      if (todayScore === 0) return 'Keçin aç. Henüz hiç beslenmedi.';
      return `Keçin aç. ${remainingTaskCount} görev daha yedirmen lazım.`;
  }
}
