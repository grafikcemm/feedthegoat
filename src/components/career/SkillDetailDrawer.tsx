'use client';

import React, { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { CareerKnowledgeItem, KnowledgeStatus } from "@/data/careerKnowledgeBase";

const KNOWLEDGE_STATUS_OPTIONS: { value: KnowledgeStatus; label: string; color: string }[] = [
  { value: "known", label: "Biliyorum", color: "#22c55e" },
  { value: "skip_relearning", label: "Tekrar gerekmez", color: "#22c55e" },
  { value: "needs_practice", label: "Uygulama lazım", color: "#f59e0b" },
  { value: "in_progress", label: "Eksik var", color: "#f59e0b" },
  { value: "not_started", label: "Sıfırdan öğrenilecek", color: "#888" },
];

interface SkillDetailDrawerProps {
  item: CareerKnowledgeItem;
  onClose: () => void;
}

export function SkillDetailDrawer({ item, onClose }: SkillDetailDrawerProps) {
  const [knowledgeStatus, setKnowledgeStatus] = useState<KnowledgeStatus>("not_started");

  const isAlreadyKnown = knowledgeStatus === "known" || knowledgeStatus === "skip_relearning";
  const needsPractice = knowledgeStatus === "needs_practice";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/60"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-[#0d0d0d] border-l border-[#1f1f1f] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-start justify-between gap-3 sticky top-0 bg-[#0d0d0d] z-10">
          <div>
            <p className="text-[9px] text-[#444] uppercase tracking-wider mb-1">{item.originalTitle}</p>
            <h3 className="text-white font-bold text-base leading-tight">{item.turkishTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#444] hover:text-white transition-colors shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Short description */}
          <p className="text-sm text-[#888] leading-relaxed">{item.shortDescription}</p>

          {/* Knowledge status selector */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-2">Bilgi Durumum</span>
            <div className="flex flex-wrap gap-1.5">
              {KNOWLEDGE_STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setKnowledgeStatus(opt.value)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all font-medium ${
                    knowledgeStatus === opt.value
                      ? "border-current bg-transparent"
                      : "border-[#1f1f1f] text-[#444] hover:border-[#333]"
                  }`}
                  style={knowledgeStatus === opt.value ? { color: opt.color, borderColor: opt.color } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional message based on status */}
          {isAlreadyKnown && (
            <div className="bg-[#0a1a0a] border border-[#22c55e]/20 rounded-lg p-3">
              <p className="text-[11px] text-[#22c55e]/80 leading-relaxed">
                Bunu zaten biliyorsan tekrar kurs izleme. Küçük bir proje veya notla kanıtla.
              </p>
              {item.completionProof.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] text-[#22c55e]/60 uppercase tracking-wider block mb-1">Kanıt için</span>
                  {item.completionProof.map((proof, i) => (
                    <p key={i} className="text-[10px] text-[#22c55e]/60">• {proof}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {needsPractice && (
            <div className="bg-[#1a1200] border border-[#f59e0b]/20 rounded-lg p-3">
              <p className="text-[11px] text-[#f59e0b]/80 leading-relaxed">
                Kurs değil, mini proje yap. Uygulamak öğretir.
              </p>
              {item.resources.projectIdeas && item.resources.projectIdeas.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] text-[#f59e0b]/60 uppercase tracking-wider block mb-1">Mini Proje Fikri</span>
                  {item.resources.projectIdeas.map((idea, i) => (
                    <p key={i} className="text-[10px] text-[#f59e0b]/60">→ {idea}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Why learn */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-2">Neden Öğrenmeliyim?</span>
            <p className="text-[11px] text-[#666] leading-relaxed">{item.whyLearn}</p>
          </div>

          {/* Relevance */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-2">Cem İçin Önemi</span>
            <p className="text-[11px] text-[#666] leading-relaxed">{item.relevanceToCem}</p>
          </div>

          {/* How to learn */}
          {!isAlreadyKnown && item.howToLearn.length > 0 && (
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-2">Nasıl Öğreneceğim?</span>
              <ol className="space-y-1.5">
                {item.howToLearn.map((step, i) => (
                  <li key={i} className="text-[11px] text-[#666] leading-relaxed flex gap-2">
                    <span className="text-[#333] shrink-0 font-mono">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Resources — only if not already known */}
          {!isAlreadyKnown && (
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block">Kaynaklar</span>

              {item.resources.udemySearchTerms && item.resources.udemySearchTerms.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#333] block mb-1">Udemy&apos;de ara:</span>
                  {item.resources.udemySearchTerms.map((term, i) => (
                    <p key={i} className="text-[10px] text-[#555] font-mono">• &quot;{term}&quot;</p>
                  ))}
                </div>
              )}

              {item.resources.youtubeSearchTerms && item.resources.youtubeSearchTerms.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#333] block mb-1">YouTube&apos;da ara:</span>
                  {item.resources.youtubeSearchTerms.map((term, i) => (
                    <p key={i} className="text-[10px] text-[#555] font-mono">• &quot;{term}&quot;</p>
                  ))}
                </div>
              )}

              {item.resources.docs && item.resources.docs.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#333] block mb-1">Dokümantasyon:</span>
                  {item.resources.docs.map((doc, i) => (
                    <p key={i} className="text-[10px] text-[#555] flex items-center gap-1">
                      <ExternalLink size={9} className="text-[#444]" />
                      {doc}
                    </p>
                  ))}
                </div>
              )}

              {item.resources.projectIdeas && item.resources.projectIdeas.length > 0 && (
                <div>
                  <span className="text-[9px] text-[#333] block mb-1">Proje Fikri:</span>
                  {item.resources.projectIdeas.map((idea, i) => (
                    <p key={i} className="text-[10px] text-[#888] leading-relaxed">→ {idea}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completion proof */}
          {item.completionProof.length > 0 && (
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#444] font-bold block mb-2">Tamamlanma Kanıtı</span>
              <ul className="space-y-1">
                {item.completionProof.map((proof, i) => (
                  <li key={i} className="text-[11px] text-[#555] flex gap-1.5">
                    <span className="text-[#333]">✓</span>
                    {proof}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[#333] mt-2 italic">
                Kaynak izlemek ilerleme sayılmaz. Çıktı gerekli.
              </p>
            </div>
          )}

          {/* Prerequisites */}
          {item.prerequisites.length > 0 && (
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#333] font-bold block mb-1.5">Ön Koşullar</span>
              <div className="flex flex-wrap gap-1">
                {item.prerequisites.map((pre, i) => (
                  <span key={i} className="text-[9px] bg-[#1a1a1a] border border-[#222] text-[#444] px-2 py-0.5 rounded">
                    {pre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Estimated time */}
          {item.estimatedTime && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-[#333]">Tahmini süre:</span>
              <span className="text-[#555] font-mono">{item.estimatedTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
