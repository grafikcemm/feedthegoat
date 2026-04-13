'use client';

import React, { useOptimistic, useTransition } from 'react';
import { cn } from '@/utils/cn';
import { toggleTemplateTask } from '@/app/actions/taskActions';
import type { TaskTemplate } from '@/types/tasks';

interface XPostSectionProps {
  task: TaskTemplate | undefined;
  isDone: boolean;
}

export function XPostSection({ task, isDone }: XPostSectionProps) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(isDone);
  const [, startTransition] = useTransition();

  if (!task) return null;

  const handleComplete = () => {
    if (optimisticDone) return;
    startTransition(() => {
      setOptimisticDone(true);
      toggleTemplateTask(task.id, false);
    });
  };

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-[#8b92ff] uppercase font-bold">
          X PAYLAŞIMI
        </h3>
        <span className="font-mono text-[9px] text-[#8b92ff]/60 uppercase tracking-widest">
          AKTİF SİSTEM
        </span>
      </div>
      
      <div
        onClick={handleComplete}
        className={cn(
          "flex items-center gap-4 px-5 py-4 rounded-ftg-card border transition-all relative group overflow-hidden",
          optimisticDone 
            ? "bg-[#8b92ff]/5 border-[#8b92ff]/20 grayscale-[0.5] opacity-60" 
            : "bg-[#0a0a0a] border-[#8b92ff]/30 hover:border-[#8b92ff] hover:bg-[#8b92ff]/5 cursor-pointer shadow-[0_0_20px_rgba(139,146,255,0.05)]"
        )}
      >
        {/* Background Accent */}
        {!optimisticDone && (
          <div className="absolute inset-y-0 left-0 w-1 bg-[#8b92ff] shadow-[0_0_15px_rgba(139,146,255,0.5)]" />
        )}

        {/* Icon */}
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500",
            optimisticDone ? "bg-[#8b92ff]/40" : "bg-[#8b92ff] animate-pulse shadow-[0_0_8px_rgba(139,146,255,0.8)]"
          )}
        />

        {/* Title */}
        <span
          className={cn(
            "flex-1 font-mono text-sm transition-all tracking-tight",
            optimisticDone ? "text-ftg-text-mute line-through" : "text-ftg-text-bright"
          )}
        >
          {task.title}
        </span>

        {/* Points */}
        <div className="flex items-center gap-3">
          <span className={cn(
            "font-mono text-xs font-bold transition-colors", 
            optimisticDone ? "text-[#8b92ff]/40" : "text-[#8b92ff]"
          )}>
            +{task.points}p
          </span>

          {/* Checkbox */}
          <div
            className={cn(
              "w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300",
              optimisticDone 
                ? "bg-[#8b92ff] border-[#8b92ff] text-black" 
                : "border-[#8b92ff]/40 bg-transparent group-hover:border-[#8b92ff]"
            )}
          >
            {optimisticDone && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
