"use client";

import { Phase, Status, Category, Priority } from "@/data/careerGoals";

export interface FilterState {
  phase: Phase | "all";
  status: Status | "all";
  category: Category | "all";
  priority: Priority | "all";
  quick: "öğrenme" | "aktif" | "gelir" | "fiziksel" | "all";
}

interface CareerFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const Btn = ({ active, onClick, children, className = "" }: { active: boolean, onClick: () => void, children: React.ReactNode, className?: string }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest border transition-colors ${
      active 
        ? "bg-text text-bg border-text" 
        : "bg-surface/50 text-text-muted border-border hover:border-text-muted"
    } ${className}`}
  >
    {children}
  </button>
);

export default function CareerFilters({ filters, setFilters }: CareerFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleQuickFilter = (val: "öğrenme" | "aktif" | "gelir" | "fiziksel" | "all") => {
    // reset all base filters when quick filter is applied
    if (val !== "all") {
      setFilters({
        phase: "all",
        status: "all",
        category: "all",
        priority: "all",
        quick: val
      });
    } else {
      updateFilter("quick", val);
    }
  };

  return (
    <div className="brutalist-card border-border bg-[#0D0D0D] p-5 mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] uppercase tracking-widest text-text-muted w-16">Faz:</span>
        <Btn active={filters.phase === "all"} onClick={() => updateFilter("phase", "all")}>Tümü</Btn>
        {[1,2,3,4,5,6].map(num => (
          <Btn key={num} active={filters.phase === num} onClick={() => { updateFilter("phase", num); updateFilter("quick", "all"); }}>Faz {num}</Btn>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
         <span className="text-[9px] uppercase tracking-widest text-text-muted w-16">Durum:</span>
         <Btn active={filters.status === "all"} onClick={() => updateFilter("status", "all")}>Tümü</Btn>
         {["active", "planned", "waiting", "completed", "removed"].map(st => (
            <Btn key={st} active={filters.status === st} onClick={() => { updateFilter("status", st); updateFilter("quick", "all"); }}>
              {st === "active" ? "Aktif" : st === "planned" ? "Planlandı" : st === "waiting" ? "Bekliyor" : st === "completed" ? "Biten" : "Çıkarıldı"}
            </Btn>
         ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
         <span className="text-[9px] uppercase tracking-widest text-text-muted w-16">Tür:</span>
         <Btn active={filters.category === "all"} onClick={() => updateFilter("category", "all")}>Tümü</Btn>
         {["digital", "sales", "product", "physical", "mindset"].map(cat => (
            <Btn key={cat} active={filters.category === cat} onClick={() => { updateFilter("category", cat); updateFilter("quick", "all"); }}>
              {cat}
            </Btn>
         ))}
      </div>

      <div className="border-t border-border mt-2 pt-4 flex flex-wrap items-center gap-2">
         <span className="text-[9px] uppercase tracking-widest text-accent-red font-bold w-16 block shrink-0">Hızlı F.:</span>
         <div className="flex flex-wrap gap-2">
            <Btn active={filters.quick === "aktif"} onClick={() => handleQuickFilter("aktif")} className={filters.quick === "aktif" ? "border-accent-red bg-accent-red text-white" : ""}>
               Sadece Aktif
            </Btn>
            <Btn active={filters.quick === "öğrenme"} onClick={() => handleQuickFilter("öğrenme")} className={filters.quick === "öğrenme" ? "border-accent-amber bg-accent-amber text-black" : ""}>
               Öğrenme Gerekenler
            </Btn>
            <Btn active={filters.quick === "gelir"} onClick={() => handleQuickFilter("gelir")} className={filters.quick === "gelir" ? "border-accent-green bg-accent-green text-black" : ""}>
               Gelir Üretenler
            </Btn>
            <Btn active={filters.quick === "fiziksel"} onClick={() => handleQuickFilter("fiziksel")} className={filters.quick === "fiziksel" ? "border-blue-500 bg-blue-500 text-white" : ""}>
               Fiziksel Sigorta
            </Btn>
            {filters.quick !== "all" && (
                <button onClick={() => handleQuickFilter("all")} className="px-2 text-[10px] text-text-muted underline hover:text-white transition-colors ml-2">Filtreleri Temizle</button>
            )}
         </div>
      </div>
    </div>
  );
}
