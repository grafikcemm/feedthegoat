// Source of truth for rhythm scheduling.
// Internal logic (task IDs, Supabase fields, localStorage keys) is untouched.
// This config drives: display titles, optional labels, day visibility helpers.

export type RhythmId = "sport" | "english" | "saz" | "treadmill";

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// JS getDay() → DayKey
const JS_TO_DAY: Record<number, DayKey> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export type RhythmVariant = {
  label: string;
  duration?: string;
  timeHint?: string;
  optional: boolean;
  intensity?: "light" | "main" | "recovery";
  description?: string;
};

type RhythmConfig = {
  label: string;
  days: readonly DayKey[];
  type?: string;
  timeHint?: string;
  description?: string;
  variants?: Partial<Record<DayKey, RhythmVariant>>;
};

export const RHYTHM_SCHEDULE = {
  sport: {
    label: "Spor",
    days: ["monday", "wednesday", "friday", "saturday"] as const,
    type: "main",
    timeHint: "Akşam / iş çıkışı",
    description: "İş biter bitmez. Eve gelip oturmadan çık.",
  },
  english: {
    label: "İngilizce",
    days: ["tuesday", "thursday", "sunday"] as const,
    variants: {
      tuesday: {
        label: "İngilizce Mikro Temas",
        duration: "15-20 dk",
        intensity: "light",
        optional: false,
      },
      thursday: {
        label: "İngilizce Ana Çalışma",
        duration: "30-40 dk",
        intensity: "main",
        optional: false,
      },
      sunday: {
        label: "İngilizce Tekrar + Konuşma",
        duration: "40-45 dk",
        intensity: "main",
        description: "Tekrar, pronunciation ve konuşma pratiği",
        optional: false,
      },
    } as Partial<Record<DayKey, RhythmVariant>>,
  },
  saz: {
    label: "Saz",
    days: ["saturday", "sunday"] as const,
    variants: {
      saturday: {
        label: "Saz Temas",
        duration: "20-30 dk",
        optional: false,
      },
      sunday: {
        label: "Saz Opsiyonel",
        duration: "20 dk",
        optional: true,
      },
    } as Partial<Record<DayKey, RhythmVariant>>,
  },
  treadmill: {
    label: "Koşu Bandı",
    days: ["tuesday", "thursday", "sunday"] as const,
    type: "recovery",
    description: "Spor değil, aktif toparlanma.",
    variants: {
      tuesday: {
        label: "Koşu Bandı",
        duration: "20 dk",
        timeHint: "Sabah",
        optional: false,
        intensity: "recovery",
      },
      thursday: {
        label: "Koşu Bandı",
        duration: "20 dk",
        timeHint: "Sabah",
        optional: false,
        intensity: "recovery",
      },
      sunday: {
        label: "Hafif Yürüyüş",
        duration: "Opsiyonel",
        timeHint: "Hafif tempo",
        optional: true,
        intensity: "light",
      },
    } as Partial<Record<DayKey, RhythmVariant>>,
  },
} satisfies Record<RhythmId, RhythmConfig>;

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDayKey(date: Date): DayKey {
  return JS_TO_DAY[date.getDay()];
}

export function isRhythmActiveToday(rhythmId: RhythmId, date: Date = new Date()): boolean {
  const dayKey = toDayKey(date);
  return (RHYTHM_SCHEDULE[rhythmId].days as readonly string[]).includes(dayKey);
}

export function getRhythmVariantForDay(
  rhythmId: RhythmId,
  date: Date = new Date()
): RhythmVariant | null {
  const dayKey = toDayKey(date);
  const config = RHYTHM_SCHEDULE[rhythmId];
  if (!isRhythmActiveToday(rhythmId, date)) return null;
  const variants = "variants" in config ? config.variants : undefined;
  return variants?.[dayKey] ?? null;
}

export function getTodayRhythms(date: Date = new Date()): RhythmId[] {
  return (Object.keys(RHYTHM_SCHEDULE) as RhythmId[]).filter(id =>
    isRhythmActiveToday(id, date)
  );
}

export function isRhythmOptionalToday(rhythmId: RhythmId, date: Date = new Date()): boolean {
  const variant = getRhythmVariantForDay(rhythmId, date);
  return variant?.optional ?? false;
}

export function mapTurkishDayToDayKey(day: string): DayKey | null {
  const map: Record<string, DayKey> = {
    Pazartesi: "monday",  Pzt: "monday",
    Salı:      "tuesday", Sal: "tuesday",
    Çarşamba:  "wednesday", Çrş: "wednesday", CRS: "wednesday",
    Perşembe:  "thursday", Prş: "thursday",
    Cuma:      "friday",  Cum: "friday",
    Cumartesi: "saturday", Cts: "saturday", CMT: "saturday",
    Pazar:     "sunday",  Paz: "sunday",
  };
  return map[day] ?? null;
}
