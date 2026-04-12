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
    <div className="bg-ftg-surface border border-ftg-border-subtle rounded-ftg-card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-ftg-border-subtle">
        <h3 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ftg-text-mute">
          ABONELİKLER
        </h3>
        <span className="font-display text-xl text-ftg-amber">
          {total.toLocaleString("tr-TR")} ₺
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-ftg-border-strong scrollbar-track-transparent">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center justify-between gap-4 py-2 border-b border-ftg-border-subtle last:border-0 px-1 hover:bg-ftg-elevated/50 transition-colors rounded-sm w-full"
          >
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-mono text-sm text-ftg-text block truncate">
                {sub.title}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-sm text-ftg-text tabular-nums whitespace-nowrap">
                {sub.amount.toLocaleString("tr-TR")} ₺
              </span>
              <button
                onClick={() => handleDelete(sub.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 text-ftg-text-mute hover:text-ftg-danger transition-all px-1"
                title="Silt"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {subscriptions.length === 0 && !showAddForm && (
          <div className="font-mono text-xs text-ftg-text-mute text-center py-8">
            Henüz kayıt yok.
          </div>
        )}

        {showAddForm ? (
          <div className="mt-4 p-3 bg-ftg-elevated rounded-ftg-card border border-ftg-border-strong animate-in zoom-in-95 duration-200">
            <input
              type="text"
              placeholder="Abonelik adı"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={isPending}
              className="w-full bg-ftg-surface border border-ftg-border-subtle rounded-md px-3 py-2 font-mono text-xs text-ftg-text mb-2 outline-none focus:border-ftg-amber"
            />
            <input
              type="number"
              placeholder="Miktar"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              disabled={isPending}
              className="w-full bg-ftg-surface border border-ftg-border-subtle rounded-md px-3 py-2 font-mono text-xs text-ftg-text mb-3 outline-none focus:border-ftg-amber"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddSub}
                disabled={isPending || !newTitle || !newAmount}
                className="flex-1 bg-ftg-amber text-ftg-bg font-mono text-[10px] uppercase font-bold py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isPending ? "..." : "EKLE"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={isPending}
                className="flex-1 border border-ftg-border-strong text-ftg-text-mute font-mono text-[10px] uppercase py-2 rounded hover:text-ftg-text transition-all"
              >
                İPTAL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mt-3 px-4 py-2 rounded-ftg-card border border-dashed border-ftg-border-subtle text-ftg-text-mute font-mono text-[10px] tracking-wider uppercase hover:border-ftg-amber hover:text-ftg-amber transition-colors"
          >
            + ABONELİK EKLE
          </button>
        )}
      </div>
    </div>
  );
}
