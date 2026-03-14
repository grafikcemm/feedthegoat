"use client";

import { useState, useEffect } from "react";

interface VitaminItem {
    id: string;
    label: string;
}

interface VitaminGroup {
    id: string;
    title: string;
    icon: string;
    items: VitaminItem[];
    subTitle?: string;
}

const VITAMIN_GROUPS: VitaminGroup[] = [
    {
        id: "morning",
        title: "SABAH",
        icon: "☀️",
        items: [
            { id: "vit-b12", label: "B12" },
        ]
    },
    {
        id: "morning-coffee",
        title: "Kahveyle Birlikte",
        icon: "☕",
        subTitle: "(Sabah kahvesiyle)",
        items: [
            { id: "vit-alpha-gpc", label: "Alpha GPC" },
            { id: "vit-tyrosine", label: "Tyrosine" },
            { id: "vit-theanine", label: "L-Theanine" },
        ]
    },
    {
        id: "noon",
        title: "ÖĞLEN",
        icon: "🍽️",
        items: [
            { id: "vit-omega3", label: "Omega 3" },
            { id: "vit-d3k2", label: "D3 K2 Damla" },
            { id: "vit-iron", label: "Demir" },
            { id: "vit-c", label: "C Vitamini" },
            { id: "vit-collagen", label: "Kolajen Şase" },
        ]
    },
    {
        id: "post-workout",
        title: "SPOR SONRASI / ARA ÖĞÜN",
        icon: "💪",
        items: [
            { id: "vit-protein", label: "Protein Tozu" },
            { id: "vit-creatine", label: "Kreatin" },
            { id: "vit-glutamine", label: "Glutamine" },
            { id: "vit-multi", label: "Multi Vitamin" },
            { id: "vit-zma", label: "ZMA" },
        ]
    },
    {
        id: "night",
        title: "GECE",
        icon: "🌙",
        items: [
            { id: "vit-psyllium", label: "Karnıyarık Otu Tozu" },
            { id: "vit-magnesium", label: "Magnezyum" },
            { id: "vit-water", label: "Bol Su" },
        ]
    },
];

export default function VitaminTracker() {
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsClient(true);
        }, 0);
        const dateStr = new Date().toISOString().split("T")[0];
        const saved = localStorage.getItem(`vitamins-v2-${dateStr}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setCompleted(parsed), 0);
            } catch (e) {
                console.error("Failed to parse vitamin state", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const dateStr = new Date().toISOString().split("T")[0];
        localStorage.setItem(`vitamins-v2-${dateStr}`, JSON.stringify(completed));
    }, [completed, isClient]);

    const toggleVitamin = (id: string) => {
        setCompleted((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const allItems = VITAMIN_GROUPS.flatMap(g => g.items);
    const doneCount = allItems.filter(item => completed[item.id]).length;
    const totalCount = allItems.length;
    const isAllComplete = doneCount === totalCount && totalCount > 0;

    if (!isClient) return null;

    return (
        <section className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-text">
                    VİTAMİN TAKİP
                </h2>
                <span className={`text-[10px] font-bold tabular-nums ${isAllComplete ? "text-accent-green" : "text-text-muted"}`}>
                    {doneCount}/{totalCount}
                </span>
            </div>

            <div className="brutalist-card bg-surface border-border flex flex-col space-y-3 p-3">
                {VITAMIN_GROUPS.map((group) => {
                    const groupDone = group.items.filter(item => completed[item.id]).length;
                    const groupTotal = group.items.length;
                    const isGroupComplete = groupDone === groupTotal;

                    return (
                        <div key={group.id} className="space-y-1">
                            {/* Group Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{group.icon}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isGroupComplete ? "text-accent-green" : "text-text"}`}>
                                        {group.title}
                                    </span>
                                    {group.subTitle && (
                                        <span className="text-[9px] text-text-muted">{group.subTitle}</span>
                                    )}
                                </div>
                                <span className={`text-[9px] font-bold tabular-nums ${isGroupComplete ? "text-accent-green" : "text-text-muted"}`}>
                                    {groupDone}/{groupTotal}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="flex flex-wrap gap-1 pl-6">
                                {group.items.map((item) => {
                                    const isOn = !!completed[item.id];
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleVitamin(item.id)}
                                            className={`
                                                flex items-center gap-1.5 px-2 py-1
                                                transition-all duration-200 cursor-pointer
                                                border text-[9px] font-bold
                                                ${isOn 
                                                    ? "border-accent-green/60 bg-accent-green/10 text-accent-green" 
                                                    : "border-border hover:border-text-muted bg-surface/50 text-text-muted hover:text-text"
                                                }
                                            `}
                                        >
                                            <div
                                                className={`
                                                    w-3 h-3 flex-shrink-0 border flex items-center justify-center text-[8px] font-bold
                                                    transition-colors duration-200
                                                    ${isOn 
                                                        ? "bg-accent-green text-black border-accent-green" 
                                                        : "bg-transparent border-border"
                                                    }
                                                `}
                                            >
                                                {isOn ? "✓" : ""}
                                            </div>
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
