"use client";

import React, { useState, useTransition } from "react";
import { addTransaction } from "@/app/actions/addTransaction";

export function AddTransactionForm() {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    startTransition(async () => {
      try {
        await addTransaction({
          type,
          title,
          amount: parseFloat(amount),
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
      className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-500"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        disabled={isPending}
        className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card px-4 py-3 font-mono text-sm text-ftg-text outline-none focus:border-ftg-amber transition-colors appearance-none cursor-pointer"
      >
        <option value="income">Gelir (+)</option>
        <option value="expense">Gider (-)</option>
      </select>

      <input
        type="text"
        placeholder="Açıklama"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isPending}
        className="flex-1 bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card px-4 py-3 font-mono text-sm text-ftg-text outline-none focus:border-ftg-amber transition-colors placeholder:text-ftg-text-mute"
      />

      <input
        type="number"
        placeholder="Miktar (₺)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isPending}
        step="0.01"
        className="w-32 bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card px-4 py-3 font-mono text-sm text-ftg-text outline-none focus:border-ftg-amber transition-colors placeholder:text-ftg-text-mute [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="submit"
        disabled={isPending || !title || !amount}
        className="border border-ftg-amber text-ftg-amber font-mono text-[11px] tracking-wider uppercase px-8 py-3 rounded-ftg-card hover:bg-ftg-amber-glow transition-colors disabled:opacity-50"
      >
        {isPending ? "EKLENİYOR..." : "EKLE"}
      </button>
    </form>
  );
}
