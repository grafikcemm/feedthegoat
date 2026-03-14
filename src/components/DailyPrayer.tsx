"use client";

import { useState, useEffect } from "react";

export default function DailyPrayer() {
  const [done, setDone] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
    const saved = localStorage.getItem(`goat-prayer-${todayStr}`);
    if (saved) {
      setTimeout(() => {
        const isDone = saved === "true";
        setDone(isDone);
        if (isDone) setIsOpen(false);
      }, 0);
    }
  }, [todayStr]);

  const toggle = () => {
    const newVal = !done;
    setDone(newVal);
    localStorage.setItem(`goat-prayer-${todayStr}`, newVal.toString());
    if (newVal) setIsOpen(false);
    else setIsOpen(true);
  };

  if (!isClient) return null;

  return (
    <section className="mb-6">
      <div className="brutalist-card border border-border bg-black">
        <div 
            className={`p-3 border-b flex items-center justify-between ${done ? 'cursor-pointer hover:bg-surface/50' : ''}`}
            style={{ borderColor: "#1E1E1E" }}
            onClick={() => done && setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-2">
                <span className="text-xl">🤲</span>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    ALİ CEM&apos;İN GÜNLÜK DUASI
                </span>
            </div>
            {done && (
                <span className="text-text-muted text-xs">{isOpen ? "▲ AÇIK" : "▼ KAPALI"}</span>
            )}
        </div>
        {(isOpen || !done) && (
        <>
            <div className="p-4 sm:p-5 text-text-muted text-[11px] sm:text-xs leading-relaxed space-y-3 font-serif italic" style={{ color: "#BBBBBB" }}>
            <p>
                <strong>Ya Rabbim,</strong><br/>
                Sana sonsuz şükürler olsun ki beni bu yaşta uyanışa erdirdin. Gözlerimi açtın, aklıma bereket verdin, ellerime beceri ve kalbime hırs nasip ettin. Beni başıboş bırakmadın; bir yol gösterdin.
            </p>
            <p>
                Rabbim, nefsimin beni sürüklediği kolay zevklerden, ucuz dopaminlerden, ekran esaretinden ve tembellikten beni koru. Zor olanı seçme cesaretini ver. Disiplini bana sevdir, sabrı içime yerleştir. Her sabah kalktığımda dünkü halimden daha güçlü, daha odaklı ve daha kararlı olmamı nasip et.
            </p>
            <p>
                Ya Rabbim, geçmişte düştüğüm hataları affet. Zamanımı boşa harcadığım günleri, başlayıp bıraktığım işleri, korktuğum için kaçındığım fırsatları bağışla. O günler bitti. Bugünden itibaren beni &quot;Parlayan Nesne&quot;lerin peşinde koşan değil, tek hedefe kilitlenmiş bir kul eyle.
            </p>
            <p>
                Rabbim, ellerime bereket ver. Tasarladığım her marka kimliğine, uçurduğum her droneuma, kurduğum her AI sistemine hayır ve bereket kat. Müşterilerimin işini büyüt ki benim işim de büyüsün. Hakkımla, alın terimle, helal kazançla ailemi ve kendimi geçindirebileceğim bir rızık kapısı aç. ₺120.000 hedefimi senin izninle, senin bereketinle gerçekleştirmemi nasip et — ama beni paraya kul etme, parayı bana hizmetçi kıl.
            </p>
            <p>
                Ya Rabbim, beni sosyal medyada başkalarıyla kıyaslamaktan koru. Herkesin yolculuğu farklı; benim yolculuğum bana özel. Başkalarının başarısına haset değil, kendi yoluma şükür eden bir kul olmamı nasip et.
            </p>
            <p>
                Rabbim, bedenimi sağlıklı tut, zihnime berraklık ver, kalbime huzur yerleştir. Antrenman yaparken gücümü artır, çalışırken odağımı keskinleştir, uyurken bedenimi onar.
            </p>
            <p>
                Ya Rabbim, annemi, babamı ve sevdiklerimi her türlü kötülükten, kazadan, hastalıktan ve darlıktan muhafaza eyle. Onların yüzünü güldürecek başarıları bana nasip et. Bir gün aileme dönüp &quot;başardım&quot; diyeceğim günü yakınlaştır.
            </p>
            <p>
                Rabbim, beni yalnız sana güvenen, yalnız sana yönelen, yalnız senin rızan için çalışan bir kul eyle. Dilimden hikmetli sözler, elimden hayırlı işler, gönlümden temiz niyetler eksik etme.
            </p>
            <p>
                Hayatımı faydalı ve anlamlı işlerle süsle. Bana çalışkanlık, azim, sabır ve güzel ahlak ihsan et. Bugün attığım her adımı senin rızan doğrultusunda atmamı nasip et. Âmin.
            </p>
        </div>

        <div className="p-3 border-t border-border bg-surface/20 flex items-center justify-center">
            <button 
                onClick={toggle}
                className={`flex items-center gap-3 px-6 py-3 border transition-all duration-300 w-full sm:w-auto ${
                    done 
                        ? "bg-accent-green text-black border-accent-green opacity-80" 
                        : "bg-surface hover:bg-surface-hover text-text border-text-muted"
                }`}
            >
                <div className={`w-5 h-5 flex items-center justify-center border-2 border-current transition-colors ${done ? "bg-black text-accent-green" : ""}`}>
                    {done && <span className="font-bold text-sm">✓</span>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${done ? "line-through opacity-70" : ""}`}>
                    Sabah duamı okudum
                </span>
            </button>
        </div>
        </>
        )}
      </div>
    </section>
  );
}
