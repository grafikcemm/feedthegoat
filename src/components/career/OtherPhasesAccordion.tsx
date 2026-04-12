"use client";

import React, { useState } from "react";
import { CareerPhase } from "@/lib/careerConfig";
import { CareerTaskRow } from "./CareerTaskRow";

interface PhaseCollapsibleCardProps {
  phase: CareerPhase;
  completedKeys: Set<string>;
}

function PhaseCollapsibleCard({ phase, completedKeys }: PhaseCollapsibleCardProps) {
  const [open, setOpen] = useState(false);
  const completedCount = phase.tasks.filter(t => completedKeys.has(t.key)).length;
  const pct = Math.round((completedCount / phase.tasks.length) * 100);

  return (
    <div className={`rounded-ftg-card border bg-ftg-bg/40 transition-all duration-300 overflow-hidden ${
      open ? 'border-ftg-border-strong' : 'border-ftg-border-subtle hover:border-ftg-text-mute/30'
    }`}>
      {/* Header — clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-ftg-elevated/20"
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl text-ftg-text-mute">FAZ {phase.number}</span>
          <span className="font-mono text-sm text-ftg-text-dim font-medium uppercase tracking-wider items-center gap-2 flex">
             {phase.title}
             {pct === 100 && <span className="text-ftg-success text-[10px]">✓ TAMAMLANDI</span>}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="font-mono text-[10px] text-ftg-text-mute tabular-nums">
            %{pct} TAMAM
          </div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-ftg-text-mute">
            {open ? 'KAPAT' : 'DETAYLAR'}
          </span>
        </div>
      </button>

      {/* Body — only when open */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-6 border-t border-ftg-border-subtle pt-5 flex flex-col gap-6 bg-ftg-bg/20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
            <div className="flex flex-col gap-5">
              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ftg-text-mute mb-2">
                  STRATEJİ
                </div>
                <div className="font-mono text-xs text-ftg-text-dim leading-relaxed">
                  {phase.amac}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ftg-text-mute mb-2">
                  ÇIKIŞ KRİTERLERİ
                </div>
                <div className="flex flex-col gap-1.5">
                  {phase.cikisKriterleri.map((c, i) => (
                    <div key={i} className="font-mono text-[11px] text-ftg-text-dim flex gap-2">
                      <span className="text-ftg-text-mute">·</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ftg-text-mute mb-3">
                FAZ GÖREVLERİ
              </div>
              <div className="grid grid-cols-1 gap-2">
                {phase.tasks.map(task => (
                  <CareerTaskRow key={task.key} task={task} isCompleted={completedKeys.has(task.key)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OtherPhasesAccordionProps {
  phases: CareerPhase[];
  completedKeys: Set<string>;
}

export function OtherPhasesAccordion({ phases, completedKeys }: OtherPhasesAccordionProps) {
  return (
    <div className="mt-8 flex flex-col gap-3">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-2">
        DİĞER YOL HARİTASI FAZLARI
      </div>
      {phases.map(phase => (
        <PhaseCollapsibleCard key={phase.number} phase={phase} completedKeys={completedKeys} />
      ))}
    </div>
  );
}
