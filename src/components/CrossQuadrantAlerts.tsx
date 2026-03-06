"use client";

import { useState, useEffect } from "react";

interface AlertData {
    id: string;
    type: "warning" | "danger" | "info";
    message: string;
    detail: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: string;
}

// Track daily quadrant completion for cross-quadrant analysis
interface DailyQuadrantLog {
    date: string;
    bodyCompleted: boolean;
    vocationCompleted: boolean;
    spiritHasTasks: boolean;
}

export default function CrossQuadrantAlerts() {
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load dismissed alerts for today
        const today = new Date().toISOString().split("T")[0];
        const savedDismissed = localStorage.getItem(`goat-alerts-dismissed-${today}`);
        if (savedDismissed) {
            try {
                setDismissed(JSON.parse(savedDismissed));
            } catch (e) { /* ignore */ }
        }

        // Load or initialize daily quadrant logs
        const savedLogs = localStorage.getItem("goat-quadrant-logs-v1");
        let logs: DailyQuadrantLog[] = [];
        if (savedLogs) {
            try {
                logs = JSON.parse(savedLogs);
            } catch (e) { /* ignore */ }
        }

        // Ensure today has an entry
        const todayLog = logs.find(l => l.date === today);
        if (!todayLog) {
            logs.push({
                date: today,
                bodyCompleted: false,
                vocationCompleted: false,
                spiritHasTasks: false,
            });
            // Keep only last 30 days
            if (logs.length > 30) {
                logs = logs.slice(-30);
            }
            localStorage.setItem("goat-quadrant-logs-v1", JSON.stringify(logs));
        }

        // Analyze and generate alerts
        const generatedAlerts: AlertData[] = [];

        // 1. BODY 3 gün üst üste 0%
        const last3Days = logs.slice(-3);
        if (last3Days.length >= 3 && last3Days.every(l => !l.bodyCompleted)) {
            generatedAlerts.push({
                id: "body-3day",
                type: "warning",
                message: "Fiziksel Enerji Uyarısı",
                detail: "Fiziksel enerji düşüşü yaratıcılığı ve İŞ/KARİYER performansını da olumsuz etkiler. BEDEN alanı 3 gündür %0.",
                color: "#FFB800",
                borderColor: "#FFB800",
                bgColor: "rgba(255, 184, 0, 0.06)",
                icon: "⚠️",
            });
        }

        // 2. VOCATION görevleri 5 gün tamamlanmadı
        const last5Days = logs.slice(-5);
        if (last5Days.length >= 5 && last5Days.every(l => !l.vocationCompleted)) {
            generatedAlerts.push({
                id: "vocation-5day",
                type: "danger",
                message: "Finansal Baskı Riski",
                detail: "Finansal baskı ZİHİN alanını blokluyor olabilir. İŞ/KARİYER görevleri 5 gündür tamamlanmadı.",
                color: "#FF3B3B",
                borderColor: "#FF3B3B",
                bgColor: "rgba(255, 59, 59, 0.06)",
                icon: "🚨",
            });
        }

        // 3. SPIRIT hiç görev yoksa
        // Check if spirit has tasks in logs
        const spiritCheck = todayLog || logs[logs.length - 1];
        if (!spiritCheck || !spiritCheck.spiritHasTasks) {
            generatedAlerts.push({
                id: "spirit-empty",
                type: "info",
                message: "RUH Alanı Boş",
                detail: "İzolasyon uzun vadede ZİHİN gelişimini yavaşlatır. RUH alanına destekleyici görevler ekle.",
                color: "#F97316",
                borderColor: "#F97316",
                bgColor: "rgba(249, 115, 22, 0.06)",
                icon: "🔮",
            });
        }

        setAlerts(generatedAlerts);
        setIsLoaded(true);
    }, []);

    const dismissAlert = (id: string) => {
        const today = new Date().toISOString().split("T")[0];
        const newDismissed = [...dismissed, id];
        setDismissed(newDismissed);
        localStorage.setItem(`goat-alerts-dismissed-${today}`, JSON.stringify(newDismissed));
    };

    if (!isLoaded) return null;

    const visibleAlerts = alerts.filter(a => !dismissed.includes(a.id));
    if (visibleAlerts.length === 0) return null;

    return (
        <section className="space-y-2 mb-4">
            {visibleAlerts.map((alert) => (
                <div
                    key={alert.id}
                    className="brutalist-card p-3 flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                    style={{
                        borderColor: alert.borderColor,
                        backgroundColor: alert.bgColor,
                    }}
                >
                    <span className="text-lg shrink-0 mt-0.5">{alert.icon}</span>
                    <div className="flex-1 min-w-0">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5"
                            style={{ color: alert.color }}
                        >
                            {alert.message}
                        </span>
                        <span className="text-[11px] text-text-muted leading-relaxed block">
                            {alert.detail}
                        </span>
                    </div>
                    <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-text-muted hover:text-text text-xs shrink-0 p-1 transition-colors"
                        title="Kapat"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </section>
    );
}
