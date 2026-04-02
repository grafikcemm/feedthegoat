"use client";

import { useState, useMemo, useEffect } from "react";

type FinRecord = {
    id: string;
    label: string;
    amount: number;
    type: "income" | "expense" | "subscription";
};

const INITIAL_RECORDS: FinRecord[] = [
    { id: "inc-1", label: "Freelance Gelecek Kalan Ödeme", amount: 15000, type: "income" },
    { id: "inc-2", label: "Şubat Sonu Maaş", amount: 42000, type: "income" },
    { id: "inc-3", label: "Ek Gelir", amount: 12000, type: "income" },
    { id: "exp-1", label: "Enpara Net Borç", amount: 60000, type: "expense" },
    { id: "exp-2", label: "Enpara Tahmini Dönem Borcu", amount: 30500, type: "expense" },
    { id: "exp-3", label: "Migros Sonra Öde", amount: 2800, type: "expense" },
    { id: "exp-4", label: "Denizbank Kredi", amount: 27000, type: "expense" },
    { id: "exp-5", label: "Kredimin ilk taksiti", amount: 11820, type: "expense" },
];

export default function WarFund() {
    const [records, setRecords] = useState<FinRecord[]>(INITIAL_RECORDS);
    const [newLabel, setNewLabel] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newType, setNewType] = useState<"income" | "expense" | "subscription">("income");
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem("goat-warfund-v2");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setRecords(parsed), 0);
            } catch (e) {
                console.error("Failed to parse WarFund data", e);
            }
        } else {
            // migration from v1
            const oldSaved = localStorage.getItem("goat-warfund-v1");
            if (oldSaved) {
                try {
                    const parsed = JSON.parse(oldSaved);
                    setTimeout(() => setRecords(parsed), 0);
                } catch(e) {}
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    // Save on Change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-warfund-v2", JSON.stringify(records));
        }
    }, [records, isLoaded]);

    const incomes = useMemo(() => records.filter(r => r.type === "income"), [records]);
    const expenses = useMemo(() => records.filter(r => r.type === "expense"), [records]);
    const subscriptions = useMemo(() => records.filter(r => r.type === "subscription"), [records]);

    const totalIncome = useMemo(() => incomes.reduce((sum, item) => sum + item.amount, 0), [incomes]);
    const totalExpense = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
    const totalSubs = useMemo(() => subscriptions.reduce((sum, item) => sum + item.amount, 0), [subscriptions]);
    const netCashflow = totalIncome - totalExpense - totalSubs;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel || !newAmount) return;
        const amt = parseFloat(newAmount);
        if (isNaN(amt)) return;

        setRecords([...records, {
            id: Date.now().toString(),
            label: newLabel,
            amount: amt,
            type: newType
        }]);
        setNewLabel("");
        setNewAmount("");
    };

    const handleDelete = (id: string) => {
        setRecords(records.filter(r => r.id !== id));
    };

    if (!isLoaded) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4 mt-6">
                <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    Savaş Fonu
                </h2>
                <span className={`text-xs font-bold tabular-nums ${netCashflow >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                    NET: {netCashflow.toLocaleString("tr-TR")} ₺
                </span>
            </div>

            {/* Warn message if negative */}
            {netCashflow < 0 && (
                <div className="mb-6 p-4 border-l-[3px] border-accent-amber/70 bg-surface flex items-start gap-3">
                    <span className="text-accent-amber text-lg font-bold mt-0.5">!</span>
                    <div>
                        <span className="text-sm text-text uppercase tracking-wide font-bold block mb-1">Negatif Nakit Akışı</span>
                        <p className="text-xs text-text-muted">Giderler gelirini aştı. Abonelikleri ve gereksiz harcamaları optimize et.</p>
                    </div>
                </div>
            )}

            {/* Add New Form */}
            <form onSubmit={handleAdd} className="border border-border p-5 bg-surface mb-6 flex flex-col md:flex-row gap-3">
                <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as "income" | "expense" | "subscription")}
                    className="bg-background border border-border px-3 py-2.5 text-xs text-text focus:border-text transition-colors outline-none"
                >
                    <option value="income">Gelir (+)</option>
                    <option value="expense">Gider (-)</option>
                    <option value="subscription">Abonelik (-)</option>
                </select>
                <input
                    type="text"
                    placeholder="Gösterge / Açıklama"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="flex-1 bg-background border border-border px-4 py-2.5 text-sm text-text focus:border-text transition-colors outline-none"
                />
                <input
                    type="number"
                    placeholder="Miktar (₺) / Aylık"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full md:w-40 bg-background border border-border px-4 py-2.5 text-sm text-text focus:border-text transition-colors outline-none"
                />
                <button type="submit" className="bg-text text-black px-6 py-2.5 text-xs tracking-wider uppercase font-bold hover:opacity-90 transition-opacity">
                    EKLE
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gelirler */}
                <div className="border border-border p-5 bg-surface/30">
                    <h3 className="text-xs uppercase tracking-wider text-accent-green/80 flex justify-between mb-4 pb-2 border-b border-border/50">
                        <span>Gelir</span>
                        <span className="font-bold">{totalIncome.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {incomes.map((item) => (
                            <div key={item.id} className="group flex justify-between items-start text-xs border-b border-border/30 pb-2">
                                <span className="text-text-muted pr-2 leading-relaxed">{item.label}</span>
                                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                                    <span className="text-text font-mono font-medium">{item.amount.toLocaleString("tr-TR")} ₺</span>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Giderler */}
                <div className="border border-border p-5 bg-surface/30">
                    <h3 className="text-xs uppercase tracking-wider text-accent-amber/80 flex justify-between mb-4 pb-2 border-b border-border/50">
                        <span>Gider</span>
                        <span className="font-bold">{totalExpense.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {expenses.map((item) => (
                            <div key={item.id} className="group flex justify-between items-start text-xs border-b border-border/30 pb-2">
                                <span className="text-text-muted pr-2 leading-relaxed">{item.label}</span>
                                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                                    <span className="text-text font-mono font-medium">{item.amount.toLocaleString("tr-TR")} ₺</span>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Abonelikler */}
                <div className="border border-border p-5 bg-surface/30">
                    <h3 className="text-xs uppercase tracking-wider text-text-muted flex justify-between mb-4 pb-2 border-b border-border/50">
                        <span>Abonelikler & Sabitler</span>
                        <span className="font-bold">{totalSubs.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {subscriptions.map((item) => (
                            <div key={item.id} className="group flex justify-between items-start text-xs border-b border-border/30 pb-2">
                                <span className="text-text-muted pr-2 leading-relaxed">{item.label}</span>
                                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                                    <span className="text-text font-mono font-medium">{item.amount.toLocaleString("tr-TR")} ₺</span>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
