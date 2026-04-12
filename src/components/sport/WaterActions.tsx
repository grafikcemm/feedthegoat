"use client";

import React, { useTransition } from "react";
import { addWater, resetWater } from "@/app/actions/water";

export function WaterActions() {
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      try {
        await addWater({ amountMl: 500 });
      } catch (err) {
        console.error("Failed to add water:", err);
      }
    });
  };

  const handleReset = () => {
    if (!confirm("Bugünkü su girişlerini sıfırlamak istediğine emin misin?")) return;
    startTransition(async () => {
      try {
        await resetWater();
      } catch (err) {
        console.error("Failed to reset water:", err);
      }
    });
  };

  return (
    <div className="rounded-ftg-card border border-ftg-border-subtle bg-ftg-surface p-5 flex gap-3">
      <button
        onClick={handleAdd}
        disabled={isPending}
        className="flex-1 px-4 py-3 rounded-ftg-card border border-ftg-amber text-ftg-amber font-mono text-[11px] tracking-wider uppercase hover:bg-ftg-amber-glow transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "EKLENİYOR..." : "+500 ML SU"}
      </button>
      <button
        onClick={handleReset}
        disabled={isPending}
        className="px-4 py-3 rounded-ftg-card border border-ftg-border-subtle text-ftg-text-mute font-mono text-[11px] tracking-wider uppercase hover:border-ftg-danger/40 hover:text-ftg-danger transition-all active:scale-[0.98] disabled:opacity-50"
      >
        SIFIRLA
      </button>
    </div>
  );
}
