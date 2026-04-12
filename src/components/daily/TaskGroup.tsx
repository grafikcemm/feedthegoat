"use client";

import React, { useTransition } from "react";
import { TaskCard } from "./TaskCard";
import { completeTask } from "@/app/actions/completeTask";

export interface Task {
  id: string;
  title: string;
  category: "discipline" | "production" | "health" | "bonus";
  time_of_day: "morning" | "day" | "evening";
  system_type?: string | null;
  points: number;
  priority: "P1" | "P2" | "P3" | null;
  is_bonus: boolean;
  is_done: boolean;
}

interface TaskGroupProps {
  tasks: Task[];
  englishSubtasks?: { id: string; title: string; isCompleted: boolean }[];
  isTreadmillActive?: boolean;
  vitaminPackages?: { id: string; title: string; isTaken: boolean; items: string[] }[];
  completedSkincareIds?: string[];
}

const GROUP_LABELS: Record<'morning' | 'day' | 'evening', string> = {
  morning: 'KRİTİK RUTİNLER',
  day: 'AKTİF GÖREVLER',
  evening: 'SİSTEMLER',
};

export function TaskGroup({ 
  tasks, 
  englishSubtasks = [], 
  isTreadmillActive = true, 
  vitaminPackages = [],
  completedSkincareIds = []
}: TaskGroupProps) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = (taskId: string) => {
    startTransition(() => {
      completeTask({ taskId });
    });
  };

  const morningTasks = tasks.filter((t) => t.time_of_day === "morning");
  const dayTasks = tasks.filter((t) => t.time_of_day === "day");
  const eveningTasks = tasks.filter((t) => t.time_of_day === "evening");

  return (
    <div className="flex flex-col gap-8">
      {/* KRİTİK RUTİNLER (morning) */}
      {morningTasks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
            {GROUP_LABELS.morning}
          </h3>
          <div className="flex flex-col gap-2">
            {morningTasks.map((t) => (
              <TaskCard
                key={t.id}
                id={t.id}
                title={t.title}
                isDone={t.is_done}
                category={t.category}
                systemType={t.system_type}
                points={t.points}
                priority={t.priority}
                isBonus={t.is_bonus}
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

      {/* AKTİF GÖREVLER (day) */}
      {dayTasks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
            {GROUP_LABELS.day}
          </h3>
          <div className="flex flex-col gap-2">
            {dayTasks.map((t) => (
              <TaskCard
                key={t.id}
                id={t.id}
                title={t.title}
                isDone={t.is_done}
                category={t.category}
                systemType={t.system_type}
                points={t.points}
                priority={t.priority}
                isBonus={t.is_bonus}
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

      {/* SİSTEMLER (evening) */}
      {eveningTasks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
            {GROUP_LABELS.evening}
          </h3>
          <div className="flex flex-col gap-2">
            {eveningTasks.map((t) => (
              <TaskCard
                key={t.id}
                id={t.id}
                title={t.title}
                isDone={t.is_done}
                category={t.category}
                systemType={t.system_type}
                points={t.points}
                priority={t.priority}
                isBonus={t.is_bonus}
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
