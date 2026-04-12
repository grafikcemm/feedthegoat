"use client";

import React, { useTransition } from "react";
import { cn } from "@/utils/cn";
import { deleteTransaction } from "@/app/actions/deleteTransaction";

interface Transaction {
  id: string;
  title: string;
  amount: number;
}

interface TransactionColumnProps {
  title: string;
  total: number;
  transactions: Transaction[];
  type: "income" | "expense";
}

export function TransactionColumn({
  title,
  total,
  transactions,
  type,
}: TransactionColumnProps) {
  const [isPending, startTransition] = useTransition();

  const isIncome = type === "income";

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTransaction({ id });
      } catch (err) {
        console.error("Failed to delete transaction:", err);
      }
    });
  };

  return (
    <div className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-ftg-border-subtle">
        <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
          {title}
        </h3>
        <span
          className={cn(
            "font-display text-xl",
            isIncome ? "text-ftg-success" : "text-ftg-danger"
          )}
        >
          {total.toLocaleString("tr-TR")} ₺
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-ftg-border-strong scrollbar-track-transparent">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="group flex items-center justify-between gap-4 py-2 border-b border-ftg-border-subtle last:border-0 px-1 hover:bg-ftg-elevated/50 transition-colors rounded-sm w-full"
          >
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-mono text-sm text-ftg-text block truncate">
                {tx.title}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-sm text-ftg-text tabular-nums whitespace-nowrap">
                {tx.amount.toLocaleString("tr-TR")} ₺
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 text-ftg-text-mute hover:text-ftg-danger transition-all px-1"
                title="Silt"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="font-mono text-xs text-ftg-text-mute text-center py-8">
            Henüz kayıt yok.
          </div>
        )}
      </div>
    </div>
  );
}
