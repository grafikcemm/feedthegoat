import React from "react";
import { CareerPhase } from "@/lib/careerConfig";
import { CareerTaskRow } from "./CareerTaskRow";

interface ActivePhaseDetailProps {
  phase: CareerPhase;
  completedKeys: Set<string>;
}

export function ActivePhaseDetail({ phase, completedKeys }: ActivePhaseDetailProps) {
  const completedCount = phase.tasks.filter(t => completedKeys.has(t.key)).length;
  const pct = Math.round((completedCount / phase.tasks.length) * 100);

  return (
    <div className="mt-8 rounded-ftg-card border border-ftg-amber/40 bg-ftg-surface overflow-hidden shadow-[0_0_30px_rgba(245,181,68,0.05)]">
      {/* Header */}
      <div className="px-6 py-6 border-b border-ftg-border-subtle bg-ftg-amber-glow/60">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <span className="font-display text-4xl text-ftg-amber tracking-wider">FAZ {phase.number}: {phase.title}</span>
              <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-ftg-amber text-ftg-amber bg-ftg-bg/50">
                {phase.duration}
              </span>
            </div>
            <div className="font-mono text-base italic text-ftg-text-dim border-l-2 border-ftg-amber/40 pl-4 py-1">
              {phase.slogan}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="font-display text-5xl text-ftg-amber leading-none tabular-nums animate-in slide-in-from-right duration-700">
              {pct}%
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-ftg-text-mute mt-1">
              {completedCount} / {phase.tasks.length} tamamlandı
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-8 flex flex-col gap-8">
        {/* Amaç */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ftg-text-mute mb-3">
            STRATEJİK AMAÇ
          </div>
          <div className="font-mono text-sm text-ftg-text leading-relaxed bg-ftg-bg/30 p-4 rounded-ftg-card border border-ftg-border-subtle">
            {phase.amac}
          </div>
        </div>

        {/* Çıkış Kriterleri */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ftg-text-mute mb-4">
            ÇIKIŞ KRİTERLERİ (FAZ GEÇİŞİ İÇİN)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 px-1">
            {phase.cikisKriterleri.map((c, i) => (
              <div key={i} className="font-mono text-sm text-ftg-text flex gap-3 group">
                <span className="text-ftg-amber group-hover:scale-125 transition-transform duration-300">▹</span>
                <span className="group-hover:text-ftg-amber-bright transition-colors">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Görevler */}
        <div className="animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ftg-text-mute mb-4">
            GÖREV LİSTESİ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phase.tasks.map(task => (
              <CareerTaskRow key={task.key} task={task} isCompleted={completedKeys.has(task.key)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
