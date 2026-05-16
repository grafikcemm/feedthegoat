"use client";

import React, { useState } from "react";
import type { RhythmVariant, WorkoutExercise } from "@/data/rhythmSchedule";
import { SPORT_GLOBAL_RULES } from "@/data/rhythmSchedule";

const ACCENT = "#22c55e";
const LS_KEY = "feed-the-goat-workout-completion-details-v1";

// ── localStorage helpers ───────────────────────────────────────────────────────

type WorkoutLog = {
  exercisesDone: Record<string, boolean>;
  exerciseLogs: Record<string, { kg: string; reps: string; note: string }>;
  warmupDone: boolean;
  cardioDone: boolean;
  checklistChecks: boolean[];
};

function loadWorkout(dateDay: string): WorkoutLog | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, WorkoutLog>;
    return all[dateDay] ?? null;
  } catch {
    return null;
  }
}

function saveWorkout(dateDay: string, log: WorkoutLog): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const all: Record<string, WorkoutLog> = raw ? (JSON.parse(raw) as Record<string, WorkoutLog>) : {};
    all[dateDay] = log;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable
  }
}

function emptyLog(exerciseNames: string[], checklistLen: number): WorkoutLog {
  return {
    exercisesDone: Object.fromEntries(exerciseNames.map(n => [n, false])),
    exerciseLogs: Object.fromEntries(exerciseNames.map(n => [n, { kg: "", reps: "", note: "" }])),
    warmupDone: false,
    cardioDone: false,
    checklistChecks: Array(checklistLen).fill(false),
  };
}

// ── Exercise row ───────────────────────────────────────────────────────────────

interface ExerciseRowProps {
  ex: WorkoutExercise;
  done: boolean;
  logEntry: { kg: string; reps: string; note: string };
  isToday: boolean;
  onToggle: () => void;
  onLog: (field: "kg" | "reps" | "note", value: string) => void;
}

