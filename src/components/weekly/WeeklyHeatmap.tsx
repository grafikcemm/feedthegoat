import React from "react";
import { isSameDay } from "date-fns";
import { DAY_LABELS_TR, formatDateForDB } from "@/lib/weekUtils";
import { cn } from "@/utils/cn";

interface DayScore {
  date: string;
  total_score: number;
  completion_rate: number;
}

interface WeeklyHeatmapProps {
  weekDays: Date[];
  scoresByDate: Record<string, DayScore>;
}

function getHeatColor(rate: number): string {
  if (rate === 0) return 'bg-[#0a0a0a] border-[#2a2a2a]';
  if (rate < 50) return 'bg-[#141414] border-[#6366f1]/10';
  if (rate < 70) return 'bg-[#141414] border-[#6366f1]/30 shadow-inner';
  if (rate < 100) return 'bg-[#6366f1]/80 border-[#6366f1]/20 shadow-md';
  return 'bg-[#30d158] border-[#30d158]/20 shadow-md';
}

export function WeeklyHeatmap({ weekDays, scoresByDate }: WeeklyHeatmapProps) {
  const now = new Date();

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-[#666666] text-xs font-semibold tracking-widest uppercase">
          HAFTALIK SİSTEM AKIŞI
        </h3>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>
      <div className="flex gap-3">
        {weekDays.map((day, i) => {
          const dateKey = formatDateForDB(day);
          const dayData = scoresByDate[dateKey];
          const score = dayData?.total_score ?? 0;
          const rate = dayData?.completion_rate ?? 0;
          const intensity = getHeatColor(rate);
          const isToday = isSameDay(day, now);

          return (
            <div key={i} className="flex flex-col items-center gap-3 flex-1">
              <div 
                className={cn(
                  'w-full aspect-square rounded-2xl border flex items-center justify-center transition-all duration-700 shadow-sm',
                  intensity,
                  isToday && 'ring-2 ring-[#6366f1] ring-offset-2 ring-offset-[#000000] shadow-xl scale-105'
                )}
                title={`${dateKey}: ${score} puan — %${rate}`}
              >
                {score > 0 && (
                  <span className={cn(
                    "text-xs font-black animate-in zoom-in duration-700",
                    rate === 100 || rate >= 70 ? "text-white" : "text-[#ffffff]"
                  )}>
                    {score}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-bold tracking-widest uppercase',
                isToday ? 'text-[#6366f1] underline underline-offset-4 decoration-2' : 'text-[#666666]'
              )}>
                {DAY_LABELS_TR[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
