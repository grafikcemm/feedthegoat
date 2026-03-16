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

export default function RightPanel() {
    const [openCard, setOpenCard] = useState<number | null>(null);

    const toggleCard = (idx: number) => {
        if (openCard === idx) setOpenCard(null);
        else setOpenCard(idx);
    };

    return (
        <div className="fixed right-0 top-32 z-50 flex flex-col gap-4 items-end pointer-events-none">
            
            {/* KART 1: KARAR FİLTRESİ */}
            <div className="pointer-events-auto flex items-start justify-end transition-all duration-300">
                {openCard !== 0 && (
                    <button 
                        onClick={() => toggleCard(0)}
                        className="bg-surface/80 backdrop-blur-sm border border-r-0 border-border text-text hover:text-white hover:bg-surface transition-all py-4 px-2 flex items-center justify-center cursor-pointer shadow-lg"
                        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">🧭 Karar Filtresi</span>
                    </button>
                )}
                {openCard === 0 && (
                    <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-r-0 border-border shadow-2xl w-[320px] md:w-[380px] max-h-[70vh] flex flex-col animate-slide-in-right rounded-l-md overflow-hidden">
                        <div className="p-3 border-b border-border bg-black flex items-center justify-between sticky top-0">
                            <span className="font-bold text-xs tracking-widest uppercase text-accent-green flex items-center gap-2">
                                🧭 Karar Filtresi
                            </span>
                            <button onClick={() => setOpenCard(null)} className="text-text-muted hover:text-white px-2 py-1">✕</button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-5">
                            <div className="p-3 border-l-2 border-accent-green bg-accent-green/5 text-[11px] text-text-muted font-medium italic leading-relaxed">
                                &quot;Hayatının merkezine tekrar kendini koy. Daha net teklif. Daha az belirsiz müşteri. Daha yüksek görünürlük.&quot;
                            </div>
                            {DECISION_FILTER.map((section, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h4 className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em] border-b border-border/50 pb-1">
                                        {section.title}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {section.cards.map((card, cidx) => (
                                            <div key={cidx} className="p-3 border border-border/50 bg-surface/30 hover:border-text-muted/50 transition-colors">
                                                <span className="text-xs font-bold text-text block mb-1 uppercase tracking-widest">{card.h}</span>
                                                <span className="text-[10px] text-text-muted leading-snug block">{card.p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* KART 2: ERKEKLİK GERÇEKLERİ */}
            <div className="pointer-events-auto flex items-start justify-end transition-all duration-300">
                {openCard !== 1 && (
                    <button 
                        onClick={() => toggleCard(1)}
                        className="bg-surface/80 backdrop-blur-sm border border-r-0 border-border text-text hover:text-white hover:bg-surface transition-all py-4 px-2 flex items-center justify-center cursor-pointer shadow-lg"
                        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">🛡️ Karakter & Disiplin</span>
                    </button>
                )}
                {openCard === 1 && (
                    <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-r-0 border-border shadow-2xl w-[320px] md:w-[380px] max-h-[70vh] flex flex-col animate-slide-in-right rounded-l-md overflow-hidden">
                        <div className="p-3 border-b border-border bg-black flex items-center justify-between sticky top-0">
                            <span className="font-bold text-xs tracking-widest uppercase text-text flex items-center gap-2">
                                🛡️ Karakter & Disiplin
                            </span>
                            <button onClick={() => setOpenCard(null)} className="text-text-muted hover:text-white px-2 py-1">✕</button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-2">
                            {MALE_TRUTHS.map((truth, idx) => (
                                <div key={idx} className="p-3 border border-border/30 bg-surface/10 hover:bg-surface/20 transition-colors flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-text uppercase tracking-widest leading-snug">{truth.title}</span>
                                    <span className="text-[10px] text-text-muted italic">{truth.subtitle}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
