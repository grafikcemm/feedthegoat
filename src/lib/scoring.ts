export type TaskCategory = 'discipline' | 'production' | 'health' | 'bonus';

export interface ScoreableTask {
  category: TaskCategory;
  points: number;
  is_done: boolean;
  is_bonus: boolean;
}

export interface DailyScoreBreakdown {
  discipline: number;
  production: number;
  health: number;
  bonus: number;
  total: number;
}

export const SCORE_CAPS = {
  discipline: 35,
  health: 35,
  total: 70,    // was 60, now 70
} as const;

export function calculateDailyScore(tasks: ScoreableTask[]): DailyScoreBreakdown {
  const sums = { discipline: 0, production: 0, health: 0, bonus: 0 };
  for (const task of tasks) {
    if (!task.is_done) continue;
    if (task.is_bonus) {
      sums.bonus += task.points;
    } else if (task.category === 'discipline') {
      sums.discipline += task.points;
    } else if (task.category === 'production') {
      sums.production += task.points; // tracked but ignored in total
    } else if (task.category === 'health') {
      sums.health += task.points;
    }
  }
  const discipline = Math.min(sums.discipline, SCORE_CAPS.discipline);
  const health = Math.min(sums.health, SCORE_CAPS.health);
  const production = sums.production;
  const total = Math.min(discipline + health, SCORE_CAPS.total);
  return { discipline, production, health, bonus: sums.bonus, total };
}
