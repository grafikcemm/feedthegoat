"use client";

import { useState, useEffect, useMemo } from "react";

const RULES = [
    "Kimsenin beni kurtarmasını beklemiyorum. Kendi hayatımın tek sorumlusu benim.",
    "Çatışmadan kaçmak barış değil, teslimiyettir. Sınırlarımı net ve sert çizerim.",
    "Onay aramak zayıflıktır. Kendi doğrularım rehberimdir.",
    "Öfkem bir enerjidir, onu bastırmam, hedeflerime ulaşmak için yönlendiririm.",
    "Konfor alanı bir mezardır. Rahatsızlık beni büyütür.",
    "ÖĞRENMEK ÜRETMEK DEĞİLDİR. HER GÜN YA BİR ŞEY SAT, YA BİR ŞEY YAYINLA, YA DA BİR MÜŞTERİYE ULAŞ."
];

export default function TheManifesto() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [reflectionInput, setReflectionInput] = useState("");
    const [reflections, setReflections] = useState<Record<number, string[]>>({});
    const [battleDays, setBattleDays] = useState(0);

    const ruleOfTheDayIndex = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear % RULES.length;
    }, []);

    useEffect(() => {
        const savedReflections = localStorage.getItem("goat-manifesto-reflections");
        if (savedReflections) {
            try { 
                const parsed = JSON.parse(savedReflections);
                setTimeout(() => setReflections(parsed), 0); 
            } catch { }
        }

        let savedStart = localStorage.getItem("goat-goals-start");
        if (!savedStart) {
            savedStart = Date.now().toString();
            localStorage.setItem("goat-goals-start", savedStart);
        }

        const startMs = parseInt(savedStart, 10);
        const diffDays = Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24));
        // Add 1 so the first day is "1. gün"
        setTimeout(() => {
            setBattleDays(Math.max(1, diffDays + 1));
            setIsLoaded(true);
        }, 0);
    }, []);

    const saveReflection = () => {
        if (!reflectionInput.trim()) return;

        const newReflections = { ...reflections };
        if (!newReflections[ruleOfTheDayIndex]) {
            newReflections[ruleOfTheDayIndex] = [];
        }

        const timestampAndText = `[${new Date().toLocaleDateString("tr-TR")}] ${reflectionInput.trim()}`;
        // Keep only the last 3 reflections
        newReflections[ruleOfTheDayIndex] = [timestampAndText, ...newReflections[ruleOfTheDayIndex]].slice(0, 3);

        setReflections(newReflections);
        localStorage.setItem("goat-manifesto-reflections", JSON.stringify(newReflections));
        setReflectionInput("");
    };

    const getMilestoneMessage = (days: number) => {
        if (days >= 365) return "1 YIL. Demir Leblebi gerçek oldu.";
        if (days >= 100) return "100 GÜN. Sen farklısın.";
        if (days >= 30) return "1 AY. Artık alışkanlık oluşuyor.";
        if (days >= 7) return "İLK HAFTA TAMAM. Çoğu kişi burada bırakır.";
        return null;
    };

    const milestoneMessage = getMilestoneMessage(battleDays);

    if (!isLoaded) return null;

    return (
        <section className="mt-12 mb-12 bg-[#0a0a0a] border-y-4 border-text py-10 px-4 md:px-8 relative overflow-hidden">
            {/* Background Texture/Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-[100px] pointer-events-none"></div>

            <h2 className="text-sm md:text-base uppercase tracking-[0.4em] text-text font-black mb-8 flex items-center justify-center gap-3 text-center border-b border-text/10 pb-6 w-full max-w-2xl mx-auto">
                <span className="text-2xl drop-shadow-lg">⚔️</span>
                DEMİR LEBLEBİ
            </h2>

            <div className="space-y-6 max-w-3xl mx-auto">
                {RULES.map((rule, idx) => {
                    const isToday = idx === ruleOfTheDayIndex;

                    if (isToday) {
                        return (
                            <div key={idx} className="brutalist-card p-6 md:p-8 bg-surface/40 border-l-8 border-l-accent-red transform hover:scale-[1.01] transition-transform shadow-2xl relative">
                                <div className="absolute -top-3 -right-3 md:-right-4 bg-accent-red text-black text-[10px] uppercase font-black tracking-widest px-3 py-1 shadow-lg transform rotate-3">
                                    📌 BUGÜNÜN KURALI
                                </div>
                                <div className="flex gap-4 items-start mb-6">
                                    <span className="text-4xl font-black text-accent-red opacity-50 font-mono tracking-tighter leading-none mt-1">0{idx + 1}</span>
                                    <p className="text-lg md:text-2xl font-black text-text uppercase tracking-widest leading-snug drop-shadow-sm">
                                        {rule}
                                    </p>
                                </div>

                                {/* Mikro Yansıtma */}
                                <div className="mt-8 border-t border-text/10 pt-6">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={reflectionInput}
                                            onChange={(e) => setReflectionInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveReflection()}
                                            placeholder="Bu kuralı bugün nasıl uyguladın? Bir cümle yaz..."
                                            className="flex-1 bg-background/50 border border-text/20 p-3 text-sm focus:outline-none focus:border-accent-red text-text transition-colors font-mono placeholder:text-text-muted"
                                        />
                                        <button
                                            onClick={saveReflection}
                                            disabled={!reflectionInput.trim()}
                                            className="bg-accent-red text-black font-black uppercase tracking-widest px-6 py-3 hover:bg-accent-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            KAYDET
                                        </button>
                                    </div>

                                    {reflections[idx] && reflections[idx].length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {reflections[idx].map((ref, rIdx) => (
                                                <div key={rIdx} className="text-[10px] md:text-xs text-text-muted font-mono bg-background/30 p-2 border-l-2 border-text/30">
                                                    {ref}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className="flex gap-4 items-start py-3 px-4 md:px-6 hover:bg-surface/5 transition-colors group cursor-default border-l-2 border-transparent hover:border-text/20">
                            <span className="text-lg font-bold text-text-muted/30 font-mono mt-0.5 group-hover:text-text-muted transition-colors">0{idx + 1}</span>
                            <p className="text-xs md:text-sm font-bold text-text-muted/60 uppercase tracking-widest leading-relaxed group-hover:text-text/80 transition-colors">
                                {rule}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Savaş Günü Sayacı */}
            <div className="mt-16 pt-8 border-t border-text/10 text-center flex flex-col items-center justify-center">
                <div className="inline-block brutalist-card bg-surface/20 border border-accent-amber/30 px-6 py-4">
                    <p className="text-base md:text-xl font-black text-accent-amber uppercase tracking-[0.3em] font-mono">
                        <span className="text-2xl mr-2">🔥</span>
                        {battleDays} GÜNDÜR SAVAŞIYORSUN.
                    </p>
                    {milestoneMessage && (
                        <p className="text-[10px] md:text-xs text-text font-bold uppercase tracking-widest mt-2 bg-text/10 py-1 px-3 inline-block">
                            {milestoneMessage}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
