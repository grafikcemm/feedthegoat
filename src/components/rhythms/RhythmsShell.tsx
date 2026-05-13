import { RHYTHM_SCHEDULE, type RhythmId, type DayKey } from "@/data/rhythmSchedule";
import { RhythmCard } from "./RhythmCard";

interface DayRhythm {
  id: RhythmId;
  label: string;
  optional: boolean;
  duration?: string;
  timeHint?: string;
  description?: string;
  variant?: { label: string; optional: boolean; duration?: string; timeHint?: string; description?: string } | null;
}

interface DaySchedule {
  dayKey: DayKey;
  dayLabel: string;
  rhythms: DayRhythm[];
}

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Pazartesi",
  tuesday: "Salı",
  wednesday: "Çarşamba",
  thursday: "Perşembe",
  friday: "Cuma",
  saturday: "Cumartesi",
  sunday: "Pazar",
};

const ALL_DAYS: DayKey[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

function buildWeekSchedule(): DaySchedule[] {
  return ALL_DAYS.map((dayKey) => {
    const rhythms: DayRhythm[] = [];

    for (const [rhythmId, config] of Object.entries(RHYTHM_SCHEDULE) as [RhythmId, typeof RHYTHM_SCHEDULE[RhythmId]][]) {
      if (!(config.days as readonly string[]).includes(dayKey)) continue;

      const variants = "variants" in config ? config.variants as Record<string, { label: string; optional: boolean; duration?: string; timeHint?: string; description?: string }> : undefined;
      const variant = variants?.[dayKey] ?? null;

      rhythms.push({
        id: rhythmId,
        label: config.label,
        optional: variant?.optional ?? false,
        duration: variant?.duration,
        timeHint: variant?.timeHint ?? (config as { timeHint?: string }).timeHint,
        description: variant?.description ?? (config as { description?: string }).description,
        variant,
      });
    }

    return { dayKey, dayLabel: DAY_LABELS[dayKey], rhythms };
  });
}

export function RhythmsShell({ todayDayKey }: { todayDayKey: string }) {
  const schedule = buildWeekSchedule();

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 pb-16">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium block">
          RİTİMLER
        </span>
        <p className="text-[13px] text-[#555555] mt-1">
          Haftalık ritim takvimi. Sürdürülebilir disiplin.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {schedule.map(({ dayKey, dayLabel, rhythms }) => {
          const isToday = dayKey === todayDayKey;
          return (
            <div key={dayKey}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[11px] uppercase tracking-widest font-semibold"
                  style={{ color: isToday ? "#f5c518" : "#444444" }}
                >
                  {dayLabel}
                </span>
                {isToday && (
                  <span className="text-[9px] uppercase tracking-widest text-[#f5c518] border border-[#f5c518]/30 px-1.5 py-0.5 rounded">
                    Bugün
                  </span>
                )}
                <div className="flex-1 h-px bg-[#1a1a1a]" />
              </div>

              {rhythms.length === 0 ? (
                <p className="text-[12px] text-[#333333] pl-1">Ritim yok</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {rhythms.map((r) => (
                    <RhythmCard
                      key={r.id}
                      id={r.id}
                      variant={r.variant ?? null}
                      defaultLabel={r.label}
                      description={r.description}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
