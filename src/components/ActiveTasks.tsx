"use client";

import { useState, useEffect, useMemo } from "react";

type ActiveTask = {
    id: string;
    title: string;
    is_completed: boolean;
    is_urgent?: boolean;
    priority: "P1" | "P2" | "P3";
    created_at: string;
    completed_at?: string;
};

export default function ActiveTasks() {
    const [tasks, setTasks] = useState<ActiveTask[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form states
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");

    // Load Data
    useEffect(() => {
        let loadedTasks: ActiveTask[] = [];
        const savedTasks = localStorage.getItem("goat-active-tasks-v2");
        if (savedTasks) {
            try {
                const parsed = JSON.parse(savedTasks);
                loadedTasks = parsed.map((t: any) => {
                    const { subTasks, category, deadline, ...rest } = t;
                    return rest;
                });
                setTasks(loadedTasks);
            } catch (e) { }
        }

        // One-time migration of old supabase tasks
        const hasMigrated = localStorage.getItem("goat-migrated-supabase");
        if (!hasMigrated) {
            const oldTasks: ActiveTask[] = [
                {
                    id: "b9ed6856-f556-4440-8549-60d2a24fae73",
                    title: "Ana sayfa da bulunan yapay zeka ile reklam görselleri kursunu bitir",
                    is_completed: false,
                    priority: "P2",
                    created_at: "2026-02-21T08:58:02.800071+00:00"
                },
                {
                    id: "136a4c51-c229-438f-a540-f4853165202e",
                    title: "Python ile Yapay Zeka 101 - 1. Ders Tamamla!",
                    is_completed: false,
                    priority: "P2",
                    created_at: "2026-02-22T11:44:36.972526+00:00"
                },
                {
                    id: "f4ee137f-8f3e-434e-bc1f-e3cf6fbd72f1",
                    title: "2026'da Claude Code ile Sıfırdan Zirveye Youtube Kursunu Bitir",
                    is_completed: false,
                    priority: "P1",
                    created_at: "2026-02-25T18:37:49.571699+00:00"
                },
                {
                    id: "57e92577-6370-433b-adac-7015fe720112",
                    title: "Anasayfa video ve notebookları bitir & weSafe sosyal medya boardu bitir",
                    is_completed: false,
                    priority: "P1",
                    created_at: "2026-02-27T10:57:59.221605+00:00"
                }
            ];

            const newTasksMap = new Map();
            oldTasks.forEach(t => newTasksMap.set(t.id, t));
            loadedTasks.forEach(t => newTasksMap.set(t.id, t));

            const combined = Array.from(newTasksMap.values());
            setTasks(combined);
            localStorage.setItem("goat-migrated-supabase", "true");
        }

        setIsLoaded(true);
    }, []);

    // Save Data
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-active-tasks-v2", JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        if (newPriority === "P1") {
            const currentP1s = tasks.filter(t => t.priority === "P1" && !t.is_completed).length;
            if (currentP1s >= 2) {
                alert("Önce mevcut P1 görevlerinden birini bitir veya düşür. (Maksimum 2 adet P1 olabilir)");
                return;
            }
        }

        const newTask: ActiveTask = {
            id: Date.now().toString(),
            title: newTaskTitle.trim(),
            is_completed: false,
            priority: newPriority,
            created_at: new Date().toISOString()
        };

        setTasks([newTask, ...tasks]);
        setNewTaskTitle("");
        setNewPriority("P2");
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const willComplete = !t.is_completed;
                return {
                    ...t,
                    is_completed: willComplete,
                    completed_at: willComplete ? new Date().toISOString() : undefined
                };
            }
            return t;
        }));
    };

    const toggleUrgency = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTasks(tasks.map(t => t.id === id ? { ...t, is_urgent: !t.is_urgent } : t));
    };

    const deleteTask = (id: string) => {
        if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
        setTasks(tasks.filter(t => t.id !== id));
    };

    const PRIORITY_STYLES = {
        "P1": "border-accent-red text-accent-red bg-accent-red/10",
        "P2": "border-accent-amber text-accent-amber bg-accent-amber/5",
        "P3": "border-border text-text-muted bg-surface/30"
    };

    const activeTasksList = useMemo(() => {
        const active = tasks.filter(t => !t.is_completed);
        return active.sort((a, b) => {
            const pOrder = { "P1": 1, "P2": 2, "P3": 3 };
            if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [tasks]);

    const completedTasksList = useMemo(() => {
        const completed = tasks.filter(t => t.is_completed);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        return completed.filter(t => {
            if (!t.completed_at) return true;
            return new Date(t.completed_at) >= twoWeeksAgo;
        }).sort((a, b) => {
            const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
            const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
            return timeB - timeA;
        });
    }, [tasks]);

    if (!isLoaded) return null;

    return (
        <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4 font-mono">
                AKTİF GÖREVLER
            </h2>

            <div className="brutalist-card p-4 space-y-4 bg-surface/10 border-border">

                {/* Simplified Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2 items-center">
                    <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="bg-background border border-border px-2 py-2 text-[10px] font-bold text-text outline-none focus:border-accent-green uppercase tracking-wider"
                    >
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                    </select>
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Yeni görev ekle..."
                        className="flex-1 bg-background border border-border px-3 py-2 text-sm font-mono text-text outline-none focus:border-accent-green transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim()}
                        className="bg-text text-black px-4 py-2 text-[10px] font-bold font-mono tracking-widest uppercase hover:bg-text-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        EKLE
                    </button>
                </form>

                {/* Active Tasks List */}
                {activeTasksList.length === 0 ? (
                    <div className="text-text-muted text-xs font-mono uppercase tracking-widest py-6 text-center border border-dashed border-border">
                        AKTİF GÖREV BULUNAMADI.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activeTasksList.map((task) => (
                            <div key={task.id} className={`brutalist-border border-border group overflow-hidden transition-all duration-200 p-3 flex items-center gap-3 ${task.is_urgent ? "bg-accent-green/5 border-accent-green glow-green" : "bg-surface/20"}`}>
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="w-4 h-4 flex-shrink-0 border-2 border-border flex items-center justify-center text-[9px] font-bold transition-colors bg-transparent text-transparent hover:border-text-muted"
                                >
                                    ✓
                                </button>

                                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                                    {task.priority}
                                </span>

                                <span className={`text-sm font-bold text-text flex-1 min-w-0 truncate ${task.is_urgent ? 'text-accent-green' : (task.priority === 'P1' ? 'text-accent-red' : '')}`}>
                                    {task.title}
                                </span>

                                <button
                                    onClick={(e) => toggleUrgency(task.id, e)}
                                    className={`opacity-0 group-hover:opacity-100 transition-all p-1 text-base shrink-0 ${task.is_urgent ? "text-accent-green opacity-100" : "text-text-muted hover:text-accent-green"}`}
                                    title="Acil/Önemli İşaretle"
                                >
                                    ★
                                </button>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all p-1 text-xs shrink-0"
                                    title="Görevi Sil"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COMPLETED ARCHIVE */}
            {completedTasksList.length > 0 && (
                <div className="mt-4 border-t border-dashed border-border/50 pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent-green">
                            ✅ Tamamlananlar
                        </h3>
                        <span className="text-[9px] text-text-muted uppercase tracking-widest">
                            {completedTasksList.length} görev
                        </span>
                    </div>
                    <div className="space-y-1 opacity-50 hover:opacity-100 transition-opacity">
                        {completedTasksList.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 p-1.5 bg-surface/5 border border-border">
                                <span className="text-accent-green text-[10px] font-bold">✓</span>
                                <span className="text-[11px] text-text-muted line-through flex-1 truncate">{task.title}</span>
                                <span className="text-[9px] text-text-muted/50 tracking-widest">
                                    {task.completed_at ? new Date(task.completed_at).toLocaleDateString("tr-TR") : ''}
                                </span>
                                <button onClick={() => deleteTask(task.id)} className="text-text-muted hover:text-accent-red text-xs px-1">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
