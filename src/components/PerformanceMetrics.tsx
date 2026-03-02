"use client";

import { useState, useEffect } from "react";
import { dailyTasks } from "@/data/mock";

export interface PerformanceMetricsProps {
    completed: Record<string, boolean>;
    refreshKey?: number;
}

export default function PerformanceMetrics({ completed, refreshKey }: PerformanceMetricsProps) {
    const [bonusDopamine, setBonusDopamine] = useState(0);

    useEffect(() => {
        const checkBonus = () => {
            const saved = localStorage.getItem("goat-bonus-dopamine");
            if (saved) {
                setBonusDopamine(parseFloat(saved));
            }
        };
        checkBonus();

        window.addEventListener("dopamineUpdated", checkBonus);
        return () => window.removeEventListener("dopamineUpdated", checkBonus);
    }, [refreshKey]);

    // Hesaplama mantığı (%60 Kırmızı, %40 Sarı)
    // Asla Kırma: 3 Görev, her biri %20 = %60 max
    // Enerjin Varsa: 2 Görev, her biri %20 = %40 max
    // Gym barı etkilemiyor.

    // Güvenlik açısından mock data uzunluklarını kullanmak yerine, görev başına %20 statik olarak kullanıcıdan istendi.
    // Ancak dinamik hesaplamak için: 
    const aslaKirmaCount = dailyTasks.filter(t => t.layer === "asla_kirma").length; // Expected: 3
    const enerjinVarsaCount = dailyTasks.filter(t => t.layer === "enerjin_varsa").length; // Expected: 2

    const doneAslaKirma = dailyTasks.filter(t => t.layer === "asla_kirma" && completed[t.id]).length;
    const doneEnerjinVarsa = dailyTasks.filter(t => t.layer === "enerjin_varsa" && completed[t.id]).length;

    const aslaKirmaPercentage = aslaKirmaCount > 0 ? (doneAslaKirma / aslaKirmaCount) * 60 : 0;
    const enerjinVarsaPercentage = enerjinVarsaCount > 0 ? (doneEnerjinVarsa / enerjinVarsaCount) * 40 : 0;

    const baseScore = aslaKirmaPercentage + enerjinVarsaPercentage;
    const totalScore = Math.min(100, Math.round(baseScore + bonusDopamine));

    // Durum Etiketi
    let statusLabel = "Devam Et";
    let statusColor = "text-accent-red";
    let barColor = "bg-accent-red glow-red";

    if (totalScore >= 100) {
        statusLabel = "Mükemmel Gün";
        statusColor = "text-accent-green";
        barColor = "bg-accent-green glow-green";
    } else if (totalScore >= 60) {
        statusLabel = "İyi Gün";
        statusColor = "text-accent-amber";
        barColor = "bg-accent-amber glow-amber";
    }

    return (
        <section className="mb-0">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted mb-4">
                PERFORMANS METRİKLERİ
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {/* Dopamin Skoru */}
                <div className="brutalist-card border-t-2 border-text/20">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-text">
                                DOPAMİN BARI
                            </p>
                            <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${statusColor}`}>
                                Durum: {statusLabel}
                            </p>
                        </div>
                        <p className={`text-2xl tabular-nums font-bold leading-none ${statusColor}`}>
                            %{totalScore.toFixed(0)}
                        </p>
                    </div>

                    <div className="w-full h-3 bg-surface brutalist-border overflow-hidden">
                        <div
                            className={`h-full progress-fill transition-all duration-500 ease-out ${barColor}`}
                            style={{ width: `${totalScore}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

