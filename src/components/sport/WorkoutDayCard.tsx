"use client";

import React, { useState, useTransition } from "react";
import { completeWorkout } from "@/app/actions/completeWorkout";
import { cn } from "@/utils/cn";

interface Exercise {
  id: string;
  name: string;
  sets_reps: string | null;
  sort_order: number;
}

interface WorkoutDay {
  id: string;
  day_of_week: string;
  title: string;
  day_type: "workout" | "active_rest" | "full_rest";
  amac: string | null;
  exercises: Exercise[];
}

interface WorkoutDayCardProps {
  day: WorkoutDay;
  isToday: boolean;
  isCompleted: boolean;
}

export function WorkoutDayCard({ day, isToday, isCompleted }: WorkoutDayCardProps) {
  const [open, setOpen] = useState(isToday);
  const [isPending, startTransition] = useTransition();

  const dayLabelMap: Record<string, string> = {
    PZT: "PAZARTESİ",
    SAL: "SALI",
    CAR: "ÇARŞAMBA",
    PER: "PERŞEMBE",
    CUM: "CUMA",
    CMT: "CUMARTESİ",
    PAZ: "PAZAR",
  };

  const buttonLabel =
    day.day_type === "full_rest"
      ? null
      : day.day_type === "active_rest"
      ? "RİTMİ KORUDUM (BİTİR)"
      : "GÜNÜ TAMAMLA";

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await completeWorkout({ dayId: day.id });
      } catch (err) {
        console.error("Failed to complete workout:", err);
      }
    });
  };

  return (
    <div
      className={cn(
        "rounded-ftg-card border bg-ftg-surface transition-all duration-300 overflow-hidden",
        isToday
          ? "border-l-4 border-l-ftg-amber border-ftg-border-subtle shadow-lg"
          : "border-ftg-border-subtle"
      )}
    >
      {/* Header — clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-ftg-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-ftg-text font-medium">
            {dayLabelMap[day.day_of_week]} — {day.title}
          </span>
          {isToday && (
            <span className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded bg-ftg-amber-glow text-ftg-amber animate-pulse">
              BUGÜN
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isCompleted && (
            <span className="font-mono text-[9px] tracking-wider uppercase text-ftg-success flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              TAMAMLANDI
            </span>
          )}
          <span className="font-mono text-[10px] tracking-wider uppercase text-ftg-text-mute">
            {open ? "KAPAT" : "AYRINTILAR"}
          </span>
        </div>
      </button>

      {/* Body — only when open */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 border-t border-ftg-border-subtle pt-4 flex flex-col gap-4">
          {day.amac && (
            <div className="font-mono text-xs italic text-ftg-text-dim border-l-2 border-ftg-border-strong pl-3 py-1">
              {day.amac}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {day.exercises.map((ex) => (
              <div key={ex.id} className="flex items-start gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-ftg-border-strong mt-1.5 group-hover:bg-ftg-amber transition-colors" />
                <div className="font-mono text-xs text-ftg-text">
                  <span className="font-medium">{ex.name}</span>
                  {ex.sets_reps && (
                    <span className="text-ftg-text-mute ml-2">— {ex.sets_reps}</span>
                  )}
                </div>
              </div>
            ))}
            
            {day.exercises.length === 0 && (
              <div className="font-mono text-xs text-ftg-text-mute italic">
                Bu gün için egzersiz tanımlanmamış.
              </div>
            )}
          </div>

          <div className="mt-2 pt-4 border-t border-ftg-border-subtle/50">
            {buttonLabel && !isCompleted && (
              <button
                onClick={handleComplete}
                disabled={isPending}
                className="w-full md:w-auto px-6 py-2.5 rounded-ftg-card border border-ftg-amber text-ftg-amber font-mono text-[10px] tracking-wider uppercase hover:bg-ftg-amber-glow transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? "İŞLENİYOR..." : buttonLabel}
              </button>
            )}
            {isCompleted && (
              <div className="w-full md:w-auto px-6 py-2.5 rounded-ftg-card border border-ftg-success/40 bg-ftg-success/5 text-ftg-success font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-2">
                 BUGÜN TAMAMLANDI
              </div>
            )}
            {!buttonLabel && (
              <div className="font-mono text-xs text-ftg-text-mute italic">
                Pazar günü sadece zihinsel ve bedensel dinlenmeye ayrılmıştır.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
