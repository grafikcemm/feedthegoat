"use client";

import { dailyTasks } from "@/data/mock";

interface DailyTrackerProps {
    completed: Record<string, boolean>;
    onToggle: (id: string) => void;
}

export default function DailyTracker({
    completed,
    onToggle,
}: DailyTrackerProps) {
    const total = dailyTasks.length;
    const done = Object.values(completed).filter(Boolean).length;
    const pct = Math.round((done / total) * 100);

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    Günlük Takip
                </h2>
                <span className="text-xs font-bold tabular-nums">
                    <span className={done === total ? "text-accent-green" : "text-text"}>
                        {done}
                    </span>
                    <span className="text-text-muted">/{total}</span>
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-surface brutalist-border mb-6 overflow-hidden">
                <div
                    className={`h-full progress-fill ${done === total ? "bg-accent-green glow-green" : "bg-accent-red"
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                {dailyTasks.map((task, index) => {
                    const isOn = !!completed[task.id];
                    const isSugarFreeTask = task.id === "task-10"; // Hardcoded checking logic for specific task

                    // Determine border & background based on whether it is the special sugar-free task and if it's checked
                    let cardClasses = "border-border hover:border-text-muted hover:bg-surface-hover";
                    let checkClasses = "bg-transparent text-text-muted";
                    let labelClasses = "text-text";

                    if (isOn) {
                        if (isSugarFreeTask) {
                            cardClasses = "border-accent-red/60 bg-accent-red/5 glow-red";
                            checkClasses = "bg-accent-red text-black border-accent-red";
                            labelClasses = "text-accent-red";
                        } else {
                            cardClasses = "border-accent-green/40 bg-accent-green/5 glow-green";
                            checkClasses = "bg-accent-green text-black border-accent-green";
                            labelClasses = "text-accent-green";
                        }
                    }

                    return (
                        <button
                            key={task.id}
                            onClick={() => onToggle(task.id)}
                            className={`
                                brutalist-card flex flex-1 items-start gap-3 text-left
                                transition-all duration-200 cursor-pointer h-full
                                ${cardClasses}
                            `}
                        >
                            {/* Status Indicator */}
                            <div
                                className={`
                                    mt-0.5 w-5 h-5 flex-shrink-0 brutalist-border flex items-center justify-center text-[11px] font-bold
                                    transition-colors duration-200
                                    ${checkClasses}
                                `}
                            >
                                {isOn ? "✓" : ""}
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                                <span className="text-lg mr-2">{task.icon}</span>
                                <span
                                    className={`text-xs uppercase tracking-wide leading-snug ${labelClasses}`}
                                >
                                    {task.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
