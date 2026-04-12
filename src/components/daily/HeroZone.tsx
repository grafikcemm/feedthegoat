import React from "react";
import { PixelGoat } from "./PixelGoat";
import { cn } from "@/utils/cn";
import { type GoatMood, moodLineFor } from "@/lib/goatState";

export interface HeroZoneProps {
  total: number;
  discipline: number;
  production: number;
  health: number;
  mood: GoatMood;
  remainingTaskCount: number;
}

export function HeroZone({ total, discipline, production, health, mood, remainingTaskCount }: HeroZoneProps) {
  const moodDesc = moodLineFor(mood, total, remainingTaskCount);

  return (
    <div className="grid grid-cols-[280px_1fr_auto] gap-8 items-center px-8 py-10 border-b border-ftg-border-subtle">
      {/* Column 1 — Pixel goat stage */}
      <div className="bg-ftg-mountain-1 rounded-ftg-card border border-ftg-border-subtle p-6 flex items-center justify-center">
        <PixelGoat mood={mood} />
      </div>

      {/* Column 2 — Score block */}
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-2">
          BUGÜNKÜ SİSTEM SKORU
        </span>
        <div className="flex items-baseline">
          {/* Keyed by total so it remounts and flashes on change */}
          <span key={total} className="font-display text-[120px] leading-none text-ftg-amber animate-score-flash">
            {total}
          </span>
          <span className="font-display text-[40px] text-ftg-text-mute ml-2">
            /70
          </span>
        </div>
        <p className="font-mono text-sm italic text-ftg-text-dim mt-2">
          {moodDesc}
        </p>
      </div>

      {/* Column 3 — Component breakdown */}
      <div className="flex flex-col gap-3 justify-center min-w-[200px]">
        {/* DİSİPLİN */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
            DİSİPLİN
          </span>
          <div className="flex flex-col items-end gap-1">
            <div className="w-24 h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
              <div
                className="bg-ftg-amber h-full transition-all duration-500 ease-out"
                style={{ width: `${(discipline / 35) * 100}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-ftg-amber leading-none">
              {discipline}/35
            </span>
          </div>
        </div>

        {/* ÜRETİM (Informational only, no bar) */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
            ÜRETİM
          </span>
          <div className="flex flex-col items-end gap-1">
            <div className="font-mono text-[10px] text-ftg-text-mute uppercase tracking-widest mb-1">
              BİLGİ AMAÇLI
            </div>
            <span className="font-mono text-sm text-ftg-text tabular-nums">
              {production} GÖREV
            </span>
          </div>
        </div>

        {/* SAĞLIK */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute w-20">
            SAĞLIK
          </span>
          <div className="flex flex-col items-end gap-1">
            <div className="w-24 h-1.5 bg-ftg-border-strong rounded-full overflow-hidden flex">
              <div
                className="bg-ftg-amber h-full transition-all duration-500 ease-out"
                style={{ width: `${(health / 35) * 100}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-ftg-amber leading-none">
              {health}/35
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
