"use client";

import { useState, useEffect } from "react";

// İçerik Havuzu
const DAILY_PODCASTS = [
    { id: "p-0", title: "Andrew Huberman: Dopamin Kontrolü ve Motivasyon", expectedTakeaway: "dopamin" },
    { id: "p-1", title: "Barış Özcan: 'Hayır' Deme Sanatı ve Sınırlar", expectedTakeaway: "sınır" },
    { id: "p-2", title: "TED: Tim Urban - Usta Bir Erteleyicinin Zihni", expectedTakeaway: "ercele" },
    { id: "p-3", title: "Ortamlarda Satılacak Bilgi: Stoacılık ve Marcus Aurelius", expectedTakeaway: "kontrol" },
    { id: "p-4", title: "TED: Simon Sinek - Harika Liderler Neden Güven Verir", expectedTakeaway: "güve" },
    { id: "p-5", title: "David Goggins: Zihni Nasırlamak ve Acı", expectedTakeaway: "acı" },
    { id: "p-6", title: "TED: Brené Brown - Kırılganlığın Gücü", expectedTakeaway: "kırılgan" },
    { id: "p-7", title: "İlber Ortaylı: Bir Ömür Nasıl Yaşanır", expectedTakeaway: "hedef" },
    { id: "p-8", title: "TED: Kelly McGonigal - Stresle Nasıl Arkadaş Olunur", expectedTakeaway: "stres" },
    { id: "p-9", title: "Jordan Peterson: Sorumluluk Almak ve Odanı Toplamak", expectedTakeaway: "sorumluluk" },
    { id: "p-10", title: "TED: Amy Cuddy - Vücut Diliniz Kim Olduğunuzu Belirler", expectedTakeaway: "beden" },
    { id: "p-11", title: "Fatih Altaylı: Celal Şengör - Bilimsel Disiplin", expectedTakeaway: "disiplin" },
    { id: "p-12", title: "Naval Ravikant: Para Kazanmak ve Mutluluk", expectedTakeaway: "değer" },
    { id: "p-13", title: "TED: Julian Treasure - İnsanların Dinlemek İsteyeceği Şekilde Konuşmak", expectedTakeaway: "dinle" }
];

export default function TheArsenal() {
    const [todaysPodcast, setTodaysPodcast] = useState<typeof DAILY_PODCASTS[0] | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [actionPlan, setActionPlan] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
        );
        const todayIndex = dayOfYear % DAILY_PODCASTS.length;
        setTimeout(() => {
            setTodaysPodcast(DAILY_PODCASTS[todayIndex]);
        }, 0);
    }, []);

    if (!todaysPodcast) return null;


    const handleVerify = () => {
        if (actionPlan.trim().length < 10) {
            setStatus("error");
            setFeedback("Çok kısa. Derinleş.");
            return;
        }

        const normalizedPlan = actionPlan.toLocaleLowerCase("tr-TR");
        const isMatch = normalizedPlan.includes(todaysPodcast.expectedTakeaway.toLocaleLowerCase("tr-TR"));

        if (isMatch) {
            setStatus("success");
            setFeedback("Doğru anlaşıldı. Şimdi hayatına geçir.");
        } else {
            setStatus("error");
            setFeedback("Odaklanamamışsın. Tekrar dinle ve asıl mesajı bul.");
        }
    };

    return (
        <section>
            {/* Collapsed header — always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full brutalist-card p-3 flex items-center gap-3 text-left hover:bg-surface-hover transition-colors group ${status === "success" ? "border-accent-green/30 bg-accent-green/5" : "border-accent-amber glow-amber bg-accent-amber/5"}`}
            >
                <span className="text-text-muted text-xs shrink-0">{isExpanded ? '▼' : '▶'}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-accent-amber font-bold shrink-0 animate-pulse">
                    ⚠️ BİLGİ CEPHANELİĞİ (GÜNÜN HEDEFİ)
                </span>
                <span className="text-xs text-text-muted truncate flex-1">
                    {todaysPodcast.title}
                </span>
                {status === "success" && (
                    <span className="text-accent-green text-[10px] font-bold tracking-widest uppercase shrink-0">✓ KAYITLI</span>
                )}
            </button>

            {/* Expanded: compact form */}
            {isExpanded && (
                <div className={`brutalist-card border-t-0 p-4 transition-all duration-300 ${status === "success" ? "border-accent-green/30 bg-accent-green/5"
                    : status === "error" ? "border-accent-red/30 bg-accent-red/5"
                        : "border-border bg-surface/20"
                    }`}>
                    {status !== "success" ? (
                        <div className="space-y-3">
                            <textarea
                                value={actionPlan}
                                onChange={(e) => {
                                    setActionPlan(e.target.value);
                                    if (status === "error") setStatus("idle");
                                }}
                                placeholder="Ne anladın ve nasıl uygulayacaksın?"
                                className={`w-full bg-background border p-2 text-xs text-text focus:outline-none transition-colors min-h-[50px] resize-none ${status === "error" ? "border-accent-red" : "border-border focus:border-text-muted"
                                    }`}
                            />
                            {status === "error" && (
                                <p className="text-[10px] text-accent-red uppercase tracking-wider font-bold">{feedback}</p>
                            )}
                            <button
                                onClick={handleVerify}
                                disabled={actionPlan.trim().length === 0}
                                className={`w-full py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${actionPlan.trim().length > 0
                                    ? "bg-text text-black hover:bg-text-muted"
                                    : "bg-surface text-text-muted cursor-not-allowed border border-border"
                                    }`}
                            >
                                Kaydet
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 border-l-2 border-accent-green bg-accent-green/10">
                            <p className="text-xs text-text italic">&quot;{actionPlan}&quot;</p>
                            <p className="text-[10px] text-accent-green/80 mt-1">{feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
