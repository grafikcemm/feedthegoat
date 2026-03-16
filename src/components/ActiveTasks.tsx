"use client";

import { useState, useEffect, useMemo } from "react";

type Quadrant = "MIND" | "BODY" | "SPIRIT" | "VOCATION";

type ActiveTask = {
    id: string;
    title: string;
    is_completed: boolean;
    is_urgent?: boolean;
    priority: "P1" | "P2" | "P3";
    quadrant: Quadrant;
    created_at: string;
    completed_at?: string;
};

const QUADRANT_STYLES: Record<Quadrant, { border: string; color: string; bg: string; label: string }> = {
    MIND: { border: "border-blue-500", color: "text-blue-500", bg: "bg-blue-500/10", label: "🧠 ZİHİN" },
    BODY: { border: "border-green-500", color: "text-green-500", bg: "bg-green-500/10", label: "💪 BEDEN" },
    SPIRIT: { border: "border-purple-500", color: "text-purple-500", bg: "bg-purple-500/10", label: "🔮 RUH" },
    VOCATION: { border: "border-orange-500", color: "text-orange-500", bg: "bg-orange-500/10", label: "⚡ İŞ/KARİYER" },
};



// Default quadrant mappings for existing tasks
const TASK_QUADRANT_MAP: Record<string, Quadrant> = {
    "Python ile Yapay Zeka 101": "MIND",
    "Claude Code": "MIND",
    "Behance": "VOCATION",
    "Ajans mail": "VOCATION",
    "Gym": "BODY",
    "Spor": "BODY",
    "Kitap": "MIND",
    "kitap": "MIND",
    "Twitter": "VOCATION",
    "Lead Gen": "VOCATION",
    "weSafe": "VOCATION",
    "reklam görselleri": "MIND",
    "video": "VOCATION",
    "notebookları": "VOCATION",
};

const guessQuadrant = (title: string): Quadrant => {
    for (const [keyword, quadrant] of Object.entries(TASK_QUADRANT_MAP)) {
        if (title.toLowerCase().includes(keyword.toLowerCase())) return quadrant;
    }
    return "VOCATION";
};

interface ActiveTasksProps {
    activeQuadrantFilter?: Quadrant | null;
}

