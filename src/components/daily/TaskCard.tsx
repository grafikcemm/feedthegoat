import React, { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/utils/cn";
import { EnglishSubtaskPanel } from "./EnglishSubtaskPanel";
import { isEnglishActiveToday } from "@/lib/dayUtils";

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

  // system_type varsa priority badge gösterilmez
  const showPriorityBadge = !isProduction && !systemType && priority;

  const handleClick = () => {
    if (isPassive) return;

    // Special System Handlers
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

    // Normal or Production Handlers
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
          "flex items-center gap-4 px-5 py-4 rounded-ftg-card border transition-all relative group",
          isPassive ? "opacity-40 grayscale cursor-not-allowed bg-transparent border-ftg-border-subtle" : 
          isBonus ? "border-dashed border-ftg-border-subtle bg-transparent" :
          "border-ftg-border-subtle bg-ftg-surface hover:border-ftg-amber/40 hover:bg-ftg-elevated cursor-pointer"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
            isDone ? "bg-ftg-success/20 text-ftg-success" : isPassive ? "bg-ftg-border-strong text-ftg-text-mute" : "bg-ftg-amber-glow"
          )}
        >
          {isDone && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Title */}
        <span
          className={cn(
            "flex-1 font-mono text-base transition-all",
            isDone ? "text-ftg-text-mute line-through" : isPassive ? "text-ftg-text-mute" : isBonus ? "text-ftg-text-dim" : "text-ftg-text"
          )}
        >
          {title}
          {isPassive && (
            <span className="ml-3 text-[9px] font-bold tracking-widest text-ftg-text-mute border border-ftg-text-mute/30 px-1.5 py-0.5 rounded">
              {getPassiveLabel()}
            </span>
          )}
        </span>

        {/* Priority Badge — system_type olan task'larda gösterilmez */}
        {showPriorityBadge && (
          <span
            className={cn(
              "px-2 py-1 rounded text-[10px] tracking-wider font-mono",
              priority === "P1" && "bg-ftg-danger/15 text-ftg-danger",
              priority === "P2" && "bg-ftg-amber/15 text-ftg-amber",
              priority === "P3" && "bg-ftg-text-mute/15 text-ftg-text-mute"
            )}
          >
            {priority}
          </span>
        )}

        {/* Points (Hide for production) */}
        {!isProduction && (
          <span className={cn("font-mono text-sm transition-colors", isDone ? "text-ftg-success" : "text-ftg-amber")}>
            +{points}p
          </span>
        )}

        {/* Floating XP Animation — dopamine */}
        {isFlying && !isProduction && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 font-mono text-sm text-ftg-amber-bright pointer-events-none animate-fly-up">
            +{points}p
          </span>
        )}

        {/* Checkbox */}
        <div
          className={cn(
            "w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300",
            isDone ? "bg-ftg-success border-ftg-success text-white" : "border-ftg-border-subtle bg-transparent group-hover:border-ftg-amber/50",
            (isEnglish || isVitamin || isSkincare) && !isDone && !isPassive && "border-ftg-amber/40 bg-ftg-amber/5"
          )}
        >
          {isDone ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (isEnglish || isVitamin || isSkincare) && !isPassive && (
            <span className="text-ftg-amber font-mono text-[10px] select-none">...</span>
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
        parentTaskId={id}
      />

      {/* Skincare Modal */}
      <SkincareModal
        isOpen={skincareModalOpen}
        onClose={() => setSkincareModalOpen(false)}
        completedPackageIds={localSkincareCompletedIds}
        onPackageTaken={handleSkincarePackageTaken}
        parentTaskId={id}
      />
    </div>
  );
}
