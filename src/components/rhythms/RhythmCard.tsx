"use client";

import React, { useState } from "react";
import { Activity, Music, BookOpen, Dumbbell, BookMarked, type LucideProps } from "lucide-react";
import type { RhythmId, RhythmVariant } from "@/data/rhythmSchedule";
import { SportWorkoutDetail } from "./SportWorkoutDetail";

const RHYTHM_ICONS: Record<RhythmId, React.ComponentType<LucideProps>> = {
  sport:    Dumbbell,
  english:  BookOpen,
  saz:      Music,
  treadmill: Activity,
  kelime:   BookMarked,
};

const RHYTHM_COLORS: Record<RhythmId, { accent: string; bg: string }> = {
  sport:    { accent: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  english:  { accent: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  saz:      { accent: "#a855f7", bg: "rgba(168,85,247,0.08)" },
  treadmill:{ accent: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  kelime:   { accent: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
};

const INTENSITY_BADGE: Record<string, string> = {
  mini:     "Mini",
  light:    "Hafif",
  main:     "Ana",
  review:   "Tekrar",
  recovery: "Toparlanma",
  optional: "Opsiyonel",
};

const LS_KEY = "feed-the-goat-rhythm-completion-details-v1";

function loadChecks(storageKey: string): boolean[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, boolean[]>;
    return all[storageKey] ?? null;
  } catch {
    return null;
  }
}

function saveChecks(storageKey: string, checks: boolean[]): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const all: Record<string, boolean[]> = raw ? (JSON.parse(raw) as Record<string, boolean[]>) : {};
    all[storageKey] = checks;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable
  }
}

interface RhythmCardProps {
  id: RhythmId;
  variant: RhythmVariant | null;
  defaultLabel: string;
  description?: string;
  isToday?: boolean;
  dayKey?: string;
}

export function RhythmCard({ id, variant, defaultLabel, description, isToday = false, dayKey = "" }: RhythmCardProps) {
  const Icon = RHYTHM_ICONS[id];
  const colors = RHYTHM_COLORS[id];
  const label = variant?.label ?? defaultLabel;
  const isOptional = variant?.optional ?? false;
  const duration = variant?.duration;
  const timeHint = variant?.timeHint;
  const desc = variant?.description ?? description;
  const intensity = variant?.intensity;
  const steps = variant?.steps ?? [];
  const resources = variant?.resources ?? [];
  const completionRules = variant?.completionRules ?? [];
  const minimumVersion = variant?.minimumVersion;
  const note = variant?.note;

  const isSport = id === "sport";
  const exercises = variant?.exercises ?? [];
  const cardio = variant?.cardio ?? [];

  const hasDetail = isSport
    ? (exercises.length > 0 || completionRules.length > 0)
    : (steps.length > 0 || resources.length > 0 || completionRules.length > 0 || minimumVersion || note);

  const [expanded, setExpanded] = useState(false);

  // Completion rule checks — only persisted for today's rhythms
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `${today}:${id}:${dayKey}`;
  const [checks, setChecks] = useState<boolean[]>(() => {
    if (!isToday || completionRules.length === 0) return completionRules.map(() => false);
    return loadChecks(storageKey) ?? completionRules.map(() => false);
  });

  const toggleCheck = (i: number) => {
    setChecks(prev => {
      const next = [...prev];
      next[i] = !next[i];
      if (isToday) saveChecks(storageKey, next);
      return next;
    });
  };

  const doneCount = checks.filter(Boolean).length;
  const allDone = completionRules.length > 0 && doneCount === completionRules.length;

  return (
    <div
      className="rounded-xl border border-[#1f1f1f] overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* ── Header ── */}
      <div className="px-4 py-3.5 flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${colors.accent}18`, border: `1px solid ${colors.accent}30` }}
        >
          <Icon size={14} className="shrink-0" style={{ color: colors.accent }} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-medium leading-tight"
              style={{ color: allDone ? colors.accent : "#cccccc" }}
            >
              {label}
            </span>
            {isOptional && (
              <span className="text-[9px] uppercase tracking-widest text-[#555555] border border-[#252525] px-1.5 py-0.5 rounded">
                Opsiyonel
              </span>
            )}
            {intensity && !isOptional && INTENSITY_BADGE[intensity] && (
              <span
                className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border"
                style={{ color: `${colors.accent}99`, borderColor: `${colors.accent}30` }}
              >
                {INTENSITY_BADGE[intensity]}
              </span>
            )}
            {id === "treadmill" && (
              <span className="text-[9px] uppercase tracking-widest text-[#444444] border border-[#1f1f1f] px-1.5 py-0.5 rounded">
                Aktif Toparlanma
              </span>
            )}
            {allDone && (
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border"
                style={{ color: colors.accent, borderColor: `${colors.accent}40` }}>
                Tamamlandı
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {duration && (
              <span className="text-[11px] text-[#555555]">{duration}</span>
            )}
            {timeHint && (
              <>
                {duration && <span className="text-[#333333]">·</span>}
                <span className="text-[11px] text-[#555555]">{timeHint}</span>
              </>
            )}
            {isToday && completionRules.length > 0 && (
              <>
                <span className="text-[#333333]">·</span>
                <span className="text-[11px]" style={{ color: allDone ? colors.accent : "#555555" }}>
                  {doneCount}/{completionRules.length} kural
                </span>
              </>
            )}
          </div>

          {!expanded && (
            <>
              {desc && !isSport && (
                <p className="text-[11px] text-[#444444] mt-1 leading-snug line-clamp-2">{desc}</p>
              )}
              {isSport && exercises.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {exercises.slice(0, 3).map(ex => (
                    <span key={ex.name} className="text-[11px] text-[#444444]">
                      · {ex.name}
                      {ex.sets && ex.reps && (
                        <span className="text-[#333333] ml-1">{ex.sets}×{ex.reps}</span>
                      )}
                    </span>
                  ))}
                  {exercises.length > 3 && (
                    <span className="text-[10px] text-[#333333]">+{exercises.length - 3} hareket…</span>
                  )}
                  {cardio.length > 0 && (
                    <span className="text-[11px] text-[#444444] mt-0.5">
                      · Kardiyo: {cardio[0].reps}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {hasDetail && (
          <button
            onClick={() => setExpanded(p => !p)}
            className="shrink-0 text-[11px] text-[#444444] hover:text-[#666666] transition-colors mt-0.5 px-1"
            title={expanded ? "Kapat" : "Detay"}
          >
            {expanded ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* ── Detail drawer ── */}
      {expanded && hasDetail && (
        <div className="border-t border-[#1f1f1f] px-4 py-4 flex flex-col gap-4">

          {/* Sport uses dedicated component */}
          {isSport && variant && (
            <SportWorkoutDetail variant={variant} isToday={isToday} dayKey={dayKey} />
          )}

          {!isSport && desc && (
            <p className="text-[12px] text-[#555555] leading-relaxed">{desc}</p>
          )}

          {/* Non-sport: Steps, Completion Rules, Resources */}
          {!isSport && (
            <>
              {steps.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold mb-2">Adımlar</p>
                  <ol className="flex flex-col gap-1">
                    {steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[10px] text-[#333333] mt-0.5 w-4 shrink-0">{i + 1}.</span>
                        <span className="text-[12px] text-[#666666] leading-snug">
                          {step.label}
                          {step.duration && (
                            <span className="text-[#444444] ml-1">({step.duration})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {completionRules.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold mb-2">
                    Kapanış Şartları
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {completionRules.map((rule, i) => (
                      <button
                        key={i}
                        onClick={() => isToday && toggleCheck(i)}
                        disabled={!isToday}
                        className="flex items-center gap-2.5 text-left group"
                      >
                        <div
                          className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: checks[i] ? colors.accent : "transparent",
                            borderColor: checks[i] ? colors.accent : "#333333",
                          }}
                        >
                          {checks[i] && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span
                          className="text-[12px] leading-snug transition-colors"
                          style={{ color: checks[i] ? colors.accent : "#666666" }}
                        >
                          {rule.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {!isToday && (
                    <p className="text-[10px] text-[#333333] mt-2 italic">
                      Kapanış şartları sadece bugün işaretlenebilir.
                    </p>
                  )}
                </div>
              )}

              {resources.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold mb-2">Kaynaklar</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resources.map((res, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 rounded border"
                        style={{ color: "#555555", borderColor: "#252525", backgroundColor: "#0a0a0a" }}
                      >
                        {res.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Minimum version */}
          {minimumVersion && (
            <div className="rounded-lg px-3 py-2 border border-[#2a2a00] bg-[#1a1500]">
              <p className="text-[9px] uppercase tracking-widest text-[#f59e0b] font-bold mb-1">Minimum Versiyon</p>
              <p className="text-[11px] text-[#888888]">{minimumVersion}</p>
            </div>
          )}

          {/* Note */}
          {note && (
            <p className="text-[11px] text-[#444444] italic leading-snug border-l-2 border-[#2a2a2a] pl-3">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
