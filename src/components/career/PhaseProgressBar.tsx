import React from 'react'
import { cn } from '@/utils/cn'
import type { CareerPhase } from '@/types/career'

interface PhaseProgressBarProps {
  phases: CareerPhase[]
}

export function PhaseProgressBar({ phases }: PhaseProgressBarProps) {
  return (
    <div className="border border-[#2a2a2a] rounded-2xl p-6 bg-[#141414] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-[#666666] text-[10px] tracking-[0.2em] font-bold uppercase">
          SİSTEM FAZ DURUMU
        </h3>
        <div className="flex-1 h-px bg-[#2a2a2a]/50" />
      </div>
      <div className="flex items-center justify-between gap-0 px-2 mt-8 mb-4">
        {phases.map((phase, idx) => {
          const isActive = phase.is_active
          const isCompleted = phase.is_unlocked && !phase.is_active
          const isLocked = !phase.is_unlocked
          const isLast = idx === phases.length - 1

          return (
            <React.Fragment key={phase.id}>
              {/* Dot Pillar */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center',
                    isActive && 'border-[#6366f1] bg-[#6366f1] shadow-lg scale-110',
                    isCompleted && 'border-[#30d158] bg-[#30d158]',
                    isLocked && 'border-[#2a2a2a] bg-[#0a0a0a]'
                  )}
                >
                  {isCompleted && (
                    <span className="text-[#30d158] text-[10px] font-bold">✓</span>
                  )}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#141414] animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold tracking-widest',
                    isActive && 'text-[#6366f1]',
                    isCompleted && 'text-[#30d158]/60',
                    isLocked && 'text-[#666666]'
                  )}
                >
                  {phase.sort_order}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 transition-colors duration-700 mx-2',
                    isCompleted ? 'bg-[#30d158]/30' : 'bg-[#2a2a2a]'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
