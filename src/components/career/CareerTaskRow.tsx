"use client";

import React, { useTransition } from "react";
import { toggleCareerTask } from "@/app/actions/toggleCareerTask";
import { CareerTask } from "@/lib/careerConfig";

interface CareerTaskRowProps {
  task: CareerTask;
  isCompleted: boolean;
}

const CATEGORY_STYLES = {
  DİJİTAL:  'border-ftg-amber/40 text-ftg-amber',
  SALES:    'border-ftg-success/40 text-ftg-success',
  PRODUCT:  'border-ftg-text-dim/40 text-ftg-text-dim',
  PHYSICAL: 'border-ftg-danger/40 text-ftg-danger',
};

const PRIORITY_STYLES = {
  CRİTİCAL:  'bg-ftg-danger/15 text-ftg-danger',
  İMPORTANT: 'bg-ftg-amber/15 text-ftg-amber',
  NORMAL:    'bg-ftg-text-mute/15 text-ftg-text-mute',
};

export function CareerTaskRow({ task, isCompleted }: CareerTaskRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleCareerTask({ taskKey: task.key });
      } catch (err) {
        console.error("Failed to toggle career task:", err);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-start gap-4 px-4 py-4 rounded-ftg-card border text-left transition-all duration-300 group ${
        isCompleted
          ? 'border-ftg-success/30 bg-ftg-success/5 shadow-[inset_0_0_12px_rgba(123,201,111,0.05)]'
          : 'border-ftg-border-subtle bg-ftg-elevated/30 hover:border-ftg-amber/40 hover:bg-ftg-elevated/60 active:scale-[0.99]'
      } disabled:opacity-70`}
    >
      <div className={`w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center shrink-0 transition-all duration-300 ${
        isCompleted ? 'bg-ftg-success border-ftg-success' : 'border-ftg-border-strong group-hover:border-ftg-amber/60'
      }`}>
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-in zoom-in duration-300">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border ${CATEGORY_STYLES[task.category]}`}>
            {task.category}
          </span>
          <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}>
            P: {task.priority}
          </span>
        </div>
        <div className={`font-mono text-sm transition-all duration-300 ${isCompleted ? 'text-ftg-text-dim line-through decoration-ftg-success/30' : 'text-ftg-text'}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="font-mono text-[11px] text-ftg-text-mute mt-1.5 leading-relaxed">
            {task.description}
          </div>
        )}
      </div>
    </button>
  );
}
