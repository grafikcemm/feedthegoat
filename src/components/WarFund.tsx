"use client";

import { useState, useMemo, useEffect } from "react";

type FinRecord = {
    id: string;
    label: string;
    amount: number;
    type: "income" | "expense";
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
    const [newType, setNewType] = useState<"income" | "expense">("income");
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem("goat-warfund-v1");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setRecords(parsed), 0);
            } catch (e) {
                console.error("Failed to parse WarFund data", e);
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    // Save on Change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-warfund-v1", JSON.stringify(records));
        }
    }, [records, isLoaded]);

    const incomes = useMemo(() => records.filter(r => r.type === "income"), [records]);
    const expenses = useMemo(() => records.filter(r => r.type === "expense"), [records]);

    const totalIncome = useMemo(() => incomes.reduce((sum, item) => sum + item.amount, 0), [incomes]);
    const totalExpense = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
    const netCashflow = totalIncome - totalExpense;

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
                <div className="mb-4 p-3 border border-accent-red bg-accent-red/5 flex items-start gap-3 glow-red">
                    <span className="text-accent-red text-lg font-bold">!</span>
                    <div>
                        <span className="text-xs text-accent-red uppercase tracking-wide font-bold block mb-1">Ağır Kan Kaybı Uyarısı</span>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Giderler gelirini aştı. Kanamayı durdur.</p>
                    </div>
                </div>
            )}

            {/* Add New Form */}
            <form onSubmit={handleAdd} className="brutalist-card border-border p-4 bg-surface/20 mb-4 flex flex-col md:flex-row gap-2">
                <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as "income" | "expense")}
                    className="bg-background border border-border p-2 text-xs focus:outline-none"
                >
                    <option value="income">Gelir (+)</option>
                    <option value="expense">Gider (-)</option>
                </select>
                <input
                    type="text"
                    placeholder="Açıklama"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="flex-1 bg-background border border-border p-2 text-xs focus:outline-none"
                />
                <input
                    type="number"
                    placeholder="Miktar (₺)"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full md:w-32 bg-background border border-border p-2 text-xs focus:outline-none"
                />
                <button type="submit" className="bg-text text-black px-4 py-2 text-xs uppercase font-bold hover:bg-text-muted transition-colors">
                    Ekle
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gelirler */}
                <div className="brutalist-card border-border p-4 bg-surface/30">
                    <h3 className="text-xs uppercase tracking-wider text-accent-green mb-3 flex justify-between">
                        <span>Gelir (Cephane)</span>
                        <span className="font-bold">{totalIncome.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {incomes.map((item) => (
                            <div key={item.id} className="group flex justify-between items-center text-xs pb-2 border-b border-border/50 last:border-0 last:pb-0">
                                <span className="text-text-muted truncate mr-2">{item.label}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-text font-mono">{item.amount.toLocaleString("tr-TR")} ₺</span>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-accent-red hover:text-red-400 transition-opacity">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Giderler */}
                <div className="brutalist-card border-border p-4 bg-surface/30">
                    <h3 className="text-xs uppercase tracking-wider text-accent-red mb-3 flex justify-between">
                        <span>Gider (Kan Kaybı)</span>
                        <span className="font-bold">{totalExpense.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {expenses.map((item) => (
                            <div key={item.id} className="group flex justify-between items-center text-xs pb-2 border-b border-border/50 last:border-0 last:pb-0">
                                <span className="text-text-muted truncate mr-2">{item.label}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-text font-mono">{item.amount.toLocaleString("tr-TR")} ₺</span>
                                    <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-accent-red hover:text-red-400 transition-opacity">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
