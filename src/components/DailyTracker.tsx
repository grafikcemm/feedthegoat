"use client";

import { useEffect, useState } from "react";
import { dailyTasks } from "@/data/mock";

interface DailyTrackerProps {
    completed: Record<string, boolean>;
    onToggle: (id: string) => void;
}

export default function DailyTracker({
    completed,
    onToggle,
}: DailyTrackerProps) {
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
    const [gymWeeklyCount, setGymWeeklyCount] = useState<number>(0);

    useEffect(() => {
        setCurrentDay(new Date().getDay());

        // Simple local storage tracker for Gym weekly count
        const weekKey = getWeekKey(new Date());
        const savedCount = localStorage.getItem(`gym-count-${weekKey}`);
        if (savedCount) {
            setGymWeeklyCount(parseInt(savedCount, 10));
        }
    }, []);

    // Helper to get week key
    const getWeekKey = (d: Date) => {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return date.getFullYear() + "-" + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };

    // Listen for gym task toggle to update count
    const handleToggle = (id: string, layer: string) => {
        onToggle(id);

        if (layer === "gym") {
            const weekKey = getWeekKey(new Date());
            const isCurrentlyCompleted = !!completed[id]; // this is state BEFORE update
            let newCount = isCurrentlyCompleted ? gymWeeklyCount - 1 : gymWeeklyCount + 1;
            newCount = Math.max(0, Math.min(newCount, 4)); // clamp 0-4

            setGymWeeklyCount(newCount);
            localStorage.setItem(`gym-count-${weekKey}`, newCount.toString());
        }
    };

    // 0: Pazar, 1: Pzt, 2: Salı, 3: Çar, 4: Perş, 5: Cuma, 6: Cmt
    // Gym only visible on: Pzt (1), Salı (2), Perşembe (4), Cumartesi (6)
    const isGymDay = [1, 2, 4, 6].includes(currentDay);

    const aslaKirmaTasks = dailyTasks.filter(t => t.layer === "asla_kirma");
    const enerjinVarsaTasks = dailyTasks.filter(t => t.layer === "enerjin_varsa");
    const gymTasks = dailyTasks.filter(t => t.layer === "gym");

    const renderTaskLayer = (title: string, tasks: typeof dailyTasks, colorClass: "accent-red" | "accent-amber" | "accent-green", customProgress?: { done: number, total: number }) => {
        if (tasks.length === 0) return null;

        const doneCount = customProgress ? customProgress.done : tasks.filter(t => completed[t.id]).length;
        const totalCount = customProgress ? customProgress.total : tasks.length;
        const isAllDone = doneCount === totalCount && totalCount > 0;

        return (
            <div className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-[11px] font-bold uppercase tracking-widest text-${colorClass}`}>
                        {title}
                    </h3>
                    <span className={`text-[10px] font-bold tabular-nums ${isAllDone ? `text-${colorClass}` : "text-text-muted"}`}>
                        {doneCount}/{totalCount}
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    {tasks.map(task => {
                        const isOn = !!completed[task.id];
                        let cardClasses = "border-border hover:border-text-muted hover:bg-surface-hover";
                        let checkClasses = "bg-transparent text-text-muted";
                        let labelClasses = "text-text";

                        if (isOn) {
                            cardClasses = `border-${colorClass}/60 bg-${colorClass}/5 glow-${colorClass.replace('accent-', '')}`;
                            checkClasses = `bg-${colorClass} text-black border-${colorClass}`;
                            labelClasses = `text-${colorClass}`;
                        }

                        // Use a generic style replacement for the dynamic classes to avoid Tailwind purging issues.
                        // Wait, tailwind might purge dynamically constructed classes like `bg-accent-red`. 
                        // It's safer to use explicit classes.
                        let finalCardClasses = "border-border hover:border-text-muted hover:bg-surface-hover";
                        let finalCheckClasses = "bg-transparent text-text-muted";
                        let finalLabelClasses = "text-text";

                        if (isOn) {
                            if (colorClass === "accent-red") {
                                finalCardClasses = "border-accent-red/60 bg-accent-red/5 glow-red";
                                finalCheckClasses = "bg-accent-red text-black border-accent-red";
                                finalLabelClasses = "text-accent-red";
                            } else if (colorClass === "accent-amber") {
                                finalCardClasses = "border-accent-amber/60 bg-accent-amber/5 glow-amber"; // assuming we add glow-amber in globals.css
                                finalCheckClasses = "bg-accent-amber text-black border-accent-amber";
                                finalLabelClasses = "text-accent-amber";
                            } else {
                                finalCardClasses = "border-accent-green/60 bg-accent-green/5 glow-green";
                                finalCheckClasses = "bg-accent-green text-black border-accent-green";
                                finalLabelClasses = "text-accent-green";
                            }
                        }


                        return (
                            <button
                                key={task.id}
                                onClick={() => handleToggle(task.id, task.layer)}
                                className={`
                                    brutalist-card flex flex-1 items-center gap-3 text-left w-full
                                    transition-all duration-200 cursor-pointer p-4 h-full min-h-[44px]
                                    ${finalCardClasses}
                                `}
                            >
                                <div
                                    className={`
                                        flex-shrink-0 w-6 h-6 brutalist-border flex items-center justify-center text-[12px] font-bold
                                        transition-colors duration-200
                                        ${finalCheckClasses}
                                    `}
                                >
                                    {isOn ? "✓" : ""}
                                </div>

                                <div className="flex-1 min-w-0 flex items-center">
                                    <span className="text-xl mr-3">{task.icon}</span>
                                    <span className={`text-[12px] uppercase tracking-wide leading-snug font-bold ${finalLabelClasses}`}>
                                        {task.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };


    // Gym Weekly Colors logic
    let gymColorClass: "accent-red" | "accent-amber" | "accent-green" = "accent-red";
    if (gymWeeklyCount >= 4) {
        gymColorClass = "accent-green";
    } else if (gymWeeklyCount >= 2) {
        gymColorClass = "accent-amber";
    }

    return (
        <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-text mb-6">
                GÜNLÜK TAKİP
            </h2>

            <div className="bg-surface p-4 border border-border">
                {renderTaskLayer("🔴 ASLA KIRMA", aslaKirmaTasks, "accent-red")}

                <div className="h-px bg-border my-6"></div>

                {renderTaskLayer("🟡 ENERJİN VARSA", enerjinVarsaTasks, "accent-amber")}

                {isGymDay && (
                    <>
                        <div className="h-px bg-border my-6"></div>
                        {renderTaskLayer(`🟢 GYM (Bu Hafta: ${gymWeeklyCount}/4 antrenman)`, gymTasks, gymColorClass)}
                    </>
                )}
            </div>
        </section>
    );
}
