'use client';

import React, { useState, useEffect } from 'react';
import { GlassWater } from 'lucide-react';
import confetti from 'canvas-confetti';
import { incrementWater, getTodayWater } from '@/app/actions/water';

export function WaterTracker() {
  const [bottlesCompleted, setBottlesCompleted] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const initial = await getTodayWater();
      setBottlesCompleted(initial);
      if (initial >= 3) setShowCelebration(true);
    }
    init();
  }, []);

  const handleBottleClick = async () => {
    if (bottlesCompleted < 3) {
      const result = await incrementWater();
      if (result.success) {
        const newVal = result.bottlesCompleted;
        setBottlesCompleted(newVal);
        if (newVal === 3) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          setShowCelebration(true);
        }
      }
    }
  };

  return (
    <div
      className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-subtle)] p-[20px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[var(--text-tertiary)]">
          SU TAKİBİ
        </h3>
        <span className="tabular-nums text-[var(--text-secondary)] text-[13px]">
          {bottlesCompleted}/3
        </span>
      </div>

      {/* Bottles — center aligned, 40px */}
      <div className="flex justify-center gap-6">
        {Array.from({ length: 3 }).map((_, index) => {
          const isFilled = index < bottlesCompleted;
          return (
            <button
              key={index}
              onClick={handleBottleClick}
              disabled={isFilled || bottlesCompleted >= 3}
              className={`transition-transform duration-200 rounded-xl ${
                !isFilled && bottlesCompleted < 3
                  ? 'hover:scale-[1.08] cursor-pointer active:scale-95'
                  : 'cursor-default'
              }`}
            >
              <GlassWater
                size={40}
                strokeWidth={isFilled ? 2 : 1.5}
                style={
                  isFilled
                    ? { color: 'var(--accent)', fill: 'rgba(250,250,250,0.15)' }
                    : { color: 'var(--border-strong)', fill: 'transparent' }
                }
              />
            </button>
          );
        })}
      </div>

      {/* Celebration Message */}
      {showCelebration && (
        <div
          className="mt-4 text-[var(--success)] italic text-[12px] text-center"
          style={{ animation: 'fade-in 0.4s ease-out, slide-in-from-bottom 0.4s ease-out' }}
        >
          3 litre tamam. Vücuduna iyi baktın.
        </div>
      )}
    </div>
  );
}
