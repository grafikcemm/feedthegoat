"use client";

import { useState } from "react";

interface Competitor {
    id: string;
    name: string;
    platform: string;
    lastUpdate: string;
    notes: string;
}

const DEFAULT_COMPETITORS: Competitor[] = [
    { id: "c1", name: "Doruk Yalçınsoy", platform: "Instagram", lastUpdate: "", notes: "" },
    { id: "c2", name: "Chris Do", platform: "YouTube", lastUpdate: "", notes: "" },
    { id: "c3", name: "", platform: "", lastUpdate: "", notes: "" },
    { id: "c4", name: "", platform: "", lastUpdate: "", notes: "" },
    { id: "c5", name: "", platform: "", lastUpdate: "", notes: "" },
    { id: "c6", name: "", platform: "", lastUpdate: "", notes: "" },
];

export default function CompetitorRadar() {
    const [competitors, setCompetitors] = useState<Competitor[]>(DEFAULT_COMPETITORS);

    const updateField = (id: string, field: keyof Competitor, value: string) => {
        setCompetitors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    return (
        <section className="mb-8 mt-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-2">
                Rakip Radarı
            </h2>
            <p className="text-xs text-text-muted mb-6 uppercase tracking-wider">
                Haftada 1 güncelle. Piyasayı takip et, geride kalma.
            </p>

            <div className="space-y-3">
                {competitors.map((c, idx) => (
                    <div key={c.id} className="brutalist-card p-4 border-l-4 border-l-accent-amber/50 bg-surface/30 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={`Rakip ${idx + 1} İsim`}
                                value={c.name}
                                onChange={(e) => updateField(c.id, "name", e.target.value)}
                                className="w-full bg-transparent border-b border-border focus:border-text-muted text-sm font-bold uppercase tracking-wider mb-2 focus:outline-none placeholder:text-text-muted/50 text-text"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Platform"
                                    value={c.platform}
                                    onChange={(e) => updateField(c.id, "platform", e.target.value)}
                                    className="w-1/2 bg-transparent border-b border-border focus:border-text-muted text-[10px] uppercase tracking-widest focus:outline-none placeholder:text-text-muted/50 text-text"
                                />
                                <input
                                    type="text"
                                    placeholder="Son Güncelleme"
                                    value={c.lastUpdate}
                                    onChange={(e) => updateField(c.id, "lastUpdate", e.target.value)}
                                    className="w-1/2 bg-transparent border-b border-border focus:border-text-muted text-[10px] uppercase tracking-widest focus:outline-none placeholder:text-text-muted/50 text-text"
                                />
                            </div>
                        </div>
                        <div className="flex-[2]">
                            <textarea
                                placeholder="Bu hafta ne yaptı?"
                                value={c.notes}
                                onChange={(e) => updateField(c.id, "notes", e.target.value)}
                                className="w-full bg-background border border-border p-2 text-xs focus:outline-none focus:border-text-muted resize-none h-full min-h-[60px] text-text placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
