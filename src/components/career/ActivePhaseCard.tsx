'use client'

import React, { useState, useTransition } from 'react'
import { cn } from '@/utils/cn'
import { toggleCareerSkill, addCareerNote, completePhase } from '@/app/actions/careerActions'
import type { CareerPhase, CareerSkill, CareerNote } from '@/types/career'

const PRIORITY_CONFIG = {
  critical:  { dot: '🔴', label: 'Kritik',    color: 'text-[#ff453a]' },
  important: { dot: '🟠', label: 'Önemli',    color: 'text-[#6366f1]' },
  continue:  { dot: '🟡', label: 'Devam Eden', color: 'text-[#ffd60a]' },
} as const

interface ActivePhaseCardProps {
  phase: CareerPhase & { notes?: CareerNote[] }
}

export function ActivePhaseCard({ phase }: ActivePhaseCardProps) {
  const skills = phase.skills ?? []
  const notes = phase.notes ?? []
  const doneCount = skills.filter(s => s.is_done).length
  const totalCount = skills.length
  const criticalDone = skills.filter(s => s.priority === 'critical' && s.is_done).length
  const criticalTotal = skills.filter(s => s.priority === 'critical').length
  const allCriticalDone = criticalTotal > 0 && criticalDone === criticalTotal

  const [noteValue, setNoteValue] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleToggleSkill = (skill: CareerSkill) => {
    startTransition(() => {
      toggleCareerSkill(skill.id, skill.is_done)
    })
  }

  const handleAddNote = () => {
    if (!noteValue.trim()) return
    const content = noteValue.trim()
    setNoteValue('')
    startTransition(() => {
      addCareerNote(phase.id, content)
    })
  }

  const handleCompletePhase = () => {
    if (!allCriticalDone) return
    startTransition(() => {
      completePhase(phase.id)
    })
  }

  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  return (
    <div className="border border-[#2a2a2a] bg-[#141414] rounded-3xl p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[#6366f1] text-[10px] font-bold tracking-[0.2em] uppercase">
            FAZ {phase.sort_order}
          </span>
          <div className="h-4 w-px bg-[#2a2a2a]" />
          <span className="text-[#30d158] text-[10px] font-bold tracking-[0.2em] uppercase">AKTİF</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] tracking-tight">
          {phase.title}
        </h2>
        <p className="text-sm text-[#ababab] mt-2 italic font-medium">{phase.subtitle}</p>
        {phase.description && (
          <p className="text-xs text-[#666666] mt-5 leading-relaxed max-w-2xl border-l-2 border-[#2a2a2a] pl-4 py-1 font-medium">
            {phase.description}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-10 bg-[#000000] border border-[#2a2a2a] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] tracking-[0.15em] text-[#666666] font-bold uppercase">
            FAZ İLERLEMESİ
          </span>
          <span className="text-xs text-[#ffffff] font-bold">
            {doneCount}/{totalCount} SKILL
          </span>
        </div>
        <div className="h-2 bg-[#2a2a2a]/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6366f1] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-[#666666] text-[10px] tracking-[0.15em] font-bold uppercase">
            ÖĞRENME ALANLARI
          </h3>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {skills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onToggle={() => handleToggleSkill(skill)}
              isPending={isPending}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8 bg-[#000000]/50 rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-[#666666] text-[10px] tracking-[0.15em] font-bold uppercase">
            NOTLAR / GÖZLEMLER
          </h3>
          <div className="flex-1 h-px bg-[#2a2a2a]/50" />
        </div>
        {notes.length > 0 && (
          <div className="flex flex-col gap-3 mb-5">
            {notes.map(note => (
              <div key={note.id} className="px-4 py-3 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-sm">
                <p className="text-xs text-[#ababab] leading-relaxed italic font-medium">{note.content}</p>
                <span className="text-[10px] text-[#666666] mt-2 block font-bold uppercase tracking-wider">
                  {new Date(note.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={noteValue}
            onChange={e => setNoteValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            placeholder="Bu faz hakkında not ekle..."
            disabled={isPending}
            className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-3 text-xs text-[#ffffff] placeholder:text-[#666666] focus:outline-none focus:border-[#6366f1]/50 transition-colors disabled:opacity-50 font-medium"
          />
          <button
            onClick={handleAddNote}
            disabled={isPending || !noteValue.trim()}
            className="px-6 py-2.5 bg-[#ababab] text-white rounded-xl text-xs font-bold hover:bg-[#ffffff] transition-all disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Complete Phase Button */}
      <div className="pt-6 border-t border-[#2a2a2a]">
        <button
          onClick={handleCompletePhase}
          disabled={!allCriticalDone || isPending}
          className={cn(
            'w-full py-4 rounded-2xl text-xs font-bold tracking-widest transition-all shadow-lg uppercase',
            allCriticalDone
              ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5] active:scale-[0.98]'
              : 'bg-[#000000] border border-[#2a2a2a] text-[#666666] cursor-not-allowed'
          )}
        >
          {allCriticalDone ? 'FAZI TAMAMLA →' : `KRİTİK HEDEFLER: ${criticalDone}/${criticalTotal}`}
        </button>
        {!allCriticalDone && (
          <p className="text-[9px] text-[#666666] text-center mt-3 font-bold tracking-widest uppercase">
            TÜM KRİTİK (🔴) SKILL&apos;LERİ TAMAMLAYIN
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Skill Card ───────────────────────────────────────── */

function SkillCard({
  skill,
  onToggle,
  isPending,
}: {
  skill: CareerSkill
  onToggle: () => void
  isPending: boolean
}) {
  const cfg = PRIORITY_CONFIG[skill.priority]

  return (
    <div
      className={cn(
        'border-l-4 rounded-r-2xl p-5 px-6 transition-all',
        skill.priority === 'critical' ? 'border-l-[#ff453a]' :
        skill.priority === 'important' ? 'border-l-[#6366f1]' : 'border-l-[#ffd60a]',
        skill.is_done
          ? 'bg-[#000000] border-y border-r border-[#2a2a2a] opacity-50'
          : 'bg-[#141414] border-y border-r border-[#2a2a2a] shadow-sm hover:border-[#6366f1]/30'
      )}
    >
      {/* Top Row: Area + Toggle */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              'text-sm font-bold tracking-wide uppercase',
              skill.is_done ? 'line-through text-[#666666]' : 'text-[#ffffff]'
            )}
          >
            {skill.area}
          </span>
        </div>
        <button
          onClick={onToggle}
          disabled={isPending}
          className={cn(
            'shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all',
            skill.is_done
              ? 'bg-[#30d158] border-[#30d158] text-white'
              : 'border-[#2a2a2a] bg-[#141414] hover:border-[#6366f1]/50 text-transparent'
          )}
        >
          {skill.is_done ? '✓' : ''}
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
        <div className="flex flex-col gap-1">
          <span className="text-[#666666] text-[9px] uppercase font-bold tracking-widest">Araç</span>
          <span className="text-[#ababab] font-bold uppercase tracking-tight">{skill.tool}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#666666] text-[9px] uppercase font-bold tracking-widest">Kaynak</span>
          <span className="text-[#ababab] font-bold uppercase tracking-tight">{skill.learn_from}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#666666] text-[9px] uppercase font-bold tracking-widest">Kriter</span>
          <span className={cn(
            "font-bold italic uppercase tracking-tight",
            skill.is_done ? 'text-[#666666]' : 'text-[#ababab]'
          )}>
            {skill.exit_criteria}
          </span>
        </div>
      </div>
    </div>
  )
}
