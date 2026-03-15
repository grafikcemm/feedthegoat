"use client";

import { useState, useEffect } from "react";

export default function DailyPrayer() {
    const [checked, setChecked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const saved = localStorage.getItem(`goat-prayer-${todayStr}`);
        if (saved) {
            setTimeout(() => {
                try { setChecked(JSON.parse(saved)); } catch {}
            }, 0);
        }
    }, [todayStr]);

    useEffect(() => {
        if (!isClient) return;
        localStorage.setItem(`goat-prayer-${todayStr}`, JSON.stringify(checked));
    }, [checked, isClient, todayStr]);

    const toggleCheckbox = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setChecked(!checked);
    };

    if (!isClient) return null;

    return (
        <section className="mt-8 border-t border-border/30 pt-6 px-2 mb-10">
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-4">
                    <div 
                        onClick={toggleCheckbox}
                        className={`w-8 h-8 shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                            checked ? "border-text bg-text text-black" : "border-border bg-transparent text-transparent hover:border-text-muted"
                        }`}
                    >
                        <span className="text-sm font-bold">✓</span>
                    </div>
                    <span className={`text-xs md:text-sm font-bold uppercase tracking-widest select-none ${checked ? 'text-text-muted line-through' : 'text-text'}`}>
                        Günü Bitirmeden Duamı Okudum
                    </span>
                </div>
                <span className="text-[10px] text-text-muted uppercase tracking-[0.2em]">
                    {isExpanded ? "Gizle ↓" : "Metin ↑"}
                </span>
            </div>

            {isExpanded && (
                <div className="mt-4 p-4 border border-border/50 bg-black text-center fade-in">
                    <p className="text-xs md:text-sm italic leading-loose text-text-muted tracking-widest">
                        Ya Rabbim, nefsimin beni sürüklediği zevklerden, ekran esaretinden ve tembellikten koru.<br/>
                        Geçmişte düştüğüm hataları affet, o günler bitti. Ellerime, drone&apos;uma, AI sistemlerime bereket kat.<br/>
                        Bedenimi sağlıklı tut, zihnime berraklık ver. Ailemin yüzünü güldürecek günleri yakınlaştır.<br/>
                        Âmin.
                    </p>
                </div>
            )}
        </section>
    );
}
