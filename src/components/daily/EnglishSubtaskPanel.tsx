'use client';

import React, { useTransition } from 'react';
import { toggleSubtask } from '@/app/actions/toggleSubtask';
import { cn } from '@/utils/cn';

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
    <div className="ml-9 mt-4 mb-2 pl-6 border-l-2 border-[#E8956D]/30 flex flex-col gap-3 animate-in slide-in-from-top duration-300">
      <div className="text-[10px] tracking-[0.15em] font-semibold uppercase text-[#B5A090] mb-2">
        BUGÜNÜN İNGİLİZCE PROGRAMI
      </div>
      {subtasks.map(sub => (
        <button
          key={sub.id}
          disabled={isPending}
          onClick={() => startTransition(() => { toggleSubtask({ subtaskId: sub.id, parentTaskId }); })}
          className={cn(
            "flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all border group",
            sub.isCompleted
              ? "bg-[#F5F1EB] border-[#E5DDD4] opacity-70"
              : "bg-white border-[#E5DDD4] shadow-sm hover:border-[#E8956D]/50 hover:bg-[#FDF0E8]/30"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all",
            sub.isCompleted ? "bg-[#4CAF82] border-[#4CAF82] text-white" : "border-[#E5DDD4] bg-white group-hover:border-[#E8956D]/40"
          )}>
            {sub.isCompleted && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-xs font-semibold transition-all",
              sub.isCompleted ? "text-[#C8B8A8] line-through" : "text-[#2C2420]"
            )}>
              {sub.title}
            </div>
          </div>
          {sub.duration && (
            <div className={cn(
              "text-[10px] font-bold uppercase tracking-tight shrink-0",
              sub.isCompleted ? "text-[#B5A090]" : "text-[#E8956D]"
            )}>
              {sub.duration}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
