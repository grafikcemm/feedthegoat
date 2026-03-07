"use client";

import { useState, useEffect } from "react";

const SCENARIOS = [
    {
        id: "s-1",
        title: "İş Arkadaşının Kredi Çalması",
        context: "Bir projede günlerce sabahladın. Toplantıda iş arkadaşın sunumu yaparken 'Bu benim fikrimdi' diyerek tüm krediyi üzerine alıyor. Gülümsüyor ve sana bakıyor.",
        objective: "Nice guy gibi susma. Saldırganlaşmadan ama net bir şekilde sınır çiz.",
    },
    {
        id: "s-2",
        title: "Saygısız Eleştiri",
        context: "Partnerin veya yakın bir arkadaşın, başkalarının yanında senin yeteneklerinle veya bir kararınla açıkça alay edici bir şekilde dalga geçiyor.",
        objective: "Ortamı yumuşatmaya çalışma. Olayı geçiştirme. Rahatsızlığını tam o anda belli et.",
    },
    {
        id: "s-3",
        title: "Vakitsiz Talep",
        context: "Ailen veya eski bir dostun, senin çok yoğun olduğun ve kendi hedeflerine odaklanman gereken bir pazar gününü kendilerine ayırmanı talep ediyor. 'Eğer gelmezsen çok kırılırım' diyerek duygu sömürüsü yapıyor.",
        objective: "Suçluluk hissetmeden, onlara hayır de. Kendi önceliklerini savun.",
    },
    {
        id: "s-4",
        title: "Sınırın İhlali",
        context: "Banka kuyruğundasın, acelesi olduğunu söyleyen biri senin önüne geçmeye çalışıyor ve seni umursamıyor.",
        objective: "Varlığını hissettir. Geri adım atma. Kendi alanını koru.",
    }
];

export default function CommunicationSimulator() {
    const [response, setResponse] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [dayOfYear, setDayOfYear] = useState<number>(0);
    useEffect(() => {
        setTimeout(() => setDayOfYear(Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
        )), 0);
    }, []);
    const currentIndex = dayOfYear % SCENARIOS.length;
    const scenario = SCENARIOS[currentIndex];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (response.trim().length < 5) return;
        setSubmitted(true);
    };

    return (
        <section className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-4 mt-6">
                <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    İletişim Simülatörü (Günün Senaryosu)
                </h2>
                <span className="text-[10px] font-bold text-accent-amber bg-accent-amber/20 px-2 py-1 uppercase tracking-widest">
                    ZORLUK SEVİYESİ: GERÇEK Hayat
                </span>
            </div>

            <div className="brutalist-card border-border p-6 bg-surface/30">
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-text mb-2 tracking-wide uppercase">
                                {scenario.title}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed mb-4">
                                {scenario.context}
                            </p>
                            <div className="bg-accent-red/10 border-l-2 border-accent-red p-3 mb-4">
                                <span className="text-xs text-accent-red uppercase tracking-wider font-bold block mb-1">Görev:</span>
                                <span className="text-xs text-text-muted">{scenario.objective}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest text-text-muted block mb-2">
                                Senin Cevabın / Aksiyonun
                            </label>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Buraya yaz. Acıma. Geçiştirme. Sınır Çiz."
                                className="w-full bg-background border border-border p-3 text-sm text-text focus:outline-none focus:border-text-muted transition-colors min-h-[120px] resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={response.trim().length < 5}
                            className={`w-full py-3 text-xs uppercase tracking-[0.2em] font-bold transition-all ${response.trim().length >= 5
                                ? "bg-text text-background hover:bg-text-muted"
                                : "bg-surface text-text-muted cursor-not-allowed border border-border"
                                }`}
                        >
                            Aksiyonu Gerçekleştir
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8 space-y-6">
                        <div className="inline-flex w-16 h-16 rounded-full border-2 border-accent-green items-center justify-center mb-2 glow-green">
                            <span className="text-accent-green text-2xl">✓</span>
                        </div>
                        <div>
                            <h3 className="text-lg uppercase tracking-widest font-bold text-accent-green mb-2">
                                Geri Adım Atmadın
                            </h3>
                            <p className="text-sm text-text-muted">
                                Simülasyondaki bu tavrı gerçek hayatta sergilemek, asıl savaştır.<br />
                                Beynine yeni bir sinir ağı kazıdın. Şimdi bunu hayata geçir.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-accent-green/20">
                            <p className="text-[10px] uppercase tracking-widest text-accent-green mb-1 font-bold">
                                Sınır Korundu
                            </p>
                            <p className="text-xs text-text italic">
                                &quot;{response}&quot;
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
