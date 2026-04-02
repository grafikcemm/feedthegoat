"use client";
import { useState } from "react";
import SportsPlan from "./SportsPlan";
import Nutrition from "./Nutrition";
import Vitamins from "./Vitamins";

type HealthTab = "SPOR" | "BESLENME" | "VITAMIN";

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState<HealthTab>("SPOR");

  const TABS: { id: HealthTab; label: string; icon: string }[] = [
    { id: "SPOR", label: "Spor Planı", icon: "🏋️‍♂️" },
    { id: "BESLENME", label: "Beslenme", icon: "🥩" },
    { id: "VITAMIN", label: "Vitamin Takip", icon: "💊" },
  ];

  return (
    <section className="bg-surface border border-border p-4 md:p-6 mb-8 mt-4 rounded-sm shadow-xl">
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-border/50 pb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
                if (navigator.vibrate) navigator.vibrate(20);
                setActiveTab(tab.id);
            }}
            className={`px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-colors rounded-sm ${
              activeTab === tab.id
                ? "bg-text text-black"
                : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
          >
            <span className="mr-2 text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === "SPOR" && <SportsPlan />}
        {activeTab === "BESLENME" && <Nutrition />}
        {activeTab === "VITAMIN" && <Vitamins />}
      </div>
    </section>
  );
}
