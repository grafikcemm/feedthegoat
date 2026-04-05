"use client";

import { useState, useEffect } from "react";
import { getDailyWakeUpMessage } from "@/lib/getDailyWakeUpMessage";
import { WakeUpMessage } from "@/data/wakeUpMessages";

export default function WakeUpMessageCard() {
  const [message, setMessage] = useState<WakeUpMessage | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Initial fetch based on standard generic seed
    setTimeout(() => {
        setMessage(getDailyWakeUpMessage(0));
        setIsClient(true);
    }, 0);
  }, []);

  const handleRefresh = () => {
    // Increase offset to get a new hash
    const newOffset = offset + 1;
    setOffset(newOffset);
    setMessage(getDailyWakeUpMessage(newOffset));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  if (!isClient || !message) return null;

  return (
    <div className="mb-6 border-l-4 border-l-accent-amber/50 border border-border bg-surface/30 p-5 sm:p-6 relative group">
       <div className="flex justify-between items-start mb-3">
           <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">
               <span className="opacity-60 mr-1">TEMA:</span> 
               <span className="text-text/80">{translateCategory(message.category)}</span>
           </div>
           <button 
             onClick={handleRefresh}
             className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] uppercase tracking-widest text-text-muted hover:text-text border border-border/50 px-2 py-1 bg-background"
             title="Başka bir mesaj getir"
           >
             Değiştir
           </button>
       </div>

       <div className="space-y-4">
           <h2 className="text-lg font-bold tracking-wide text-text leading-snug">
               &quot;{message.text}&quot;
           </h2>
           
           <div className="flex items-center justify-between border-t border-border/30 pt-3">
              <span className="text-[11px] text-text-muted italic">Bugünün Darbesi</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-text text-black px-2 py-0.5">Reality Check</span>
           </div>
       </div>
    </div>
  );
}

// Simple translation helper for displaying the category
function translateCategory(cat: string): string {
    const map: Record<string, string> = {
        'responsibility': "Sorumluluk",
        'action': "Eylem & Yürütme",
        'dopamine': "Dijital Disiplin",
        'time': "Zaman Farkındalığı",
        'systems': "Sistem Kurma",
        'risk': "Konfordan Çıkış",
        'discipline': "Disiplin",
        'circle': "Çevre Yönetimi",
        'health': "Fiziksel Standart",
        'money': "Üretim & Kaynak",
        'independence': "Zihinsel Bağımsızlık",
        'focus': "Derin Odak",
        'recovery': "Toparlanma",
        'reality': "Acı Gerçekler",
        'self_respect': "Özsaygı",
    };
    return map[cat] || cat.toUpperCase();
}
