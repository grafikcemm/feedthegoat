'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface EveningAlertProps {
  incompleteCriticalTasks: string[];
  score: number;
  isFinalized: boolean;
}

export function EveningAlert({ incompleteCriticalTasks, score, isFinalized }: EveningAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only after 21:00
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() >= 21 && incompleteCriticalTasks.length > 0 && !isFinalized) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [incompleteCriticalTasks, isFinalized]);

  if (!isVisible) return null;

  return (
    <div className="border border-[#E8956D]/30 bg-[#FDF0E8] shadow-sm rounded-2xl px-6 py-5 mb-8 animate-in duration-500 group">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[#E8956D] animate-pulse text-xl">⚡</span>
        <p className="text-[#E8956D] text-[10px] tracking-[0.2em] font-bold uppercase">
          AKŞAM UYARISI: KRİTİK EKSİKLER
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        {incompleteCriticalTasks.map((task, i) => (
          <div key={i} className="flex items-center gap-3 py-1 border-l-4 border-[#E8956D] pl-6 transition-all">
            <span className="text-[#8B7355] text-sm font-semibold leading-tight transition-colors group-hover:text-[#2C2420]">
              {task}
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-[9px] text-[#B5A090] font-bold uppercase tracking-[0.1em] italic">
        * SİSTEM TAMAMLANMADAN UYUYA KALMA. KEÇİYİ BESLE.
      </p>
    </div>
  );
}
