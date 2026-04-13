"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import { TaskCard } from "./TaskCard";
import { ActiveTaskCard } from "./ActiveTaskCard";
import { toggleTemplateTask, addActiveTask } from "@/app/actions/taskActions";
import type { TaskTemplate, ActiveTask } from "@/types/tasks";

interface TaskGroupProps {
  kritikTasks: TaskTemplate[];
  sistemTasks: TaskTemplate[];
  activeTasks: ActiveTask[];
  completedIds: Set<string>;
  // System task specific props (passed through to cards)
  englishSubtasks?: { id: string; title: string; isCompleted: boolean }[];
  isTreadmillActive?: boolean;
  vitaminPackages?: { id: string; title: string; isTaken: boolean; items: string[] }[];
  completedSkincareIds?: string[];
}

export function TaskGroup({ 
  kritikTasks,
  sistemTasks,
  activeTasks,
  completedIds,
  englishSubtasks = [],
  isTreadmillActive = true,
  vitaminPackages = [],
  completedSkincareIds = [],
}: TaskGroupProps) {
  // useOptimistic: anında görsel güncelleme, sunucu yanıtını bekleme
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
  const [newTaskValue, setNewTaskValue] = useState('');
  const [isAdding, startAddTransition] = useTransition();

  const handleComplete = (templateId: string) => {
    const isCompleted = optimisticIds.has(templateId);
    startTransition(() => {
      // Önce optimistic güncelleme — anında
      toggleOptimistic(templateId);
      // Arkaplanda server action
      toggleTemplateTask(templateId, isCompleted);
    });
  };

  const handleAddTask = () => {
    if (!newTaskValue.trim()) return;
    const title = newTaskValue.trim();
    setNewTaskValue('');
    startAddTransition(() => {
      addActiveTask(title);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTask();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* KRİTİK RUTİNLER */}
      {kritikTasks.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute pb-2 border-b border-zinc-800 mb-4">
            KRİTİK RUTİNLER
          </h3>
          <div className="flex flex-col gap-3">
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
                englishSubtasks={t.system_type === 'english' ? englishSubtasks : []}
                isTreadmillActive={isTreadmillActive}
                vitaminPackages={t.system_type === 'vitamin' ? vitaminPackages : []}
                completedSkincareIds={t.system_type === 'skincare' ? completedSkincareIds : []}
              />
            ))}
          </div>
        </div>
      )}

      {/* AKTİF GÖREVLER */}
      <div className="flex flex-col gap-4">
        <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute pb-2 border-b border-zinc-800 mb-4">
          AKTİF GÖREVLER
        </h3>
        <div className="flex flex-col gap-3">
          {activeTasks.length === 0 && (
            <p className="font-mono text-xs text-ftg-text-mute italic px-1">
              Henüz görev yok. Aşağıdan ekle.
            </p>
          )}
          {activeTasks.map((t) => (
            <ActiveTaskCard key={t.id} task={t} />
          ))}
        </div>
        {/* Görev Ekleme Input */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newTaskValue}
            onChange={(e) => setNewTaskValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Yeni görev ekle..."
            disabled={isAdding}
            className="flex-1 bg-transparent border border-ftg-border-subtle rounded-ftg-card px-4 py-3 font-mono text-sm text-ftg-text placeholder:text-ftg-text-mute focus:outline-none focus:border-ftg-amber/40 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleAddTask}
            disabled={isAdding || !newTaskValue.trim()}
            className="px-4 py-3 border border-ftg-border-subtle rounded-ftg-card font-mono text-sm text-ftg-amber hover:border-ftg-amber/50 hover:bg-ftg-elevated/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* SİSTEMLER */}
      {sistemTasks.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute pb-2 border-b border-zinc-800 mb-4">
            SİSTEMLER
          </h3>
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
                englishSubtasks={t.system_type === 'english' ? englishSubtasks : []}
                isTreadmillActive={isTreadmillActive}
                vitaminPackages={t.system_type === 'vitamin' ? vitaminPackages : []}
                completedSkincareIds={t.system_type === 'skincare' ? completedSkincareIds : []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
