"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface PerformanceMetricsProps {
    doneCount: number;
    totalCount: number;
    refreshKey?: number;
}

export default function PerformanceMetrics({ doneCount, totalCount, refreshKey = 0 }: PerformanceMetricsProps) {
    const [streak, setStreak] = useState(0);
    const [reborn, setReborn] = useState(false);

    const pointsPerTask = 10;
    const maxScore = totalCount * pointsPerTask;
    const currentScore = doneCount * pointsPerTask;
    const scorePct = Math.min(100, Math.round((currentScore / maxScore) * 100));

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const USER_ID = "00000000-0000-0000-0000-000000000001";
                const { data, error } = await supabase
                    .from("user_performance")
                    .select("current_streak")
                    .eq("id", USER_ID)
                    .single();

                if (!error && data) {
                    setStreak(data.current_streak);
                }
            } catch (err) {
                console.error("Streak fetch error", err);
            }
        };

        fetchStreak();
    }, [refreshKey]);

    // Local override logic for UI preview before saving
    useEffect(() => {
        // Just for visual reborn flair on reset
        if (doneCount === 0 && streak > 0) {
            // We don't reset state fully here unless saved, but trigger animation
        }
    }, [doneCount, streak]);

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                PERFORMANS METRİKLERİ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dopamin Skoru */}
                <div className="brutalist-card border-t-2 border-text/20">
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text">
                            DOPAMİN SKORU
                        </p>
                        <p className="text-xl tabular-nums font-bold leading-none">
                            {currentScore.toFixed(1)} <span className="text-text-muted text-sm">/ {maxScore}</span>
                        </p>
                    </div>

                    <div className="w-full h-3 bg-surface brutalist-border overflow-hidden">
                        <div
                            className="h-full progress-fill transition-all duration-500 ease-out bg-accent-green glow-green"
                            style={{ width: `${scorePct}%` }}
                        />
                    </div>
                </div>

                {/* Niyet Kası Sayacı */}
                <div className="brutalist-card border-t-2 border-accent-amber/40 relative overflow-hidden flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-amber mb-1">
                        NİYET KASI (STREAK)
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-3xl tabular-nums font-bold tracking-tighter transition-colors ${streak > 0 ? "text-accent-amber" : "text-text-muted"}`}>
                            {streak} <span className="text-sm font-normal tracking-wide">GÜN</span>
                        </p>
                    </div>

                    {reborn && (
                        <div className="absolute inset-0 bg-accent-red flex items-center justify-center animate-in fade-in duration-200 fade-out delay-1000">
                            <span className="text-black font-bold uppercase tracking-widest animate-pulse">
                                REBORN
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
