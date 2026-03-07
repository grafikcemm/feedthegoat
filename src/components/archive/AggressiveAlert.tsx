"use client";

import { useEffect, useState } from "react";

interface AggressiveAlertProps {
    doneCount: number;
    totalCount: number;
}

export default function AggressiveAlert({ doneCount, totalCount }: AggressiveAlertProps) {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const checkTimeAndScore = () => {
            const now = new Date();
            const hours = now.getHours();

            // Score calculations
            const pointsPerTask = 12.5;
            const maxScore = totalCount * pointsPerTask;
            const currentScore = doneCount * pointsPerTask;
            const scorePct = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;

            // Trigger after 14:00 if score is below 50%
            if (hours >= 14 && scorePct < 50) {
                setShowAlert(true);
            } else {
                setShowAlert(false);
            }
        };

        checkTimeAndScore();

        // Setup an interval to check periodically (e.g. every minute)
        const interval = setInterval(checkTimeAndScore, 60000);
        return () => clearInterval(interval);
    }, [doneCount, totalCount]);

    if (!showAlert) return null;

    return (
        <div className="w-full bg-accent-red text-black brutalist-border mb-8 p-4 md:p-6 animate-pulse-slow">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-3xl lg:text-4xl">⚠️</span>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest leading-tight">
                            KONFOR ALANI ÖLDÜRÜR. O ÇOCUK SENİ İZLİYOR.
                        </h2>
                        <p className="text-sm font-medium mt-1">
                            Saat 14:00&apos;ü geçti ve Dopamin Skorun %50&apos;nin altında. İrade kasın eriyor.
                        </p>
                    </div>
                </div>
                <button
                    className="border-2 border-black px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-accent-red transition-colors whitespace-nowrap"
                    onClick={() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                >
                    ŞİMDİ HAREKETE GEÇ
                </button>
            </div>
        </div>
    );
}
