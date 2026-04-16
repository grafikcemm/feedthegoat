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
    <div className={cn(
        "bg-[#141414] border rounded-2xl p-6 h-full flex flex-col shadow-sm transition-all",
        isIncome ? "border-[#30d158]/20" : "border-[#2a2a2a]"
    )}>
      <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-[#2a2a2a]/50">
        <h3 className="text-[#666666] text-[10px] tracking-[0.2em] font-bold uppercase">
          {title}
        </h3>
        <span
          className={cn(
            "text-2xl font-bold font-sans",
            isIncome ? "text-[#30d158]" : "text-[#ff453a]"
          )}
        >
          {total.toLocaleString("tr-TR")} ₺
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar mt-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="group flex items-center justify-between gap-4 py-3.5 border-b border-[#2a2a2a]/30 last:border-0 px-3 hover:bg-[#0a0a0a]/50 transition-colors rounded-xl w-full"
          >
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-sm text-[#ababab] block truncate font-semibold">
                {tx.title}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs text-[#ffffff] font-bold tabular-nums whitespace-nowrap">
                {tx.amount.toLocaleString("tr-TR")} ₺
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 text-[#ff453a] hover:scale-110 transition-all px-1 text-xl leading-none font-bold"
                title="Sil"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-xs text-[#666666] text-center py-12 italic font-medium">
            Henüz kayıt yok.
          </div>
        )}
      </div>
    </div>
  );
}
