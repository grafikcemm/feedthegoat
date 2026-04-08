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
    <div 
      className="group"
      style={{
        marginTop: "24px",
        paddingLeft: "16px",
        borderLeft: "1px solid var(--amber-border)",
      }}
    >
      {/* Üst */}
      <div className="flex justify-between items-start mb-2">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            color: "var(--text-3)",
            letterSpacing: "0.1em",
            fontStyle: "italic",
            textTransform: "uppercase",
          }}
        >
          [ {translateCategory(message.category)} ]
        </span>
      </div>

      {/* Alıntı */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          color: "var(--text-1)",
          fontStyle: "italic",
          lineHeight: 1.4,
          marginBottom: "12px",
        }}
      >
        "{message.text}"
      </h2>
      
      {/* Alt Bölüm */}
      <div className="flex items-center gap-4">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            color: "var(--text-3)",
          }}
        >
          Bugünün darbesi
        </span>
        <button 
          onClick={handleRefresh}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--size-xs)",
            color: "var(--text-3)",
            background: "transparent",
            border: "1px solid var(--border-0)",
            padding: "3px 8px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
          className="hover:text-(--text-1) hover:border-(--border-1)"
        >
          REALITY CHECK
        </button>
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
    return map[cat] || cat;
}