export default function ActiveTasks({ activeQuadrantFilter }: ActiveTasksProps) {
    const [tasks, setTasks] = useState<ActiveTask[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form states
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");
    const [newQuadrant] = useState<Quadrant>("VOCATION");

    // Load Data with migration
    useEffect(() => {
        let loadedTasks: ActiveTask[] = [];
        const savedTasks = localStorage.getItem("goat-active-tasks-v2");
        if (savedTasks) {
            try {
                const parsed = JSON.parse(savedTasks);
                loadedTasks = parsed.map((t: ActiveTask & { subTasks?: unknown, category?: unknown, deadline?: unknown }) => {
                    const mapped = { ...t };
                    delete mapped.subTasks;
                    delete mapped.category;
                    delete mapped.deadline;
                    // Migrate: add quadrant if missing
                    if (!mapped.quadrant) {
                        mapped.quadrant = guessQuadrant(mapped.title || "");
                    }
                    return mapped;
                });
            } catch { }
        }

        // One-time migration (v4 = full task restore from screenshot)
        const hasMigrated = localStorage.getItem("goat-migrated-supabase-v4");
        if (!hasMigrated) {
            const oldTasks: ActiveTask[] = [
                {
                    id: "t-grafikcem-reels",
                    title: "Grafikcem reels çekimlerini & editlerini yap - Yeni insta profil fotoğrafı, diğer ayarlar (tiktok, içerik planı)",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P1",
                    quadrant: "VOCATION",
                    created_at: "2026-03-01T09:00:00.000Z"
                },
                {
                    id: "t-ceren-8mart",
                    title: "Ceren 8 Mart videosunu tamamla & Esline Güzellik işlerine başlangıç yap",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P1",
                    quadrant: "VOCATION",
                    created_at: "2026-03-02T09:00:00.000Z"
                },
                {
                    id: "t-python-4",
                    title: "(Pazar) Python ile Yapay Zeka 101 - 4. Ders",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P2",
                    quadrant: "MIND",
                    created_at: "2026-03-03T09:00:00.000Z"
                },
                {
                    id: "t-python-3",
                    title: "(Pazar) Python ile Yapay Zeka 101 - 3. Ders",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P2",
                    quadrant: "MIND",
                    created_at: "2026-03-03T08:00:00.000Z"
                },
                {
                    id: "t-python-2",
                    title: "(Cumartesi) Python ile Yapay Zeka 101 - 2. Ders",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P2",
                    quadrant: "MIND",
                    created_at: "2026-03-02T08:00:00.000Z"
                },
                {
                    id: "t-python-1",
                    title: "(Cumartesi) Python ile Yapay Zeka 101 - 1. Ders",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P2",
                    quadrant: "MIND",
                    created_at: "2026-03-01T08:00:00.000Z"
                },
                {
                    id: "t-ingilizce-rutin",
                    title: "İngilizceyi günlük rutin olarak sistem haline sokacak güncellemeleri yap ve günlük rutin olarak ekle",
                    is_completed: false,
                    is_urgent: true,
                    priority: "P3",
                    quadrant: "MIND",
                    created_at: "2026-03-01T07:00:00.000Z"
                },
                {
                    id: "t-behance-portfolio",
                    title: "Behance portfolyonu güncel tutmaya odaklı planlama yap ve ajanslara mail yollamak için planlama yap",
                    is_completed: false,
                    priority: "P3",
                    quadrant: "VOCATION",
                    created_at: "2026-03-01T06:00:00.000Z"
                },
                {
                    id: "b9ed6856-f556-4440-8549-60d2a24fae73",
                    title: "Ana sayfa da bulunan yapay zeka ile reklam görselleri kursunu bitir",
                    is_completed: false,
                    priority: "P3",
                    quadrant: "MIND",
                    created_at: "2026-02-21T08:58:02.800071+00:00"
                },
                {
                    id: "t-wesafe-tamamla",
                    title: "weSafe projesini tamamla",
                    is_completed: false,
                    priority: "P3",
                    quadrant: "VOCATION",
                    created_at: "2026-02-27T10:57:59.221605+00:00"
                }
            ];

            const newTasksMap = new Map();
            oldTasks.forEach(t => newTasksMap.set(t.id, t));
            loadedTasks.forEach(t => newTasksMap.set(t.id, t));
            loadedTasks = Array.from(newTasksMap.values()) as ActiveTask[];
            localStorage.setItem("goat-migrated-supabase-v4", "true");
        }

        // Set tasks and mark as loaded in same batch to avoid race condition
        setTimeout(() => {
            setTasks(loadedTasks);
            setIsLoaded(true);
        }, 0);
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
            quadrant: newQuadrant,
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

    const deleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const PRIORITY_STYLES = {
        "P1": "border-accent-red text-accent-red",
        "P2": "border-accent-amber text-accent-amber",
        "P3": "border-border text-text-muted"
    };

    const PRIORITY_LEFT_BORDER = {
        "P1": "#FF3B3B",
        "P2": "#FFB800",
        "P3": "#444444"
    };

    const PRIORITY_BG = {
        "P1": "#1A0808",
        "P2": "#1A1200",
        "P3": "transparent"
    };

    const activeTasksList = useMemo(() => {
        let active = tasks.filter(t => !t.is_completed);
        // Apply quadrant filter if active
        if (activeQuadrantFilter) {
            active = active.filter(t => t.quadrant === activeQuadrantFilter);
        }
        return active.sort((a, b) => {
            const pOrder = { "P1": 1, "P2": 2, "P3": 3 };
            if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [tasks, activeQuadrantFilter]);

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
            <div 
                className="flex items-center justify-between mb-4 px-3 py-2 -mx-1"
                style={{ backgroundColor: "#0F0F1A" }}
            >
                <h2 className="text-xs uppercase tracking-[0.25em] text-text font-mono font-bold">
                    ⚡ AKTİF GÖREVLER
                </h2>
            </div>

            <div className="brutalist-card p-4 space-y-4 bg-surface/10 border-border">

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2 items-center flex-wrap">
                    <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as "P1" | "P2" | "P3")}
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
                        className="flex-1 bg-background border border-border px-3 py-2 text-sm font-mono text-text outline-none focus:border-accent-green transition-colors min-w-[150px]"
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
                        {activeQuadrantFilter
                            ? `${QUADRANT_STYLES[activeQuadrantFilter].label} QUADRANT'INDA AKTİF GÖREV YOK.`
                            : "AKTİF GÖREV BULUNAMADI."}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activeTasksList.map((task) => {
                            return (
                                <div 
                                    key={task.id} 
                                    className={`brutalist-border border-border group overflow-hidden transition-all duration-200 p-3 flex items-center gap-3 ${task.is_urgent ? "border-accent-green glow-green" : ""}`}
                                    style={{
                                        borderLeftWidth: "3px",
                                        borderLeftColor: PRIORITY_LEFT_BORDER[task.priority],
                                        backgroundColor: task.is_urgent ? "rgba(0, 255, 136, 0.05)" : PRIORITY_BG[task.priority]
                                    }}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="w-4 h-4 shrink-0 border-2 border-border flex items-center justify-center text-[9px] font-bold transition-colors bg-transparent text-transparent hover:border-text-muted"
                                    >
                                        ✓
                                    </button>

                                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                                        {task.priority}
                                    </span>

                                    <span 
                                        className={`text-sm text-text flex-1 min-w-0 truncate ${task.is_urgent ? 'text-accent-green' : (task.priority === 'P1' ? 'text-accent-red' : '')}`}
                                        style={{ fontWeight: 600 }}
                                    >
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
                                        onClick={(e) => deleteTask(task.id, e)}
                                        className="text-text-muted hover:text-accent-red transition-all p-1.5 text-xs shrink-0"
                                        title="Görevi Sil"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
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
                                <button onClick={(e) => deleteTask(task.id, e)} className="text-text-muted hover:text-accent-red text-xs px-1">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
