"use client";

import { useState, useEffect, useMemo } from "react";

type Level = "NotStarted" | "Learning" | "Applying" | "Selling";

const LEVELS: Level[] = ["NotStarted", "Learning", "Applying", "Selling"];

const LEVEL_CONFIG: Record<Level, { label: string; short: string; bg: string; text: string; border: string; dot: string }> = {
    NotStarted: { label: "Başlamadım", short: "—", bg: "bg-red-500/8", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-500" },
    Learning: { label: "Öğreniyorum", short: "ÖĞR", bg: "bg-yellow-500/8", text: "text-yellow-400", border: "border-yellow-500/20", dot: "bg-yellow-500" },
    Applying: { label: "Uyguluyorum", short: "UYG", bg: "bg-green-500/8", text: "text-green-400", border: "border-green-500/20", dot: "bg-green-500" },
    Selling: { label: "Satabiliyorum", short: "SAT", bg: "bg-cyan-400/10", text: "text-cyan-400", border: "border-cyan-400/30", dot: "bg-cyan-400" },
};

interface Skill {
    id: string;
    name: string;
    level: Level;
    note?: string;
}

const DEFAULT_SKILLS: Skill[] = [
    { id: "s1", name: "Prompt Engineering — Stratejik Seviye", level: "Learning" },
    { id: "s2", name: "JavaScript + Python", level: "NotStarted" },
    { id: "s3", name: "N8N Otomasyonları", level: "Applying" },
    { id: "s4", name: "Vibe Coding + Cursor", level: "NotStarted" },
    { id: "s5", name: "AI Agents Mimarisi", level: "NotStarted" },
    { id: "s6", name: "UI/UX Design (Figma, Framer, Lovable)", level: "Learning" },
    { id: "s7", name: "Motion Design (After Effects)", level: "NotStarted", note: "ERTELENEBİLİR — Ay 6+" },
    { id: "s8", name: "Growth Marketing & Pricing", level: "Learning", note: "ÖNCELİKLİ" },
    { id: "s9", name: "Marka İletişimi & Satış", level: "Learning", note: "ÖNCELİKLİ" },
    { id: "s10", name: "AI Content Multiplier", level: "NotStarted", note: "monetizasyon alt görevi eklendi" },
    { id: "s11", name: "AI Güvenliği & Etik", level: "NotStarted" },
    { id: "s12", name: "Data Storytelling", level: "NotStarted" },
    { id: "s13", name: "AI Literacy Eğitim Tasarımı", level: "NotStarted" },
    { id: "s14", name: "AI Workflow Denetim", level: "NotStarted" },
    { id: "s15", name: "Arts & Media AI Stratejisi", level: "Learning" },
];

const migrateSkills = (oldSkills: Skill[]): Skill[] => {
    const oldMap = new Map(oldSkills.map(s => [s.id, s]));
    return DEFAULT_SKILLS.map(defaultSkill => {
        const existing = oldMap.get(defaultSkill.id);
        if (existing) {
            return { ...defaultSkill, level: existing.level, note: defaultSkill.note || existing.note };
        }
        return { ...defaultSkill };
    });
};

export default function SkillTree() {
    const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedV2 = localStorage.getItem("goat-skills-v2");
        const savedV1 = localStorage.getItem("goat-skills-v1");

        if (savedV2) {
            try {
                setSkills(migrateSkills(JSON.parse(savedV2)));
            } catch { console.error("Failed to parse SkillTree v2"); }
        } else if (savedV1) {
            try {
                setSkills(migrateSkills(JSON.parse(savedV1)));
            } catch { console.error("Failed to parse SkillTree v1"); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("goat-skills-v2", JSON.stringify(skills));
    }, [skills, isLoaded]);

    const cycleLevel = (id: string) => {
        setSkills(prev => prev.map(s => {
            if (s.id !== id) return s;
            const nextIdx = (LEVELS.indexOf(s.level) + 1) % LEVELS.length;
            return { ...s, level: LEVELS[nextIdx] };
        }));
    };

    // Stats
    const stats = useMemo(() => {
        const counts = { NotStarted: 0, Learning: 0, Applying: 0, Selling: 0 };
        skills.forEach(s => counts[s.level]++);
        return counts;
    }, [skills]);

    const progressPct = useMemo(() => {
        const maxScore = skills.length * 3; // Selling = 3 points
        const current = skills.reduce((sum, s) => sum + LEVELS.indexOf(s.level), 0);
        return Math.round((current / maxScore) * 100);
    }, [skills]);

    if (!isLoaded) return null;

    return (
        <section className="mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-text">
                    Skill Tree — Seviye Haritan
                </h2>
                <span className="text-[10px] text-text-muted uppercase tracking-widest">
                    {skills.length} Beceri
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 border border-border bg-surface p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">
                        Genel İlerleme
                    </span>
                    <span className="text-xs font-bold text-text tabular-nums">
                        %{progressPct}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-background border border-border overflow-hidden">
                    <div
                        className="h-full transition-all duration-700 ease-out"
                        style={{
                            width: `${progressPct}%`,
                            background: progressPct < 30
                                ? '#FF3B3B'
                                : progressPct < 60
                                    ? 'linear-gradient(90deg, #FFB800, #FF8C00)'
                                    : 'linear-gradient(90deg, #00FF88, #22C55E)',
                        }}
                    />
                </div>

                {/* Level Stats */}
                <div className="flex gap-3 mt-2.5 flex-wrap">
                    {(["Selling", "Applying", "Learning", "NotStarted"] as Level[]).map(level => {
                        const cfg = LEVEL_CONFIG[level];
                        const count = stats[level];
                        return (
                            <div key={level} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${cfg.text}`}>
                                    {count}
                                </span>
                                <span className="text-[8px] uppercase tracking-widest text-text-muted">
                                    {cfg.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Skills List */}
            <div className="space-y-1">
                {skills.map((skill, idx) => {
                    const cfg = LEVEL_CONFIG[skill.level];
                    const isPriority = skill.note === "ÖNCELİKLİ";
                    const isDelayed = skill.note?.includes("ERTELENEBİLİR");

                    return (
                        <div
                            key={skill.id}
                            onClick={() => cycleLevel(skill.id)}
                            role="button"
                            tabIndex={0}
                            className={`
                                group flex items-center gap-3 px-3 py-2.5 border cursor-pointer
                                transition-all duration-200
                                ${isDelayed
                                    ? "opacity-50 hover:opacity-80 border-border bg-surface/5"
                                    : isPriority
                                        ? `border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10`
                                        : `border-border hover:border-text-muted/30 bg-surface/10 hover:bg-surface-hover`
                                }
                            `}
                        >
                            {/* Index */}
                            <span className="text-[9px] text-text-muted/40 tabular-nums w-4 text-right shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                            </span>

                            {/* Level Dot */}
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} transition-colors`} />

                            {/* Skill Name */}
                            <span className={`flex-1 text-[11px] font-bold uppercase tracking-wider ${isDelayed ? "text-text-muted" : "text-text"} truncate`}>
                                {skill.name}
                                {isPriority && <span className="text-amber-400 ml-1.5">⚡</span>}
                            </span>

                            {/* Note (if exists and not priority marker) */}
                            {skill.note && !isPriority && (
                                <span className="text-[8px] uppercase tracking-widest text-text-muted/60 hidden sm:inline shrink-0">
                                    {skill.note}
                                </span>
                            )}

                            {/* Level Badge */}
                            <span className={`
                                text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border shrink-0
                                ${cfg.bg} ${cfg.text} ${cfg.border}
                            `}>
                                {cfg.short === "—" ? "—" : cfg.short}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
