'use client';

import React from 'react';

interface CareerTargetBannerProps {
  totalPhases: number;
  activePhaseNumber: number;
  completedSkills: number;
  totalSkills: number;
}

export function CareerTargetBanner({ 
  totalPhases, 
  activePhaseNumber, 
  completedSkills, 
  totalSkills 
}: CareerTargetBannerProps) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-4 mb-4">
      <div className="mb-4">
        <span className="text-[#444444] text-xs uppercase tracking-widest block mb-1">
          HEDEF ROL
        </span>
        <h2 className="text-[#F5C518] font-bold text-base">
          AI-Native Creative Operator
        </h2>
        <p className="text-[#888888] text-xs mt-1">
          Markaların yaratıcı operasyonlarını yöneten kişi — konseptten varyasyona, motion'dan performansa.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-none">{totalPhases}</span>
          <span className="text-[#444444] text-[10px] uppercase tracking-wider mt-1">TOPLAM FAZ</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-none">{activePhaseNumber}</span>
          <span className="text-[#444444] text-[10px] uppercase tracking-wider mt-1">AKTİF FAZ</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg leading-none">{completedSkills}/{totalSkills}</span>
          <span className="text-[#444444] text-[10px] uppercase tracking-wider mt-1">BECERİ TAMAMLANDI</span>
        </div>
      </div>
    </div>
  );
}
