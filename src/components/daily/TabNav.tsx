"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "GUNLUK", label: "GÜNLÜK", href: "/" },
  { id: "SPOR", label: "SPOR", href: "/?tab=SPOR" },
  { id: "HAFTALIK", label: "HAFTALIK", href: "/?tab=HAFTALIK" },
  { id: "KARIYER", label: "KARİYER", href: "/?tab=KARIYER" },
  { id: "FINANS", label: "FİNANS", href: "/?tab=FINANS" },
];

export function TabNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "GUNLUK";

  // For the 'GÜNLÜK' tab if tab is empty or 'GUNLUK', we want it active
  const isActive = (id: string) => {
    if (id === "GUNLUK") return !searchParams.has("tab") || currentTab === "GUNLUK";
    return currentTab === id;
  };

  return (
    <div className="flex border-b border-ftg-border-subtle px-8">
      {TABS.map((tab) => {
        const active = isActive(tab.id);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "px-5 py-4 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors",
              active
                ? "text-ftg-amber border-b-2 border-ftg-amber -mb-px"
                : "text-ftg-text-mute hover:text-ftg-text-dim"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
