"use client";
import { useState, useEffect } from "react";

export default function Nutrition() {
  const [proteins, setProteins] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [water, setWater] = useState(0);
  const [ceoBreakfast, setCeoBreakfast] = useState(false);

  useEffect(() => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-nutrition-v2-${d}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
            setProteins(parsed.proteins || 0);
            setKcal(parsed.kcal || 0);
            setWater(parsed.water || 0);
            setCeoBreakfast(parsed.ceoBreakfast || false);
        }, 0);
      } catch {}
    }
  }, []);

  const saveState = (p: number, k: number, w: number, c: boolean) => {
    const d = new Date().toISOString().split("T")[0];
    const key = `goat-nutrition-v2-${d}`;
    localStorage.setItem(key, JSON.stringify({ proteins: p, kcal: k, water: w, ceoBreakfast: c }));
  };

  const updateMacros = (p: number, k: number) => {
      const newP = Math.max(0, proteins + p);
      const newK = Math.max(0, kcal + k);
      setProteins(newP);
      setKcal(newK);
      saveState(newP, newK, water, ceoBreakfast);
  };

  const updateWater = (w: number) => {
      const newW = Math.max(0, water + w);
      setWater(newW);
      saveState(proteins, kcal, newW, ceoBreakfast);
  }

  const toggleBreakfast = () => {
      const newC = !ceoBreakfast;
      setCeoBreakfast(newC);
      saveState(proteins, kcal, water, newC);
  }

  return (
    <div className="space-y-8">
      {/* Target Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-4">
              <h4 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">Protein Hedefi</h4>
              <div className="text-3xl font-bold text-text font-mono flex items-end gap-1">
                 {proteins} <span className="text-sm text-text-muted mb-1">/ 180g</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-background overflow-hidden relative">
                 <div className="absolute top-0 left-0 h-full bg-accent-green transition-all" style={{ width: `${Math.min(100, (proteins/180)*100)}%` }}></div>
              </div>
          </div>
          <div className="bg-surface border border-border p-4">
              <h4 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">Kalori Limiti</h4>
              <div className="text-3xl font-bold text-text font-mono flex items-end gap-1">
                 {kcal} <span className="text-sm text-text-muted mb-1">/ ~1600</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-background overflow-hidden relative">
                 <div className={`absolute top-0 left-0 h-full transition-all ${kcal > 1600 ? 'bg-accent-red' : 'bg-text'}`} style={{ width: `${Math.min(100, (kcal/1600)*100)}%` }}></div>
              </div>
          </div>
          <div className="bg-surface border border-border p-4">
              <h4 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">Su</h4>
              <div className="text-3xl font-bold text-text font-mono flex items-end gap-1">
                 {water} <span className="text-sm text-text-muted mb-1">/ 3000ml</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-background overflow-hidden relative">
                 <div className="absolute top-0 left-0 h-full bg-[#3b82f6] transition-all" style={{ width: `${Math.min(100, (water/3000)*100)}%` }}></div>
              </div>
          </div>
      </div>

      {/* Quick Add / Actions */}
      <div className="border border-border p-6 bg-surface space-y-6">
         <div>
            <h4 className="text-sm text-text font-bold uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Hızlı Ekle</h4>
            <div className="flex flex-wrap gap-2">
                <button onClick={() => updateMacros(25, 120)} className="px-3 py-1.5 border border-border bg-background hover:bg-surface-hover text-xs transition-colors rounded-sm text-text-muted hover:text-text">
                    Ölçek Toz (+25g, 120kcal)
                </button>
                <button onClick={() => updateMacros(30, 150)} className="px-3 py-1.5 border border-border bg-background hover:bg-surface-hover text-xs transition-colors rounded-sm text-text-muted hover:text-text">
                    Tavuk 100g (+30g, 150kcal)
                </button>
                <button onClick={() => updateMacros(20, 250)} className="px-3 py-1.5 border border-border bg-background hover:bg-surface-hover text-xs transition-colors rounded-sm text-text-muted hover:text-text">
                    Köfte/Et 100g (+20g, ~250kcal)
                </button>
                <button onClick={() => updateMacros(0, 300)} className="px-3 py-1.5 border border-border bg-background hover:bg-surface-hover text-xs transition-colors rounded-sm text-text-muted hover:text-text">
                    Karbonhidrat (+300kcal)
                </button>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
               <button onClick={() => updateWater(500)} className="px-3 py-1.5 border border-[#3b82f6]/30 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-xs transition-colors rounded-sm text-[#3b82f6]">
                    +500ml Su
               </button>
               <button onClick={() => { setProteins(0); setKcal(0); setWater(0); saveState(0, 0, 0, ceoBreakfast); }} className="px-3 py-1.5 border border-accent-red/30 bg-accent-red/5 hover:bg-accent-red/10 text-xs transition-colors rounded-sm text-accent-red/60 hover:text-accent-red ml-auto">
                    KAYITLARI SIFIRLA
               </button>
            </div>
         </div>

         <div>
             <h4 className="text-sm text-text font-bold uppercase tracking-wider mb-3">Günlük Sistemler</h4>
             <div 
               onClick={toggleBreakfast}
               className={`flex items-center gap-4 border p-4 cursor-pointer transition-all ${ceoBreakfast ? 'border-accent-green bg-accent-green/5' : 'border-border bg-background hover:border-text-muted'}`}
             >
                 <div className={`w-5 h-5 border flex items-center justify-center shrink-0 ${ceoBreakfast ? 'border-accent-green bg-accent-green text-black' : 'border-border text-transparent'}`}>
                    <span className="text-[10px] font-bold">✓</span>
                 </div>
                 <div>
                     <p className={`font-bold text-sm tracking-wide ${ceoBreakfast ? 'text-accent-green' : 'text-text'}`}>
                         CEO Breakfast (Intermittent Fasting)
                     </p>
                     <p className="text-[11px] text-text-muted mt-0.5">
                         Sabah sadece su + sade kahve. İlk öğün 12:00 sonrasında. (Karar yorgunluğunu azalt)
                     </p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
