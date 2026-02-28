"use client";

import { useState, useEffect } from "react";

export interface PerformanceMetricsProps {
    doneCount: number;
    totalCount: number;
    refreshKey?: number;
}

export default function PerformanceMetrics({ doneCount, totalCount, refreshKey }: PerformanceMetricsProps) {
    const pointsPerTask = 10;
    const [bonusDopamine, setBonusDopamine] = useState(0);

    useEffect(() => {
        const checkBonus = () => {
            const saved = localStorage.getItem("goat-bonus-dopamine");
            if (saved) {
                setBonusDopamine(parseFloat(saved));
            }
        };
        checkBonus();

        window.addEventListener("dopamineUpdated", checkBonus);
        return () => window.removeEventListener("dopamineUpdated", checkBonus);
    }, [refreshKey]);

    const maxScore = totalCount * pointsPerTask;
    // Cap score percentage visually at 100%, but show the raw total to the user.
    const currentScore = doneCount * pointsPerTask + bonusDopamine;
    const scorePct = Math.min(100, Math.round((currentScore / maxScore) * 100));

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                PERFORMANS METRİKLERİ
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {/* Dopamin Skoru */}
                <div className="brutalist-card border-t-2 border-text/20">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text">
                                DOPAMİN SKORU
                            </p>
                            {bonusDopamine > 0 && (
                                <p className="text-[9px] uppercase tracking-widest text-accent-green font-bold mt-1">
                                    +{bonusDopamine} BONUS (Alt Görevler)
                                </p>
                            )}
                        </div>
                        <p className="text-xl tabular-nums font-bold leading-none">
                            {currentScore.toFixed(0)} <span className="text-text-muted text-sm">/ {maxScore}</span>
                        </p>
                    </div>

                    <div className="w-full h-3 bg-surface brutalist-border overflow-hidden">
                        <div
                            className="h-full progress-fill transition-all duration-500 ease-out bg-accent-green glow-green"
                            style={{ width: `${scorePct}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
