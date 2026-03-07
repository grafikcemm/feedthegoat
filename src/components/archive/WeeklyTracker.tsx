"use client";

import { weeklyTasks } from "@/data/mock";

interface WeeklyTrackerProps {
    completed: Record<string, boolean>;
    onToggle: (id: string) => void;
}

export default function WeeklyTracker({
    completed,
    onToggle,
}: WeeklyTrackerProps) {
    const total = weeklyTasks.length;
    const done = weeklyTasks.filter(task => completed[task.id]).length;
    const pct = Math.round((done / total) * 100);

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 mt-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-text">
                    HAFTALIK TAKİP
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
                    className={`h-full progress-fill ${done === total ? "bg-accent-green glow-green" : "bg-accent-amber"
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                {weeklyTasks.map((task, index) => {
                    const isOn = !!completed[task.id];

                    // Determine border & background based on whether it is checked
                    let cardClasses = "border-border hover:border-text-muted hover:bg-surface-hover";
                    let checkClasses = "bg-transparent text-text-muted";
                    let labelClasses = "text-text";

                    if (isOn) {
                        cardClasses = "border-accent-green/40 bg-accent-green/5 glow-green";
                        checkClasses = "bg-accent-green text-black border-accent-green";
                        labelClasses = "text-accent-green";
                    }

                    return (
                        <button
                            key={task.id}
                            onClick={() => onToggle(task.id)}
                            className={`
                                brutalist-card flex flex-1 items-center gap-3 text-left
                                transition-all duration-200 cursor-pointer p-4 h-full min-h-[44px]
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

                            <div className="flex-1 min-w-0 flex items-center">
                                <span className="text-xl mr-3">{task.icon}</span>
                                <span
                                    className={`text-[12px] uppercase tracking-wide leading-snug font-bold ${labelClasses}`}
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