function ExerciseRow({ ex, done, logEntry, isToday, onToggle, onLog }: ExerciseRowProps) {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="border-b border-[#1a1a1a] last:border-0">
      <div className="flex items-center gap-3 py-2.5">
        {/* done checkbox */}
        <button
          onClick={() => isToday && onToggle()}
          disabled={!isToday}
          className="shrink-0"
        >
          <div
            className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
            style={{
              backgroundColor: done ? ACCENT : "transparent",
              borderColor: done ? ACCENT : "#333333",
            }}
          >
            {done && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </button>

        {/* name + sets/reps */}
        <div className="flex-1 min-w-0">
          <span
            className="text-[12px] leading-snug block"
            style={{ color: done ? "#666666" : "#888888", textDecoration: done ? "line-through" : "none" }}
          >
            {ex.name}
          </span>
          {(ex.sets || ex.reps) && (
            <span className="text-[10px] text-[#444444]">
              {ex.sets && `${ex.sets} set`}{ex.sets && ex.reps && " × "}{ex.reps}
            </span>
          )}
          {ex.note && (
            <span className="text-[10px] text-[#f59e0b] block mt-0.5">⚠ {ex.note}</span>
          )}
        </div>

        {/* mini log toggle */}
        {isToday && (
          <button
            onClick={() => setShowLog(p => !p)}
            className="text-[10px] text-[#333333] hover:text-[#555555] transition-colors px-1 shrink-0"
            title="Ağırlık/tekrar log"
          >
            {showLog ? "▲" : "kg"}
          </button>
        )}
      </div>

      {/* Progressive overload mini log */}
      {showLog && isToday && (
        <div className="flex gap-2 pb-2.5 pl-7">
          <input
            type="text"
            placeholder="kg"
            value={logEntry.kg}
            onChange={e => onLog("kg", e.target.value)}
            className="w-14 bg-[#111111] border border-[#1f1f1f] rounded px-2 py-1 text-[10px] text-[#888888] placeholder-[#333333] outline-none focus:border-[#22c55e]/40"
          />
          <input
            type="text"
            placeholder="tekrar"
            value={logEntry.reps}
            onChange={e => onLog("reps", e.target.value)}
            className="w-16 bg-[#111111] border border-[#1f1f1f] rounded px-2 py-1 text-[10px] text-[#888888] placeholder-[#333333] outline-none focus:border-[#22c55e]/40"
          />
          <input
            type="text"
            placeholder="not"
            value={logEntry.note}
            onChange={e => onLog("note", e.target.value)}
            className="flex-1 bg-[#111111] border border-[#1f1f1f] rounded px-2 py-1 text-[10px] text-[#888888] placeholder-[#333333] outline-none focus:border-[#22c55e]/40"
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface SportWorkoutDetailProps {
  variant: RhythmVariant;
  isToday: boolean;
  dayKey: string;
}

export function SportWorkoutDetail({ variant, isToday, dayKey }: SportWorkoutDetailProps) {
  const today = new Date().toISOString().slice(0, 10);
  const dateDay = `${today}:${dayKey}`;

  const exercises: WorkoutExercise[] = variant.exercises ?? [];
  const warmup: WorkoutExercise[] = variant.warmup ?? [];
  const cardio: WorkoutExercise[] = variant.cardio ?? [];
  const completionRules = variant.completionRules ?? [];
  const exerciseNames = exercises.map(e => e.name);

  const [log, setLog] = useState<WorkoutLog>(() => {
    if (!isToday) return emptyLog(exerciseNames, completionRules.length);
    return loadWorkout(dateDay) ?? emptyLog(exerciseNames, completionRules.length);
  });

  const [rulesOpen, setRulesOpen] = useState(false);

  const update = (next: WorkoutLog) => {
    setLog(next);
    if (isToday) saveWorkout(dateDay, next);
  };

  const toggleExercise = (name: string) => {
    update({
      ...log,
      exercisesDone: { ...log.exercisesDone, [name]: !log.exercisesDone[name] },
    });
  };

  const updateLog = (name: string, field: "kg" | "reps" | "note", value: string) => {
    update({
      ...log,
      exerciseLogs: {
        ...log.exerciseLogs,
        [name]: { ...log.exerciseLogs[name], [field]: value },
      },
    });
  };

  const toggleWarmup = () => update({ ...log, warmupDone: !log.warmupDone });
  const toggleCardio = () => update({ ...log, cardioDone: !log.cardioDone });

  const toggleChecklist = (i: number) => {
    const next = [...log.checklistChecks];
    next[i] = !next[i];
    update({ ...log, checklistChecks: next });
  };

  const doneExCount = Object.values(log.exercisesDone).filter(Boolean).length;
  const checkDoneCount = log.checklistChecks.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">

      {/* Global rules accordion */}
      <div className="rounded-lg border border-[#252525] overflow-hidden">
        <button
          onClick={() => setRulesOpen(p => !p)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left"
        >
          <span className="text-[9px] uppercase tracking-widest text-[#444444] font-bold">
            Antrenman Kuralları
          </span>
          <span className="text-[10px] text-[#333333]">{rulesOpen ? "▲" : "▼"}</span>
        </button>
        {rulesOpen && (
          <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-[#1a1a1a]">
            {SPORT_GLOBAL_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 pt-1.5">
                <span className="text-[#22c55e] text-[10px] mt-px shrink-0">•</span>
                <span className="text-[11px] text-[#666666]">{rule}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      {variant.description && (
        <p className="text-[12px] text-[#555555] leading-relaxed">{variant.description}</p>
      )}

      {/* Warmup */}
      {warmup.length > 0 && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold mb-2">Isınma</p>
          {warmup.map((w, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <button
                onClick={() => isToday && toggleWarmup()}
                disabled={!isToday}
                className="shrink-0"
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: log.warmupDone ? ACCENT : "transparent",
                    borderColor: log.warmupDone ? ACCENT : "#333333",
                  }}
                >
                  {log.warmupDone && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
              <span className="text-[12px] text-[#888888]">{w.name}</span>
              {w.reps && <span className="text-[11px] text-[#444444]">{w.reps}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Exercises */}
      {exercises.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold">
              Hareketler
            </p>
            <span className="text-[10px]" style={{ color: doneExCount === exercises.length ? ACCENT : "#444444" }}>
              {doneExCount}/{exercises.length}
            </span>
          </div>
          <div>
            {exercises.map((ex) => (
              <ExerciseRow
                key={ex.name}
                ex={ex}
                done={log.exercisesDone[ex.name] ?? false}
                logEntry={log.exerciseLogs[ex.name] ?? { kg: "", reps: "", note: "" }}
                isToday={isToday}
                onToggle={() => toggleExercise(ex.name)}
                onLog={(f, v) => updateLog(ex.name, f, v)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cardio */}
      {cardio.length > 0 && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold mb-2">Kardiyo</p>
          {cardio.map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <button
                onClick={() => isToday && toggleCardio()}
                disabled={!isToday}
                className="shrink-0"
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: log.cardioDone ? ACCENT : "transparent",
                    borderColor: log.cardioDone ? ACCENT : "#333333",
                  }}
                >
                  {log.cardioDone && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
              <span className="text-[12px] text-[#888888]">{c.name}</span>
              {c.reps && <span className="text-[11px] text-[#444444]">{c.reps}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      {completionRules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] uppercase tracking-widest text-[#444444] font-bold">Kapanış Şartları</p>
            {isToday && (
              <span className="text-[10px]" style={{ color: checkDoneCount === completionRules.length ? ACCENT : "#444444" }}>
                {checkDoneCount}/{completionRules.length}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {completionRules.map((rule, i) => (
              <button
                key={i}
                onClick={() => isToday && toggleChecklist(i)}
                disabled={!isToday}
                className="flex items-center gap-2.5 text-left"
              >
                <div
                  className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: log.checklistChecks[i] ? ACCENT : "transparent",
                    borderColor: log.checklistChecks[i] ? ACCENT : "#333333",
                  }}
                >
                  {log.checklistChecks[i] && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  className="text-[12px] leading-snug"
                  style={{ color: log.checklistChecks[i] ? ACCENT : "#666666" }}
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

      {/* Safety reminder */}
      <div className="rounded-lg px-3 py-2 border border-[#2a1500] bg-[#1a0f00]">
        <p className="text-[9px] uppercase tracking-widest text-[#ef4444] font-bold mb-1">Ağrı Uyarısı</p>
        <p className="text-[11px] text-[#888888]">
          Bel veya bacağa vuran ağrı artarsa hareketi hemen kes. Failure yok. RPE 7–8 dışına çıkma.
        </p>
      </div>

    </div>
  );
}
