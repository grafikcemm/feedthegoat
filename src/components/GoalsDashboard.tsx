"use client";

import { useState, useEffect } from "react";
import goalsDataRaw from "@/data/goals.json";

// --- Types ---
type ItemStatus = 'ACTIVE' | 'IN_PROGRESS' | 'LOCKED' | 'COMPLETED';
type Level = "NotStarted" | "Learning" | "Applying" | "Selling";

interface SubTask {
    id: string;
    text: string;
    completed: boolean;
}

interface GoalItemContent {
    id: string;
    text: string;
    status: ItemStatus;       // Detailed
    subTasks: SubTask[];      // Detailed
    completedDate?: string;   // Detailed
    preReq?: string;          // Detailed
    level: Level;             // Levels
    completed: boolean;       // Checkbox
}

interface Goal {
    id: string;
    title: string;
    affirmation: string;
    items: GoalItemContent[];
    type: "detailed" | "levels" | "checkbox";
}

// --- Maps ---
const STATUS_MAP: Record<ItemStatus, { label: string; color: string; border: string; bg: string }> = {
    ACTIVE: { label: "🔴 AKTİF", color: "text-accent-red", border: "border-accent-red", bg: "bg-accent-red/10" },
    IN_PROGRESS: { label: "🟡 DEVAM EDİYOR", color: "text-accent-amber", border: "border-accent-amber", bg: "bg-accent-amber/10" },
    LOCKED: { label: "⏳ SIRADA / KİLİTLİ", color: "text-text-muted", border: "border-border", bg: "bg-surface/20" },
    COMPLETED: { label: "✅ TAMAMLANDI", color: "text-accent-green", border: "border-accent-green", bg: "bg-accent-green/5" },
};

const LEVEL_MAP: Record<Level, { label: string; icon: string; color: string }> = {
    NotStarted: { label: "Başlamadım", icon: "🔴", color: "text-red-500" },
    Learning: { label: "Öğreniyorum", icon: "🟡", color: "text-yellow-500" },
    Applying: { label: "Uygulayabiliyorum", icon: "🟢", color: "text-green-500" },
    Selling: { label: "Satabiliyorum", icon: "💎", color: "text-cyan-400" },
};

