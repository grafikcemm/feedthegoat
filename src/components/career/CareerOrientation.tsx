"use client";

import { useState } from "react";

export default function CareerOrientation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="brutalist-card border-border bg-surface/10 mb-8 p-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-center justify-between hover:bg-surface/20 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
          <span>📖</span> Bu ekranı nasıl kullanıyorum?
        </span>
        <span className="text-xs font-bold text-text-muted border border-border px-2 py-1">
          {isOpen ? "KAPAT ↑" : "AÇ ↓"}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 text-xs md:text-sm text-text-muted/90 flex flex-col gap-3 font-mono border-t border-surface mt-2 fade-in">
          <p className="text-accent-red font-bold text-[10px] uppercase tracking-widest mb-2 border-b border-border pb-2">Bu bölüm bir hedef listesi değil, bir uygulama panelidir.</p>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Hedefler sırayla ilerler. Önce Faz 1 bitmeli, sonra Faz 2&apos;ye geçilmeli.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Her hedefin altında &quot;nasıl yapılacağı&quot; yazılıdır. Sadece oku ve uygula.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Her şeyi aynı anda yapmaya çalışmak <strong>YASAK</strong>. &quot;Şimdi Odaklan&quot; panelinde max 3 aktif hedef görürsün.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Akış: Önce temeli at ➔ Sonra ürünü yap ➔ Sonra müşteri bul ➔ Sonra ölçekle.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>&quot;Çıkarıldı&quot; bölümündeki hedeflere 12 ay boyunca dokunma.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Bir fazın &quot;çıkış kriterleri&quot; tamamlanmadan sonraki faza geçme.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-amber">→</span> 
            <span>Hedefin altındaki &quot;Aşırı Öğrenme Uyarısı&quot;na dikkat et — gereksiz derinleşme en büyük düşman!</span>
          </div>
        </div>
      )}
    </div>
  );
}
