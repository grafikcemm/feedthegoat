'use client';

import React, { useEffect, useState } from 'react';
import { getTodayModules } from '@/lib/dayModules';
import { Dumbbell, BookOpen, Activity, Wind } from 'lucide-react';

export function DayModule() {
  const [mounted, setMounted] = useState(false);
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setModules(getTodayModules());
  }, []);

  if (!mounted) return null;
  if (!modules || modules.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      {modules.map((modId) => {
        if (modId === 'sunday_charge_mode') return null;

        let accentColor = 'rgba(255,255,255,1)';
        let title = '';
        let detail = '';
        let IconComp: React.ComponentType<any> | null = null;
        let linkHref: string | null = null;

        switch (modId) {
          case 'active_rest':
            accentColor = 'rgba(255,255,255,0.6)';
            title = 'AKTİF DİNLENME';
            detail = '20-30 dk yürüyüş · Sıfır çekme';
            IconComp = Wind;
            break;
          case 'sunday_charge_mode':
            // Although sunday_charge_mode is ignored at line 22, 
            // we keep the case just to be safe if filtering changes.
            return null;
          default:
            return null;
        }

        const card = (
          <div className="flex items-stretch rounded-[16px] overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-elevated)] transition-colors group">
            <div className="w-[4px] shrink-0" style={{ backgroundColor: accentColor }} />
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                  {title}
                </span>
                <span className="text-[13px] text-[var(--text-secondary)]">
                  {detail}
                </span>
              </div>
              {IconComp && (
                <IconComp
                  size={20}
                  className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors"
                  strokeWidth={1.5}
                />
              )}
            </div>
          </div>
        );

        if (linkHref) {
          return (
            <a key={modId} href={linkHref} className="block">
              {card}
            </a>
          );
        }

        return <div key={modId}>{card}</div>;
      })}
    </div>
  );
}
