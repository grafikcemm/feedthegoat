"use client";

import { useState } from "react";

interface EndDayButtonProps {
    score: number;
    maxBaseScore: number;
    onFail: () => void;
    onSuccess: () => void;
}

export default function EndDayButton({ score, maxBaseScore, onFail, onSuccess }: EndDayButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    // If score >= 3, it's a win.
    const isSuccess = score >= maxBaseScore;

    const handleClick = () => {
        alert("Yarın için derin işini de Active Tasks üzerinden seçmeyi unutma!");
        if (isSuccess) {
            onSuccess();
        } else {
            onFail();
        }
    };

    return (
        <section className="mt-8 mb-12 flex justify-center">
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    relative group overflow-hidden px-8 py-4 
                    border-2 font-mono uppercase tracking-[0.3em] font-bold text-sm
                    transition-all duration-300 w-full sm:w-auto
                    ${isSuccess
                        ? "border-accent-green text-accent-green hover:bg-accent-green hover:text-background"
                        : "border-text text-text hover:bg-text hover:text-background"
                    }
                `}
            >
                {/* Background Glitch Effect wrapper */}
                <span className="absolute inset-0 w-full h-full bg-surface opacity-0 group-hover:opacity-10 transition-opacity" />

                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isHovered ? (
                        <span>GÜNÜ BİTİR</span>
                    ) : (
                        <span>GÜNÜ BİTİR</span>
                    )}
                </span>
            </button>
        </section>
    );
}
