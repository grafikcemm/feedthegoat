export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAY_MODULES: Record<DayKey, string[]> = {
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: ['sunday_charge_mode']
};

export function getTodayModules(): string[] {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const map: Record<number, DayKey> = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
    0: 'sun'
  };
  return DAY_MODULES[map[day]];
}
