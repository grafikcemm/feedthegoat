"use client";

import { useState, useEffect } from "react";
import goalsDataRaw from "@/data/goals.json";

// --- Types ---
type ItemStatus = 'ACTIVE' | 'IN_PROGRESS' | 'LOW_PRIORITY' | 'LOCKED' | 'TRIGGER_BASED' | 'IGNORED';

interface SubTask {
    id: string;
    text: string;
    completed: boolean;
}

interface GoalItemContent {
    id: string;
    text: string;
    status: ItemStatus;       
    subTasks: SubTask[];      

    // New Detail Fields
    whyImportant?: string;
    howToLearn?: string;
    output?: string;
    thisWeek?: string;
    revenueLink?: string;
    scopeLimit?: string;
    unlockCondition?: string;
}

interface Goal {
    id: string;
    title: string;
    affirmation: string;
    items: GoalItemContent[];
}

// --- Maps ---
const STATUS_MAP: Record<ItemStatus, { label: string; color: string; border: string; bg: string }> = {
    ACTIVE: { label: "🔴 AKTİF", color: "text-accent-red", border: "border-accent-red", bg: "bg-accent-red/10" },
    IN_PROGRESS: { label: "🟡 SIRADA", color: "text-accent-amber", border: "border-accent-amber", bg: "bg-accent-amber/10" },
    LOW_PRIORITY: { label: "🟣 DÜŞÜK ÖNCELİK", color: "text-purple-400", border: "border-purple-400/50", bg: "bg-purple-900/20" },
    LOCKED: { label: "🔒 KİLİTLİ", color: "text-text-muted", border: "border-border", bg: "bg-surface/20" },
    TRIGGER_BASED: { label: "⚡ TRIGGER-BASED", color: "text-cyan-400", border: "border-cyan-400/50", bg: "bg-cyan-900/20" },
    IGNORED: { label: "❌ REDDEDİLDİ", color: "text-red-900", border: "border-red-900", bg: "bg-red-900/10" },
};

