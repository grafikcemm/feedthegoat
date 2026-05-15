'use client';

import React, { useState } from 'react';
import { ChevronDown, Check, Info } from 'lucide-react';
import { SkillItem } from './SkillItem';
import { SkillDetailDrawer } from './SkillDetailDrawer';
import { GELISIM_CONFIG } from '@/data/gelisimConfig';
import { getKnowledgeItem, CareerKnowledgeItem } from '@/data/careerKnowledgeBase';

// Skills archived from the main list — still exist in DB, not shown
const ARCHIVED_SKILL_TITLES = [
  "AgencyOS'u Tamamla ve Aktif Et",
  "Grafikcem Detaylı Branding Planlaması",
];

interface Skill {
  id: number;
  phase_id: number;
  skill_type: 'teknik' | 'kisisel';
  title: string;
  description: string | null;
  resource: string | null;
  is_completed: boolean;
  sort_order: number;
  wef_tag?: string | null;
}

interface Phase {
  id: number;
  phase_number: number;
  title: string;
  subtitle: string;
  is_active: boolean;
  is_unlocked: boolean;
  sort_order: number;
  skills: Skill[];
}

export function CareerPhaseCard({ phase }: { phase: Phase }) {
  const [isOpen, setIsOpen] = useState(phase.is_active);
  const [drawerItem, setDrawerItem] = useState<CareerKnowledgeItem | null>(null);

  // Filter archived items from main list (they stay in DB)
  const allSkills = [...phase.skills]
    .filter(s => !ARCHIVED_SKILL_TITLES.includes(s.title))
    .sort((a, b) => a.sort_order - b.sort_order);

  const totalSkills = allSkills.length;
  const completedCount = allSkills.filter(s => s.is_completed).length;
  const progressPct = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
  const isAllDone = totalSkills > 0 && completedCount === totalSkills;

  const remaining = allSkills.filter(s => !s.is_completed);
  const activeTask = remaining[0] ?? null;
  const nextTask = remaining[1] ?? null;

  const technicalSkills = allSkills.filter(s => s.skill_type === 'teknik');
  const personalSkills = allSkills.filter(s => s.skill_type === 'kisisel');

  const fallback = GELISIM_CONFIG[phase.phase_number];
  const description = phase.subtitle || fallback?.description || '';

  const openDrawer = (skill: Skill) => {
    const kb = getKnowledgeItem(skill.title);
    if (kb) setDrawerItem(kb);
  };

  return (
    <>
      {drawerItem && (
        <SkillDetailDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
      )}

      <div
        className={`rounded-xl border overflow-hidden transition-all ${
          phase.is_active
            ? 'bg-[#111111] border-[#F5C518]/25'
            : 'bg-[#0D0D0D] border-[#1a1a1a]'
        }`}
      >
        {/* ── Header ── */}
        <div
          className={`p-4 flex items-center gap-3 ${!phase.is_active ? 'cursor-pointer' : ''}`}
          onClick={() => { if (!phase.is_active) setIsOpen(o => !o); }}
        >
          {/* Step circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
              phase.is_active
                ? 'bg-[#F5C518] text-black'
                : isAllDone
                ? 'bg-[#22c55e]/15 border border-[#22c55e] text-[#22c55e]'
                : 'bg-[#1a1a1a] border border-[#252525] text-[#444444]'
            }`}
          >
            {isAllDone ? <Check size={12} strokeWidth={3} /> : phase.phase_number}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium">
                SEVİYE {phase.phase_number}
              </span>
              {phase.is_active && (
                <span className="text-[10px] bg-[#F5C518]/10 text-[#F5C518] px-1.5 py-px rounded font-bold tracking-wide">
                  AKTİF
                </span>
              )}
            </div>
            <h3 className={`font-bold text-base leading-tight ${phase.is_active ? 'text-white' : 'text-[#555555]'}`}>
              {phase.title}
            </h3>
            {description && (
              <p className="text-[#444444] text-xs mt-0.5 truncate">{description}</p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {totalSkills > 0 && (
              <span className="text-[10px] font-mono text-[#444444]">
                {completedCount}/{totalSkills}
              </span>
            )}
            {!phase.is_active && (
              <ChevronDown
                size={16}
                className={`text-[#333333] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        </div>

        {/* ── Progress bar ── */}
        {isOpen && totalSkills > 0 && (
          <div className="px-4 pb-3">
            <div className="h-px bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5C518] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-[#333333] mt-1 block font-mono">
              {progressPct}% tamamlandı
            </span>
          </div>
        )}

        {/* ── Active task + next step ── */}
        {isOpen && phase.is_active && (activeTask || nextTask) && (
          <div className="px-4 pb-3 pt-2 border-t border-[#1a1a1a] flex flex-col gap-1.5">
            {activeTask && (
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#444444] uppercase tracking-wider shrink-0 w-24">
                  Aktif görev
                </span>
                <span className="text-xs text-[#888888]">{activeTask.title}</span>
              </div>
            )}
            {nextTask && (
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-[#333333] uppercase tracking-wider shrink-0 w-24">
                  Sonraki adım
                </span>
                <span className="text-xs text-[#555555]">{nextTask.title}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Skills list ── */}
        {isOpen && (technicalSkills.length > 0 || personalSkills.length > 0) && (
          <div className="px-4 pb-4 pt-3 border-t border-[#1a1a1a] space-y-5">
            {technicalSkills.length > 0 && (
              <div>
                <h5 className="text-[#444444] text-[10px] uppercase tracking-widest font-bold mb-2">
                  Teknik Beceriler
                </h5>
                <div className="space-y-0.5">
                  {technicalSkills.map(skill => {
                    const kb = getKnowledgeItem(skill.title);
                    return (
                      <div key={skill.id} className="flex items-start gap-1">
                        <div className="flex-1 min-w-0">
                          <SkillItem skill={skill} disabled={!phase.is_active} turkishTitle={kb?.turkishTitle} />
                        </div>
                        {kb && (
                          <button
                            onClick={() => openDrawer(skill)}
                            className="mt-2.5 text-[#2a2a2a] hover:text-[#555] transition-colors shrink-0"
                            title="Detay"
                          >
                            <Info size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {personalSkills.length > 0 && (
              <div>
                <h5 className="text-[#333333] text-[10px] uppercase tracking-widest font-bold mb-2">
                  Kişisel Beceriler
                </h5>
                <div className="space-y-0.5">
                  {personalSkills.map(skill => {
                    const kb = getKnowledgeItem(skill.title);
                    return (
                      <div key={skill.id} className="flex items-start gap-1">
                        <div className="flex-1 min-w-0">
                          <SkillItem skill={skill} disabled={!phase.is_active} turkishTitle={kb?.turkishTitle} />
                        </div>
                        {kb && (
                          <button
                            onClick={() => openDrawer(skill)}
                            className="mt-2.5 text-[#2a2a2a] hover:text-[#555] transition-colors shrink-0"
                            title="Detay"
                          >
                            <Info size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!phase.is_active && (
              <p className="text-[#333333] text-[10px] italic border-t border-[#1a1a1a] pt-3">
                Bu seviyeye geçmek için Seviye {phase.phase_number - 1}&#39;i tamamla
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
