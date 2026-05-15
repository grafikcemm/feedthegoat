'use client';

import React from "react";
import { ArrowRight } from "lucide-react";
import { getKnowledgeItem } from "@/data/careerKnowledgeBase";

interface ActiveStepCardProps {
  phaseTitle: string;
  activeSkillTitle: string | null;
  nextSkillTitle: string | null;
  phaseNumber: number;
}

export function ActiveStepCard({
  phaseTitle,
  activeSkillTitle,
  nextSkillTitle,
  phaseNumber,
}: ActiveStepCardProps) {
  const kb = activeSkillTitle ? getKnowledgeItem(activeSkillTitle) : null;

  return (
    <div className="bg-[#111111] border border-[#F5C518]/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#F5C518] font-bold block">
            Şu an tek odağın
          </span>
          <span className="text-[10px] text-[#444] mt-0.5 block">Seviye {phaseNumber} — {phaseTitle}</span>
        </div>
        <div className="w-6 h-6 bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#F5C518]">{phaseNumber}</span>
        </div>
      </div>

      {activeSkillTitle ? (
        <div className="space-y-3">
          {/* Active skill */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
            <span className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">Aktif Görev</span>
            <p className="text-sm text-white font-medium leading-snug">
              {kb?.turkishTitle || activeSkillTitle}
            </p>
            {kb?.turkishTitle && (
              <p className="text-[10px] text-[#2a2a2a] font-mono mt-px leading-tight">{activeSkillTitle}</p>
            )}
            {kb && (
              <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">{kb.shortDescription}</p>
            )}
          </div>

          {/* KB enrichment */}
          {kb && (
            <div className="space-y-2">
              <div>
                <span className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">Neden Önemli</span>
                <p className="text-[11px] text-[#666] leading-relaxed">{kb.relevanceToCem}</p>
              </div>

              {kb.howToLearn.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#444] uppercase tracking-wider block mb-1.5">Sıradaki Mini Aksiyon</span>
                  <div className="flex items-start gap-1.5">
                    <ArrowRight size={11} className="text-[#F5C518] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#888] leading-relaxed">{kb.howToLearn[0]}</p>
                  </div>
                </div>
              )}

              {kb.completionProof.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#333] uppercase tracking-wider block mb-1">Tamamlanma Kanıtı</span>
                  <p className="text-[10px] text-[#444] leading-relaxed">{kb.completionProof[0]}</p>
                </div>
              )}

              {kb.estimatedTime && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#333]">Tahmini süre:</span>
                  <span className="text-[9px] text-[#555] font-mono">{kb.estimatedTime}</span>
                </div>
              )}
            </div>
          )}

          {/* Next skill */}
          {nextSkillTitle && (() => {
            const nextKb = getKnowledgeItem(nextSkillTitle);
            return (
              <div className="border-t border-[#1a1a1a] pt-2">
                <span className="text-[9px] text-[#333] uppercase tracking-wider block mb-1">Sonraki Adım</span>
                <p className="text-[11px] text-[#444]">{nextKb?.turkishTitle || nextSkillTitle}</p>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-xs text-[#555]">Bu seviyedeki tüm görevler tamamlandı.</p>
          <p className="text-[10px] text-[#444] mt-1">Sıradaki seviyeye geçmeye hazırsın.</p>
        </div>
      )}
    </div>
  );
}
