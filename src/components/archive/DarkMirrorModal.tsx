"use client";

import { useState, useEffect, useCallback } from "react";
import { darkMirrorMessages } from "@/data/mock";

interface DarkMirrorModalProps {
    open: boolean;
    onClose: () => void;
}

export default function DarkMirrorModal({ open, onClose }: DarkMirrorModalProps) {
    const [countdown, setCountdown] = useState(5);
    const [message] = useState(
        () => darkMirrorMessages[Math.floor(Math.random() * darkMirrorMessages.length)]
    );

    useEffect(() => {
        if (!open) {
            setTimeout(() => setCountdown(5), 0);
            return;
        }

        if (countdown <= 0) return;

        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [open, countdown]);

    const handleDismiss = useCallback(() => {
        if (countdown <= 0) onClose();
    }, [countdown, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6"
            onClick={handleDismiss}
        >
            {/* Glitch Lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-accent-red/60" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-accent-red/60" />

            {/* Icon */}
            <div className="text-5xl mb-6 animate-pulse">💀</div>

            {/* Message */}
            <div className="max-w-lg text-center space-y-4">
                {message.split("\n").map((line, i) => (
                    <p
                        key={i}
                        className={`
              font-bold uppercase tracking-wide leading-relaxed
              ${i === 0 ? "text-xl md:text-2xl text-accent-red" : "text-sm md:text-base text-red-400/80"}
            `}
                    >
                        {line}
                    </p>
                ))}
            </div>

            {/* Dismiss */}
            <div className="mt-10">
                {countdown > 0 ? (
                    <p className="text-xs text-text-muted uppercase tracking-widest tabular-nums">
                        Kapat — {countdown}s
                    </p>
                ) : (
                    <button
                        onClick={handleDismiss}
                        className="brutalist-border px-6 py-2.5 text-xs uppercase tracking-widest text-text-muted hover:text-accent-red hover:border-accent-red transition-colors cursor-pointer"
                    >
                        DEVAM ET
                    </button>
                )}
            </div>
        </div>
    );
}
