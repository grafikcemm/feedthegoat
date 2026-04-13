'use client'

import React, { useState, useTransition } from 'react'
import { cn } from '@/utils/cn'
import { toggleActiveTask, deleteActiveTask } from '@/app/actions/taskActions'
import type { ActiveTask } from '@/types/tasks'

interface ActiveTaskCardProps {
  task: ActiveTask
}

export function ActiveTaskCard({ task }: ActiveTaskCardProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticDone, setOptimisticDone] = useState(task.is_done)

  const handleToggle = () => {
    const isCurrentlyDone = optimisticDone;
    setOptimisticDone(prev => !prev)

    if (!isCurrentlyDone) {
      import('@/lib/confetti').then(m => m.fireTaskConfetti());
    }

    startTransition(() => {
      toggleActiveTask(task.id, task.is_done)
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    startTransition(() => {
      deleteActiveTask(task.id)
    })
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-ftg-card border transition-all group',
        'border-ftg-border-subtle hover:border-ftg-amber/30 hover:bg-ftg-elevated/50',
        isPending && 'opacity-60',
        optimisticDone ? 'bg-transparent' : 'bg-ftg-surface/50'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300',
          optimisticDone
            ? 'bg-ftg-success border-ftg-success text-white'
            : 'border-ftg-border-subtle bg-transparent hover:border-ftg-amber/50'
        )}
      >
        {optimisticDone && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          'flex-1 font-mono text-sm transition-all',
          optimisticDone ? 'line-through text-ftg-text-mute' : 'text-ftg-text'
        )}
      >
        {task.title}
      </span>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-ftg-text-mute hover:text-ftg-danger shrink-0"
        title="Görevi sil"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
