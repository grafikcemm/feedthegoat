"use client";

import { useState, useMemo, useEffect } from "react";


type FinRecord = {
    id: string;
    label: string;
    amount: number;
    type: "income" | "expense" | "subscription";
};

const INITIAL_RECORDS: FinRecord[] = [
    { id: "inc-1", label: "Ek Gelir (Ay Ortası)", amount: 12000, type: "income" },
    { id: "inc-2", label: "Nisan Sonu Maaş", amount: 42000, type: "income" },
    { id: "exp-1", label: "Enpara Tahmini Kredi Kartı", amount: 55670, type: "expense" },
    { id: "exp-2", label: "Getir Yemek", amount: 3277, type: "expense" },
    { id: "exp-3", label: "Kredinin Üçüncü Taksiti", amount: 9121, type: "expense" },
    { id: "exp-4", label: "Denizbank Kredi Kartı", amount: 15000, type: "expense" },
    { id: "sub-1", label: "Twitter Mavi Tik", amount: 150, type: "subscription" },
    { id: "sub-2", label: "Instagram Mavi Tik", amount: 260, type: "subscription" },
    { id: "sub-3", label: "Claude", amount: 799, type: "subscription" },
    { id: "sub-4", label: "Perplexity", amount: 400, type: "subscription" },
];

export default function WarFund() {
    const [records, setRecords] = useState<FinRecord[]>(() => {
        if (typeof window === "undefined") return [];

        // Veri Enjeksiyonu (Bir defaya mahsus)
        const migrationFlag = localStorage.getItem("goat-restoration-v2-finance");
        if (!migrationFlag) {
            const screenshotRecords: FinRecord[] = [
                { id: "inc-1", label: "Ek Gelir (Ay Ortası)", amount: 12000, type: "income" },
                { id: "inc-2", label: "Nisan Sonu Maaş", amount: 42000, type: "income" },
                { id: "exp-1", label: "Enpara Tahmini Kredi Kartı", amount: 55670, type: "expense" },
                { id: "exp-2", label: "Getir Yemek", amount: 3277, type: "expense" },
                { id: "exp-3", label: "Kredinin Üçüncü Taksiti", amount: 9121, type: "expense" },
                { id: "exp-4", label: "Denizbank Kredi Kartı", amount: 15000, type: "expense" },
                { id: "sub-1", label: "Twitter Mavi Tik", amount: 150, type: "subscription" },
                { id: "sub-2", label: "Instagram Mavi Tik", amount: 260, type: "subscription" },
                { id: "sub-3", label: "Claude", amount: 799, type: "subscription" },
                { id: "sub-4", label: "Perplexity", amount: 400, type: "subscription" },
            ];
            localStorage.setItem("goat-restoration-v2-finance", "true");
            localStorage.setItem("goat-warfund-v2", JSON.stringify(screenshotRecords));
            return screenshotRecords;
        }

        const saved = localStorage.getItem("goat-warfund-v2");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch { }
        }
        return INITIAL_RECORDS;
    });
    const [newLabel, setNewLabel] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newType, setNewType] = useState<"income" | "expense" | "subscription">("income");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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
        <div style={{ marginTop: "24px" }}>
            <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    Savaş Fonu
                </h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: netCashflow >= 0 ? "rgba(34, 197, 94, 1)" : "var(--red-signal)", fontWeight: 500 }}>
                    NET: {netCashflow.toLocaleString("tr-TR")} ₺
                </span>
            </div>

            {netCashflow < 0 && (
                <div style={{ padding: "16px", background: "rgba(224, 100, 100, 0.1)", borderLeft: "2px solid var(--red-signal)", marginBottom: "24px" }}>
                    <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--red-signal)", fontWeight: 500, marginBottom: "4px" }}>Durum Bilgisi: Nakit Açığı</h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-xs)", color: "var(--text-2)" }}>Giderler geçici olarak gelirini aşmış durumda. Panik yapmadan önce abonelikleri ve gereksiz küçük harcamaları optimize edebilirsin.</p>
                </div>
            )}

            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 mb-8" style={{ background: "transparent", border: "1px solid var(--border-0)", padding: "16px", borderRadius: 0 }}>
                <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as "income" | "expense" | "subscription")}
                    className="focus:border-(--border-1) transition-colors"
                    style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)", background: "transparent", border: "1px solid var(--border-0)", padding: "10px", outline: "none", borderRadius: 0 }}
                >
                    <option value="income">Gelir (+)</option>
                    <option value="expense">Gider (-)</option>
                    <option value="subscription">Abonelik (-)</option>
                </select>
                <input
                    type="text"
                    placeholder="Açıklama"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="flex-1 focus:border-(--border-1) transition-colors"
                    style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)", background: "transparent", border: "1px solid var(--border-0)", padding: "10px", outline: "none", borderRadius: 0 }}
                />
                <input
                    type="number"
                    placeholder="Miktar (₺)"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full md:w-40 focus:border-(--border-1) transition-colors"
                    style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)", background: "transparent", border: "1px solid var(--border-0)", padding: "10px", outline: "none", borderRadius: 0 }}
                />
                <button type="submit" className="hover:bg-(--bg-hover) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-1)", background: "transparent", border: "1px solid var(--border-0)", padding: "10px 24px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 0 }}>
                    EKLE
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gelirler */}
                <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border-0)", padding: "20px" }}>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid var(--border-1)", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(34, 197, 94, 0.8)" }}>Gelir</span>
                        <span style={{ color: "var(--text-0)" }}>{totalIncome.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-0">
                        {incomes.map((item) => (
                            <div key={item.id} className="group flex justify-between items-center" style={{ height: "40px", borderBottom: "1px solid var(--border-1)", fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)" }}>
                                <span className="truncate pr-2">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)" }}>{item.amount.toLocaleString("tr-TR")}</span>
                                    <button onClick={() => handleDelete(item.id)} style={{ background: "transparent", border: "none", color: "var(--text-3)", cursor: "pointer" }} className="opacity-0 group-hover:opacity-100 hover:text-(--red-signal) transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Giderler */}
                <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border-0)", padding: "20px" }}>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid var(--border-1)", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--amber)" }}>Gider</span>
                        <span style={{ color: "var(--text-0)" }}>{totalExpense.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-0">
                        {expenses.map((item) => (
                            <div key={item.id} className="group flex justify-between items-center" style={{ height: "40px", borderBottom: "1px solid var(--border-1)", fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)" }}>
                                <span className="truncate pr-2">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)" }}>{item.amount.toLocaleString("tr-TR")}</span>
                                    <button onClick={() => handleDelete(item.id)} style={{ background: "transparent", border: "none", color: "var(--text-3)", cursor: "pointer" }} className="opacity-0 group-hover:opacity-100 hover:text-(--red-signal) transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Abonelikler */}
                <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border-0)", padding: "20px" }}>
                    <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid var(--border-1)", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                        <span>Abonelikler</span>
                        <span style={{ color: "var(--text-0)" }}>{totalSubs.toLocaleString("tr-TR")} ₺</span>
                    </h3>
                    <div className="space-y-0">
                        {subscriptions.map((item) => (
                            <div key={item.id} className="group flex justify-between items-center" style={{ height: "40px", borderBottom: "1px solid var(--border-1)", fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: "var(--text-1)" }}>
                                <span className="truncate pr-2">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)" }}>{item.amount.toLocaleString("tr-TR")}</span>
                                    <button onClick={() => handleDelete(item.id)} style={{ background: "transparent", border: "none", color: "var(--text-3)", cursor: "pointer" }} className="opacity-0 group-hover:opacity-100 hover:text-(--red-signal) transition-opacity">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
