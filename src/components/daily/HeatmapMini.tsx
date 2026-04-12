import React from "react";
import { cn } from "@/utils/cn";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";

export interface HeatmapDay {
  date: string;
  score: number;
}

export function HeatmapMini({ last7Days }: { last7Days: HeatmapDay[] }) {
  // Generate the last 7 days labels so even missing days show up as 0
  const today = new Date();
  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const label = format(d, "EEEEEE", { locale: tr }).toUpperCase();
    
    // Find if we have a score for this day
    const matchingData = last7Days.find((x) => x.date === dateStr);
    const score = matchingData ? matchingData.score : 0;
    
    return { score, label };
  });

  const getIntensityClass = (score: number) => {
    if (score === 0) return "bg-ftg-border-subtle";
    if (score <= 25) return "bg-ftg-amber/20";
    if (score <= 50) return "bg-ftg-amber/50";
    if (score <= 75) return "bg-ftg-amber/80";
    return "bg-ftg-amber animate-pulse shadow-[0_0_8px_rgba(245,181,68,0.4)]"; // special glow for max
  };

  return (
    <div className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-5">
      <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-4">
        SON 7 GÜN
      </h3>
      
      <div className="flex gap-2 justify-between">
        {weekData.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-9 h-9 rounded-sm flex items-center justify-center transition-colors",
                getIntensityClass(day.score)
              )}
            ></div>
            <span className="font-mono text-[9px] text-ftg-text-mute uppercase">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
