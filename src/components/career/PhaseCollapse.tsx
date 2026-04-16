'use client'

import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import type { CareerPhase } from '@/types/career'

interface PhaseCollapseProps {
  phases: CareerPhase[]
}

export function PhaseCollapse({ phases }: PhaseCollapseProps) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (phases.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-[#666666] text-xs font-semibold tracking-widest uppercase">
          DİĞER FAZLAR
        </h3>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>
      <div className="flex flex-col gap-3">
        {phases.map(phase => {
          const isLocked = !phase.is_unlocked
          const isCompleted = phase.is_unlocked && !phase.is_active
          const skills = phase.skills ?? []
          const doneCount = skills.filter(s => s.is_done).length
          const isOpen = openId === phase.id

          return (
            <div key={phase.id} className="group">
              <button
                onClick={() => {
                  if (isLocked) return
                  setOpenId(isOpen ? null : phase.id)
                }}
                className={cn(
                  'w-full border rounded-2xl px-5 py-4 text-left transition-all',
                  isLocked
                    ? 'border-[#2a2a2a] bg-[#0a0a0a] opacity-40 grayscale cursor-not-allowed'
                    : isCompleted
                      ? 'border-[#2a2a2a] bg-[#141414] hover:border-[#6366f1]/30 cursor-pointer shadow-sm'
                      : 'border-[#2a2a2a] bg-[#0a0a0a] opacity-60 cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-[#666666] font-bold tracking-widest uppercase">
                      FAZ {phase.sort_order}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold tracking-tight uppercase',
                        isCompleted ? 'text-[#666666] line-through opacity-60' : 'text-[#ababab]'
                      )}
                    >
                      {phase.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {isCompleted && skills.length > 0 && (
                      <span className="text-[10px] text-[#666666] font-bold tracking-widest">
                        {doneCount}/{skills.length} SKILL
                      </span>
                    )}
                    {isLocked && <span className="text-sm opacity-60">🔒</span>}
                    {isCompleted && <span className="text-[#30d158] text-sm font-bold">✓</span>}
                    {!isLocked && !isCompleted && <span className="text-sm opacity-60">🔒</span>}
                  </div>
                </div>
              </button>

              {/* Expanded content for completed phases */}
              {isOpen && isCompleted && skills.length > 0 && (
                <div className="mt-2 ml-6 border-l-4 border-[#2a2a2a] bg-[#000000]/30 pl-6 py-4 flex flex-col gap-3 animate-in duration-500 rounded-r-2xl">
                  {skills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-3 text-xs group/skill">
                      <span className={cn(
                        "w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                        skill.is_done ? 'bg-[#30d158] border-[#30d158]/30 text-[#30d158]' : 'border-[#2a2a2a] text-[#666666]'
                      )}>
                        {skill.is_done ? '✓' : '○'}
                      </span>
                      <span className={cn(
                        'font-bold tracking-tight uppercase',
                        skill.is_done ? 'text-[#666666] line-through' : 'text-[#ababab]'
                      )}>
                        {skill.area}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
