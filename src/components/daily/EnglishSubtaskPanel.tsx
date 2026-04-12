'use client';

import React, { useTransition } from 'react';
import { toggleSubtask } from '@/app/actions/toggleSubtask';

interface Subtask {
  id: string;
  title: string;
  duration: string | null;
  isCompleted: boolean;
}

interface EnglishSubtaskPanelProps {
  subtasks: Subtask[];
  parentTaskId: string;
}

export function EnglishSubtaskPanel({ subtasks, parentTaskId }: EnglishSubtaskPanelProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="ml-9 mt-2 mb-1 pl-4 border-l-2 border-ftg-amber/40 flex flex-col gap-2 animate-in slide-in-from-top duration-300">
      <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-ftg-text-mute mb-1">
        BUGÜNÜN İNGİLİZCE PROGRAMI
      </div>
      {subtasks.map(sub => (
        <button
          key={sub.id}
          disabled={isPending}
          onClick={() => startTransition(() => { toggleSubtask({ subtaskId: sub.id, parentTaskId }); })}
          className={`flex items-center gap-3 px-3 py-2 rounded-ftg-card text-left transition-all ${
            sub.isCompleted
              ? 'bg-ftg-success/5 border border-ftg-success/30 shadow-[inset_0_0_12px_rgba(123,201,111,0.05)]'
              : 'bg-ftg-bg border border-ftg-border-subtle hover:border-ftg-amber/40 hover:bg-ftg-elevated/40'
          } disabled:opacity-70`}
        >
          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
            sub.isCompleted ? 'bg-ftg-success border-ftg-success' : 'border-ftg-border-strong'
          }`}>
            {sub.isCompleted && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-mono text-xs transition-all ${sub.isCompleted ? 'text-ftg-text-dim line-through decoration-ftg-success/30' : 'text-ftg-text'}`}>
              {sub.title}
            </div>
          </div>
          {sub.duration && (
            <div className={`font-mono text-[10px] shrink-0 ${sub.isCompleted ? 'text-ftg-text-mute' : 'text-ftg-amber'}`}>
              {sub.duration}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