export default function GoalsDashboard() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [subTaskInputs, setSubTaskInputs] = useState<Record<string, string>>({}); 

    // Accordion State for Goal Categories (0,1,2,3)
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
        0: true, 1: true, 2: true, 3: true
    });

    // Accordion State for Cards Details
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const savedGoals = localStorage.getItem("goat-goals-v6");

        const buildFreshGoals = (): Goal[] => {
            return goalsDataRaw.map((goalRaw: any, index: number) => {
                const items: GoalItemContent[] = goalRaw.items.map((itemObj: any, iIndex: number) => {
                    const initialSubTasks = (itemObj.subTasks || []).map((st: string, stIdx: number) => ({
                        id: `st-${index}-${iIndex}-${stIdx}-${Date.now()}`,
                        text: st,
                        completed: false
                    }));

                    let status: ItemStatus = itemObj.defaultStatus as ItemStatus || "LOCKED";

                    return {
                        id: `g${index}-i${iIndex}`,
                        text: itemObj.text,
                        status,
                        subTasks: initialSubTasks,
                        whyImportant: itemObj.whyImportant || "",
                        howToLearn: itemObj.howToLearn || "",
                        output: itemObj.output || "",
                        thisWeek: itemObj.thisWeek || "",
                        revenueLink: itemObj.revenueLink || "",
                        scopeLimit: itemObj.scopeLimit || "",
                        unlockCondition: itemObj.unlockCondition || ""
                    };
                });

                return {
                    id: `g${index}`,
                    title: goalRaw.title,
                    affirmation: goalRaw.affirmation,
                    items
                };
            });
        };

        const migrateGoals = (oldGoals: Goal[]): Goal[] => {
            const freshGoals = buildFreshGoals();
            const oldItemMap = new Map<string, GoalItemContent>();
            oldGoals.forEach(g => {
                g.items.forEach(item => {
                    const key = item.text.substring(0, 30).toLowerCase();
                    oldItemMap.set(key, item);
                });
            });

            return freshGoals.map((freshGoal) => {
                const mergedItems = freshGoal.items.map(freshItem => {
                    const freshKey = freshItem.text.substring(0, 30).toLowerCase();
                    const oldItem = oldItemMap.get(freshKey);

                    if (oldItem) {
                        const oldSubMap = new Map(oldItem.subTasks.map(st => [st.text.substring(0, 25).toLowerCase(), st]));
                        const mergedSubs: SubTask[] = [];

                        freshItem.subTasks.forEach(freshSt => {
                            const stKey = freshSt.text.substring(0, 25).toLowerCase();
                            const oldSt = oldSubMap.get(stKey);
                            if (oldSt) {
                                mergedSubs.push({ ...freshSt, completed: oldSt.completed, id: oldSt.id });
                                oldSubMap.delete(stKey);
                            } else {
                                mergedSubs.push(freshSt);
                            }
                        });

                        oldSubMap.forEach(oldSt => {
                            const isUserAdded = !freshItem.subTasks.some(fs => fs.text.substring(0, 25).toLowerCase() === oldSt.text.substring(0, 25).toLowerCase());
                            if (isUserAdded) {
                                mergedSubs.push(oldSt);
                            }
                        });

                        return {
                            ...freshItem,
                            status: oldItem.status, 
                            subTasks: mergedSubs,
                        };
                    }
                    return freshItem;
                });

                return {
                    ...freshGoal,
                    items: mergedItems,
                };
            });
        };

        if (savedGoals) {
            try {
                const parsed = JSON.parse(savedGoals);
                setTimeout(() => setGoals(migrateGoals(parsed)), 0);
            } catch {
                setTimeout(() => setGoals(buildFreshGoals()), 0);
            }
        } else {
            setTimeout(() => setGoals(buildFreshGoals()), 0);
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    useEffect(() => {
        if (isLoaded && goals.length > 0) {
            localStorage.setItem("goat-goals-v6", JSON.stringify(goals));
        }
    }, [goals, isLoaded]);

    if (!isLoaded) return null;

    const toggleSection = (idx: number) => {
        setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const toggleCardDetails = (itemId: string) => {
        setExpandedCards(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const updateGoalItem = (goalId: string, itemId: string, updates: Partial<GoalItemContent>) => {
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            return {
                ...g,
                items: g.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
            };
        }));
    };

    const cycleStatus = (goalId: string, item: GoalItemContent, allowedStatuses: ItemStatus[]) => {
        if (allowedStatuses.length === 0) return;
        const nextIdx = (allowedStatuses.indexOf(item.status) + 1) % allowedStatuses.length;
        updateGoalItem(goalId, item.id, { status: allowedStatuses[nextIdx] });
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
        const newSubTasks = item.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);
        updateGoalItem(goalId, item.id, { subTasks: newSubTasks });
    };

    const removeSubTask = (goalId: string, item: GoalItemContent, subTaskId: string) => {
        updateGoalItem(goalId, item.id, { subTasks: item.subTasks.filter(st => st.id !== subTaskId) });
    };

    const renderTopSummary = () => (
        <div className="brutalist-card border-2 border-text bg-surface/5 mb-8 p-0 overflow-hidden">
            <div className="bg-text text-background font-bold text-xs uppercase tracking-[0.2em] p-3">
                KARİYER ODAK PANELİ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-4 bg-surface/10 hover:bg-surface/20 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest text-accent-amber font-bold block mb-2">BU ÇEYREĞİN ODAĞI</span>
                    <p className="text-sm font-bold leading-snug">İlk hibrit gelir omurgasını kur: n8n + voice agent + drone + pilot müşteri</p>
                </div>
                <div className="p-4 bg-surface/10 hover:bg-surface/20 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest text-accent-red font-bold block mb-2">AKTİF MOTORLAR</span>
                    <ul className="text-xs space-y-1 font-bold">
                        <li>• Prompt Engineering</li>
                        <li>• n8n Workflow</li>
                        <li>• Drone / IHA-1</li>
                        <li>• Teklif & Satış</li>
                    </ul>
                </div>
                <div className="p-4 bg-surface/10 hover:bg-surface/20 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest text-accent-green font-bold block mb-2">HEDEF SEKTÖRLER</span>
                    <ul className="text-xs space-y-1 font-bold">
                        <li>• Diş Kliniği</li>
                        <li>• Güzellik Merkezi</li>
                        <li>• Emlak</li>
                    </ul>
                </div>
                <div className="p-4 bg-surface/5 hover:bg-accent-red/5 transition-colors">
                    <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold block mb-2">ŞİMDİLİK YAPMA</span>
                    <ul className="text-[10px] space-y-1 text-text-muted">
                        <li>- Genel veri analistliği</li>
                        <li>- GA4 / sertifika avı</li>
                        <li>- Rastgele JS/Python syntax</li>
                        <li>- YouTube (kısa video fabrikası)</li>
                        <li>- Micro-SaaS hayalleri</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderGoalCard = (g: Goal, item: GoalItemContent, allowedStatuses: ItemStatus[]) => {
        const isExpanded = expandedCards[item.id];
        const statusObj = STATUS_MAP[item.status] || STATUS_MAP.LOCKED;
        
        return (
            <div key={item.id} className={`brutalist-card border transition-all ${isExpanded ? 'bg-surface/10 border-text' : 'bg-surface/5 border-border hover:border-text-muted'}`}>
                {/* Header (Clickable for accordion) */}
                <div className="p-4 cursor-pointer flex justify-between items-start gap-4" onClick={() => toggleCardDetails(item.id)}>
                    <div className="flex-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); cycleStatus(g.id, item, allowedStatuses); }}
                            className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-[0.2em] mb-2 border ${statusObj.bg} ${statusObj.color} ${statusObj.border} hover:opacity-80 transition-opacity`}
                        >
                            {statusObj.label}
                        </button>
                        <h4 className={`text-sm md:text-base font-bold text-text leading-snug`}>
                            {item.text}
                        </h4>
                        {!isExpanded && item.thisWeek && (
                            <p className="text-[10px] text-text-muted mt-2 truncate"><span className="text-accent-red">↳ Bu Hafta:</span> {item.thisWeek}</p>
                        )}
                        {!isExpanded && item.unlockCondition && (
                            <p className="text-[10px] text-text-muted mt-2 truncate"><span className="text-accent-amber">🔒 Kilit:</span> {item.unlockCondition}</p>
                        )}
                    </div>
                    <div className="text-text-muted font-bold text-xs pt-1">
                        {isExpanded ? "−" : "＋"}
                    </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                    <div className="p-4 border-t border-border/50 bg-background/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Data Fields */}
                        <div className="space-y-3">
                            {item.whyImportant && (
                                <div><span className="text-[9px] uppercase tracking-widest text-text-muted block">Neden Önemli</span><p className="text-xs font-bold text-text">{item.whyImportant}</p></div>
                            )}
                            {item.howToLearn && (
                                <div><span className="text-[9px] uppercase tracking-widest text-text-muted block">Nasıl Öğrenilecek</span><p className="text-xs opacity-90">{item.howToLearn}</p></div>
                            )}
                            {item.output && (
                                <div><span className="text-[9px] uppercase tracking-widest text-text-muted block">Çıktı / Kanıt</span><p className="text-xs text-accent-green font-bold">{item.output}</p></div>
                            )}
                            {item.thisWeek && (
                                <div><span className="text-[9px] uppercase tracking-widest text-accent-red block">Bu Hafta Yapılacak</span><p className="text-xs font-bold text-text">{item.thisWeek}</p></div>
                            )}
                            {item.revenueLink && (
                                <div><span className="text-[9px] uppercase tracking-widest text-text-muted block">Gelir Bağı</span><p className="text-xs italic">{item.revenueLink}</p></div>
                            )}
                            {item.scopeLimit && (
                                <div className="border-l-2 border-accent-amber pl-2 bg-accent-amber/5 p-1"><span className="text-[9px] uppercase tracking-widest text-accent-amber block">Scope Sınırı / UYARI</span><p className="text-xs font-bold text-accent-amber">{item.scopeLimit}</p></div>
                            )}
                            {item.unlockCondition && (
                                <div className="border-l-2 border-text-muted pl-2 bg-surface/10 p-1"><span className="text-[9px] uppercase tracking-widest text-text-muted block">Açılma Şartı</span><p className="text-xs text-text-muted">{item.unlockCondition}</p></div>
                            )}
                        </div>

                        {/* Subtasks (Actionable) */}
                        <div className="border-l border-border/50 pl-0 md:pl-4 pt-4 md:pt-0">
                            <span className="text-[9px] uppercase tracking-widest text-text-muted block mb-2">Checklist & Aksiyon</span>
                            <div className="space-y-2">
                                {item.subTasks.map(st => (
                                    <div key={st.id} className="flex items-start gap-2 group">
                                        <button onClick={() => toggleSubTask(g.id, item, st.id)} className={`w-4 h-4 mt-0.5 flex items-center justify-center border font-bold text-[10px] shrink-0 ${st.completed ? 'bg-text text-background border-text' : 'bg-transparent border-border text-transparent'}`}>
                                            {st.completed && '✓'}
                                        </button>
                                        <span className={`text-xs ${st.completed ? 'line-through text-text-muted' : 'text-text'}`}>{st.text}</span>
                                        <button onClick={() => removeSubTask(g.id, item, st.id)} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-red text-[10px] uppercase font-bold tracking-widest transition-opacity px-1">Sil</button>
                                    </div>
                                ))}
                                <div className="flex gap-2 mt-2 pt-2 border-t border-border/30">
                                    <input
                                        type="text" placeholder="Yeni alt görev..." value={subTaskInputs[item.id] || ""}
                                        onChange={(e) => setSubTaskInputs({ ...subTaskInputs, [item.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && addSubTask(g.id, item)}
                                        className="bg-background border border-border text-xs text-text px-2 py-1 w-full focus:outline-none focus:border-text-muted"
                                    />
                                    <button onClick={() => addSubTask(g.id, item)} className="px-2 bg-surface border border-border text-text hover:bg-surface-hover text-[10px] uppercase font-bold">Ekle</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const mainSections = goals.slice(0, 4); // Index 0-3 are Sections 1-4
    const lockedSection = goals[4]; // Index 4: Kilitli
    const ignoredSection = goals[5]; // Index 5: Şimdilik Yapma

    return (
        <section className="pb-10">
            {renderTopSummary()}

            <div className="space-y-6">
                {mainSections.map((goal, i) => {
                    const isExpanded = expandedSections[i];
                    return (
                        <div key={goal.id} className="brutalist-card border border-border bg-surface/5 overflow-hidden">
                            <button
                                onClick={() => toggleSection(i)}
                                className="w-full text-left p-4 flex items-center justify-between hover:bg-surface/10 transition-colors bg-surface/10"
                            >
                                <div className="flex flex-col">
                                    <span className={`font-bold text-sm tracking-widest uppercase text-text`}>
                                        {goal.title}
                                    </span>
                                    <span className="text-[10px] italic text-text-muted mt-1">{goal.affirmation}</span>
                                </div>
                                <span className="text-text-muted text-xs font-bold uppercase tracking-[0.2em] ml-4 bg-background border border-border py-1 px-2">
                                    {isExpanded ? "Gizle ↑" : "Göster ↓"}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="p-4 grid grid-cols-1 gap-3 bg-background/30 fade-in">
                                    {goal.items.map(item => renderGoalCard(goal, item, ['ACTIVE', 'IN_PROGRESS', 'LOW_PRIORITY']))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* KİLİTLİ / SONRAKİ FAZ ALANI */}
            {lockedSection && lockedSection.items.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4 border-b border-border pb-2">{lockedSection.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {lockedSection.items.map(item => {
                            const statusObj = STATUS_MAP[item.status] || STATUS_MAP.LOCKED;
                            return (
                                <div key={item.id} className="p-3 border border-border bg-surface/5 opacity-70 hover:opacity-100 transition-opacity flex flex-col justify-between">
                                    <div>
                                        <button onClick={() => cycleStatus(lockedSection.id, item, ['LOCKED', 'TRIGGER_BASED', 'IN_PROGRESS'])} className={`text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-[0.2em] mb-2 border ${statusObj.bg} ${statusObj.color} ${statusObj.border}`}>
                                            {statusObj.label}
                                        </button>
                                        <p className="text-xs font-bold text-text-muted w-full">{item.text}</p>
                                    </div>
                                    {item.unlockCondition && (
                                       <p className="text-[9px] text-text-muted/60 mt-2 border-t border-border pt-1">
                                           Açılma Şartı: {item.unlockCondition}
                                       </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ŞİMDİLİK YAPILMAYACAKLAR ALANI */}
            {ignoredSection && ignoredSection.items.length > 0 && (
                <div className="mt-12 p-4 border border-border bg-surface/5">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3 flex items-center gap-2">
                        <span className="text-accent-red">×</span> {ignoredSection.title}
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-text-muted/60 mb-4">{ignoredSection.affirmation}</p>
                    <div className="flex flex-wrap gap-2">
                        {ignoredSection.items.map(item => (
                            <div key={item.id} className="bg-background border border-border px-2 py-1 text-[10px] text-text-muted/70 line-through decoration-accent-red/50">
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
