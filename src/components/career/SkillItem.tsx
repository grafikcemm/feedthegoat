'use client';

import React from 'react';
import { toggleSkillCompletion } from '@/app/actions/careerActions';
import { useRouter } from 'next/navigation';

interface SkillItemProps {
  skill: {
    id: number;
    title: string;
    description: string | null;
    resource: string | null;
    is_completed: boolean;
    wef_tag?: string | null;
  };
  disabled?: boolean;
}

export function SkillItem({ skill, disabled = false }: SkillItemProps) {
  const router = useRouter();

  const handleToggle = async () => {
    if (disabled) return;
    await toggleSkillCompletion(skill.id, !skill.is_completed);
    router.refresh();
  };

  const getWefLabel = (tag: string) => {
    const labels: Record<string, string> = {
      'AI_BIG_DATA': 'WEF · AI & BIG DATA',
      'TECH_LITERACY': 'WEF · TECH LITERACY',
      'CREATIVE_THINKING': 'WEF · CREATIVE THINKING',
      'RESILIENCE': 'WEF · RESILIENCE',
      'CURIOSITY': 'WEF · CURIOSITY',
      'LEADERSHIP': 'WEF · LEADERSHIP',
      'TALENT_MGMT': 'WEF · TALENT MGMT',
      'ANALYTICAL': 'WEF · ANALYTICAL',
      'SYSTEMS': 'WEF · SYSTEMS',
      'MOTIVATION': 'WEF · MOTIVATION',
      'EMPATHY': 'WEF · EMPATHY',
      'SERVICE': 'WEF · SERVICE',
      'DESIGN_UX': 'WEF · DESIGN/UX (EMERGING)'
    };
    return labels[tag] || tag;
  };

  return (
    <div className={`flex gap-3 py-2 group ${disabled ? 'opacity-70' : ''}`}>
      <button 
        onClick={handleToggle}
        disabled={disabled}
        className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 transition-all duration-200 flex items-center justify-center
          ${skill.is_completed 
            ? 'bg-[#22C55E]/20 border-[#22C55E]' 
            : 'border-[#1E1E1E] bg-transparent group-hover:border-[#444444]'
          }
          ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        `}
      >
        {skill.is_completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4L3.5 6.5L9 1" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="flex-1">
        <h4 className={`text-sm font-medium transition-colors ${skill.is_completed ? 'text-[#888888]' : 'text-white'}`}>
          {skill.title}
        </h4>
        {skill.description && (
          <p className="text-[#888888] text-xs mt-0.5 leading-relaxed">
            {skill.description}
          </p>
        )}
        {skill.resource && (
          <div className="bg-[#1E1E1E] text-[#444444] text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider font-semibold mr-2">
            {skill.resource}
          </div>
        )}
        {skill.wef_tag && (
          <div className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-[#1E1E1E] bg-[#0A0A0A] mt-1.5 inline-block font-semibold ${skill.wef_tag === 'DESIGN_UX' ? 'text-[#F5C518]' : 'text-[#888]'}`}>
            {getWefLabel(skill.wef_tag)}
          </div>
        )}
      </div>
    </div>
  );
}
