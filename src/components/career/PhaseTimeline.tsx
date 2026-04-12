import React from "react";
import { CareerPhase } from "@/lib/careerConfig";

interface PhaseTimelineProps {
  phases: CareerPhase[];
  currentPhase: number;
  completionsByPhase: Record<number, number>;  // phase number → percentage
}

export function PhaseTimeline({ phases, currentPhase, completionsByPhase }: PhaseTimelineProps) {
  return (
    <div className="mt-8">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute mb-8">
        YOL HARİTASI
      </div>
      <div className="relative px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-[800px] relative px-12">
          {/* Background line */}
          <div className="absolute left-[3rem] right-[3rem] top-[1.75rem] h-[2px] bg-ftg-border-strong" />
          
          {/* Progress line — fills up to current phase */}
          <div
            className="absolute left-[3rem] top-[1.75rem] h-[2px] bg-ftg-amber transition-all duration-700 ease-out"
            style={{ 
              width: currentPhase === 1 
                ? '0%' 
                : `calc((100% - 6rem) * ${(currentPhase - 1) / 5})` 
            }}
          />

          {/* 6 dots */}
          <div className="relative flex justify-between">
            {phases.map((phase) => {
              const pct = completionsByPhase[phase.number] ?? 0;
              const isActive = phase.number === currentPhase;
              const isPast = phase.number < currentPhase;

              return (
                <div key={phase.number} className="flex flex-col items-center gap-4 w-32 relative group">
                  <div 
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-display text-2xl transition-all duration-500 z-10 ${
                      isActive  ? 'border-ftg-amber bg-ftg-amber text-ftg-bg shadow-[0_0_24px_rgba(245,181,68,0.5)] scale-110' :
                      isPast    ? 'border-ftg-amber bg-ftg-amber-glow text-ftg-amber' :
                                  'border-ftg-border-strong bg-ftg-surface text-ftg-text-mute group-hover:border-ftg-text-mute transition-colors'
                    }`}
                  >
                    {isPast ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-in zoom-in duration-300">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      phase.number
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className={`font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-500 ${
                      isActive ? 'text-ftg-amber font-bold' : isPast ? 'text-ftg-text-dim' : 'text-ftg-text-mute'
                    }`}>
                      FAZ {phase.number}
                    </div>
                    <div className={`font-mono text-[10px] mt-1 line-clamp-1 transition-colors duration-500 ${
                      isActive ? 'text-ftg-text' : 'text-ftg-text-mute'
                    }`}>
                      {phase.title}
                    </div>
                    <div className={cn("font-mono text-[9px] mt-1 transition-all duration-500", 
                      isActive ? 'text-ftg-amber-bright font-bold' : 'text-ftg-text-mute'
                    )}>
                      %{pct} TAMAM
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal helper to avoid dependency issues if utils/cn is not ready
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
