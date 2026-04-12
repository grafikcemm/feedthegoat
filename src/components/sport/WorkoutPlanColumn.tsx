import React from "react";
import { WeeklyProgressCard } from "./WeeklyProgressCard";
import { WorkoutDayCard } from "./WorkoutDayCard";

interface Exercise {
  id: string;
  name: string;
  sets_reps: string | null;
  sort_order: number;
}

interface WorkoutDay {
  id: string;
  day_of_week: string;
  title: string;
  day_type: "workout" | "active_rest" | "full_rest";
  is_required: boolean;
  is_bonus: boolean;
  amac: string | null;
  exercises: Exercise[];
}

interface WorkoutPlanColumnProps {
  days: WorkoutDay[];
  completedDayIds: Set<string>;
  todayDayKey: string;
}

export function WorkoutPlanColumn({
  days,
  completedDayIds,
  todayDayKey,
}: WorkoutPlanColumnProps) {
  // Compute required & bonus counts
  const requiredCompletedCount = days
    ?.filter((d) => d.is_required && completedDayIds.has(d.id)).length ?? 0;
  const bonusCompletedCount = days
    ?.filter((d) => d.is_bonus && completedDayIds.has(d.id)).length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
        SPOR PLANI
      </div>

      {/* Haftalık ilerleme card */}
      <WeeklyProgressCard
        requiredCompleted={requiredCompletedCount}
        requiredTotal={3}
        bonusCompleted={bonusCompletedCount}
        bonusTotal={1}
      />

      {/* 7 gün accordion */}
      <div className="flex flex-col gap-3">
        {days.map((day) => (
          <WorkoutDayCard
            key={day.id}
            day={day}
            isToday={day.day_of_week === todayDayKey}
            isCompleted={completedDayIds.has(day.id)}
          />
        ))}
      </div>
    </div>
  );
}
