"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import { Card } from "@/components/dashboard/Card";
import { SectionLabel } from "@/components/dashboard/SectionLabel";
import { TaskCard } from "./TaskCard";
import { ActiveTaskCard } from "./ActiveTaskCard";
import { cn } from "@/utils/cn";
import { toggleTemplateTask, addActiveTask } from "@/app/actions/taskActions";

interface TaskGroupProps {
  kritikTasks: any[];
  sistemTasks: any[];
  activeTasks: any[];
  completedIds: Set<string>;
  englishSubtasks: any[];
  isTreadmillActive: boolean;
  vitaminPackages: any[];
  completedSkincareIds: string[];
  showOnly?: "kritik" | "active" | "sistem";
}

export function TaskGroup({
  kritikTasks,
  sistemTasks,
  activeTasks,
  completedIds,
  englishSubtasks,
  isTreadmillActive,
  vitaminPackages,
  completedSkincareIds,
  showOnly,
}: TaskGroupProps) {
  // Optimistic UI update
  const [optimisticIds, toggleOptimistic] = useOptimistic(
    completedIds,
    (current: Set<string>, templateId: string) => {
      const next = new Set(current);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    }
  );

  const [, startTransition] = useTransition();
  const [newTaskValue, setNewTaskValue] = useState("");
  const [isAdding, startAddTransition] = useTransition();

  const handleComplete = (templateId: string) => {
    const isCompleted = optimisticIds.has(templateId);
    startTransition(() => {
      toggleOptimistic(templateId);
      toggleTemplateTask(templateId, isCompleted);
    });
  };

  const handleAddTask = (category: "active" | "waiting") => {
    if (!newTaskValue.trim()) return;
    const title = newTaskValue.trim();
    setNewTaskValue("");
    startAddTransition(() => {
      addActiveTask(title, category);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask("active");
  };

  const activeOnly = activeTasks
    .filter((t) => t.category === "active")
    .sort((a, b) => {
      if (a.is_priority && !b.is_priority) return -1;
      if (!a.is_priority && b.is_priority) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  const waitingOnly = activeTasks
    .filter((t) => t.category === "waiting")
    .sort((a, b) => {
      if (a.is_priority && !b.is_priority) return -1;
      if (!a.is_priority && b.is_priority) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  const renderKritik = () => (
    kritikTasks.length > 0 && (
      <Card noPadding>
        <div className="p-6">
          <SectionLabel>Kritik Rutinler</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kritikTasks.map((t) => (
            <TaskCard
              key={t.id}
              id={t.id}
              title={t.title}
              isDone={optimisticIds.has(t.id)}
              category={t.category}
              systemType={t.system_type}
              points={t.points}
              priority={null}
              isBonus={false}
              onComplete={handleComplete}
              englishSubtasks={t.system_type === "english" ? englishSubtasks : []}
              isTreadmillActive={isTreadmillActive}
              vitaminPackages={t.system_type === "vitamin" ? vitaminPackages : []}
              completedSkincareIds={t.system_type === "skincare" ? completedSkincareIds : []}
            />
          ))}
        </div>
        </div>
      </Card>
    )
  );

  const renderActive = () => (
    <Card noPadding>
      <div className="p-6">
        <SectionLabel>Aktif Görevler</SectionLabel>
      
      <div className="flex flex-col gap-3">
        {activeOnly.length === 0 && (
          <p className="text-xs text-[#666666] italic px-1">
            Henüz aktif görev yok.
          </p>
        )}
        {activeOnly.map((t) => (
          <ActiveTaskCard key={t.id} task={t} />
        ))}
      </div>

      {/* Görev Ekleme Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newTaskValue}
          onChange={(e) => setNewTaskValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Yeni görev ekle..."
          disabled={isAdding}
          className="flex-1 bg-[#111111] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-[#888888] placeholder-[#444444] focus:border-[#F5C518] focus:outline-none transition-all disabled:opacity-50"
        />
        <button
          onClick={() => handleAddTask("active")}
          disabled={isAdding || !newTaskValue.trim()}
          className="w-9 h-9 bg-[#F5C518] rounded-xl flex items-center justify-center hover:bg-[#e6b800] transition-colors text-black text-sm font-bold disabled:opacity-50"
        >
          +
        </button>
        <button
          onClick={() => handleAddTask("waiting")}
          disabled={isAdding || !newTaskValue.trim()}
          className="w-9 h-9 bg-[#111111] border border-[#1E1E1E] rounded-xl flex items-center justify-center text-[#555555] hover:border-[#333333] transition-colors disabled:opacity-50"
          title="Bekleyenlere Ekle"
        >
          ⏳
        </button>
      </div>

      {/* BEKLEYENLER */}
      {waitingOnly.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mt-4 mb-2">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#444444]">BEKLEYENLER</p>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <div className="flex flex-col gap-1">
            {waitingOnly.map((t) => (
              <ActiveTaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}
      </div>
    </Card>
  );

  const renderSistem = () => (
    sistemTasks.length > 0 && (
      <Card noPadding>
        <div className="p-6">
          <SectionLabel>Sistemler</SectionLabel>
        <div className="flex flex-col gap-3">
          {sistemTasks.map((t) => (
            <TaskCard
              key={t.id}
              id={t.id}
              title={t.title}
              isDone={optimisticIds.has(t.id)}
              category={t.category}
              systemType={t.system_type}
              points={t.points}
              priority={null}
              isBonus={false}
              onComplete={handleComplete}
              englishSubtasks={t.system_type === "english" ? englishSubtasks : []}
              isTreadmillActive={isTreadmillActive}
              vitaminPackages={t.system_type === "vitamin" ? vitaminPackages : []}
              completedSkincareIds={t.system_type === "skincare" ? completedSkincareIds : []}
            />
          ))}
        </div>
        </div>
      </Card>
    )
  );

  if (showOnly === "kritik") return renderKritik();
  if (showOnly === "active") return renderActive();
  if (showOnly === "sistem") return renderSistem();

  return (
    <div className="flex flex-col gap-10">
      {renderKritik()}
      {renderActive()}
      {renderSistem()}
    </div>
  );
}
