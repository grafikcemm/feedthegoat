import type { ReminderType } from '@/data/orchestratorConfig';
import { REMINDER_SCHEDULE } from '@/data/orchestratorConfig';

export type ReminderStatus = 'sent' | 'responded' | 'skipped';

export interface ReminderState {
  id?: string;
  date: string;
  reminder_type: ReminderType;
  sent_at: string;
  responded_at?: string;
  status: ReminderStatus;
  telegram_message_id?: number;
}

// Returns the reminder type that should fire right now, or null
export function getDueReminder(
  now: Date,
  sentToday: ReminderType[],
): ReminderType | null {
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const order: ReminderType[] = [
    'morning_checkin',
    'midday_status',
    'evening_rhythm',
    'night_shutdown',
  ];

  for (const type of order) {
    if (sentToday.includes(type)) continue;
    if (hhmm >= REMINDER_SCHEDULE[type]) return type;
  }

  return null;
}
