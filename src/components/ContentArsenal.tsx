"use client";

import { useState, useEffect } from "react";

interface ArsenalItem {
    id: number;
    url: string;
    date: string;
    isUsed?: boolean;
}

export default function ContentArsenal() {
    const [items, setItems] = useState<ArsenalItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [url, setUrl] = useState("");

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("goat-content-arsenal-v3");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setItems(parsed), 0);
            } catch {
                console.error("Failed to parse Content Arsenal data");
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-content-arsenal-v3", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const handleAdd = () => {
        if (!url.trim()) return;
        const newItem: ArsenalItem = {
            id: Date.now(),
            url,
            date: new Date().toLocaleDateString("tr-TR"),
            isUsed: false
        };
        setItems([newItem, ...items]);
        setUrl("");
    };

    const toggleUsed = (id: number) => {
        setItems(items.map(item => item.id === id ? { ...item, isUsed: !item.isUsed } : item));
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    if (!isLoaded) return null;

    const usedCount = items.filter(i => i.isUsed).length;

    return (
        <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-text mb-2">
                AKSİYON CEPHANELİĞİ (İÇERİK DEPOSU)
            </h2>
            <p className="text-[10px] text-text-muted mb-6 uppercase tracking-wider leading-relaxed">
                İLHAM İÇİN KAYDET.
            </p>

            {/* İstatistik Bandı */}
            <div className="bg-surface border border-border px-3 py-2 mb-6 text-[10px] uppercase tracking-widest font-bold flex flex-wrap gap-x-4 gap-y-2 text-text/80 items-center justify-between">
                <div>
                    <span className="text-accent-green">{items.length} Kayıtlı</span>
                </div>
                <div className="text-text-muted">
                    {usedCount}/{items.length} Kullanıldı
                </div>
            </div>

            {/* Sadeleştirilmiş Ekleme Formu */}
            <div className="brutalist-card p-4 border border-border bg-surface mb-6 flex flex-col sm:flex-row gap-3">
                <input
                    type="url"
                    placeholder="İçerik Linki (URL)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-accent-green text-text placeholder:text-text-muted/50 transition-colors"
                />

                <button
                    onClick={handleAdd}
                    className="py-2 px-6 bg-text text-black font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-text-muted transition-colors sm:w-auto w-full"
                >
                    EKLE
                </button>
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className={`brutalist-card p-4 border transition-colors ${item.isUsed ? 'bg-accent-green/5 border-accent-green/30' : 'border-border bg-surface/10'}`}>
                        <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">

                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-accent-green hover:underline truncate block w-full max-w-full sm:max-w-md">
                                    {item.url} &rarr;
                                </a>
                                <span className="text-[9px] text-text-muted tabular-nums tracking-widest">{item.date}</span>
                            </div>

                            <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={() => toggleUsed(item.id)}
                                    className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border text-[9px] uppercase font-bold tracking-widest transition-colors ${item.isUsed ? 'bg-accent-green text-background border-accent-green' : 'bg-transparent border-border hover:border-accent-green text-text-muted'}`}
                                >
                                    {item.isUsed ? '✓' : 'KULLAN'}
                                </button>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="px-4 py-2 border border-border hover:border-accent-red text-text-muted hover:text-accent-red text-[11px] transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-border text-text-muted text-[11px] uppercase tracking-widest font-bold">
                        CEPHANELİK BOŞ.
                    </div>
                )}
            </div>
        </section>
    );
}
