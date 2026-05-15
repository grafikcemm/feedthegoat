'use client';

import React from "react";

interface CareerLadderHeroProps {
  currentLevel: number;
  totalLevels: number;
  completedLevels: number;
  activeLevelTitle: string;
  progressPercent: number;
}

export function CareerLadderHero({
  currentLevel,
  totalLevels,
  completedLevels,
  activeLevelTitle,
  progressPercent,
}: CareerLadderHeroProps) {
  const steps = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Left: Ladder Visual */}
        <div className="flex flex-col-reverse gap-1.5 shrink-0">
          {steps.map(step => {
            const isDone = step < currentLevel;
            const isActive = step === currentLevel;

            return (
              <div key={step} className="flex items-center gap-2">
                {/* Rung */}
                <div
                  className={`h-6 rounded transition-all duration-500 ${
                    isActive
                      ? "w-16 bg-[#F5C518]"
                      : isDone
                      ? "w-14 bg-[#22c55e]/40"
                      : "w-10 bg-[#1a1a1a]"
                  }`}
                />
                {/* Step label */}
                <span
                  className={`text-[9px] font-mono font-bold ${
                    isActive
                      ? "text-[#F5C518]"
                      : isDone
                      ? "text-[#22c55e]/60"
                      : "text-[#2a2a2a]"
                  }`}
                >
                  {step}
                </span>
                {/* Character — only on active level */}
                {isActive && (
                  <div
                    className="text-base animate-bounce"
                    style={{ animationDuration: "1.8s" }}
                    role="img"
                    aria-label="aktif seviye"
                  >
                    🐐
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#444] font-bold block">
              Gelişim Merdiveni
            </span>
            <h2 className="text-white font-bold text-lg mt-1 leading-tight">
              Seviye {currentLevel}
            </h2>
            <p className="text-[#666] text-xs mt-0.5 truncate">{activeLevelTitle}</p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] text-[#444] uppercase tracking-wider">Seviye İlerlemesi</span>
              <span className="text-[9px] font-mono text-[#555]">{progressPercent}%</span>
            </div>
            <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5C518] transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-2 text-center">
              <span className="text-[#22c55e] font-mono font-bold text-base block">{completedLevels}</span>
              <span className="text-[9px] text-[#444] uppercase tracking-wider">Tamamlandı</span>
            </div>
            <div className="bg-[#0d0d0d] border border-[#F5C518]/15 rounded-lg p-2 text-center">
              <span className="text-[#F5C518] font-mono font-bold text-base block">{currentLevel}</span>
              <span className="text-[9px] text-[#444] uppercase tracking-wider">Aktif</span>
            </div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-2 text-center">
              <span className="text-[#333] font-mono font-bold text-base block">{totalLevels - currentLevel}</span>
              <span className="text-[9px] text-[#333] uppercase tracking-wider">Kalan</span>
            </div>
          </div>

          {/* Single focus rule reminder */}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#F5C518]" />
            <span className="text-[10px] text-[#444] italic">
              Tek aktif basamak: önce bunu bitir, sonra ilerleme.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
