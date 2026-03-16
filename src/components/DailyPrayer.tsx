"use client";

import { useState, useEffect } from "react";

export default function DailyPrayer() {
    const [checked, setChecked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const saved = localStorage.getItem(`goat-prayer-${todayStr}`);
        if (saved) {
            setTimeout(() => {
                try { setChecked(JSON.parse(saved)); } catch {}
            }, 0);
        }
    }, [todayStr]);

    useEffect(() => {
        if (!isClient) return;
        localStorage.setItem(`goat-prayer-${todayStr}`, JSON.stringify(checked));
    }, [checked, isClient, todayStr]);

    const toggleCheckbox = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setChecked(!checked);
    };

    if (!isClient) return null;

    return (
        <section className="mt-6 mb-8">
            <div className={`border transition-colors ${checked ? 'border-text bg-text/5' : 'border-border/50 bg-[#050505]'}`}>
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl opacity-80">{checked ? "🕋" : "🤲"}</span>
                        <div>
                            <span className={`text-xs md:text-sm font-bold uppercase tracking-widest block ${checked ? 'text-text' : 'text-text'}`}>
                                Günü Kapatış Ritüeli
                            </span>
                            <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-medium mt-1 block">
                                Uyanışa, İlme ve Berekete Şükür
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex-1 sm:flex-none px-4 py-2.5 border border-border/50 text-[10px] uppercase tracking-widest font-bold text-text-muted hover:bg-surface/50 transition-colors"
                        >
                            {isExpanded ? "Metni Gizle" : "Metni Aç"}
                        </button>
                        <button 
                            onClick={toggleCheckbox}
                            className={`flex-2 sm:flex-none px-6 py-2.5 border text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                                checked 
                                    ? "bg-text border-text text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                                    : "border-border text-text hover:bg-surface"
                            }`}
                        >
                            {checked ? (
                                <><span>✓</span> OKUNDU</>
                            ) : (
                                "ONAYLA"
                            )}
                        </button>
                    </div>
                </div>

            </div>

            {isExpanded && (
                <div className="p-5 border border-t-0 border-border/50 bg-[#0A0A0A] fade-in">
                    <p className="text-xs md:text-sm italic leading-loose text-text-muted tracking-widest text-left space-y-3">
                        <span>Ya Rabbim,</span><br/>
                        <span>Sana sonsuz şükürler olsun ki beni bu yaşta uyanışa erdirdin. Gözlerimi açtın, aklıma bereket verdin, ellerime beceri ve kalbime hırs nasip ettin. Beni başıboş bırakmadın; bir yol gösterdin.</span><br/>
                        <span>Rabbim, nefsimin beni sürüklediği kolay zevklerden, ucuz dopaminlerden, ekran esaretinden ve tembellikten beni koru. Zor olanı seçme cesaretini ver. Disiplini bana sevdir, sabrı içime yerleştir. Her sabah kalktığımda dünkü halimden daha güçlü, daha odaklı ve daha kararlı olmamı nasip et.</span><br/>
                        <span>Ya Rabbim, geçmişte düştüğüm hataları affet. Zamanımı boşa harcadığım günleri, başlayıp bıraktığım işleri, korktuğum için kaçındığım fırsatları bağışla. O günler bitti. Bugünden itibaren beni &quot;Parlayan Nesne&quot;lerin peşinde koşan değil, tek hedefe kilitlenmiş bir kul eyle.</span><br/>
                        <span>Rabbim, ellerime bereket ver. Tasarladığım her marka kimliğine, uçurduğum her droneuma, kurduğum her AI sistemine hayır ve bereket kat. Müşterilerimin işini büyüt ki benim işim de büyüsün. Hakkımla, alın terimle, helal kazançla ailemi ve kendimi geçindirebileceğim bir rızık kapısı aç. ₺120.000 hedefimi senin izninle, senin bereketinle gerçekleştirmemi nasip et — ama beni paraya kul etme, parayı bana hizmetçi kıl.</span><br/>
                        <span>Ya Rabbim, beni sosyal medyada başkalarıyla kıyaslamaktan koru. Herkesin yolculuğu farklı; benim yolculuğum bana özel. Başkalarının başarısına haset değil, kendi yoluma şükür eden bir kul olmamı nasip et.</span><br/>
                        <span>Rabbim, bedenimi sağlıklı tut, zihnime berraklık ver, kalbime huzur yerleştir. Antrenman yaparken gücümü artır, çalışırken odağımı keskinleştir, uyurken bedenimi onar.</span><br/>
                        <span>Ya Rabbim, annemi, babamı ve sevdiklerimi her türlü kötülükten, kazadan, hastalıktan ve darlıktan muhafaza eyle. Onların yüzünü güldürecek başarıları bana nasip et. Bir gün aileme dönüp &quot;başardım&quot; diyeceğim günü yakınlaştır.</span><br/>
                        <span>Rabbim, beni yalnız sana güvenen, yalnız sana yönelen, yalnız senin rızan için çalışan bir kul eyle. Dilimden hikmetli sözler, elimden hayırlı işler, gönlümden temiz niyetler eksik etme.</span><br/>
                        <span>Hayatımı faydalı ve anlamlı işlerle süsle. Bana çalışkanlık, azim, sabır ve güzel ahlak ihsan et. Bugün attığım her adımı senin rızan doğrultusunda atmamı nasip et.</span><br/>
                        <span>Âmin.</span>
                    </p>
                </div>
            )}
        </section>
    );
}
