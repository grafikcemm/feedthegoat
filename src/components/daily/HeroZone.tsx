import React from "react";
import { PixelGoat } from "./PixelGoat";
import { cn } from "@/utils/cn";
import { type GoatMood, moodLineFor } from "@/lib/goatState";

export interface HeroZoneProps {
  total: number;
  disciplineScore: number;
  disciplineMax: number;
  healthScore: number;
  healthMax: number;
  productionDone: number;
  productionTotal: number;
  mood: GoatMood;
  remainingTaskCount: number;
  energyLevel?: 'low' | 'medium' | 'high';
  energyCap?: number;
}

export function HeroZone({ 
  total, 
  disciplineScore, 
  disciplineMax, 
  healthScore, 
  healthMax, 
  productionDone, 
  productionTotal, 
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
      "grid grid-cols-[280px_1fr_auto] gap-8 items-center px-8 py-10 border-b border-ftg-border-subtle transition-colors duration-500",
      isHigh && "bg-ftg-success/5"
    )}>
      {/* Column 1 — Pixel goat stage */}
      <div className={cn(
        "bg-ftg-mountain-1 rounded-ftg-card border border-ftg-border-subtle p-6 flex items-center justify-center transition-all",
        isLow && "grayscale opacity-50"
      )}>
        <PixelGoat mood={mood} />
      </div>

      {/* Column 2 — Score block */}
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-2">
          BUGÜNKÜ SİSTEM SKORU
        </span>
        <div className="flex items-baseline">
          {/* Keyed by total so it remounts and flashes on change */}
          <span key={total} className={cn(
            "font-display text-[120px] leading-none animate-score-flash",
            isLow ? "text-zinc-400" : "text-ftg-amber"
          )}>
            {total}
          </span>
          <span className="font-display text-[40px] text-ftg-text-mute ml-2">
            /{energyCap}
          </span>
        </div>
        <p className="font-mono text-sm italic text-ftg-text-dim mt-2">
          {moodDesc}
        </p>
      </div>

      {/* Column 3 — Component breakdown */}
      <div className="flex flex-col gap-3 justify-center min-w-[200px]">
        {/* DİSİPLİN */}
        {disciplineMax > 0 && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
              DİSİPLİN
            </span>
            <div className="flex flex-col items-end gap-1">
              <div className="w-24 h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
                <div
                  className="bg-ftg-amber h-full transition-all duration-500 ease-out"
                  style={{ width: `${(disciplineScore / disciplineMax) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-[10px] text-ftg-amber leading-none">
                {disciplineScore}/{disciplineMax}
              </span>
            </div>
          </div>
        )}

        {/* ÜRETİM */}
        {productionTotal > 0 && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
              ÜRETİM
            </span>
            <div className="flex flex-col items-end gap-1">
              <div className="w-24 h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(productionDone / productionTotal) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-[10px] text-ftg-text-bright leading-none">
                {productionDone}/{productionTotal}
              </span>
            </div>
          </div>
        )}

        {/* SAĞLIK */}
        {healthMax > 0 && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
              SAĞLIK
            </span>
            <div className="flex flex-col items-end gap-1">
              <div className="w-24 h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
                <div
                  className="bg-ftg-success h-full transition-all duration-500 ease-out"
                  style={{ width: `${(healthScore / healthMax) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-[10px] text-ftg-success leading-none">
                {healthScore}/{healthMax}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
