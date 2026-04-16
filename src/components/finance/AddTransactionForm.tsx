"use client";

import React, { useState, useTransition } from "react";
import { addTransaction } from "@/app/actions/addTransaction";
import { cn } from "@/utils/cn";

export function AddTransactionForm() {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    startTransition(async () => {
      try {
        await addTransaction({
          title,
          amount: parseFloat(amount),
          type,
        });
        setTitle("");
        setAmount("");
      } catch (err) {
        console.error("Failed to add transaction:", err);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="md:col-span-1 flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] px-1">Tip</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 py-3.5 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase",
                type === "expense"
                  ? "bg-[#ff453a] text-[#ff453a] border border-[#ff453a]/30"
                  : "bg-[#0a0a0a] border border-[#2a2a2a] text-[#666666] hover:text-[#ababab]"
              )}
            >
              GİDER
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 py-3.5 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase",
                type === "income"
                  ? "bg-[#30d158] text-[#30d158] border border-[#30d158]/30"
                  : "bg-[#0a0a0a] border border-[#2a2a2a] text-[#666666] hover:text-[#ababab]"
              )}
            >
              GELİR
            </button>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-2">
          <label className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] px-1">İşlem Adı</label>
          <input
            type="text"
            placeholder="Market, Kira, Side Hustle..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-[#ffffff] font-medium placeholder:text-[#666666] focus:outline-none focus:border-[#6366f1]/50 transition-all shadow-sm"
          />
        </div>

        <div className="md:col-span-1 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] px-1">Miktar (₺)</label>
            <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-[#ffffff] font-medium placeholder:text-[#666666] focus:outline-none focus:border-[#6366f1]/50 transition-all shadow-sm"
            />
        </div>

        <button
          type="submit"
          disabled={isPending || !title || !amount}
          className="bg-[#ababab] text-white text-[10px] tracking-[0.2em] uppercase font-bold py-4 rounded-xl hover:bg-[#ffffff] transition-all disabled:opacity-50 shadow-md active:scale-[0.98]"
        >
          {isPending ? "EKLENİYOR..." : "İŞLEMİ EKLE"}
        </button>
      </div>
    </form>
  );
}
