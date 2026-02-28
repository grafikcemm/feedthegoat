"use client";

import { useState, useEffect, useMemo } from "react";

type SubTask = {
    id: string;
    text: string;
    completed: boolean;
};

type ActiveTask = {
    id: string;
    title: string;
    is_completed: boolean;
    is_urgent?: boolean;
    priority: "P1" | "P2" | "P3";
    deadline?: string;
    category: "MÜŞTERİ" | "ÖĞRENME" | "SİSTEM" | "LANSMAN";
    subTasks: SubTask[];
    created_at: string;
    completed_at?: string;
};

export default function ActiveTasks() {
    const [tasks, setTasks] = useState<ActiveTask[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form states
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");
    const [newCategory, setNewCategory] = useState<"MÜŞTERİ" | "ÖĞRENME" | "SİSTEM" | "LANSMAN">("SİSTEM");
    const [newDeadline, setNewDeadline] = useState("");

    // Subtask input states keyed by task id
    const [subTaskInputs, setSubTaskInputs] = useState<Record<string, string>>({});

    // Money Tracker State
    const [moneyTracker, setMoneyTracker] = useState<Record<string, boolean>>({});

    // Load Data
    useEffect(() => {
        let loadedTasks: ActiveTask[] = [];
        const savedTasks = localStorage.getItem("goat-active-tasks-v2");
        if (savedTasks) {
            try { loadedTasks = JSON.parse(savedTasks); setTasks(loadedTasks); } catch (e) { }
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
                    category: "ÖĞRENME",
                    subTasks: [],
                    created_at: "2026-02-21T08:58:02.800071+00:00"
                },
                {
                    id: "136a4c51-c229-438f-a540-f4853165202e",
                    title: "Python ile Yapay Zeka 101 - 1. Ders Tamamla!",
                    is_completed: false,
                    priority: "P2",
                    category: "ÖĞRENME",
                    subTasks: [],
                    created_at: "2026-02-22T11:44:36.972526+00:00"
                },
                {
                    id: "f4ee137f-8f3e-434e-bc1f-e3cf6fbd72f1",
                    title: "2026’da Claude Code ile Sıfırdan Zirveye Youtube Kursunu Bitir",
                    is_completed: false,
                    priority: "P1",
                    category: "ÖĞRENME",
                    subTasks: [],
                    created_at: "2026-02-25T18:37:49.571699+00:00"
                },
                {
                    id: "57e92577-6370-433b-adac-7015fe720112",
                    title: "Anasayfa video ve notebookları bitir & weSafe sosyal medya boardu bitir",
                    is_completed: false,
                    priority: "P1",
                    category: "ÖĞRENME",
                    subTasks: [],
                    created_at: "2026-02-27T10:57:59.221605+00:00"
                }
            ];

            // Merge protecting duplicates by ID
            const newTasksMap = new Map();
            oldTasks.forEach(t => newTasksMap.set(t.id, t));
            loadedTasks.forEach(t => newTasksMap.set(t.id, t)); // User's newer edits overwrite

            const combined = Array.from(newTasksMap.values());
            setTasks(combined);
            localStorage.setItem("goat-migrated-supabase", "true");
        }

        const savedMoney = localStorage.getItem("goat-money-tracker");
        if (savedMoney) {
            try { setMoneyTracker(JSON.parse(savedMoney)); } catch (e) { }
        }

        setIsLoaded(true);
    }, []);

    // Save Data
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-active-tasks-v2", JSON.stringify(tasks));
            localStorage.setItem("goat-money-tracker", JSON.stringify(moneyTracker));
        }
    }, [tasks, moneyTracker, isLoaded]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // P1 Limit Check
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
            category: newCategory,
            deadline: newDeadline || undefined,
            subTasks: [],
            created_at: new Date().toISOString()
        };

        setTasks([newTask, ...tasks]);
        setNewTaskTitle("");
        setNewPriority("P2");
        setNewCategory("SİSTEM");
        setNewDeadline("");
    };

    const toggleTask = (id: string, forceComplete?: boolean) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const willComplete = forceComplete !== undefined ? forceComplete : !t.is_completed;
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

    const toggleSubTask = (taskId: string, subTaskId: string) => {
        let allSubsCompletedNow = false;

        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                const newSubs = t.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);

                // Check if this action completes the last subtask
                if (newSubs.length > 0 && newSubs.every(st => st.completed)) {
                    allSubsCompletedNow = true;
                }
                return { ...t, subTasks: newSubs };
            }
            return t;
        }));

        if (allSubsCompletedNow) {
            setTimeout(() => {
                const answer = window.confirm("Tüm alt görevler tamamlandı! Ana görevi de tamamlamak ister misin?");
                if (answer) {
                    toggleTask(taskId, true);
                }
            }, 100);
        }
    };

    const addSubTask = (taskId: string) => {
        const text = subTaskInputs[taskId];
        if (!text || !text.trim()) return;

        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    subTasks: [...t.subTasks, { id: Date.now().toString(), text: text.trim(), completed: false }]
                };
            }
            return t;
        }));

        setSubTaskInputs(prev => ({ ...prev, [taskId]: "" }));
    };

    const deleteTask = (id: string) => {
        if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
        setTasks(tasks.filter(t => t.id !== id));
    };

    // Deadline Helper
    const getDeadlineBadge = (deadline?: string) => {
        if (!deadline) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = new Date(deadline);
        target.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return <span className="bg-accent-red/20 text-accent-red px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">🔴 {Math.abs(diffDays)} GÜN GEÇTİ!</span>;
        if (diffDays === 0) return <span className="bg-accent-red text-black px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider animate-pulse border border-accent-red">⚠️ BUGÜN!</span>;
        if (diffDays <= 3) return <span className="bg-accent-amber/20 text-accent-amber px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">⏰ {diffDays} GÜN KALDI</span>;
        return <span className="bg-surface/50 text-text-[10px] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-text-muted border border-border">📅 {diffDays} GÜN KALDI</span>;
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
            // Sort by creation date if priorities match
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

    // Money Tracker Stats
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local format
    const didMakeMoneyToday = !!moneyTracker[todayStr];

    const weeklyMoneyStats = useMemo(() => {
        let count = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const str = d.toLocaleDateString("en-CA");
            if (moneyTracker[str]) count++;
        }
        return count;
    }, [moneyTracker]);

    const toggleMoney = () => {
        setMoneyTracker(prev => ({ ...prev, [todayStr]: !didMakeMoneyToday }));
    };

    if (!isLoaded) return null;

    return (
        <section className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4 font-mono">
                AKTİF GÖREVLER
            </h2>

            {/* Money Tracker Toggle */}
            <div className={`brutalist-card p-4 mb-6 transition-colors border-2 ${didMakeMoneyToday ? 'border-accent-green bg-accent-green/10' : 'border-accent-red/50 bg-accent-red/5'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-text">
                        Bugün Gelir Üreten Bir İş Yaptın Mı?
                    </span>
                    <button
                        onClick={toggleMoney}
                        className={`px-6 py-2 text-xs font-bold font-mono tracking-widest uppercase transition-colors border-2 ${didMakeMoneyToday ? 'bg-accent-green text-black border-accent-green' : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red hover:text-black'}`}
                    >
                        {didMakeMoneyToday ? 'EVET YAPTIM' : 'HAYIR'}
                    </button>
                </div>
                <div className="text-[10px] text-text-muted mt-2 text-center sm:text-left uppercase tracking-widest">
                    Bu hafta 7 günün <span className={`font-bold ${weeklyMoneyStats > 0 ? 'text-accent-green' : 'text-accent-red'}`}>{weeklyMoneyStats}</span>'inde gelir üreten iş yapıldı.
                </div>
            </div>

            <div className="brutalist-card p-4 space-y-6 bg-surface/10 border-border">

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex flex-col gap-3 p-3 border border-border bg-background/50">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Yeni görev ekle..."
                        className="w-full bg-background brutalist-border px-3 py-2 text-sm font-mono text-text outline-none focus:border-accent-green transition-colors"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as any)}
                            className="bg-background border border-border px-2 py-2 text-xs font-bold text-text outline-none focus:border-accent-green"
                        >
                            <option value="P1">P1 - BUGÜN YAP</option>
                            <option value="P2">P2 - BU HAFTA</option>
                            <option value="P3">P3 - BU AY</option>
                        </select>
                        <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="bg-background border border-border px-2 py-2 text-xs font-bold text-text outline-none focus:border-accent-green"
                        >
                            <option value="MÜŞTERİ">💰 MÜŞTERİ</option>
                            <option value="ÖĞRENME">📚 ÖĞRENME</option>
                            <option value="SİSTEM">🔧 SİSTEM</option>
                            <option value="LANSMAN">🚀 LANSMAN</option>
                        </select>
                        <input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="bg-background border border-border px-2 py-2 text-xs font-bold text-text outline-none focus:border-accent-green uppercase"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskTitle.trim()}
                            className="bg-text text-black px-4 py-2 text-xs font-bold font-mono tracking-widest uppercase hover:bg-text-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto"
                        >
                            EKLE
                        </button>
                    </div>
                </form>

                {/* Active Tasks List */}
                {activeTasksList.length === 0 ? (
                    <div className="text-text-muted text-xs font-mono uppercase tracking-widest py-8 text-center border border-dashed border-border">
                        AKTİF GÖREV BULUNAMADI.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTasksList.map((task) => (
                            <div key={task.id} className={`brutalist-border border-border group overflow-hidden transition-all duration-200 ${task.is_urgent ? "bg-accent-green/5 border-accent-green glow-green" : "bg-surface/20"}`}>
                                <div className="p-3 flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="w-5 h-5 mt-0.5 flex-shrink-0 border-2 border-border flex items-center justify-center text-[10px] font-bold transition-colors bg-transparent text-transparent hover:border-text-muted"
                                    >
                                        ✓
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${PRIORITY_STYLES[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-text/10 text-text">
                                                {task.category}
                                            </span>
                                            {getDeadlineBadge(task.deadline)}

                                            {task.subTasks.length > 0 && (
                                                <span className="text-[9px] ml-auto text-text-muted font-bold tracking-widest">
                                                    {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} ALT
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm md:text-base font-bold text-text break-words ${task.is_urgent ? 'text-accent-green' : (task.priority === 'P1' ? 'text-accent-red' : '')}`}>
                                            {task.title}
                                        </div>
                                    </div>

                                    {/* Urgency Button */}
                                    <button
                                        onClick={(e) => toggleUrgency(task.id, e)}
                                        className={`opacity-0 group-hover:opacity-100 transition-all p-1 mr-1 text-base ${task.is_urgent ? "text-accent-green opacity-100" : "text-text-muted hover:text-accent-green"}`}
                                        title="Acil/Önemli İşaretle"
                                    >
                                        ★
                                    </button>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all p-1 -mr-1 text-xs"
                                        title="Görevi Sil"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Subtasks Area */}
                                <div className="bg-background/30 border-t border-border p-3 pl-11">
                                    <div className="space-y-2 mb-3">
                                        {task.subTasks.map(st => (
                                            <div key={st.id} className="flex items-start gap-2 group/sub">
                                                <button
                                                    onClick={() => toggleSubTask(task.id, st.id)}
                                                    className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 flex items-center justify-center border text-[8px] font-bold transition-colors ${st.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent hover:border-text-muted'}`}
                                                >
                                                    {st.completed && '✓'}
                                                </button>
                                                <span className={`text-[11px] leading-tight ${st.completed ? 'line-through text-text-muted opacity-50' : 'text-text/90'}`}>
                                                    {st.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Alt görev ekle..."
                                            value={subTaskInputs[task.id] || ""}
                                            onChange={(e) => setSubTaskInputs({ ...subTaskInputs, [task.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && addSubTask(task.id)}
                                            className="flex-1 bg-background border border-border px-2 py-1 text-[10px] text-text outline-none focus:border-text-muted transition-colors opacity-50 focus:opacity-100 placeholder:uppercase tracking-wide"
                                        />
                                        <button
                                            onClick={() => addSubTask(task.id)}
                                            className="px-2 py-1 bg-surface border border-border text-[9px] font-bold uppercase tracking-widest text-text-muted hover:text-text hover:bg-surface-hover transition-colors opacity-50 hover:opacity-100"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COMPLETED ARCHIVE */}
            <div className="mt-8 border-t-2 border-dashed border-border/50 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent-green">
                        ✅ Tamamlananlar Arşivi
                    </h3>
                    <span className="text-[9px] text-text-muted uppercase tracking-widest">
                        Bu hafta: {completedTasksList.length} görev
                    </span>
                </div>

                {completedTasksList.length === 0 ? (
                    <div className="text-[10px] text-text-muted uppercase tracking-widest text-center py-4 opacity-50">
                        Son 2 haftaya ait tamamlanmış görev yok.
                    </div>
                ) : (
                    <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                        {completedTasksList.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-2 bg-surface/5 border border-border">
                                <span className="text-accent-green text-[10px] font-bold">✓</span>
                                <span className="text-xs text-text-muted line-through flex-1 truncate">{task.title}</span>
                                <span className="text-[9px] text-text-muted/50 tracking-widest uppercase">
                                    {task.completed_at ? new Date(task.completed_at).toLocaleDateString("tr-TR") : ''}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-text-muted hover:text-accent-red text-xs px-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
