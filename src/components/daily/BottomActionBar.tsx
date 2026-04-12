"use client";

import React, { useTransition, useState } from "react";
import { endDay } from "@/app/actions/endDay";
import { addTask } from "@/app/actions/addTask";

export function BottomActionBar() {
  const [isPending, startTransition] = useTransition();
  const [taskTitle, setTaskTitle] = useState("");

  const handleEndDay = () => {
    startTransition(async () => {
      await endDay();
      // Optional: Add some nice toast or feedback to UI here if it leveled up
    });
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && taskTitle.trim()) {
      startTransition(async () => {
        await addTask({ title: taskTitle.trim() });
        setTaskTitle("");
      });
    }
  };

  return (
    <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 px-8 py-5 border-t border-ftg-border-subtle bg-ftg-bg rounded-b-ftg-shell">
      {/* Left Input */}
      <input
        type="text"
        placeholder="+ Yeni görev yakala... (Enter'a bas)"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={handleAddTask}
        disabled={isPending}
        className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-ftg-text placeholder:text-ftg-text-mute disabled:opacity-50"
      />

      {/* Right Button */}
      <button 
        onClick={handleEndDay}
        disabled={isPending}
        className="px-6 py-3 rounded-ftg-card border border-ftg-amber text-ftg-amber font-mono text-[11px] tracking-wider uppercase hover:bg-ftg-amber-glow transition-colors disabled:opacity-50"
      >
        {isPending ? "BEKLEYİN..." : "GÜNÜ BİTİR"}
      </button>
    </div>
  );
}
