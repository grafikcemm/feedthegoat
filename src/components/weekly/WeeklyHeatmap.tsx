import React from "react";
import { isSameDay } from "date-fns";
import { DAY_LABELS_TR, formatDateForDB } from "@/lib/weekUtils";

interface WeeklyHeatmapProps {
  weekDays: Date[];
  scoresByDate: Record<string, number>;
}

export function WeeklyHeatmap({ weekDays, scoresByDate }: WeeklyHeatmapProps) {
  const now = new Date();

  return (
    <div className="mt-8">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-3">
        BU HAFTA
      </div>
      <div className="flex gap-3">
        {weekDays.map((day, i) => {
          const score = scoresByDate[formatDateForDB(day)] ?? 0;
          const intensity =
            score === 0 ? 'bg-ftg-border-subtle' :
            score < 35 ? 'bg-ftg-amber/20' :
            score < 70 ? 'bg-ftg-amber/50' :
            'bg-ftg-amber';
          
          const isToday = isSameDay(day, now);

          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className={`w-full aspect-square rounded-ftg-card ${intensity} ${isToday ? 'ring-1 ring-ftg-amber shadow-[0_0_10px_rgba(200,150,62,0.3)]' : ''} flex items-center justify-center transition-all duration-500`}
                title={`${formatDateForDB(day)}: ${score} puan`}
              >
                {score > 0 && (
                  <span className="font-display text-2xl text-ftg-bg animate-in zoom-in duration-700">
                    {score}
                  </span>
                )}
              </div>
              <span className={`font-mono text-[9px] tracking-[0.15em] ${isToday ? 'text-ftg-amber font-bold' : 'text-ftg-text-mute'}`}>
                {DAY_LABELS_TR[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
