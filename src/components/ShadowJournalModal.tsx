"use client";

import { useState } from "react";

interface ShadowJournalModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ShadowJournalModal({ open, onClose }: ShadowJournalModalProps) {
    const [q1, setQ1] = useState("");
    const [q2, setQ2] = useState("");
    const [q3, setQ3] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (q1.trim().length < 5 || q2.trim().length < 5 || q3.trim().length < 5) return;
        setSubmitted(true);
        setTimeout(() => {
            onClose();
            setSubmitted(false);
            setQ1("");
            setQ2("");
            setQ3("");
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="brutalist-card border-text p-6 md:p-8 bg-black w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
                {!submitted ? (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-text">
                                    GÖLGE GÜNLÜĞÜ
                                </h2>
                                <p className="text-xs text-text-muted mt-2 tracking-widest uppercase">
                                    GECE YÜZLEŞMESİ. ONAY ARAMA İHTİYACINLA YÜZLEŞ.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-text-muted hover:text-text text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-text font-bold block mb-2">
                                    1. Bugün nerede "Uysallık" (Nice Guy refleksi) gösterdin?
                                </label>
                                <textarea
                                    value={q1}
                                    onChange={(e) => setQ1(e.target.value)}
                                    placeholder="Kimden onay bekledin? Kime hayır diyemedin?"
                                    className="w-full bg-surface/30 border border-border p-3 text-sm text-text focus:outline-none focus:border-text transition-colors min-h-[80px] resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-text font-bold block mb-2">
                                    2. Sınırlarını koruyabildin mi?
                                </label>
                                <textarea
                                    value={q2}
                                    onChange={(e) => setQ2(e.target.value)}
                                    placeholder="Nerede taviz verdin veya nerede sağlam durdun?"
                                    className="w-full bg-surface/30 border border-border p-3 text-sm text-text focus:outline-none focus:border-text transition-colors min-h-[80px] resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-widest text-text font-bold block mb-2">
                                    3. Kendi isteklerini başkalarınınkinin önüne koyabildin mi?
                                </label>
                                <textarea
                                    value={q3}
                                    onChange={(e) => setQ3(e.target.value)}
                                    placeholder="Yoksa yine başkalarını mutlu etmek için kendi zamanından mı çaldın?"
                                    className="w-full bg-surface/30 border border-border p-3 text-sm text-text focus:outline-none focus:border-text transition-colors min-h-[80px] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={q1.length < 5 || q2.length < 5 || q3.length < 5}
                                className={`w-full py-4 text-sm uppercase tracking-[0.3em] font-black transition-all mt-4 ${q1.length >= 5 && q2.length >= 5 && q3.length >= 5
                                    ? "bg-text text-black hover:bg-text-muted"
                                    : "bg-surface text-text-muted cursor-not-allowed border border-border"
                                    }`}
                            >
                                Yüzleşmeyi Tamamla
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="py-12 text-center space-y-4">
                        <span className="text-6xl text-text block mb-4">👁️</span>
                        <h3 className="text-xl uppercase tracking-[0.4em] font-black text-text">
                            GÖLGE KAYDEDİLDİ
                        </h3>
                        <p className="text-sm text-text-muted max-w-md mx-auto uppercase tracking-widest">
                            Farkındalık değişimin ilk adımıdır. Yarın aynı zayıflıkları tekrarlama.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
