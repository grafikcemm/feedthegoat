"use client";

import { useState } from "react";

// Genişletilmiş ve Türkçe/Çeviri İçerik Havuzu (Psikoloji, Maskülenite, İş, TED)
const DAILY_PODCASTS = [
    { id: "p-0", title: "Andrew Huberman (Türkçe Çeviri): Dopamin Kontrolü ve Motivasyon", expectedTakeaway: "dopamin" },
    { id: "p-1", title: "Barış Özcan: 'Hayır' Deme Sanatı ve Sınırlar", expectedTakeaway: "sınır" },
    { id: "p-2", title: "TED: Tim Urban - Usta Bir Erteleyicinin Zihni (Türkçe Altyazılı)", expectedTakeaway: "ercele" },
    { id: "p-3", title: "Ortamlarda Satılacak Bilgi: Stoacılık ve Marcus Aurelius", expectedTakeaway: "kontrol" },
    { id: "p-4", title: "TED: Simon Sinek - Harika Liderler Neden Size Güven Verir (Türkçe Altyazılı)", expectedTakeaway: "güve" },
    { id: "p-5", title: "David Goggins (Türkçe Analiz): Zihni Nasırlamak ve Acı", expectedTakeaway: "acı" },
    { id: "p-6", title: "TED: Brené Brown - Kırılganlığın Gücü (Türkçe Altyazılı)", expectedTakeaway: "kırılgan" },
    { id: "p-7", title: "İlber Ortaylı: Bir Ömür Nasıl Yaşanır (Disiplin ve Hedef)", expectedTakeaway: "hedef" },
    { id: "p-8", title: "TED: Kelly McGonigal - Stresle Nasıl Arkadaş Olunur (Türkçe Altyazılı)", expectedTakeaway: "stres" },
    { id: "p-9", title: "Jordan Peterson (Türkçe Çeviri): Sorumluluk Almak ve Odanı Toplamak", expectedTakeaway: "sorumluluk" },
    { id: "p-10", title: "TED: Amy Cuddy - Vücut Diliniz Kim Olduğunuzu Belirler (Türkçe Altyazılı)", expectedTakeaway: "beden" },
    { id: "p-11", title: "Fatih Altaylı ile Teke Tek: Celal Şengör - Bilimsel Disiplin", expectedTakeaway: "disiplin" },
    { id: "p-12", title: "Naval Ravikant (Türkçe Özet): Para Kazanmak ve Mutluluk", expectedTakeaway: "değer" },
    { id: "p-13", title: "TED: Julian Treasure - İnsanların Dinlemek İsteyeceği Şekilde Nasıl Konuşulur (Türkçe Altyazılı)", expectedTakeaway: "dinle" }
];

export default function TheArsenal() {
    // Yılın gününe göre index belirle (her gün değişsin, sadece haftanın günü değil)
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const todayIndex = dayOfYear % DAILY_PODCASTS.length;
    const todaysPodcast = DAILY_PODCASTS[todayIndex];

    const [actionPlan, setActionPlan] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [feedback, setFeedback] = useState("");

    const handleVerify = () => {
        if (actionPlan.trim().length < 10) {
            setStatus("error");
            setFeedback("Çok kısa. Yüzeysel geçiştirmelere yer yok. Derinleş.");
            return;
        }

        const normalizedPlan = actionPlan.toLocaleLowerCase("tr-TR");
        const isMatch = normalizedPlan.includes(todaysPodcast.expectedTakeaway.toLocaleLowerCase("tr-TR"));

        if (isMatch) {
            setStatus("success");
            setFeedback("Doğru anlaşıldı. Kanun kaydedildi. Şimdi bunu hayatına geçir.");
        } else {
            setStatus("error");
            setFeedback(`Odaklanamamışsın. Çıkarımın ana temayı ıskalıyor. Tekrar dinle ve asıl mesajı bul.`);
        }
    };

    return (
        <section className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-4 mt-6">
                <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    Bilgi Cephaneliği (Günün Mühimmatı)
                </h2>
            </div>
            <p className="text-xs text-text-muted mb-4 uppercase tracking-wider">
                Ham bilgi ağırlıktır, uygulanan bilgi silahtır. Sadece dinleyip geçme, anla ve uygula.
            </p>

            <div className={`brutalist-card p-6 transition-all duration-300 ${status === "success" ? "border-accent-green/30 bg-accent-green/5"
                : status === "error" ? "border-accent-red/30 bg-accent-red/5"
                    : "border-border bg-surface/20"
                }`}>

                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent-amber/20 text-accent-amber">
                        GÜNLÜK PODCAST
                    </span>
                    {status === "success" && (
                        <span className="text-accent-green text-xs font-bold tracking-widest uppercase">✓ Absorbe Edildi</span>
                    )}
                </div>

                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-text mb-6">
                    {todaysPodcast.title}
                </h3>

                {status !== "success" ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-text-muted block mb-2 font-bold">
                                Ne Anladın ve Nasıl Uygulayacaksın?
                            </label>
                            <textarea
                                value={actionPlan}
                                onChange={(e) => {
                                    setActionPlan(e.target.value);
                                    if (status === "error") setStatus("idle");
                                }}
                                placeholder="Buraya yaz. Kendini kandırma. Gerçek aksiyon adımı ne?"
                                className={`w-full bg-background border p-3 text-sm text-text focus:outline-none transition-colors min-h-[100px] resize-none ${status === "error" ? "border-accent-red focus:border-accent-red" : "border-border focus:border-text-muted"
                                    }`}
                            />
                        </div>

                        {status === "error" && (
                            <div className="p-3 bg-accent-red/10 border-l-2 border-accent-red">
                                <span className="text-xs text-accent-red uppercase tracking-wider font-bold block mb-1">Reddedildi:</span>
                                <span className="text-xs text-accent-red/80">{feedback}</span>
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={actionPlan.trim().length === 0}
                            className={`w-full py-3 text-xs uppercase tracking-widest font-bold transition-all ${actionPlan.trim().length > 0
                                ? "bg-text text-black hover:bg-text-muted"
                                : "bg-surface text-text-muted cursor-not-allowed border border-border"
                                }`}
                        >
                            Analiz Et ve Kaydet
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border-l-2 border-accent-green bg-accent-green/10 mt-4">
                        <span className="text-[10px] uppercase tracking-widest text-accent-green block mb-2 font-bold">Senin Çıkarımın:</span>
                        <p className="text-sm text-text italic">"{actionPlan}"</p>
                        <div className="mt-4 pt-4 border-t border-accent-green/20">
                            <span className="text-[10px] uppercase tracking-widest text-accent-green block mb-1 font-bold">Sistem Onayı:</span>
                            <span className="text-xs text-accent-green/80">{feedback}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
