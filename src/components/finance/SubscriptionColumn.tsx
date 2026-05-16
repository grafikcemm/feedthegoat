"use client";

import React, { useState, useTransition } from "react";
import { addSubscription } from "@/app/actions/addSubscription";
import { deleteSubscription } from "@/app/actions/deleteSubscription";

interface Subscription {
  id: string;
  title: string;
  amount: number;
}

interface SubscriptionColumnProps {
  total: number;
  subscriptions: Subscription[];
}

export function SubscriptionColumn({
  total,
  subscriptions,
}: SubscriptionColumnProps) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleAddSub = () => {
    if (!newTitle || !newAmount) return;

    startTransition(async () => {
      try {
        await addSubscription({
          title: newTitle,
          amount: parseFloat(newAmount),
          currency: "TRY",
        });
        setNewTitle("");
        setNewAmount("");
        setShowAddForm(false);
      } catch (err) {
        console.error("Failed to add subscription:", err);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteSubscription({ id });
      } catch (err) {
        console.error("Failed to delete subscription:", err);
      }
    });
  };

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-[#2a2a2a]/50">
        <h3 className="text-[#666666] text-[10px] tracking-[0.2em] font-bold uppercase">
          ABONELİKLER
        </h3>
        <span className="text-2xl font-bold font-sans text-[#6366f1]">
          {total.toLocaleString("tr-TR")} ₺
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar mt-2">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center justify-between gap-4 py-3.5 border-b border-[#2a2a2a]/30 last:border-0 px-3 hover:bg-[#141414]/50 transition-colors rounded-xl w-full"
          >
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-sm text-[#ababab] block truncate font-semibold">
                {sub.title}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs text-[#ffffff] font-bold tabular-nums whitespace-nowrap">
                {sub.amount.toLocaleString("tr-TR")} ₺
              </span>
              <button
                onClick={() => handleDelete(sub.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 text-[#ff453a] hover:scale-110 transition-all px-1 text-xl leading-none font-bold"
                title="Sil"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {subscriptions.length === 0 && !showAddForm && (
          <div className="text-xs text-[#666666] text-center py-12 italic font-medium">
            Henüz kayıt yok.
          </div>
        )}

        {showAddForm ? (
          <div className="mt-6 p-6 bg-[#000000] rounded-2xl border border-[#6366f1]/20 animate-in zoom-in-95 duration-200 shadow-lg">
             <p className="text-[10px] font-bold text-[#6366f1] mb-4 uppercase tracking-[0.2em]">Yeni Abonelik</p>
            <input
              type="text"
              placeholder="Abonelik adı"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={isPending}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-xs text-[#ffffff] font-medium mb-3 outline-none focus:border-[#6366f1]/50 transition-all"
            />
            <input
              type="number"
              placeholder="Miktar"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              disabled={isPending}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-xs text-[#ffffff] font-medium mb-4 outline-none focus:border-[#6366f1]/50 transition-all"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddSub}
                disabled={isPending || !newTitle || !newAmount}
                className="flex-1 bg-[#6366f1] text-white text-[10px] uppercase font-bold py-3 rounded-xl hover:bg-[#4f46e5] transition-all disabled:opacity-50"
              >
                {isPending ? "..." : "EKLE"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={isPending}
                className="flex-1 border border-[#2a2a2a] text-[#666666] text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-[#0a0a0a] transition-all font-bold"
              >
                İPTAL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 py-4 rounded-xl border-dashed border-2 border-[#2a2a2a] text-[#666666] font-bold text-[10px] tracking-widest uppercase hover:border-[#6366f1] hover:text-[#6366f1] hover:bg-[#141414] transition-all"
          >
            + ABONELİK EKLE
          </button>
        )}
      </div>
    </div>
  );
}
