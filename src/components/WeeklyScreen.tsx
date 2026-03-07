"use client";

import { useState, useEffect } from "react";

export default function WeeklyScreen() {
    const [focus, setFocus] = useState("");
    const [weeklyTasks, setWeeklyTasks] = useState([
        { id: "wt-1", text: "CUMARTESİ VEYA PAZAR NEO SKALA 1 KURS", icon: "🎓", done: false },
        { id: "wt-2", text: "MÜSAİT OLDUKÇA GÖNENÇ AKADEMİ'DEN VİDEOLAR İZLE KİŞİSEL GELİŞİME DEVAM ET", icon: "🧠", done: false }
    ]);

    useEffect(() => {
        const saved = localStorage.getItem("goat-weekly-v1");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Simple Monday reset logic
                const lastSavedDate = new Date(parsed.lastUpdated || Date.now());
                const now = new Date();
                
                // If it's Monday and the last saved date wasn't today, reset it automatically
                // A better approach would be to check if we crossed a Monday since last save,
                // but this is a simple check. If we are in a new week, clear.
                const resetMs = 1000 * 60 * 60 * 24 * 7; // 1 week
                const isNewWeek = now.getTime() - lastSavedDate.getTime() > resetMs || 
                                 (now.getDay() === 1 && lastSavedDate.getDay() !== 1);

                if (!isNewWeek) {
                    setTimeout(() => {
                        setFocus(parsed.focus || "");
                        if (parsed.weeklyTasks) {
                            setWeeklyTasks(parsed.weeklyTasks);
                        }
                    }, 0);
                }
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("goat-weekly-v1", JSON.stringify({
            focus, weeklyTasks, lastUpdated: new Date().toISOString()
        }));
    }, [focus, weeklyTasks]);

    const toggleWeeklyTask = (id: string) => {
        setWeeklyTasks(weeklyTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const doneCount = weeklyTasks.filter(t => t.done).length;

    return (
        <section className="space-y-8 animate-in fade-in duration-300">
            {/* Alan 1: Haftanın Odağı */}
            <div className="brutalist-card p-4 border border-border bg-surface/10">
                <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-accent-red mb-2">
                    ALAN 1: HAFTANIN ODAĞI
                </label>
                <input
                    type="text"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="Bu hafta neyin etrafında şekilleniyor?"
                    className="w-full bg-background border px-4 py-3 text-sm md:text-base font-bold text-text outline-none focus:border-accent-red transition-colors placeholder:text-text-muted/50"
                />
            </div>

            {/* Haftalık Takip */}
            <div className="brutalist-card p-4 border border-border bg-surface/10">
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">
                        HAFTALIK TAKİP
                    </label>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">{doneCount}/{weeklyTasks.length}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weeklyTasks.map(task => (
                        <div 
                            key={task.id}
                            onClick={() => toggleWeeklyTask(task.id)}
                            className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                                task.done 
                                    ? "border-text bg-surface/5" 
                                    : "border-border bg-surface/20 hover:border-text-muted"
                            }`}
                        >
                            <div className={`w-6 h-6 shrink-0 flex items-center justify-center border-2 transition-colors mt-0.5 ${
                                task.done 
                                    ? "border-text bg-text text-background" 
                                    : "border-border bg-transparent text-transparent"
                            }`}>
                                <span className="text-sm font-bold">✓</span>
                            </div>
                            <div className="flex-1 flex gap-2">
                                <span className="shrink-0">{task.icon}</span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold leading-relaxed ${task.done ? 'line-through text-text-muted opacity-70' : 'text-text'}`}>
                                    {task.text}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
