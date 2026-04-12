export interface StreakInput {
  currentStreak: number;
  yesterdayScoreFinalized: boolean;
  yesterdayScore: number;
  todayIsSunday: boolean;
  ritimKorumaUsed: boolean;
}

export const STREAK_THRESHOLD = 50;
export const SUNDAY_THRESHOLD = 30;

export interface StreakResult {
  newStreak: number;
  streakBroken: boolean;
  ritimKorumaConsumed: boolean;
}

export function evaluateStreak(input: StreakInput): StreakResult {
  const threshold = input.todayIsSunday ? SUNDAY_THRESHOLD : STREAK_THRESHOLD;
  if (!input.yesterdayScoreFinalized) {
    if (input.ritimKorumaUsed) {
      return { newStreak: input.currentStreak, streakBroken: false, ritimKorumaConsumed: true };
    }
    return { newStreak: 0, streakBroken: true, ritimKorumaConsumed: false };
  }
  if (input.yesterdayScore >= threshold) {
    return { newStreak: input.currentStreak + 1, streakBroken: false, ritimKorumaConsumed: false };
  }
  return { newStreak: 0, streakBroken: true, ritimKorumaConsumed: false };
}
