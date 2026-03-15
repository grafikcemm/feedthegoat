"use client";

import { useState, useEffect } from "react";

const DETOX_RULES = {
    red: [
        { id: "dd-r1", label: "Pornografi izlemedim" },
        { id: "dd-r2", label: "Doomscroll yapmadım" },
        { id: "dd-r3", label: "Telefon 22:00 uçak modu" }
    ],
    yellow: [
        { id: "dd-y1", label: "Dışarıdan yemek yemedim" },
        { id: "dd-y2", label: "Su dışı içecek yok (Çay/Kahve OK)" },
        { id: "dd-y3", label: "Sadece faydalı YouTube izledim" }
    ],
    green: [
        { id: "dd-g1", label: "Sabah bloğu sessiz geçti" },
        { id: "dd-g2", label: "Sosyal medya sadece üreticiydi" },
        { id: "dd-g3", label: "Ekstra dijital temizlik / organizasyon" }
    ]
};

export default function DopamineDetox() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const saved = localStorage.getItem(`goat-dd-v3-${todayStr}`);
        if (saved) {
        setTimeout(() => {
            try { setChecked(JSON.parse(saved)); } catch {}
        }, 0);
        }
    }, [todayStr]);

    useEffect(() => {
        if (!isClient) return;
        localStorage.setItem(`goat-dd-v3-${todayStr}`, JSON.stringify(checked));
        // We aren't doing strict 30 day history anymore according to prompt, 
        // focus is on day-to-day resilience and the scoreboard.
    }, [checked, isClient, todayStr]);

    const toggle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!isClient) return null;

    const countGroup = (group: {id: string}[]) => group.filter(item => checked[item.id]).length;

    const redCount = countGroup(DETOX_RULES.red);
    const yellowCount = countGroup(DETOX_RULES.yellow);
    const greenCount = countGroup(DETOX_RULES.green);

    return (
        <section className="mt-6 border border-border bg-surface/5 overflow-hidden">
            {/* Compact Header / Scoreboard */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-3 flex items-center justify-between hover:bg-surface/10 transition-colors bg-black"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">🧠</span>
                    <span className="font-bold text-[11px] tracking-widest uppercase text-text">Dopamin Detoksu</span>
                </div>
                
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex gap-2 text-[10px] font-bold font-mono">
                        <span className={redCount === 3 ? "text-accent-red" : "text-text-muted"}>🔴 {redCount}/3</span>
                        <span className={yellowCount === 3 ? "text-accent-amber" : "text-text-muted"}>🟡 {yellowCount}/3</span>
                        <span className={greenCount === 3 ? "text-accent-green" : "text-text-muted"}>🟢 {greenCount}/3</span>
                    </div>
                    <span className="text-text-muted text-[10px] uppercase font-bold tracking-[0.2em] bg-surface/20 border border-border px-1.5 py-0.5">
                        {isExpanded ? "Gizle" : "Göster"}
                    </span>
                </div>
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-3 bg-background/50 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-border/30 fade-in">
                    
                    {/* RED PANEL */}
                    <div className="p-3 border border-accent-red/20 bg-accent-red/5">
                        <h4 className="text-[9px] uppercase tracking-widest text-accent-red font-bold mb-3 border-b border-accent-red/20 pb-1">
                            KRİTİK SAVUNMA (BOZULAMAZ)
                        </h4>
                        <div className="space-y-2">
                            {DETOX_RULES.red.map(item => (
                                <div key={item.id} onClick={(e) => toggle(item.id, e)} className="flex items-start gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 mt-0.5 shrink-0 border flex items-center justify-center text-[10px] ${checked[item.id] ? 'bg-accent-red border-accent-red text-black' : 'border-border bg-black group-hover:border-accent-red/50'}`}>
                                        {checked[item.id] && '✓'}
                                    </div>
                                    <span className={`text-[11px] font-medium leading-tight select-none ${checked[item.id] ? 'line-through text-text-muted' : 'text-text'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* YELLOW PANEL */}
                    <div className="p-3 border border-accent-amber/20 bg-accent-amber/5">
                        <h4 className="text-[9px] uppercase tracking-widest text-accent-amber font-bold mb-3 border-b border-accent-amber/20 pb-1">
                            PERFORMANS (İRADEYİ KORU)
                        </h4>
                        <div className="space-y-2">
                            {DETOX_RULES.yellow.map(item => (
                                <div key={item.id} onClick={(e) => toggle(item.id, e)} className="flex items-start gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 mt-0.5 shrink-0 border flex items-center justify-center text-[10px] ${checked[item.id] ? 'bg-accent-amber border-accent-amber text-black' : 'border-border bg-black group-hover:border-accent-amber/50'}`}>
                                        {checked[item.id] && '✓'}
                                    </div>
                                    <span className={`text-[11px] font-medium leading-tight select-none ${checked[item.id] ? 'line-through text-text-muted' : 'text-text'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GREEN PANEL */}
                    <div className="p-3 border border-accent-green/20 bg-accent-green/5">
                        <h4 className="text-[9px] uppercase tracking-widest text-accent-green font-bold mb-3 border-b border-accent-green/20 pb-1">
                            BONUS KALİTE (GÜCÜ ARTIR)
                        </h4>
                        <div className="space-y-2">
                            {DETOX_RULES.green.map(item => (
                                <div key={item.id} onClick={(e) => toggle(item.id, e)} className="flex items-start gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 mt-0.5 shrink-0 border flex items-center justify-center text-[10px] ${checked[item.id] ? 'bg-accent-green border-accent-green text-black' : 'border-border bg-black group-hover:border-accent-green/50'}`}>
                                        {checked[item.id] && '✓'}
                                    </div>
                                    <span className={`text-[11px] font-medium leading-tight select-none ${checked[item.id] ? 'line-through text-text-muted' : 'text-text'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </section>
    );
}
