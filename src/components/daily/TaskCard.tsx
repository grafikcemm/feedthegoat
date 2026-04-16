"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/utils/cn";
import { EnglishSubtaskPanel } from "./EnglishSubtaskPanel";
import { isEnglishActiveToday } from "@/lib/dayUtils";
import { toggleTemplateTask } from "@/app/actions/taskActions";

const VitaminModal = dynamic(() => import("./VitaminModal").then(mod => mod.VitaminModal), {
  ssr: false,
});

const SkincareModal = dynamic(() => import("./SkincareModal").then(mod => mod.SkincareModal), {
  ssr: false,
});

export interface TaskCardProps {
  id: string;
  title: string;
  isDone: boolean;
  points: number;
  category: "discipline" | "production" | "health" | "bonus";
  systemType?: string | null;
  priority?: "P1" | "P2" | "P3" | null;
  isBonus?: boolean;
  onComplete: (taskId: string) => void;
  // System task specific props
  englishSubtasks?: any[];
  isTreadmillActive?: boolean;
  vitaminPackages?: any[];
  completedSkincareIds?: string[];
}

const EMPTY_ARRAY: any[] = [];

export function TaskCard({ 
  id, title, isDone, points, category, systemType, priority, isBonus, onComplete,
  englishSubtasks = EMPTY_ARRAY, isTreadmillActive = true, vitaminPackages = EMPTY_ARRAY,
  completedSkincareIds = EMPTY_ARRAY
}: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isFlying, setIsFlying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [vitaminModalOpen, setVitaminModalOpen] = useState(false);
  const [skincareModalOpen, setSkincareModalOpen] = useState(false);
  
  const [localVitaminCompletedIds, setLocalVitaminCompletedIds] = useState<string[]>(
    vitaminPackages.filter((p: any) => p.isTaken).map((p: any) => p.id)
  );
  const [localSkincareCompletedIds, setLocalSkincareCompletedIds] = useState<string[]>(completedSkincareIds);

  // Sync with props when they change (after revalidation)
  React.useEffect(() => {
    const currentTakenIds = vitaminPackages.filter((p: any) => p.isTaken).map((p: any) => p.id);
    if (JSON.stringify(currentTakenIds) !== JSON.stringify(localVitaminCompletedIds)) {
      setLocalVitaminCompletedIds(currentTakenIds);
    }
  }, [vitaminPackages]);

  React.useEffect(() => {
    if (JSON.stringify(completedSkincareIds) !== JSON.stringify(localSkincareCompletedIds)) {
      setLocalSkincareCompletedIds(completedSkincareIds);
    }
  }, [completedSkincareIds]);

  // 1. Passive Checks
  const isEnglish = systemType === 'english';
  const isTreadmill = systemType === 'treadmill';
  const isVitamin = systemType === 'vitamin';
  const isSkincare = systemType === 'skincare';
  const isProduction = category === 'production';

  const englishActive = isEnglishActiveToday();
  const treadmillActive = isTreadmillActive;

  const isPassive = (isEnglish && !englishActive) || (isTreadmill && !treadmillActive);

  const showPriorityBadge = !isProduction && !systemType && priority;

  const handleClick = () => {
    if (isPassive) return;

    if (isEnglish && !isDone) {
      setExpanded(!expanded);
      return;
    }
    if (isVitamin) {
      if (isDone) {
        onComplete(id);
      } else {
        setVitaminModalOpen(true);
      }
      return;
    }
    if (isSkincare) {
      if (isDone) {
        onComplete(id);
      } else {
        setSkincareModalOpen(true);
      }
      return;
    }

    if (!isDone && !isProduction) {
      import('@/lib/confetti').then(m => m.fireTaskConfetti());
      setIsFlying(true);
      setTimeout(() => setIsFlying(false), 800);
    }
    
    onComplete(id);
  };

  const handleVitaminPackageTaken = (packageId: string) => {
    setLocalVitaminCompletedIds(prev => [...prev, packageId]);
  };

  const handleSkincarePackageTaken = (packageId: string) => {
    setLocalSkincareCompletedIds(prev => [...prev, packageId]);
  };

  const getPassiveLabel = () => {
    if (isEnglish && !englishActive) return "BUGÜN PASİF";
    if (isTreadmill && !treadmillActive) return "BUGÜN SALON GÜNÜ";
    return null;
  };

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors relative group",
          isPassive ? "opacity-40 grayscale cursor-not-allowed bg-transparent border-[#2a2a2a]" : 
          isBonus ? "border-dashed border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a]" :
          "bg-[#141414] border-[#2a2a2a] hover:border-[#333333] cursor-pointer"
        )}
      >
        {/* Icon (Status Dot) */}
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all text-white",
            isDone ? "bg-[#30d158]" : isPassive ? "border border-[#2a2a2a] bg-transparent" : "border-2 border-[#333333] group-hover:border-[#6366f1]"
          )}
        >
          {isDone && (
             <svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={6}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
          )}
        </div>

        {/* Title */}
        <span
          className={cn(
            "flex-1 text-[15px] font-medium transition-all w-full truncate",
            isDone ? "text-[#444444] line-through" : isPassive ? "text-[#666666]" : "text-white"
          )}
        >
          {title}
          {isPassive && (
            <span className="ml-3 text-[10px] bg-[#141414] text-[#6366f1] px-2 py-0.5 rounded-full font-medium">
              {getPassiveLabel()}
            </span>
          )}
        </span>

        {/* Priority Badge */}
        {showPriorityBadge && (
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] tracking-wider font-bold",
              priority === "P1" && "bg-[#ff453a] text-[#ff453a]",
              priority === "P2" && "bg-[#451a03] text-[#ffd60a]",
              priority === "P3" && "bg-[#1c1c1c] text-[#ababab]"
            )}
          >
            {priority}
          </span>
        )}

        {/* Points */}
        {!isProduction && (
          <span className={cn("text-xs font-bold transition-colors", isDone ? "text-[#30d158]" : "text-[#6366f1]")}>
            +{points}P
          </span>
        )}

        {/* XP Animation */}
        {isFlying && !isProduction && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6366f1] pointer-events-none animate-fly-up">
            +{points}P
          </span>
        )}

        <div
          className={cn(
            "shrink-0 flex items-center justify-center transition-all duration-300",
            (isEnglish || isVitamin || isSkincare) && !isPassive && !isDone
               ? "w-7 h-7 rounded-lg bg-[#222222] border border-[#333333] text-[#666666] hover:border-[#6366f1] hover:text-[#6366f1]"
               : "hidden"
          )}
        >
          {(isEnglish || isVitamin || isSkincare) && !isPassive && !isDone && (
            <span className="leading-none pb-1">...</span>
          )}
        </div>
      </div>
 
      {/* English Inline Sub-tasks */}
      {isEnglish && expanded && !isDone && !isPassive && (
        <EnglishSubtaskPanel subtasks={englishSubtasks} parentTaskId={id} />
      )}
 
      {/* Vitamin Modal */}
      <VitaminModal
        isOpen={vitaminModalOpen}
        onClose={() => setVitaminModalOpen(false)}
        completedPackageIds={localVitaminCompletedIds}
        onPackageTaken={handleVitaminPackageTaken}
        templateId={id}
      />

      {/* Skincare Modal */}
      <SkincareModal
        isOpen={skincareModalOpen}
        onClose={() => setSkincareModalOpen(false)}
        completedPackageIds={localSkincareCompletedIds}
        onPackageTaken={handleSkincarePackageTaken}
        templateId={id}
      />
    </div>
  );
}
