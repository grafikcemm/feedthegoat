"use client";

import { useState, useEffect } from "react";

interface EndDayButtonProps {
    score: number;
    maxBaseScore: number;
    onFail: () => void;
    onSuccess: () => void;
}

export default function EndDayButton({ score, maxBaseScore, onFail, onSuccess }: EndDayButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // If score >= 3, it's a win.
    const isSuccess = score >= maxBaseScore;

    const handleClick = () => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100]); // Sequence for winning
        }
        // Show inline toast instead of alert
        setShowToast(true);
        
        if (isSuccess) {
            onSuccess();
        } else {
            onFail();
        }
    };

    // Auto-hide toast after 2 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <section className="mt-8 mb-12 flex flex-col items-center gap-4">
            {/* Inline Toast Notification */}
            <div
                className={`
                    px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest
                    transition-all duration-300 ease-out
                    ${showToast 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `}
                style={{ 
                    backgroundColor: "#00FF88", 
                    color: "#0d0d0d",
                    boxShadow: "0 0 20px rgba(0, 255, 136, 0.4)"
                }}
            >
                Gün tamamlandı. 🔥
            </div>

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
