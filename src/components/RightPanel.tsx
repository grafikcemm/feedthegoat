"use client";

import { useState } from "react";

const DECISION_FILTER = [
    {
        title: "2026'da Dikkat Et",
        cards: [
            { h: "Muğlak para yok", p: "Ortak para, borç, veresiye ve net olmayan anlaşmalara dikkat et." },
            { h: "Yorgunken karar verme", p: "Duygusal yorgunlukla profesyonel karar alma; bir gece bekle." },
            { h: "Aşk kariyeri bozmasın", p: "Özel hayat işin yönünü bozuyorsa geri çekil." },
            { h: "İlham değil ritim", p: "İyi hissettiğinde çok çalışıp kötü hissettiğinde sistemi bırakma." },
        ]
    },
    {
        title: "2026'da Finansal Büyüme",
        cards: [
            { h: "3 gelir hattı kur", p: "Premium hizmet + düzenli retainer + ölçeklenebilir ürün." },
            { h: "Her işi yapma", p: "'Ben şu problemi çözüyorum' cümleni netleştir." },
            { h: "Görünür üret", p: "Portfolyo, case study, breakdown, süreç anlatımı." },
            { h: "İlk yarı çevre, güz marka", p: "Önce network ve iş birlikleri; sonra rebrand ve premium." },
            { h: "Teknolojiyle kavga etme", p: "Yeni araçları yaratıcı kaldıraç olarak kullan." },
            { h: "Para ile duyguyu ayır", p: "Ayrı iş hesabı, rezerv, net ödeme şartı." },
        ]
    }
];

const MALE_TRUTHS = [
    { title: "Geçmişi unut, bugünü yönet", subtitle: "Olmuşla ölmüşe çare yok." },
    { title: "Sorumluluk al, suçlama", subtitle: "Hata senin değilse bile düzeltmek senin işindir." },
    { title: "Disiplin gerekince yapılır", subtitle: "Canın isteyince yapılan şeyin adı hobi." },
    { title: "Az konuş, çok üret", subtitle: "Planlarını değil, sonuçlarını anlat." },
    { title: "Kısa haz değil, uzun sonuç düşün", subtitle: "Bugünün fedakarlığı, yarının özgürlüğü." },
    { title: "Vücut yap; enerji tabanındır", subtitle: "Fiziksel zayıflık, zihinsel kararsızlık getirir." },
    { title: "Giyinmeyi ve duruşu ciddiye al", subtitle: "Önce görünümünle saygı uyandır." },
    { title: "Özgüven kanıtla kurulur", subtitle: "Fake it till you make it değil, yap ve yaslan." },
    { title: "Savunma disiplini edin", subtitle: "Kendini yönetemezsen, başkaları seni yönetir." },
    { title: "Saygılı ol, her şeyi anlatma", subtitle: "Gizem zayıflık değildir." },
    { title: "Çevreni filtrele", subtitle: "Belirsiz, vizyonsuz insanlardan uzak dur." },
    { title: "Ailene sahip çık", subtitle: "Önce sen güçlü olacaksın ki onlara bakasın." },
    { title: "Dinine bağlı ol", subtitle: "Sonsuzluğu unutan, bugünü de kaybeder." },
    { title: "Allah'tan başka kimseden korkma", subtitle: "Yol bellidir." }
];

export default function RightPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [expandedTab, setExpandedTab] = useState<number | null>(0);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 transition-opacity backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sliding Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-[#0A0A0A] border-l border-border z-50 transform transition-transform duration-300 ease-out overflow-y-auto flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-[#0A0A0A] z-10">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest text-text">Sistem Filtreleri</span>
                        <span className="text-[10px] text-text-muted uppercase tracking-widest">Kişilik ve Karar Mekanizması</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 border border-border flex items-center justify-center text-text hover:bg-surface/10 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 space-y-4 flex-1">
                    
                    {/* ACCORDION 1: KİŞİSEL KARAR FİLTRESİ */}
                    <div className="border border-border bg-surface/5">
                        <button 
                            onClick={() => setExpandedTab(expandedTab === 0 ? null : 0)}
                            className="w-full text-left p-4 flex items-center justify-between bg-black/50 hover:bg-surface/20 transition-colors"
                        >
                            <span className="font-bold text-sm tracking-widest uppercase text-accent-green">
                                🧭 KİŞİSEL KARAR FİLTRESİ
                            </span>
                            <span className="text-text-muted text-xs font-bold">{expandedTab === 0 ? "−" : "＋"}</span>
                        </button>

                        {expandedTab === 0 && (
                            <div className="p-4 bg-background/50 space-y-6 fade-in border-t border-border/50">
                                <div className="p-3 border-l-2 border-accent-green bg-accent-green/5 mb-6">
                                    <h3 className="text-xs font-bold text-accent-green uppercase mb-1">Özet Motto</h3>
                                    <p className="text-[11px] text-text-muted font-medium italic leading-relaxed">
                                        "Hayatının merkezine tekrar kendini koy. Daha net teklif. Daha az belirsiz müşteri. Daha yüksek görünürlük."
                                    </p>
                                </div>

                                {DECISION_FILTER.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em] border-b border-border/50 pb-1">
                                            {section.title}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {section.cards.map((card, cidx) => (
                                                <div key={cidx} className="p-3 border border-border/50 bg-surface/5 hover:border-text-muted/50 transition-colors">
                                                    <span className="text-xs font-bold text-text block mb-1 uppercase tracking-widest">
                                                        {card.h}
                                                    </span>
                                                    <span className="text-[10px] text-text-muted leading-snug block">
                                                        {card.p}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACCORDION 2: ERKEKLİK GERÇEKLERİ */}
                    <div className="border border-border bg-surface/5">
                        <button 
                            onClick={() => setExpandedTab(expandedTab === 1 ? null : 1)}
                            className="w-full text-left p-4 flex items-center justify-between bg-black/50 hover:bg-surface/20 transition-colors"
                        >
                            <span className="font-bold text-sm tracking-widest uppercase text-text">
                                🛡️ KARAKTER & DİSİPLİN
                            </span>
                            <span className="text-text-muted text-xs font-bold">{expandedTab === 1 ? "−" : "＋"}</span>
                        </button>

                        {expandedTab === 1 && (
                            <div className="p-4 bg-background/50 space-y-2 fade-in border-t border-border/50">
                                {MALE_TRUTHS.map((truth, idx) => (
                                    <div key={idx} className="p-3 border-l-2 border-text bg-surface/10 hover:bg-surface/20 transition-colors flex flex-col gap-1">
                                        <span className="text-xs font-bold text-text uppercase tracking-widest leading-snug">
                                            {truth.title}
                                        </span>
                                        <span className="text-[10px] text-text-muted italic">
                                            {truth.subtitle}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
