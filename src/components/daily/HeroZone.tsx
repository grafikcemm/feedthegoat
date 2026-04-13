import React from "react";
import { PixelGoat } from "./PixelGoat";
import { cn } from "@/utils/cn";
import { type GoatMood, moodLineFor } from "@/lib/goatState";

export interface HeroZoneProps {
  total: number;
  mood: GoatMood;
  remainingTaskCount: number;
  energyLevel?: 'low' | 'medium' | 'high';
  energyCap?: number;
}

export function HeroZone({ 
  total, 
  mood, 
  remainingTaskCount,
  energyLevel = 'high',
  energyCap = 70
}: HeroZoneProps) {
  const moodDesc = energyLevel === 'low' 
    ? "Bugün dinlenme günü. Az ama öz." 
    : energyLevel === 'high' 
      ? "Bugün tam güç. Sistemi çalıştır." 
      : moodLineFor(mood, total, remainingTaskCount);

  const isLow = energyLevel === 'low';
  const isHigh = energyLevel === 'high';

  return (
    <div className={cn(
      "grid grid-cols-[280px_1fr] gap-12 items-center px-10 py-12 border-b border-ftg-border-subtle transition-colors duration-500",
      isHigh && "bg-ftg-success/5"
    )}>
      {/* Column 1 — Pixel goat stage */}
      <div className={cn(
        "bg-ftg-mountain-1 rounded-ftg-card border border-ftg-border-subtle p-8 flex items-center justify-center transition-all shadow-inner",
        isLow && "grayscale opacity-50"
      )}>
        <PixelGoat mood={mood} />
      </div>

      {/* Column 2 — Score block */}
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ftg-text-mute mb-3">
          BUGÜNKÜ SİSTEM SKORU
        </span>
        <div className="flex items-baseline">
          {/* Keyed by total so it remounts and flashes on change */}
          <span key={total} className={cn(
            "font-display text-[140px] leading-none animate-score-flash tracking-tighter",
            isLow ? "text-zinc-600" : "text-ftg-amber"
          )}>
            {total}
          </span>
          <span className="font-display text-[50px] text-ftg-text-mute ml-3 opacity-50">
            /{energyCap}
          </span>
        </div>
        <p className="font-mono text-base italic text-ftg-text-dim mt-4 border-l-2 border-ftg-amber/30 pl-4">
          {moodDesc}
        </p>
      </div>
    </div>
  );
}
