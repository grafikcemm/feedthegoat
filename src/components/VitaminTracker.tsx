"use client";

import { useState, useEffect } from "react";

interface VitaminItem {
    id: string;
    label: string;
    isGymOnly?: boolean;
}

const VITAMIN_DATA: VitaminItem[] = [
    { id: "vit-morning", label: "☀️ SABAH: 2 Bardak Su + Limon + B12, Kahve + Alpha GPC + Tyrosine + L-Theanine" },
    { id: "vit-noon", label: "🍽️ ÖĞLE: Omega 3, D3 K2 Damla, Demir, C Vitamini, Saç Jelibonu" },
    { id: "vit-pre-gym", label: "🏋️ SPOR ÖNCESİ (GYM): L-Karnitin", isGymOnly: true },
    { id: "vit-post", label: "💪 SPOR SONRASI: Protein Tozu, Kreatin, Glutamine, Multi Vitamin, ZMA, Magnezyum" },
    { id: "vit-night", label: "🌙 GECE: Karnıyarık Otu tozu (1 tatlı kaşığı) + Bol Su" },
];

export default function VitaminTracker() {
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [isClient, setIsClient] = useState(false);
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());

    useEffect(() => {
        setIsClient(true);
        setCurrentDay(new Date().getDay());
        const dateStr = new Date().toISOString().split("T")[0];
        const saved = localStorage.getItem(`vitamins-${dateStr}`);
        if (saved) {
            try {
                setCompleted(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse vitamin state", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const dateStr = new Date().toISOString().split("T")[0];
        localStorage.setItem(`vitamins-${dateStr}`, JSON.stringify(completed));
    }, [completed, isClient]);

    const toggleVitamin = (id: string) => {
        setCompleted((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const isGymDay = [1, 2, 4, 6].includes(currentDay);

    const activeVitamins = VITAMIN_DATA.filter(v => !v.isGymOnly || isGymDay);
    const doneCount = activeVitamins.filter(v => completed[v.id]).length;
    const totalCount = activeVitamins.length;
    const isAllComplete = doneCount === totalCount && totalCount > 0;

    if (!isClient) return null;

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-text">
                    VİTAMİN TAKİP
                </h2>
                <span className={`text-[10px] font-bold tabular-nums ${isAllComplete ? "text-accent-green" : "text-text-muted"}`}>
                    {doneCount}/{totalCount}
                </span>
            </div>

            <div className="brutalist-card bg-surface border-border flex flex-col space-y-3 p-4">
                {activeVitamins.map((item) => {
                    const isOn = !!completed[item.id];
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleVitamin(item.id)}
                            className={`
                flex items-center gap-3 text-left w-full
                transition-all duration-200 cursor-pointer p-3 min-h-[44px] brutalist-border
                ${isOn ? "border-accent-green/40 bg-accent-green/5 text-accent-green" : "border-border hover:border-text-muted hover:bg-surface-hover text-text"}
              `}
                        >
                            <div
                                className={`
                  w-5 h-5 flex-shrink-0 brutalist-border flex items-center justify-center text-[11px] font-bold
                  transition-colors duration-200
                  ${isOn ? "bg-accent-green text-black border-accent-green" : "bg-transparent text-text-muted border-border"}
                `}
                            >
                                {isOn ? "✓" : ""}
                            </div>
                            <span className="text-[12px] leading-snug flex-1 font-bold">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
