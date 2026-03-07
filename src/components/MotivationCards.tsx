"use client";

import { useState, useEffect } from "react";
import { getDailyQuote, Quote } from "@/utils/dailyQuote";

export default function MotivationCards() {
    const [quote, setQuote] = useState<Quote | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setQuote(getDailyQuote());
        }, 0);
    }, []);

    if (!quote) return (
        <section className="brutalist-card p-3 flex items-center justify-center">
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest animate-pulse">
                LOADING...
            </p>
        </section>
    );

    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Aphorism */}
                <div className="brutalist-card group relative overflow-hidden flex flex-col justify-center p-4">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-red" />
                    <p className="text-[10px] uppercase tracking-[0.25em] text-accent-red mb-2 pl-4 font-bold">
                        KİMLİK İNŞASI ({quote.theme})
                    </p>
                    <p className="text-sm leading-relaxed font-bold text-text pl-4">
                        &ldquo;{quote.aphorism}&rdquo;
                    </p>
                </div>

                {/* Strategy */}
                <div className="brutalist-card group relative overflow-hidden flex flex-col justify-center p-4">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-green" />
                    <p className="text-[10px] uppercase tracking-[0.25em] text-accent-green mb-2 pl-4 font-bold">
                        STRATEJİ / AKSİYON
                    </p>
                    <p className="text-sm leading-relaxed font-bold text-text pl-4">
                        &ldquo;{quote.strategy}&rdquo;
                    </p>
                </div>
            </div>
        </section>
    );
}
