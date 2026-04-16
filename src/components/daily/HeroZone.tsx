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
  currentStreak?: number;
  weeklyConsistency?: number;
}

export function HeroZone({ 
  total, 
  mood, 
  remainingTaskCount,
  energyLevel = 'high',
  energyCap = 70,
  currentStreak = 0,
  weeklyConsistency = 0,
}: HeroZoneProps) {
  // Match 'low', 'medium', 'high' or 'LOW', 'MID', 'HIGH'
  const isLow = energyLevel?.toLowerCase() === 'low';
  const isHigh = energyLevel?.toLowerCase() === 'high';
  const isMid = energyLevel?.toLowerCase() === 'mid' || energyLevel?.toLowerCase() === 'medium';

  const moodDesc = isLow 
    ? "Bugün dinlenme modu. Az ama öz." 
    : isMid
      ? "Bugün tam güç. Sistemi çalıştır." 
      : isHigh
        ? "Yüksek enerji. Maksimum çıktı."
        : moodLineFor(mood, total, remainingTaskCount);



  return (
    <div className={cn(
      "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-center p-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500",
      isHigh && "border-[#6366f1]/50 shadow-[0_4px_20px_rgba(99,102,241,0.2)]"
    )}>
      {/* Column 1 — Pixel goat stage */}
      <div className={cn(
        "bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-10 flex items-center justify-center transition-all",
        isLow && "grayscale opacity-50"
      )}>
        <PixelGoat mood={mood} />
      </div>

      {/* Column 2 — Score block */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
           <span className="text-[11px] font-semibold tracking-widest uppercase text-[#555555]">
            GÜNLÜK SİSTEM SKORU
          </span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>
        
        <div className="flex items-baseline gap-1 mt-2">
          {/* Keyed by total so it remounts and flashes on change */}
          <span key={total} className={cn(
            "text-7xl font-black leading-none animate-score-flash",
            isLow ? "text-[#666666]" : "text-white"
          )}>
            {total}
          </span>
          <span className="text-3xl font-thin text-[#555555] ml-2">
            /{energyCap}
          </span>
        </div>

        <p className="text-sm text-[#666666] italic mt-2 mt-8 border-l-4 border-[#6366f1] pl-6 font-medium leading-relaxed max-w-xl">
          {moodDesc}
        </p>

        {/* Streak + Consistency */}
        <div className="flex flex-wrap items-center gap-6 mt-10">
          {currentStreak > 0 && (
            <div className="flex items-center gap-3 bg-[#141414] px-5 py-2.5 rounded-full border border-[#6366f1]/40 shadow-sm transition-transform hover:scale-105">
              <span className="text-[#6366f1] text-xl">🔥</span>
              <span className="text-[#6366f1] text-xs font-semibold uppercase">
                {currentStreak} GÜN SERİ
              </span>
            </div>
          )}
          {weeklyConsistency > 0 && (
            <div className="flex items-center gap-3 bg-[#0a0a0a] px-5 py-2.5 rounded-full border border-[#2a2a2a]">
               <span className="w-2 h-2 rounded-full bg-[#30d158]" />
               <span className="text-[#ababab] text-xs font-semibold uppercase">
                HAFTALIK %{weeklyConsistency} TUTARLILIK
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
