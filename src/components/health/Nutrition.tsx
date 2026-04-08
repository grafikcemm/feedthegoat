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
    <div className="flex flex-col gap-8">
      {/* Target Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div style={{ background: "transparent", border: "1px solid var(--border-0)", padding: "16px", borderRadius: 0 }}>
              <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                Protein Hedefi
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xl)", color: "var(--text-0)", lineHeight: 1 }}>{proteins}</span>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: "var(--text-2)" }}>/ 180g</span>
              </div>
              <div style={{ height: "4px", width: "100%", background: "var(--bg-hover)", position: "relative" }}>
                 <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "var(--amber)", transition: "width 0.3s", width: `${Math.min(100, (proteins/180)*100)}%` }}></div>
              </div>
          </div>

          <div style={{ background: "transparent", border: "1px solid var(--border-0)", padding: "16px", borderRadius: 0 }}>
              <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                Kalori Limiti
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xl)", color: "var(--text-0)", lineHeight: 1 }}>{kcal}</span>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: "var(--text-2)" }}>/ ~1600</span>
              </div>
              <div style={{ height: "4px", width: "100%", background: "var(--bg-hover)", position: "relative" }}>
                 <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: kcal > 1600 ? "var(--red-signal)" : "var(--text-2)", transition: "width 0.3s", width: `${Math.min(100, (kcal/1600)*100)}%` }}></div>
              </div>
          </div>

          <div style={{ background: "transparent", border: "1px solid var(--border-0)", padding: "16px", borderRadius: 0 }}>
              <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                Su
              </h4>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xl)", color: "var(--text-0)", lineHeight: 1 }}>{water}</span>
                 <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-sm)", color: "var(--text-2)" }}>/ 3000ml</span>
              </div>
              <div style={{ height: "4px", width: "100%", background: "var(--bg-hover)", position: "relative" }}>
                 <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "rgba(100,130,180,1)", transition: "width 0.3s", width: `${Math.min(100, (water/3000)*100)}%` }}></div>
              </div>
          </div>
      </div>

      {/* Quick Add / Actions */}
      <div style={{ border: "1px solid var(--border-0)", padding: "24px", background: "transparent", borderRadius: 0 }}>
         <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
              Hızlı Ekle
            </h4>
            <div className="flex flex-wrap gap-2">
                <button onClick={() => updateMacros(25, 120)} className="hover:border-(--border-1) hover:text-(--text-0) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", border: "1px solid var(--border-0)", background: "transparent", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    + Toz (25g, 120kcal)
                </button>
                <button onClick={() => updateMacros(30, 150)} className="hover:border-(--border-1) hover:text-(--text-0) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", border: "1px solid var(--border-0)", background: "transparent", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    + Tavuk 100g (30g, 150kcal)
                </button>
                <button onClick={() => updateMacros(20, 250)} className="hover:border-(--border-1) hover:text-(--text-0) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", border: "1px solid var(--border-0)", background: "transparent", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    + Et/Köfte 100g (20g, ~250kcal)
                </button>
                <button onClick={() => updateMacros(0, 300)} className="hover:border-(--border-1) hover:text-(--text-0) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", border: "1px solid var(--border-0)", background: "transparent", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    + Karbonhidrat (300kcal)
                </button>
            </div>
            
            <div className="flex gap-2" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-1)" }}>
               <button onClick={() => updateWater(500)} className="hover:bg-(--bg-hover) transition-colors" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "rgba(100,130,180,1)", border: "1px solid rgba(100,130,180,0.3)", background: "rgba(100,130,180,0.05)", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    +500 ML SU
               </button>
               <button onClick={() => { setProteins(0); setKcal(0); setWater(0); saveState(0, 0, 0, ceoBreakfast); }} className="hover:bg-(--red-signal) hover:text-black transition-colors ml-auto" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-3)", border: "1px solid var(--border-0)", background: "transparent", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}>
                    SIFIRLA
               </button>
            </div>
         </div>

         <div>
             <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-xs)", color: "var(--text-2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
              Günlük Sistemler
             </h4>
             <div 
               onClick={toggleBreakfast}
               className="group flex items-start gap-4 transition-all"
               style={{
                 background: ceoBreakfast ? "var(--bg-hover)" : "transparent",
                 border: "1px solid",
                 borderColor: ceoBreakfast ? "var(--amber-border)" : "var(--border-0)",
                 padding: "16px",
                 cursor: "pointer",
               }}
             >
                 <div
                   style={{
                     marginTop: "2px",
                     width: "14px",
                     height: "14px",
                     border: "1px solid",
                     borderColor: ceoBreakfast ? "var(--amber)" : "var(--text-3)",
                     background: ceoBreakfast ? "var(--amber)" : "transparent",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                    {ceoBreakfast && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="black" strokeWidth="1.5" />
                      </svg>
                    )}
                 </div>
                 <div>
                     <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-sm)", color: ceoBreakfast ? "var(--amber)" : "var(--text-1)", fontWeight: 500 }}>
                         CEO Breakfast (Intermittent Fasting)
                     </p>
                     <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--size-xs)", color: "var(--text-3)", marginTop: "4px" }}>
                         Sabah sadece su + sade kahve. İlk öğün 12:00 sonrasında.
                     </p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
