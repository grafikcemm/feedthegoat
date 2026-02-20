"use client";

import { useState } from "react";
import goalsData from "@/data/goals.json";

interface Goal {
    title: string;
    affirmation: string;
    items: string[];
}

export default function GoalsDashboard() {
    const goals = goalsData as Goal[];
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    const closeModal = () => setSelectedGoal(null);

    return (
        <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                Hedefler Paneli
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((goal, i) => {
                    const colors = [
                        "border-accent-green hover:bg-accent-green/5 text-accent-green",
                        "border-accent-amber hover:bg-accent-amber/5 text-accent-amber",
                        "border-accent-red hover:bg-accent-red/5 text-accent-red",
                        "border-text hover:bg-text/5 text-text",
                    ];
                    const colorClass = colors[i % colors.length];

                    return (
                        <button
                            key={goal.title}
                            onClick={() => setSelectedGoal(goal)}
                            className={`brutalist-card text-left flex items-center justify-between transition-colors border-l-4 cursor-pointer ${colorClass}`}
                        >
                            <span className="font-bold text-sm tracking-widest uppercase">
                                {goal.title}
                            </span>
                            <span className="text-xl ml-4">&rarr;</span>
                        </button>
                    );
                })}
            </div>

            {/* Modal / Side Panel */}
            {selectedGoal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    {/* Dark Overlay to Close */}
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Panel Content */}
                    <div className="relative w-full max-w-2xl bg-surface brutalist-border p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-text-muted hover:text-accent-red transition-colors font-bold text-xl px-2"
                        >
                            &times;
                        </button>

                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-text mb-6">
                            {selectedGoal.title}
                        </h2>

                        <div className="brutalist-card bg-accent-red/10 border-accent-red/50 mb-8 p-4">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-accent-red mb-2">
                                SUPERPOWER AFFIRMATION
                            </p>
                            <p className="text-sm md:text-base text-text leading-relaxed font-medium">
                                &ldquo;{selectedGoal.affirmation}&rdquo;
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted mb-4">
                                AKSİYON MADDELERİ
                            </p>
                            <ul className="space-y-4">
                                {selectedGoal.items.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-sm md:text-base text-text leading-snug"
                                    >
                                        <span className="text-accent-green font-bold mt-0.5">&gt;</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
