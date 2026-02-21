"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface VisualHeatmapProps {
    refreshKey?: number;
}

type DayStatus = "empty" | "missed" | "perfect";

export default function VisualHeatmap({ refreshKey = 0 }: VisualHeatmapProps) {
    const [days, setDays] = useState<DayStatus[]>(Array(30).fill("empty"));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                // Fetch last 30 days of metrics
                const { data, error } = await supabase
                    .from("daily_metrics")
                    .select("date, is_perfect, score")
                    .order("date", { ascending: false })
                    .limit(30);

                if (error) throw error;

                // Create an exact 30-day lookback array
                const today = new Date();
                const past30Days: DayStatus[] = [];

                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dateStr = d.toISOString().split("T")[0];

                    const record = data?.find((row) => row.date === dateStr);

                    if (!record) {
                        past30Days.push("empty");
                    } else if (record.is_perfect) {
                        past30Days.push("perfect");
                    } else {
                        past30Days.push("missed"); // less than perfect
                    }
                }

                setDays(past30Days);
            } catch (err: any) {
                // If it's a table missing error or similar, it might be an empty object in console.
                if (err?.code !== "PGRST116") {
                    console.error("Error fetching heatmap:", err.message || err);
                }
            } finally {
                setMounted(true);
            }
        };

        fetchHeatmapData();
    }, [refreshKey]);

    const getColor = (status: DayStatus) => {
        if (status === "empty") return "bg-surface-hover border-border";
        if (status === "missed") return "bg-accent-red/20 border-accent-red/40";
        if (status === "perfect") return "bg-accent-green border-accent-green glow-green";
        return "bg-surface-hover border-border";
    };

    if (!mounted) {
        // Hydration matching blank state
        return (
            <section className="mb-8">
                <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4 opacity-50">
                    NÖROPLASTİSİTE GRAFİĞİ YÜKLENİYOR...
                </h2>
                <div className="brutalist-card p-4 overflow-x-auto min-h-[80px]" />
            </section>
        );
    }

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                NÖROPLASTİSİTE GRAFİĞİ (SON 30 GÜN)
            </h2>
            <div className="brutalist-card p-4 overflow-x-auto">
                <div className="flex gap-1.5 w-max">
                    {days.map((status, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 rounded-sm border ${getColor(status)} transition-colors duration-300`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-[9px] uppercase tracking-widest text-text-muted">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-surface-hover border border-border" /> BOŞ
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-accent-red/20 border border-accent-red/40" /> KAÇMIŞ
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-accent-green border border-accent-green glow-green" /> ZAFER
                    </span>
                </div>
            </div>
        </section>
    );
}
