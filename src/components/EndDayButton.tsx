"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function EndDayButton({
    allComplete,
    doneCount,
    totalCount,
    completedTasks,
    onFail,
    onSuccess,
}: {
    allComplete: boolean;
    doneCount: number;
    totalCount: number;
    completedTasks: Record<string, boolean>;
    onFail: () => void;
    onSuccess: () => void;
}) {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD local logic
            const score = Math.round((doneCount / totalCount) * 100);

            // 1. Upsert Daily Metric
            const { error: dailyError } = await supabase
                .from("daily_metrics")
                .upsert({
                    date: today,
                    score: score,
                    is_perfect: allComplete,
                    checked_tasks: completedTasks
                }, { onConflict: "date" });

            if (dailyError) throw dailyError;

            // 2. Fetch & Update Streak in user_performance (Assuming single user w/ fixed UUID for MVP)
            const USER_ID = "00000000-0000-0000-0000-000000000001";
            const { data: userData, error: fetchError } = await supabase
                .from("user_performance")
                .select("current_streak, highest_streak")
                .eq("id", USER_ID)
                .single();

            let newStreak = allComplete ? 1 : 0;
            let currentHighest = 0;

            if (!fetchError && userData) {
                newStreak = allComplete ? (userData.current_streak || 0) + 1 : 0;
                currentHighest = userData.highest_streak || 0;

                await supabase
                    .from("user_performance")
                    .update({
                        current_streak: newStreak,
                        highest_streak: Math.max(currentHighest, newStreak)
                    })
                    .eq("id", USER_ID);
            } else if (fetchError?.code === "PGRST116" || fetchError?.code === "42703") {
                // row doesn't exist (PGRST116) or highest_streak col missing (42703), do initial insert/fallback
                await supabase
                    .from("user_performance")
                    .upsert({
                        id: USER_ID,
                        current_streak: newStreak,
                        highest_streak: newStreak
                    });
            }

            // Update local streak tracking
            const todayKey = today;
            if (allComplete) {
                const currentStreak = parseInt(localStorage.getItem("goat-streak-v1") || "0", 10);
                const currentBest = parseInt(localStorage.getItem("goat-streak-best-v1") || "0", 10);
                const newLocalStreak = currentStreak + 1;
                const newBest = Math.max(currentBest, newLocalStreak);
                localStorage.setItem("goat-streak-v1", newLocalStreak.toString());
                localStorage.setItem("goat-streak-best-v1", newBest.toString());
                localStorage.setItem("goat-streak-last-date", todayKey);
                localStorage.setItem(`goat-day-complete-${todayKey}`, "true");
                window.dispatchEvent(new Event("streakUpdated"));
            } else {
                localStorage.setItem("goat-streak-v1", "0");
                localStorage.setItem("goat-streak-last-date", todayKey);
                window.dispatchEvent(new Event("streakUpdated"));
            }

            if (!allComplete) {
                // Failed day, show the brutal Dark Mirror. Modal close will trigger refresh.
                onFail();
            } else {
                // Perfect day
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onSuccess();
                }, 1500);
            }
        } catch (error) {
            console.error("Supabase Error:", error);
            alert("Veritabanı bağlantı hatası. .env.local yapılandırmanızı kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={handleClick}
                className={`
          w-full brutalist-border px-8 py-4 text-sm uppercase tracking-[0.3em] font-bold
          transition-all duration-300 cursor-pointer
          ${allComplete
                        ? "border-accent-green text-accent-green hover:bg-accent-green/10 glow-green"
                        : "border-accent-red text-accent-red hover:bg-accent-red/10 glow-red"
                    }
        `}
            >
                ⚡ GÜNÜ BİTİR
            </button>

            {success && (
                <div className="brutalist-card border-accent-green/40 text-center w-full">
                    <p className="text-accent-green text-sm font-bold uppercase tracking-wide">
                        ✓ BUGÜN TAMAMLANDI
                    </p>
                    <p className="text-text-muted text-[10px] mt-1 uppercase tracking-widest">
                        Disiplin = Özgürlük
                    </p>
                </div>
            )}
        </div>
    );
}
