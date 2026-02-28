"use client";

import { useState, useMemo } from "react";

type Level = "NotStarted" | "Learning" | "Applying" | "Selling";

const LEVEL_MAP: Record<Level, { label: string; icon: string; color: string }> = {
    NotStarted: { label: "Başlamadım", icon: "🔴", color: "text-red-500" },
    Learning: { label: "Öğreniyorum", icon: "🟡", color: "text-yellow-500" },
    Applying: { label: "Uygulayabiliyorum", icon: "🟢", color: "text-green-500" },
    Selling: { label: "Satabiliyorum", icon: "💎", color: "text-cyan-400" },
};

interface Skill {
    id: string;
    name: string;
    level: Level;
}

const DEFAULT_SKILLS: Skill[] = [
    { id: "s1", name: "Prompt Engineering — Stratejik Seviye", level: "Learning" },
    { id: "s2", name: "JavaScript + Python", level: "NotStarted" },
    { id: "s3", name: "N8N Otomasyonları", level: "Applying" },
    { id: "s4", name: "Vibe Coding + Cursor", level: "NotStarted" },
    { id: "s5", name: "AI Agents Mimarisi", level: "NotStarted" },
    { id: "s6", name: "UI/UX Design (Figma, Framer, Lovable)", level: "Learning" },
    { id: "s7", name: "Motion Design (After Effects)", level: "NotStarted" },
    { id: "s8", name: "Growth Marketing & Pricing", level: "Learning" },
    { id: "s9", name: "Marka İletişimi & Satış", level: "Learning" },
    { id: "s10", name: "AI Content Multiplier", level: "NotStarted" }
];

export default function SkillTree() {
    const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleLevel = (id: string) => {
        setSkills(prev => prev.map(s => {
            if (s.id !== id) return s;
            const order: Level[] = ["NotStarted", "Learning", "Applying", "Selling"];
            const nextIdx = (order.indexOf(s.level) + 1) % order.length;
            return { ...s, level: order[nextIdx] };
        }));
    };

    const sellingCount = useMemo(() => skills.filter(s => s.level === "Selling").length, [skills]);
    const total = skills.length;

    return (
        <section className="mb-8 mt-8">
            <div
                className="flex items-center justify-between border border-border bg-surface/10 p-3 brutalist-card cursor-pointer hover:bg-surface/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-text-muted text-xs font-mono">{isExpanded ? '▼' : '▶'}</span>
                    <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
                        Skill Tree — Seviye Haritan
                    </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    <span className={sellingCount > 0 ? "text-cyan-400" : ""}>{sellingCount}</span>/{total} Satılabilir
                </span>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {skills.map(s => {
                        const l = LEVEL_MAP[s.level];
                        const isSelling = s.level === "Selling";
                        return (
                            <button
                                key={s.id}
                                onClick={() => toggleLevel(s.id)}
                                className={`w-full text-left brutalist-card p-2 flex justify-between items-center transition-all duration-300 ${isSelling
                                    ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                                    : "border-border hover:bg-surface-hover hover:border-text-muted bg-surface/20"
                                    }`}
                            >
                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider truncate mr-2 ${isSelling ? "text-cyan-400" : "text-text"}`} title={s.name}>
                                    {s.name}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                    <span className={`text-[9px] hidden sm:inline uppercase tracking-widest font-bold ${l.color}`}>
                                        {l.label}
                                    </span>
                                    <span className="text-sm">{l.icon}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </section>
    );
}
