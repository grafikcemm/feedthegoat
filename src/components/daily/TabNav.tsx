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
    <div className="flex border-b border-[#E5DDD4] bg-white px-8">
      {TABS.map((tab) => {
        const active = isActive(tab.id);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "px-5 py-4 text-sm transition-all duration-300",
              active
                ? "text-[#E8956D] border-b-2 border-[#E8956D] font-semibold -mb-px"
                : "text-[#B5A090] font-medium hover:text-[#8B7355]"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
