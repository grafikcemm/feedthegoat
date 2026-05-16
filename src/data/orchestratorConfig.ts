export const ORCHESTRATOR_START_DATE = process.env.ORCHESTRATOR_START_DATE ?? '2026-06-01';

export type ReminderType =
  | 'morning_checkin'
  | 'midday_status'
  | 'evening_rhythm'
  | 'night_shutdown';

export const REMINDER_SCHEDULE: Record<ReminderType, string> = {
  morning_checkin: '09:30',
  midday_status:   '13:30',
  evening_rhythm:  '19:00',
  night_shutdown:  '23:00',
};

export function isOrchestratorActive(today: string): boolean {
  return today >= ORCHESTRATOR_START_DATE;
}
