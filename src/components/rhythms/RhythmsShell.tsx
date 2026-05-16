"use client";

import React from "react";
import { RHYTHM_SCHEDULE, type RhythmId, type DayKey, type RhythmVariant } from "@/data/rhythmSchedule";
import { RhythmCard } from "./RhythmCard";
import { useSportStatus } from "@/hooks/useSportStatus";

interface DayRhythm {
  id: RhythmId;
  label: string;
  optional: boolean;
  duration?: string;
  timeHint?: string;
  description?: string;
  variant: RhythmVariant | null;
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

// Weekly English plan for compact overview table
const ENGLISH_WEEK = [
  { day: "Pazartesi", label: "Kelime mini ritmi",        duration: "10 dk" },
  { day: "Salı",      label: "Mikro temas + kelime",     duration: "25 dk" },
  { day: "Çarşamba",  label: "Kelime mini ritmi",        duration: "10 dk" },
  { day: "Perşembe",  label: "Ana ders + grammar/vocab", duration: "45–60 dk" },
  { day: "Cuma",      label: "Kelime mini ritmi",        duration: "10 dk" },
  { day: "Cumartesi", label: "Hafif okuma/dinleme",      duration: "20–30 dk" },
  { day: "Pazar",     label: "Tekrar + konuşma + writing", duration: "45–60 dk" },
];

// Weekly sport plan for compact overview table
const SPORT_WEEK = [
  { day: "Pazartesi", label: "Upper A + Kardiyo",      duration: "75–90 dk" },
  { day: "Çarşamba",  label: "Lower A + Core + Interval", duration: "75–90 dk" },
  { day: "Cuma",      label: "Upper B + Uzun Kardiyo", duration: "80–95 dk" },
  { day: "Cumartesi", label: "Lower B + Metabolik Gün", duration: "75–90 dk" },
];

function buildWeekSchedule(): DaySchedule[] {
  return ALL_DAYS.map((dayKey) => {
    const rhythms: DayRhythm[] = [];

    for (const [rhythmId, config] of Object.entries(RHYTHM_SCHEDULE) as [RhythmId, typeof RHYTHM_SCHEDULE[RhythmId]][]) {
      if (!(config.days as readonly string[]).includes(dayKey)) continue;

      const variants = "variants" in config ? config.variants as Partial<Record<DayKey, RhythmVariant>> : undefined;
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

// ── Weekly plan tables ─────────────────────────────────────────────────────────

function WeeklyEnglishTable() {
  return (
    <div className="rounded-xl border border-[#1f1f1f] bg-[rgba(59,130,246,0.04)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1f1f1f]">
        <span className="text-[9px] uppercase tracking-widest text-[#3b82f6] font-bold">
          Haftalık İngilizce Planı
        </span>
      </div>
      <div className="divide-y divide-[#1a1a1a]">
        {ENGLISH_WEEK.map(({ day, label, duration }) => (
          <div key={day} className="flex items-center justify-between px-4 py-2.5 gap-3">
            <span className="text-[11px] text-[#444444] w-20 shrink-0">{day}</span>
            <span className="text-[11px] text-[#888888] flex-1">{label}</span>
            <span className="text-[10px] text-[#3b82f6] tabular-nums shrink-0">{duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklySportTable() {
  return (
    <div className="rounded-xl border border-[#1f1f1f] bg-[rgba(34,197,94,0.04)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1f1f1f]">
        <span className="text-[9px] uppercase tracking-widest text-[#22c55e] font-bold">
          Haftalık Spor Planı
        </span>
        <p className="text-[10px] text-[#444444] mt-0.5">RPE 7–8 · Failure yok · Koşu yok</p>
      </div>
      <div className="divide-y divide-[#1a1a1a]">
        {SPORT_WEEK.map(({ day, label, duration }) => (
          <div key={day} className="flex items-center justify-between px-4 py-2.5 gap-3">
            <span className="text-[11px] text-[#444444] w-20 shrink-0">{day}</span>
            <span className="text-[11px] text-[#888888] flex-1">{label}</span>
            <span className="text-[10px] text-[#22c55e] tabular-nums shrink-0">{duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sport status banner ───────────────────────────────────────────────────────

const STATUS_CONFIG = {
  planned: {
    label: "PLANLANDΙ",
    desc: "Bayram/tatil sonrası başlayacak.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "#2a2000",
  },
  active: {
    label: "AKTİF",
    desc: "Spor ritmi aktif.",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "#0f2a00",
  },
  paused: {
    label: "DURAKLATILDI",
    desc: "Spor ritmi geçici olarak duraklatıldı.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "#2a0f00",
  },
} as const;

function SportStatusBanner() {
  const { status, update } = useSportStatus();
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
        <span className="text-[10px] font-bold tracking-widest" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <span className="text-[11px] text-[#555555]">{cfg.desc}</span>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {(["planned", "active", "paused"] as const).map(s => (
          <button
            key={s}
            onClick={() => update(s)}
            className="text-[9px] uppercase tracking-widest px-2 py-1 rounded border transition-all"
            style={{
              borderColor: status === s ? cfg.color : "#252525",
              color: status === s ? cfg.color : "#444444",
              backgroundColor: status === s ? `${cfg.color}15` : "transparent",
            }}
          >
            {s === "planned" ? "Planlandı" : s === "active" ? "Aktif" : "Duraklat"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

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

      {/* Sport status */}
      <div className="mb-4">
        <SportStatusBanner />
      </div>

      {/* Weekly plan tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <WeeklySportTable />
        <WeeklyEnglishTable />
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
                      variant={r.variant}
                      defaultLabel={r.label}
                      description={r.description}
                      isToday={isToday}
                      dayKey={dayKey}
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
