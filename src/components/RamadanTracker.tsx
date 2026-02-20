"use client";

import { ramadanProtocol } from "@/data/ramadan";

export default function RamadanTracker() {
    return (
        <section className="mt-8 border-t border-border pt-8">
            <h2 className="text-xs md:text-sm uppercase font-bold tracking-[0.2em] text-accent-amber mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-amber animate-pulse" />
                RAMAZAN OPERASYON MERKEZİ (NÖRO-BİYOLOJİK HACK)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {ramadanProtocol.map((step, index) => (
                    <div
                        key={index}
                        className="brutalist-card border-t-2 border-accent-amber/40 hover:bg-surface-hover transition-colors p-4 flex flex-col"
                    >
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-accent-amber mb-3">
                            {index + 1}. {step.title}
                        </h3>

                        <ul className="space-y-2 mb-auto">
                            {step.items.map((item, i) => (
                                <li key={i} className="text-xs text-text/90 leading-relaxed flex items-start gap-1.5">
                                    <span className="text-text-muted mt-0.5">&gt;</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        {step.forbidden && step.forbidden.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/50">
                                <span className="text-[9px] uppercase tracking-widest font-bold text-accent-red block mb-1">
                                    YASAK:
                                </span>
                                <p className="text-xs text-accent-red/90 leading-relaxed">
                                    {step.forbidden.join(", ")}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
