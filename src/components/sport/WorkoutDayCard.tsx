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
        "rounded-2xl border transition-all duration-300 overflow-hidden",
        isToday
          ? "border-[#6366f1]/50 bg-[#141414] shadow-xl"
          : "border-[#2a2a2a] bg-[#141414] shadow-sm"
      )}
    >
      {/* Header — clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0a0a0a]/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-sm font-bold transition-colors uppercase tracking-tight",
            isToday ? "text-[#6366f1]" : "text-[#ababab]"
          )}>
            {dayLabelMap[day.day_of_week]} — {day.title}
          </span>
          {isToday && (
            <span className="bg-[#6366f1] text-white text-[9px] px-2 py-0.5 rounded-lg font-bold animate-pulse uppercase tracking-widest">
              BUGÜN
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          {isCompleted && (
            <span className="text-[10px] tracking-widest uppercase text-[#30d158] flex items-center gap-1.5 font-bold">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              TAMAMLANDI
            </span>
          )}
          <span className="text-[10px] tracking-widest uppercase text-[#666666] font-bold">
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
        <div className="px-6 pb-6 border-t border-[#2a2a2a] bg-[#000000]/30 pt-5 flex flex-col gap-5">
          {day.amac && (
            <div className="text-[11px] italic text-[#ababab] border-l-4 border-[#6366f1] pl-4 py-2 bg-[#141414] rounded-r-xl font-medium">
              {day.amac}
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {day.exercises.map((ex) => (
              <div key={ex.id} className="flex items-start gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a] mt-2 group-hover:bg-[#6366f1] transition-colors" />
                <div className="text-sm">
                  <span className="text-[#ababab] font-medium">{ex.name}</span>
                  {ex.sets_reps && (
                    <span className="text-[#666666] ml-3 text-xs font-bold uppercase tracking-tight">/ {ex.sets_reps}</span>
                  )}
                </div>
              </div>
            ))}
            
            {day.exercises.length === 0 && (
              <div className="text-xs text-[#666666] italic py-2">
                Bu gün için egzersiz tanımlanmamış.
              </div>
            )}
          </div>

          <div className="mt-2 pt-5 border-t border-[#2a2a2a]/50">
            {buttonLabel && !isCompleted && (
              <button
                onClick={handleComplete}
                disabled={isPending}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl border-2 border-[#6366f1] text-[#6366f1] text-[10px] tracking-widest font-bold uppercase hover:bg-[#141414] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? "İŞLENİYOR..." : buttonLabel}
              </button>
            )}
            {isCompleted && (
              <div className="w-full md:w-auto px-8 py-3.5 rounded-xl border border-[#30d158]/20 bg-[#30d158] text-[#30d158] text-[10px] tracking-widest font-bold uppercase flex items-center justify-center gap-2">
                 TAMAMLANDI
              </div>
            )}
            {!buttonLabel && (
              <div className="text-xs text-[#666666] italic leading-relaxed font-medium">
                Pazar günü sadece zihinsel ve bedensel dinlenmeye ayrılmıştır.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
