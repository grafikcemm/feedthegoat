'use client';

import React, { useState } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import { SkillItem } from './SkillItem';

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

interface CareerPhaseCardProps {
  phase: Phase;
}

export function CareerPhaseCard({ phase }: CareerPhaseCardProps) {
  const [isOpen, setIsOpen] = useState(phase.is_active);

  const toggleAccordion = () => {
    if (!phase.is_active) {
      setIsOpen(!isOpen);
    }
  };

  const technicalSkills = phase.skills.filter(s => s.skill_type === 'teknik').sort((a, b) => a.sort_order - b.sort_order);
  const personalSkills = phase.skills.filter(s => s.skill_type === 'kisisel').sort((a, b) => a.sort_order - b.sort_order);

  const cardClasses = `
    w-full transition-all duration-300 rounded-xl overflow-hidden mb-4
    ${phase.is_active 
      ? 'bg-[#111111] border border-[#F5C518]' 
      : `bg-[#111111] border border-[#1E1E1E] ${isOpen ? 'opacity-100' : 'opacity-70'}`
    }
  `;

  return (
    <div className={cardClasses}>
      {/* Header */}
      <div 
        onClick={toggleAccordion}
        className={`p-4 flex items-center justify-between ${!phase.is_active ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-3">
          {phase.is_active ? (
            <span className="bg-[#F5C518] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              AKTİF FAZ
            </span>
          ) : (
            <Lock className="w-4 h-4 text-[#444444]" />
          )}
          <div>
            <span className="text-[#444444] text-[10px] uppercase tracking-widest block font-medium">
              FAZ {phase.phase_number}
            </span>
            <h3 className="text-white font-bold text-lg leading-tight">
              {phase.title}
            </h3>
            <p className="text-[#888888] text-sm">
              {phase.subtitle}
            </p>
          </div>
        </div>
        
        {!phase.is_active && (
          <ChevronDown 
            className={`w-5 h-5 text-[#444444] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[#1E1E1E]/50 pt-4">
          <div className="space-y-6">
            {/* Technical Skills */}
            {technicalSkills.length > 0 && (
              <div>
                <h5 className="text-[#F5C518] text-[10px] uppercase tracking-widest font-bold mb-3">
                  TEKNİK BECERİLER
                </h5>
                <div className="space-y-1">
                  {technicalSkills.map(skill => (
                    <SkillItem 
                      key={skill.id} 
                      skill={skill} 
                      disabled={!phase.is_active} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Personal Skills */}
            {personalSkills.length > 0 && (
              <div>
                <h5 className="text-[#888888] text-[10px] uppercase tracking-widest font-bold mb-3">
                  KİŞİSEL BECERİLER
                </h5>
                <div className="space-y-1">
                  {personalSkills.map(skill => (
                    <SkillItem 
                      key={skill.id} 
                      skill={skill} 
                      disabled={!phase.is_active} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {!phase.is_active && (
            <p className="text-[#444444] text-[10px] italic mt-6 border-t border-[#1E1E1E] pt-3">
              Bu fazı açmak için Faz {phase.phase_number - 1}'i tamamla
            </p>
          )}
        </div>
      )}
    </div>
  );
}
