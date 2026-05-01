"use client";

import React, { useState, useTransition } from "react";
import { cn } from "@/utils/cn";
import { toggleActiveTask, deleteActiveTask, moveActiveTask, toggleTaskPriority } from "@/app/actions/taskActions";
import type { ActiveTask } from "@/types/tasks";
import { AlertCircle } from "lucide-react"; // Import icon

interface ActiveTaskCardProps {
  task: ActiveTask;
}

export function ActiveTaskCard({ task }: ActiveTaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useState(task.is_done);
  const [optimisticPriority, setOptimisticPriority] = useState(task.is_priority);

  const isWaiting = task.category === "waiting";

  const handleToggle = () => {
    const isCurrentlyDone = optimisticDone;
    setOptimisticDone((prev) => !prev);

    if (!isCurrentlyDone) {
      import("@/lib/confetti").then((m) => m.fireTaskConfetti());
    }

    startTransition(() => {
      toggleActiveTask(task.id, task.is_done);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      deleteActiveTask(task.id);
    });
  };

  const handleMove = (e: React.MouseEvent, to: "active" | "waiting") => {
    e.stopPropagation();
    startTransition(() => {
      moveActiveTask(task.id, to);
    });
  };

  const handlePriorityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyPriority = optimisticPriority;
    setOptimisticPriority((prev) => !prev);
    startTransition(() => {
      toggleTaskPriority(task.id, !!isCurrentlyPriority);
    });
  };

  if (isWaiting) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 text-[#444444] hover:text-[#666666] transition-colors group",
          isPending && "opacity-60"
        )}
      >
        <button
          onClick={handleToggle}
          className={cn(
            "w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300",
            optimisticDone
              ? "bg-[#30d158] border-[#30d158] text-white"
              : "border-[#2a2a2a] bg-transparent hover:border-[#6366f1]"
          )}
        >
          {optimisticDone && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <span
          className={cn(
            "flex-1 transition-all",
            optimisticDone ? "line-through opacity-70 text-[15px] text-[#666666]" : "text-[15px] text-[#444444]"
          )}
        >
          {task.title}
        </span>

        <button
          onClick={(e) => handleMove(e, "active")}
          className="text-[#666666] hover:text-[#6366f1] transition-colors ml-auto text-xs opacity-0 group-hover:opacity-100 px-1"
          title="Aktife taşı"
        >
          ↑
        </button>

        <button
          onClick={handleDelete}
          className="text-[#2a2a2a] hover:text-[#ff453a] transition-colors text-xs opacity-0 group-hover:opacity-100"
          title="Görevi sil"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group",
        optimisticPriority 
          ? "bg-[#111111] border-[#1E1E1E] border-l-2 border-l-[#EF4444]" 
          : "bg-[#111111] border-[#1E1E1E] border-l-2 border-l-transparent",
        isPending && "opacity-60",
        optimisticDone && "opacity-70"
      )}
      style={{
        marginBottom: "8px"
      }}
    >
      <button
        onClick={handleToggle}
        className={cn(
          "w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300",
          optimisticDone
            ? "bg-[#30d158] border-[#30d158] text-white"
            : "border-[#2a2a2a] bg-[#141414] hover:border-[#6366f1]/50"
        )}
      >
        {optimisticDone && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={cn(
          "flex-1 transition-all text-sm font-medium",
          optimisticDone ? "text-[#666666] line-through" : "text-white"
        )}
      >
        {task.title}
      </span>

      {/* Priority Toggle Button */}
      <button
        onClick={handlePriorityToggle}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: optimisticPriority ? "#EF4444" : "#444444",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "4px 8px",
          lineHeight: 1,
          borderRadius: "6px"
        }}
        className={cn(
          "transition-all",
          !optimisticPriority && "opacity-0 group-hover:opacity-100",
          optimisticPriority && "scale-125"
        )}
        title={optimisticPriority ? "Önceliği kaldır" : "Öncelikli işaretle"}
      >
        !
      </button>

      <button
        onClick={(e) => handleMove(e, "waiting")}
        className="w-7 h-7 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#555555] hover:border-[#333333] transition-colors ml-1 opacity-0 group-hover:opacity-100"
        title="Bekleyene taşı"
      >
        <span className="text-[10px]">⏳</span>
      </button>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-[#666666] hover:text-[#ff453a] shrink-0 ml-1"
        title="Görevi sil"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
