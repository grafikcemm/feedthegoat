"use client";

import { useState, useEffect } from "react";

export default function StreakCounter() {
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedStreak = localStorage.getItem("goat-streak-v1");
        const savedBest = localStorage.getItem("goat-streak-best-v1");

        if (savedStreak) setTimeout(() => setStreak(parseInt(savedStreak, 10)), 0);
        if (savedBest) setTimeout(() => setBestStreak(parseInt(savedBest, 10)), 0);

        // Check yesterday's completion status
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split("T")[0];
        const yesterdayComplete = localStorage.getItem(`goat-day-complete-${yesterdayKey}`);

        // If yesterday wasn't completed in EndDay, check if streak should be broken
        const lastStreakDate = localStorage.getItem("goat-streak-last-date");
        if (lastStreakDate) {
            const lastDate = new Date(lastStreakDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            lastDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            // If more than 1 day gap, streak is broken
            if (diffDays > 1 && !yesterdayComplete) {
                setTimeout(() => setStreak(0), 0);
                localStorage.setItem("goat-streak-v1", "0");
            }
        }

        setTimeout(() => setIsLoaded(true), 0);

        // Listen for streak update events (from EndDayButton)
        const handleStreakUpdate = () => {
            const newStreak = parseInt(localStorage.getItem("goat-streak-v1") || "0", 10);
            const newBest = parseInt(localStorage.getItem("goat-streak-best-v1") || "0", 10);
            setStreak(newStreak);
            setBestStreak(newBest);
        };

        window.addEventListener("streakUpdated", handleStreakUpdate);
        return () => window.removeEventListener("streakUpdated", handleStreakUpdate);
    }, []);

    if (!isLoaded) return null;

    // Determine visual intensity based on streak
    let borderClass = "border-border";
    let glowClass = "";
    let streakColor = "text-text-muted";
    let fireEmoji = "🔥";

    if (streak >= 30) {
        borderClass = "border-accent-green";
        glowClass = "glow-green";
        streakColor = "text-accent-green";
        fireEmoji = "👑";
    } else if (streak >= 14) {
        borderClass = "border-accent-green";
        glowClass = "glow-green";
        streakColor = "text-accent-green";
        fireEmoji = "🔥";
    } else if (streak >= 7) {
        borderClass = "border-accent-amber";
        glowClass = "glow-amber";
        streakColor = "text-accent-amber";
    } else if (streak >= 3) {
        borderClass = "border-accent-amber";
        streakColor = "text-accent-amber";
    } else if (streak === 0) {
        fireEmoji = "💀";
        borderClass = "border-accent-red/30";
        streakColor = "text-accent-red";
    }

    return (
        <div className={`brutalist-card p-3 flex items-center justify-between ${borderClass} ${glowClass} transition-all duration-500`}>
            <div className="flex items-center gap-3">
                <span className="text-2xl">{fireEmoji}</span>
                <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted block">
                        Disiplin Serisi
                    </span>
                    <span className={`text-lg font-bold ${streakColor}`}>
                        {streak} GÜN
                    </span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-text-muted block">
                    En İyi
                </span>
                <span className="text-sm font-bold text-text-muted">
                    {bestStreak} gün
                </span>
            </div>
        </div>
    );
}