export default function GoalsDashboard() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<number>(Date.now());
    const [subTaskInputs, setSubTaskInputs] = useState<Record<string, string>>({}); // local state for inputs
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedGoals = localStorage.getItem("goat-goals-v3");
        const savedStart = localStorage.getItem("goat-goals-start");

        if (savedStart) {
            setStartDate(parseInt(savedStart, 10));
        } else {
            localStorage.setItem("goat-goals-start", Date.now().toString());
        }

        if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
        } else {
            // Initial data structure creation
            const initialGoals: Goal[] = goalsDataRaw.map((goal: any, index: number) => {
                let type: "detailed" | "levels" | "checkbox" = "checkbox";
                if (index === 0) type = "detailed";
                else if (index === 1) type = "levels";

                const items: GoalItemContent[] = goal.items.map((itemObj: any, iIndex: number) => {
                    const itemText = itemObj.text;
                    // Extract exact name for prereq matching
                    const cleanText = itemText.split("—")[0].split("(")[0].trim();
                    const preReqText = index === 0 && iIndex > 0 ? goal.items[iIndex - 1].text.split("—")[0].split("(")[0].trim() : undefined;

                    const initialSubTasks = (itemObj.subTasks || []).map((st: string, stIdx: number) => ({
                        id: `st-${index}-${iIndex}-${stIdx}-${Date.now()}`,
                        text: st,
                        completed: false
                    }));

                    return {
                        id: `g${index}-i${iIndex}`,
                        text: itemText,
                        status: "LOCKED",
                        subTasks: initialSubTasks,
                        level: "NotStarted",
                        completed: false,
                        preReq: preReqText
                    };
                });

                if (type === "detailed" && items.length > 0) items[0].status = "ACTIVE";

                return {
                    id: `g${index}`,
                    title: goal.title,
                    affirmation: goal.affirmation,
                    items,
                    type
                };
            });
            setGoals(initialGoals);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded && goals.length > 0) {
            localStorage.setItem("goat-goals-v3", JSON.stringify(goals));
        }
    }, [goals, isLoaded]);

    if (!isLoaded) return null;

    const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;
    const closeModal = () => setSelectedGoalId(null);

    // --- Updaters ---
    const updateGoalItem = (goalId: string, itemId: string, updates: Partial<GoalItemContent>) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                items: g.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
            };
        }));
    };

    // --- Handlers for Detailed Panel ---
    const toggleStatus = (goalId: string, item: GoalItemContent) => {
        const order: ItemStatus[] = ['LOCKED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED'];
        const nextIdx = (order.indexOf(item.status) + 1) % order.length;
        const nextStatus = order[nextIdx];

        let completedDate = item.completedDate;
        if (nextStatus === 'COMPLETED') {
            completedDate = new Date().toLocaleDateString("tr-TR");
        } else if (item.status === 'COMPLETED') {
            completedDate = undefined;
        }

        updateGoalItem(goalId, item.id, { status: nextStatus, completedDate });
    };

    const addSubTask = (goalId: string, item: GoalItemContent) => {
        const text = subTaskInputs[item.id] || "";
        if (!text.trim()) return;

        updateGoalItem(goalId, item.id, {
            subTasks: [...item.subTasks, { id: Date.now().toString(), text: text.trim(), completed: false }]
        });
        setSubTaskInputs(prev => ({ ...prev, [item.id]: "" }));
    };

    const toggleSubTask = (goalId: string, item: GoalItemContent, subTaskId: string) => {
        const targetSubTask = item.subTasks.find(st => st.id === subTaskId);
        const willComplete = targetSubTask ? !targetSubTask.completed : false;

        const newSubTasks = item.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);
        updateGoalItem(goalId, item.id, { subTasks: newSubTasks });

        // Dopamine Bonus
        const currentBonus = parseFloat(localStorage.getItem("goat-bonus-dopamine") || "0");
        const newBonus = willComplete ? currentBonus + 1 : Math.max(0, currentBonus - 1);
        localStorage.setItem("goat-bonus-dopamine", newBonus.toString());
        window.dispatchEvent(new Event("dopamineUpdated"));
    };

    const removeSubTask = (goalId: string, item: GoalItemContent, subTaskId: string) => {
        updateGoalItem(goalId, item.id, { subTasks: item.subTasks.filter(st => st.id !== subTaskId) });
    };

    // --- Handlers for Level Panel ---
    const toggleLevel = (goalId: string, item: GoalItemContent) => {
        const order: Level[] = ["NotStarted", "Learning", "Applying", "Selling"];
        const nextIdx = (order.indexOf(item.level) + 1) % order.length;
        updateGoalItem(goalId, item.id, { level: order[nextIdx] });
    };

    // --- Helpers ---
    const calculateMonthsAndDaysRemaining = () => {
        const targetDate = new Date(startDate);
        targetDate.setMonth(targetDate.getMonth() + 6);

        const now = new Date();
        const diffMs = targetDate.getTime() - now.getTime();
        if (diffMs <= 0) return "Süre Doldu";

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;

        if (months > 0) return `${months} Ay ${days} Gün`;
        return `${days} Gün`;
    };


    const renderDetailedPanel = (g: Goal) => {
        const completedCount = g.items.filter(i => i.status === 'COMPLETED').length;
        const totalCount = g.items.length;
        const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

        // Find Focus
        let focusItem = null;
        let focusSubTask = null;
        const activeItem = g.items.find(i => i.status === 'ACTIVE' || i.status === 'IN_PROGRESS');
        if (activeItem) {
            focusItem = activeItem;
            focusSubTask = activeItem.subTasks.find(st => !st.completed);
        }

        return (
            <div className="space-y-6">
                {/* General Progress Bar */}
                <div className="brutalist-card p-4 border border-border bg-surface/10">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-text">Genel İlerleme</span>
                        <div className="text-right">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted block">Kalan Süre: <span className="text-accent-red font-bold">{calculateMonthsAndDaysRemaining()}</span></span>
                            <span className="text-sm font-bold text-accent-green">{completedCount}/{totalCount} Tamamlandı</span>
                        </div>
                    </div>
                    <div className="h-2 bg-surface border border-border w-full relative overflow-hidden">
                        <div className="h-full bg-accent-green transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                {/* Focus of the week */}
                {focusItem && (
                    <div className="p-4 border-2 border-accent-red bg-accent-red/5">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-red mb-1 block">BU HAFTA ODAK</span>
                        <div className="text-sm font-bold text-text mb-1 truncate" title={focusItem.text}>{focusItem.text}</div>
                        {focusSubTask ? (
                            <div className="text-xs text-text-muted flex items-center gap-2">
                                <span className="text-accent-red text-[16px]">↳</span> {focusSubTask.text}
                            </div>
                        ) : (
                            <div className="text-xs text-text-muted italic">Alt görev ekle veya tanımla...</div>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {g.items.map((item) => {
                        const statusObj = STATUS_MAP[item.status];
                        const subTasksTotal = item.subTasks.length;
                        const subTasksDone = item.subTasks.filter(st => st.completed).length;
                        const subProgress = subTasksTotal === 0 ? 0 : Math.round((subTasksDone / subTasksTotal) * 100);
                        const isCompleted = item.status === 'COMPLETED';

                        return (
                            <div key={item.id} className={`brutalist-card p-4 border transition-all ${isCompleted ? 'opacity-60 bg-surface/5 border-border' : 'border-border bg-surface/20'}`}>
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    <div className="flex-[3]">
                                        <button
                                            onClick={() => toggleStatus(g.id, item)}
                                            className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest mb-2 border ${statusObj.bg} ${statusObj.color} ${statusObj.border} hover:opacity-80 transition-opacity`}
                                        >
                                            {statusObj.label}
                                        </button>
                                        <h4 className={`text-sm md:text-base font-bold text-text leading-snug ${isCompleted ? 'line-through text-text-muted' : ''}`}>
                                            {item.text}
                                        </h4>
                                    </div>
                                    <div className="flex-[1] text-right">
                                        {isCompleted && item.completedDate && (
                                            <span className="text-[9px] uppercase tracking-widest text-text-muted block">Tamamlanma: {item.completedDate}</span>
                                        )}
                                        {item.status === 'LOCKED' && item.preReq && (
                                            <span className="text-[9px] uppercase tracking-widest text-text-muted block opacity-50">Ön koşul: {item.preReq}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Item Progress Bar */}
                                <div className="mt-3 mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] uppercase tracking-widest text-text-muted">Alt Görevler ({subTasksDone}/{subTasksTotal})</span>
                                        <span className="text-[9px] font-bold text-text">{subProgress}%</span>
                                    </div>
                                    <div className="h-1 bg-background border border-border w-full">
                                        <div className="h-full bg-text transition-all" style={{ width: `${subProgress}%` }} />
                                    </div>
                                </div>

                                {/* Subtasks list */}
                                <div className="space-y-2 mt-2 pl-2 border-l-2 border-surface">
                                    {item.subTasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-2 group">
                                            <button
                                                onClick={() => toggleSubTask(g.id, item, st.id)}
                                                className={`w-4 h-4 flex items-center justify-center border font-bold text-[10px] shrink-0 ${st.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent'}`}
                                            >
                                                {st.completed && '✓'}
                                            </button>
                                            <span className={`text-xs ${st.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                                                {st.text}
                                            </span>
                                            <button onClick={() => removeSubTask(g.id, item, st.id)} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-red text-[10px] uppercase font-bold tracking-widest transition-opacity px-1">
                                                Sil
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Input */}
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder="Yeni alt görev ekle..."
                                            value={subTaskInputs[item.id] || ""}
                                            onChange={(e) => setSubTaskInputs({ ...subTaskInputs, [item.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && addSubTask(g.id, item)}
                                            className="bg-background border border-border text-xs text-text px-2 py-1 w-full focus:outline-none focus:border-text-muted"
                                        />
                                        <button
                                            onClick={() => addSubTask(g.id, item)}
                                            className="px-2 bg-surface border border-border text-text hover:bg-surface-hover text-xs uppercase font-bold"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderLevelPanel = (g: Goal) => {
        const sellingCount = g.items.filter(i => i.level === 'Selling').length;
        const totalCount = g.items.length;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <span className="text-xs uppercase tracking-widest text-text-muted">Seviye Özet</span>
                    <span className="text-sm font-bold uppercase tracking-widest">
                        <span className={sellingCount > 0 ? "text-cyan-400" : "text-text-muted"}>{sellingCount}</span><span className="text-text-muted">/{totalCount} Satılabilir</span>
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {g.items.map((item) => {
                        const l = LEVEL_MAP[item.level];
                        const isSelling = item.level === "Selling";
                        return (
                            <div
                                key={item.id}
                                className={`w-full text-left brutalist-card p-3 flex flex-col transition-all duration-300 border ${isSelling ? "border-cyan-400 bg-cyan-400/5" : "border-border hover:bg-surface/10 bg-surface/10"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleLevel(g.id, item)}
                                    className="flex justify-between items-start w-full cursor-pointer group"
                                >
                                    <span className={`text-xs font-bold uppercase tracking-wide mr-2 text-left leading-snug group-hover:opacity-80 transition-opacity ${isSelling ? "text-cyan-400" : "text-text"}`} title={item.text}>
                                        {item.text}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0 bg-background/50 px-2 py-1 rounded">
                                        <span className={`text-[9px] hidden sm:inline uppercase tracking-widest font-bold ${l.color}`}>
                                            {l.label}
                                        </span>
                                        <span className="text-base">{l.icon}</span>
                                    </div>
                                </button>

                                {item.subTasks.length > 0 && (
                                    <div className="space-y-2 mt-3 pl-2 border-l-2 border-cyan-400/20 pt-2">
                                        {item.subTasks.map(st => (
                                            <div key={st.id} className="flex items-start gap-2 group">
                                                <button
                                                    onClick={() => toggleSubTask(g.id, item, st.id)}
                                                    className={`w-3.5 h-3.5 mt-0.5 flex items-center justify-center border font-bold text-[8px] shrink-0 ${st.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent'}`}
                                                >
                                                    {st.completed && '✓'}
                                                </button>
                                                <span className={`text-[10px] md:text-xs leading-tight ${st.completed ? 'line-through text-text-muted opacity-50' : 'text-text/90'}`}>
                                                    {st.text}
                                                </span>
                                                <button onClick={() => removeSubTask(g.id, item, st.id)} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-red text-[9px] uppercase font-bold tracking-widest transition-opacity px-1">
                                                    Sil
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-3">
                                    <input
                                        type="text"
                                        placeholder="Yeni alt görev ekle..."
                                        value={subTaskInputs[item.id] || ""}
                                        onChange={(e) => setSubTaskInputs({ ...subTaskInputs, [item.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && addSubTask(g.id, item)}
                                        className="bg-background border border-border text-[10px] text-text px-2 py-1 w-full focus:outline-none focus:border-text-muted opacity-50 focus:opacity-100 transition-opacity"
                                    />
                                    <button
                                        onClick={() => addSubTask(g.id, item)}
                                        className="px-2 bg-surface border border-border text-text hover:bg-surface-hover text-[10px] uppercase font-bold opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCheckboxPanel = (g: Goal) => {
        const completedCount = g.items.filter(i => i.completed).length;
        const totalCount = g.items.length;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <span className="text-xs uppercase tracking-widest text-text-muted">Basit Takip</span>
                    <span className="text-sm font-bold uppercase tracking-widest text-accent-green">
                        {completedCount}/{totalCount} Tamamlandı
                    </span>
                </div>
                <div className="space-y-3">
                    {g.items.map((item) => (
                        <div
                            key={item.id}
                            className={`brutalist-card p-4 border transition-colors ${item.completed ? "bg-surface/5 border-border" : "border-border hover:border-text-muted bg-surface/20"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => updateGoalItem(g.id, item.id, { completed: !item.completed })}
                                    className={`w-5 h-5 mt-0.5 flex items-center justify-center border-2 shrink-0 transition-colors ${item.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent'
                                        }`}
                                >
                                    {item.completed && <span className="font-bold text-sm">✓</span>}
                                </button>
                                <span className={`text-sm md:text-base font-bold leading-snug cursor-pointer select-none ${item.completed ? 'line-through text-text-muted opacity-50' : 'text-text'}`} onClick={() => updateGoalItem(g.id, item.id, { completed: !item.completed })}>
                                    {item.text}
                                    <span className="text-[10px] text-text-muted uppercase tracking-widest block font-normal mt-1">
                                        {item.subTasks.filter(st => st.completed).length}/{item.subTasks.length} Alt Görev Tamamlandı
                                    </span>
                                </span>
                            </div>

                            {/* Panel 3 & 4 Subtasks Accordion */}
                            <div className="space-y-2 mt-4 pl-1 border-l-2 border-surface pt-2 ml-3 md:ml-8">
                                {item.subTasks.map(st => (
                                    <div key={st.id} className="flex items-start gap-2 group">
                                        <button
                                            onClick={() => toggleSubTask(g.id, item, st.id)}
                                            className={`w-4 h-4 flex mt-0.5 items-center justify-center border font-bold text-[10px] shrink-0 ${st.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent'}`}
                                        >
                                            {st.completed && '✓'}
                                        </button>
                                        <span className={`text-xs leading-snug ${st.completed ? 'line-through text-text-muted opacity-50' : 'text-text/90'}`}>
                                            {st.text}
                                        </span>
                                        <button onClick={() => removeSubTask(g.id, item, st.id)} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-red text-[10px] uppercase font-bold tracking-widest transition-opacity px-1">
                                            Sil
                                        </button>
                                    </div>
                                ))}

                                <div className="flex gap-2 mt-3">
                                    <input
                                        type="text"
                                        placeholder="Yeni alt görev ekle..."
                                        value={subTaskInputs[item.id] || ""}
                                        onChange={(e) => setSubTaskInputs({ ...subTaskInputs, [item.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && addSubTask(g.id, item)}
                                        className="bg-background border border-border text-xs text-text px-2 py-1.5 w-full focus:outline-none focus:border-text-muted opacity-60 focus:opacity-100 transition-opacity"
                                    />
                                    <button
                                        onClick={() => addSubTask(g.id, item)}
                                        className="px-3 bg-surface border border-border text-text hover:bg-surface-hover text-[10px] uppercase font-bold opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section>
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
                Hedefler Paneli (Kapsamlı Odak)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((goal, i) => {
                    const colors = [
                        "border-accent-green hover:bg-accent-green/5 text-accent-green",
                        "border-accent-amber hover:bg-accent-amber/5 text-accent-amber",
                        "border-accent-red hover:bg-accent-red/5 text-accent-red",
                        "border-text hover:bg-text/5 text-text",
                    ];
                    const colorClass = colors[i % colors.length];

                    return (
                        <button
                            key={goal.title}
                            onClick={() => setSelectedGoalId(goal.id)}
                            className={`brutalist-card text-left flex items-center justify-between transition-colors border-l-4 cursor-pointer p-4 ${colorClass}`}
                        >
                            <span className="font-bold text-sm tracking-widest uppercase">
                                {goal.title}
                            </span>
                            <span className="text-xl ml-4 font-bold">&rarr;</span>
                        </button>
                    );
                })}
            </div>

            {/* Side Panel / Modal overlay */}
            {selectedGoal && (
                <div className="fixed inset-0 z-50 flex items-start justify-end lg:justify-center p-0 md:p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    {/* Dark Overlay to Close */}
                    <div
                        className="fixed inset-0 cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Panel Content */}
                    <div className="relative w-full max-w-2xl bg-background border-l border-r sm:border border-border min-h-screen md:min-h-[80vh] md:my-8 shadow-2xl animate-in fade-in slide-in-from-right-10 md:slide-in-from-bottom-5 duration-300">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
                            <h2 className="text-sm md:text-base font-bold uppercase tracking-widest text-text truncate pr-4">
                                {selectedGoal.title}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-text-muted hover:text-accent-red transition-colors font-bold text-xl px-2 shrink-0 bg-surface/50 border border-border"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-4 md:p-8">
                            <div className="brutalist-card bg-accent-red/5 border-accent-red/30 mb-8 p-4">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-accent-red mb-2 font-bold">
                                    SUPERPOWER AFFIRMATION
                                </p>
                                <p className="text-sm md:text-base text-text leading-relaxed font-semibold italic">
                                    &ldquo;{selectedGoal.affirmation}&rdquo;
                                </p>
                            </div>

                            <div className="mb-12">
                                {selectedGoal.type === "detailed" && renderDetailedPanel(selectedGoal)}
                                {selectedGoal.type === "levels" && renderLevelPanel(selectedGoal)}
                                {selectedGoal.type === "checkbox" && renderCheckboxPanel(selectedGoal)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
