"use client";

import { useState, useEffect } from "react";
import type { Quadrant } from "./QuadrantDashboard";

const QUADRANT_COLORS: Record<Quadrant, { border: string; bg: string; text: string; label: string }> = {
    MIND: { border: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)", text: "#3B82F6", label: "🧠 MIND" },
    BODY: { border: "#22C55E", bg: "rgba(34, 197, 94, 0.08)", text: "#22C55E", label: "💪 BODY" },
    SPIRIT: { border: "#A855F7", bg: "rgba(168, 85, 247, 0.08)", text: "#A855F7", label: "🔮 SPIRIT" },
    VOCATION: { border: "#F97316", bg: "rgba(249, 115, 22, 0.08)", text: "#F97316", label: "⚡ VOCATION" },
};

interface ChannelState {
    isActive: boolean;
    quadrant: Quadrant;
    activatedAt: string | null;
}

export default function ChannelDetector() {
    const [channel, setChannel] = useState<ChannelState>({
        isActive: false,
        quadrant: "VOCATION",
        activatedAt: null,
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("goat-channel-v1");
        if (saved) {
            try {
                setChannel(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse channel data");
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-channel-v1", JSON.stringify(channel));
        }
    }, [channel, isLoaded]);

    const toggleActive = () => {
        setChannel(prev => ({
            ...prev,
            isActive: !prev.isActive,
            activatedAt: !prev.isActive ? new Date().toISOString() : null,
        }));
    };

    const cycleQuadrant = () => {
        const order: Quadrant[] = ["MIND", "BODY", "SPIRIT", "VOCATION"];
        const idx = order.indexOf(channel.quadrant);
        const nextIdx = (idx + 1) % order.length;
        setChannel(prev => ({ ...prev, quadrant: order[nextIdx] }));
    };

    // Calculate duration if active
    const getDuration = (): string => {
        if (!channel.activatedAt) return "";
        const diff = Date.now() - new Date(channel.activatedAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} dk`;
        const hrs = Math.floor(mins / 60);
        const remainMins = mins % 60;
        return `${hrs}s ${remainMins}dk`;
    };

    if (!isLoaded) return null;

    const activeStyle = channel.isActive ? QUADRANT_COLORS[channel.quadrant] : null;

    return (
        <section className="mb-4">
            <div
                className="brutalist-card p-3 transition-all duration-500"
                style={activeStyle ? {
                    borderColor: activeStyle.border,
                    backgroundColor: activeStyle.bg,
                    boxShadow: `0 0 20px ${activeStyle.bg}`,
                } : {}}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                            className={`w-3 h-3 shrink-0 transition-all duration-500 ${channel.isActive ? "animate-pulse" : ""}`}
                            style={{
                                backgroundColor: channel.isActive ? activeStyle!.border : "#666",
                                boxShadow: channel.isActive ? `0 0 8px ${activeStyle!.border}` : "none",
                            }}
                        />
                        <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted block">
                                Odak Modu
                            </span>
                            {channel.isActive ? (
                                <span className="text-xs font-bold" style={{ color: activeStyle!.text }}>
                                    Odaktasın — bu momentum&apos;u kırma
                                    <span className="text-text-muted text-[9px] ml-2">
                                        {getDuration()}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-xs text-text-muted">
                                    Aktif Odak: YOK
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Quadrant Selector */}
                        <button
                            onClick={cycleQuadrant}
                            className="text-[9px] uppercase tracking-widest font-bold px-2 py-1.5 border transition-all hover:opacity-80"
                            style={{
                                borderColor: QUADRANT_COLORS[channel.quadrant].border,
                                color: QUADRANT_COLORS[channel.quadrant].text,
                                backgroundColor: channel.isActive ? QUADRANT_COLORS[channel.quadrant].bg : "transparent",
                            }}
                            title="Quadrant değiştir"
                        >
                            {QUADRANT_COLORS[channel.quadrant].label}
                        </button>

                        {/* Toggle */}
                        <button
                            onClick={toggleActive}
                            className={`
                                text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-all
                                ${channel.isActive
                                    ? "bg-accent-red/20 border-accent-red text-accent-red hover:bg-accent-red/30"
                                    : "bg-accent-green/10 border-accent-green text-accent-green hover:bg-accent-green/20"
                                }
                            `}
                        >
                            {channel.isActive ? "DURDUR" : "BAŞLAT"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
