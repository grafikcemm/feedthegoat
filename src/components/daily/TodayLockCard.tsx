"use client";

import { Lock } from "lucide-react";

interface TodayLockCardProps {
  activeTasks: Array<{
    id: string;
    title: string;
    category?: string;
    is_priority?: boolean;
    is_done?: boolean;
  }>;
}

function selectLock(
  activeTasks: TodayLockCardProps["activeTasks"]
): { title: string; source: "p1" | "first" | "default" } {
  const openTasks = activeTasks.filter(
    (t) => t.category === "active" && !t.is_done
  );

  const p1 = openTasks.find((t) => t.is_priority);
  if (p1) return { title: p1.title, source: "p1" };

  const first = openTasks[0];
  if (first) return { title: first.title, source: "first" };

  return {
    title: "Bugün kritik rutinleri tamamla, yeter.",
    source: "default",
  };
}

export function TodayLockCard({ activeTasks }: TodayLockCardProps) {
  const lock = selectLock(activeTasks);

  return (
    <div className="bg-[#111111] rounded-xl border border-[#2a2000] overflow-hidden">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={13} className="text-[#f5c518]" strokeWidth={2} />
          <span className="text-[10px] uppercase tracking-widest text-[#888888] font-medium">
            Bugünün Kilidi
          </span>
        </div>

        <p className="text-[11px] text-[#555555] mb-1.5">
          Bunu bitir, gün kazanıldı.
        </p>

        <p className="text-[15px] font-medium text-[#cccccc] leading-snug">
          {lock.title}
        </p>

        {lock.source !== "default" && (
          <p className="text-[10px] text-[#444444] mt-2">
            Yeni görev ekleme. Kilidi aç.
          </p>
        )}
      </div>
    </div>
  );
}
