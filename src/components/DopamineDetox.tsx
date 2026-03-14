"use client";

import { useState, useEffect } from "react";

const DETOX_ITEMS = [
    { id: "detox-porn", label: "Pornografi izlemedim", desc: "Dopamin reseptörlerini sıfırlar, gerçek yaşam motivasyonunu artırır." },
    { id: "detox-sm", label: "Sosyal medya scroll yapmadım (sadece paylaşım)", desc: "Başkalarının hayatını izlemeyi bırak, kendi hayatını yaşa." },
    { id: "detox-drink", label: "Su dışında içecek tüketmedim (çay/kahve OK)", desc: "Şekerli içecekler insülin direncini ve zihin sisini tetikler." },
    { id: "detox-food", label: "Dışarıdan yemek yemedim", desc: "Kendi yakıtını kendin seç." },
    { id: "detox-morning", label: "Sabah bloğu sessiz geçti (müzik/podcast yok)", desc: "Zihnin kendi düşüncelerini üretmesine izin ver." },
    { id: "detox-yt", label: "YouTube'da sadece eğitim içerik izledim", desc: "Tüketici eğlencesi değil, üretici hammaddesi." },
    { id: "detox-phone", label: "Telefon 22:00'de uçak moduna alındı", desc: "Kaliteli uyku, ertesi günün savaşını kazanmanın tek yoludur." },
];

export default function DopamineDetox() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [history, setHistory] = useState<Record<string, boolean>>({}); // "YYYY-MM-DD": true/false
    const [isClient, setIsClient] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const savedToday = localStorage.getItem(`goat-detox-today-${todayStr}`);
        if (savedToday) {
            try { setChecked(JSON.parse(savedToday)); } catch { }
        }

        const savedHistory = localStorage.getItem("goat-detox-history");
        if (savedHistory) {
            try { setHistory(JSON.parse(savedHistory)); } catch { }
        }
    }, [todayStr]);

    useEffect(() => {
        if (!isClient) return;
        localStorage.setItem(`goat-detox-today-${todayStr}`, JSON.stringify(checked));

        const checkedCount = Object.values(checked).filter(Boolean).length;
        const isSuccess = checkedCount >= 6;

        const updatedHistory = { ...history, [todayStr]: isSuccess };
        localStorage.setItem("goat-detox-history", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, isClient, todayStr]);

    const toggle = (id: string) => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Calculate weekly / 30-day scores
    const calculateScores = () => {
        let weeklyScore = 0;
        let streak = 0;

        const d = new Date();
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date(d);
            tempDate.setDate(d.getDate() - i);
            const dateStr = tempDate.toISOString().split("T")[0];
            if (history[dateStr]) weeklyScore++;
        }

        const sortedDates = Object.keys(history).sort((a, b) => b.localeCompare(a));
        for (const date of sortedDates) {
            if (history[date]) {
                streak++;
            } else {
                break;
            }
        }

        return { weeklyScore, streak };
    };

    if (!isClient) return null;

    const { weeklyScore, streak } = calculateScores();
    const checkedCount = Object.values(checked).filter(Boolean).length;
    const isTodaySuccess = checkedCount >= 6;

    return (
        <section className="mb-4">
            <div className="border border-border" style={{ backgroundColor: "#111111" }}>
                <div className="p-4 border-b border-border bg-black">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🧠</span>
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                                DOPAMİN DETOKSU
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] uppercase tracking-widest text-text-muted block">Haftalık Skor</span>
                            <span className="text-sm font-bold text-accent-green">{weeklyScore} / 7 Gün</span>
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-text-muted">
                        30 GÜN. ZİNCİRİ KIRMA. (Hedef: 30. Şu an: <span className="text-white font-bold">{streak}</span>)
                    </p>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DETOX_ITEMS.map((item) => {
                        const isDone = checked[item.id];
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => toggle(item.id)}
                                className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                                    isDone ? "border-text bg-surface/5" : "border-border bg-surface/20 hover:border-text-muted"
                                }`}
                                title={item.desc}
                            >
                                <div className={`w-11 h-11 shrink-0 flex items-center justify-center border transition-colors ${
                                    isDone ? "border-text bg-text text-black" : "border-border bg-transparent text-transparent"
                                }`}>
                                    <span className="text-xl font-bold">✓</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-bold select-none leading-tight ${isDone ? "line-through text-text-muted opacity-70" : "text-white"}`}>
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border bg-black/50">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-text-muted">
                            Bu Gün Başarılı Mı? (En az 6 tik)
                        </span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${isTodaySuccess ? "text-accent-green" : "text-accent-red"}`}>
                            {isTodaySuccess ? "EVET ✅" : "HAYIR ❌"}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
