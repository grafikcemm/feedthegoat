"use client";

import { useState, useEffect, useMemo } from "react";
import CollapsibleBlock from "./CollapsibleBlock";
import { supabase } from "@/utils/supabase";

const MOVIES = [
  { id: 1, title: "The Social Network (2010)", reason: "Bir fikri sıfırdan küresel ürüne dönüştürme hikayesi. Obsesyon vs ilişkiler dengesi." },
  { id: 2, title: "Whiplash (2014)", reason: "Mükemmellik takıntısı ve disiplinin bedeli. 'Kötü gün' protokolünü hatırlatır." },
  { id: 3, title: "Steve Jobs (2015)", reason: "Ürün vizyonu, sunum sanatı ve tavizsiz standartlar. Kreatif yönetici olarak seni besler." },
  { id: 4, title: "The Pursuit of Happyness (2006)", reason: "Sıfırdan başlama, pes etmeme, oğluna söz verme. Finansal darlıkta motivasyon." },
  { id: 5, title: "Jiro Dreams of Sushi (2011)", reason: "Zanaat ustalığı, 'bir şeyi mükemmel yapma' felsefesi. Fiziksel beceri sigortanla örtüşür." },
  { id: 6, title: "Moneyball (2011)", reason: "Veri-driven karar verme, herkesin gördüğünü farklı yorumlama. Senin 'Mor Sincap' stratejin." },
  { id: 7, title: "Ford v Ferrari (2019)", reason: "Mühendislik + tutku + kurumsal baskıya karşı bağımsızlık. Freelancer ruhu." },
  { id: 8, title: "Chef (2014)", reason: "Kurumsal dünyayı bırakıp kendi işini kurma. Sosyal medya ile marka inşası." },
  { id: 9, title: "The Founder (2016)", reason: "McDonald's'ın hikayesi. Sistem düşüncesi, franchise modeli, acımasız iş dünyası." },
  { id: 10, title: "Nightcrawler (2014)", reason: "Karanlık motivasyon, sıfırdan sektöre girme, 'hayır' kabul etmeme. Etik sınırları düşündürür." },
  { id: 11, title: "Joy (2015)", reason: "Kadın girişimci, patent savaşları, aile baskısı. Ürün geliştirme süreci." },
  { id: 12, title: "The Intern (2015)", reason: "Nesil farkı, startup kültürü, mentor-mentee ilişkisi. Hafif ama öğretici." },
  { id: 13, title: "Margin Call (2011)", reason: "Risk yönetimi, kriz anında karar verme, finans dünyasının acımasızlığı." },
  { id: 14, title: "Rocky (1976)", reason: "Underdog hikayesinin orijinali. Disiplin, antrenman, 'bir şans daha' felsefesi." },
  { id: 15, title: "The Secret Life of Walter Mitty (2013)", reason: "Hayal kurmaktan aksiyon almaya geçiş. Görsel olarak ilham verici (drone gözüyle izle)." },
  { id: 16, title: "Gattaca (1997)", reason: "Genetik dezavantaja rağmen irade ile hedefe ulaşma. 'İmkansız' denen şeyi yapma." },
  { id: 17, title: "Good Will Hunting (1997)", reason: "Ham yetenek vs disiplin. Mentor ilişkisi. Duygusal duvarları yıkma." },
  { id: 18, title: "A Beautiful Mind (2001)", reason: "Deha ve mücadele. Zihinsel sağlık farkındalığı. Odak ve obsesyon dengesi." },
  { id: 19, title: "The Shawshank Redemption (1994)", reason: "Sabır, uzun vadeli plan, umut. 20 yıllık tünel = senin 3 yıllık yol haritası." },
  { id: 20, title: "Creed (2015)", reason: "Kendi kimliğini inşa etme, babanın gölgesinden çıkma, modern Rocky." },
  { id: 21, title: "Soul (Pixar, 2020)", reason: "Hayatın anlamı, tutku vs günlük yaşam, 'spark' kavramı. Derin ama hafif." },
  { id: 22, title: "The Walk (2015)", reason: "İkiz Kuleler arasında ip yürüyüşü. İmkansız hedefe takıntılı odaklanma." },
  { id: 23, title: "127 Hours (2010)", reason: "Hayatta kalma iradesi. Konfor zonunun çok ötesinde karar verme." },
  { id: 24, title: "Sully (2016)", reason: "Kriz anında soğukkanlılık, uzmanlık, 'doğru olanı yap' cesareti." },
  { id: 25, title: "Ip Man (2008)", reason: "Ustalık, alçakgönüllülük, disiplin. Dövüş sanatı felsefesi." },
  { id: 26, title: "The Imitation Game (2014)", reason: "Alan Turing, kod kırma, farklı düşünmenin gücü. AI tarihinin başlangıcı." },
  { id: 27, title: "Amadeus (1984)", reason: "Yetenek vs çalışkanlık, sanat ve kıskançlık. Yaratıcı süreç üzerine başyapıt." },
  { id: 28, title: "Ratatouille (2007)", reason: "'Herkes aşçı olabilir' = 'Herkes kreatif olabilir'. Sınıf ayrımına meydan okuma." },
  { id: 29, title: "Blade Runner 2049 (2017)", reason: "Görsel sinema ustalığı. Drone gözüyle kompozisyon, ışık ve atmosfer dersi." },
  { id: 30, title: "Her (2013)", reason: "AI-insan ilişkisi, teknolojinin duygusal etkisi. Voice Agent işinle doğrudan bağlantılı." },
  { id: 31, title: "Ex Machina (2014)", reason: "AI, bilinç, manipülasyon. Yapay zekanın etik sınırları." },
  { id: 32, title: "Arrival (2016)", reason: "İletişim, dil ve algı. Problem çözme yaklaşımını değiştirir." },
  { id: 33, title: "Interstellar (2014)", reason: "Vizyon, fedakarlık, zamanın değeri. Görsel olarak drone çekimlerin için ilham." },
  { id: 34, title: "Searching (2018)", reason: "Tamamen ekranlarda geçen film. Dijital çağda hikaye anlatımı." },
  { id: 35, title: "Bohemian Rhapsody (2018)", reason: "Kimlik arayışı, sanatsal vizyon, performans. Kişisel marka ilhamı." },
  { id: 36, title: "The Grand Budapest Hotel (2014)", reason: "Wes Anderson estetiği. Renk paleti, kompozisyon, marka kimliği dersi." },
  { id: 37, title: "Parasite (2019)", reason: "Sınıf farkı, strateji, plan yapma. Her sahnesinde bir ders var." },
  { id: 38, title: "Everything Everywhere All at Once (2022)", reason: "Yaratıcılık patlaması, çoklu yetenek, kaos içinde anlam bulma." },
  { id: 39, title: "Network (1976)", reason: "Medya, manipülasyon, halkı ikna etme. Marketing ve içerik stratejisi temeli." },
  { id: 40, title: "Hababam Sınıfı (1975)", reason: "Türk kültürel mirası, topluluk, sistem içinde bireysellik. Kendi kültürünü hatırla." },
  { id: 41, title: "Babam ve Oğlum (2005)", reason: "Baba-oğul ilişkisi, Türkiye tarihi, aile bağları. Duygusal derinlik." },
  { id: 42, title: "Kelebeğin Rüyası (2013)", reason: "Hayallerin peşinden gitme, Türk sinemasında poetik anlatım." },
  { id: 43, title: "Into the Wild (2007)", reason: "Maddi dünyadan kaçış, doğa, anlam arayışı. Dopamin detoksunun felsefi temeli." },
  { id: 44, title: "The Tree of Life (2011)", reason: "Varoluş, doğa vs şehir, spiritüel derinlik. Duandan sonra izle." },
  { id: 45, title: "Life of Pi (2012)", reason: "İnanç, hayatta kalma, hikaye anlatmanın gücü. Görsel olarak muhteşem." },
  { id: 46, title: "Ikiru (Kurosawa, 1952)", reason: "Hayatın anlamı, bürokratik sisteme karşı bireysel eylem. Zamansız başyapıt." },
  { id: 47, title: "The Truman Show (1998)", reason: "Yapay dünyadan uyanış, kendi gerçeğini yaratma. Sosyal medya eleştirisi." },
  { id: 48, title: "Cast Away (2000)", reason: "Yalnızlık, hayatta kalma, yeniden başlama. Minimalizm ve odak." },
  { id: 49, title: "Dead Poets Society (1989)", reason: "Eğitim, özgür düşünce, 'carpe diem'. Kişisel gelişim klasiği." },
  { id: 50, title: "Gladiator (2000)", reason: "Liderlik, onur, kaybedilen her şeye rağmen devam etme." },
  { id: 51, title: "Oppenheimer (2023)", reason: "Deha, sorumluluk, teknolojinin çift yüzü. AI çağında etik düşünce." },
  { id: 52, title: "Pay It Forward (2000)", reason: "İyilik zinciri, dünyayı değiştirme idealizmi. Yılın kapanışı için umut." }
];

function getWeekNumber(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return Math.min(Math.max(weekNo, 1), 52); // clamped between 1 and 52
}

interface WeeklySummary {
    completedDays: number;
    totalScore: number;
    trainingDays: number;
    bestDayScore: number;
    bestDayDate: string;
}

interface DayScore {
    date: string;
    total_score: number;
}

// Haftanın Pazartesi tarihini döndürür (YYYY-MM-DD)
function getMondayOfWeek(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date.toISOString().split("T")[0];
}

export default function WeeklyScreen() {
    const [weeklySummary, setWeeklySummary] = useState<WeeklySummary>({
        completedDays: 0,
        totalScore: 0,
        trainingDays: 0,
        bestDayScore: 0,
        bestDayDate: "",
    });
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [weekDayScores, setWeekDayScores] = useState<DayScore[]>([]);
    const [weeklyTasks, setWeeklyTasks] = useState([
        { id: "wt-sat-1", text: "Cumartesi: Haftalık gelir/gider takibi", icon: "💰", done: false },
        { id: "wt-sat-2", text: "Cumartesi: Müşteri pipeline kontrolü", icon: "📊", done: false },
        { id: "wt-sat-4", text: "Cumartesi: Neo Skala 1 kurs progresyonu", icon: "🎓", done: false },
        { id: "wt-sun-1", text: "Pazar: Hafta içi her gün için 1 potansiyel müşteri ayarla (Pzt, Sal, vs)", icon: "📞", done: false },
        { id: "wt-sun-2", text: "Pazar: Haftanın içerik kontrollerini tamamla", icon: "📱", done: false }
    ]);
    const [isClient, setIsClient] = useState(false);

    const weekNumber = useMemo(() => {
        return getWeekNumber(new Date());
    }, []);

    const todaysMovie = useMemo(() => {
        return MOVIES.find(m => m.id === weekNumber) || MOVIES[0];
    }, [weekNumber]);

    useEffect(() => {
        setTimeout(() => setIsClient(true), 0);
        const saved = localStorage.getItem("goat-weekly-v3");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Simple Monday reset logic
                const lastSavedDate = new Date(parsed.lastUpdated || Date.now());
                const now = new Date();
                
                const resetMs = 1000 * 60 * 60 * 24 * 7;
                const isNewWeek = now.getTime() - lastSavedDate.getTime() > resetMs || 
                                 (now.getDay() === 1 && lastSavedDate.getDay() !== 1);

                if (!isNewWeek) {
                    setTimeout(() => {
                        if (parsed.weeklyTasks && parsed.weeklyTasks.length === 5 && parsed.weeklyTasks[0].id === "wt-sat-1") {
                            setWeeklyTasks(parsed.weeklyTasks);
                        }
                    }, 0);
                }
            } catch { }
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;
        localStorage.setItem("goat-weekly-v3", JSON.stringify({
            weeklyTasks, lastUpdated: new Date().toISOString()
        }));
    }, [weeklyTasks, isClient]);

    // Haftalık özet — Supabase'den çek
    useEffect(() => {
        if (!isClient) return;
        const monday = getMondayOfWeek(new Date());
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        const sundayStr = sunday.toISOString().split("T")[0];

        async function loadSummary() {
            const { data, error } = await supabase
                .from("daily_scores")
                .select("date, total_score, routines_completed")
                .gte("date", monday)
                .lte("date", sundayStr);

            if (error || !data) {
                setSummaryLoaded(true);
                return;
            }

            const completedDays = data.filter(r => (r.total_score ?? 0) > 0).length;
            const totalScore = data.reduce((s, r) => s + (r.total_score ?? 0), 0);
            const trainingDays = data.filter(r => (r.routines_completed ?? 0) >= 4).length;
            const best = data.reduce(
                (top, r) => (r.total_score ?? 0) > top.score
                    ? { score: r.total_score ?? 0, date: r.date }
                    : top,
                { score: 0, date: "" }
            );

            setWeeklySummary({
                completedDays,
                totalScore,
                trainingDays,
                bestDayScore: best.score,
                bestDayDate: best.date,
            });
            setWeekDayScores(data as DayScore[]);
            setSummaryLoaded(true);
        }

        loadSummary();
    }, [isClient]);

    const toggleWeeklyTask = (id: string) => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setWeeklyTasks(weeklyTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const doneCount = weeklyTasks.filter(t => t.done).length;

    if (!isClient) return null;

    return (
        <section className="space-y-8 animate-in fade-in duration-300">
            {/* 2x2 Haftalık Özet Grid */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    {
                        label: "Tamamlanan Gün",
                        value: `${weeklySummary.completedDays} / 7`,
                        color: weeklySummary.completedDays >= 5 ? "#22c55e" : weeklySummary.completedDays >= 3 ? "#ffd60a" : "#ff453a",
                    },
                    {
                        label: "Haftalık Toplam Puan",
                        value: weeklySummary.totalScore > 0 ? weeklySummary.totalScore.toString() : "—",
                        color: "#3b82f6",
                    },
                    {
                        label: "Antrenman",
                        value: `${weeklySummary.trainingDays} / 4`,
                        color: weeklySummary.trainingDays >= 4 ? "#22c55e" : weeklySummary.trainingDays >= 2 ? "#ffd60a" : "#ff453a",
                    },
                    {
                        label: "En İyi Gün",
                        value: weeklySummary.bestDayScore > 0
                            ? `${weeklySummary.bestDayScore}p`
                            : "—",
                        sub: weeklySummary.bestDayDate
                            ? new Date(weeklySummary.bestDayDate + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" })
                            : "",
                        color: "#f97316",
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        style={{
                            background: "#111111",
                            border: "1px solid #1f1f1f",
                            borderRadius: "6px",
                            padding: "16px 18px",
                        }}
                    >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#404040] font-bold mb-2">
                            {card.label}
                        </p>
                        <p
                            className="text-2xl font-bold tabular-nums"
                            style={{ color: card.color }}
                        >
                            {card.value}
                        </p>
                        {"sub" in card && card.sub && (
                            <p className="text-[10px] text-[#404040] mt-0.5">{card.sub}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Haftalık Bar Chart */}
            {summaryLoaded && (() => {
                const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
                const monday = getMondayOfWeek(new Date());
                const mondayDate = new Date(monday + "T12:00:00");
                const bars = DAY_LABELS.map((label, i) => {
                    const d = new Date(mondayDate);
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().split("T")[0];
                    const found = weekDayScores.find((s) => s.date === dateStr);
                    return { label, score: found?.total_score ?? 0 };
                });
                const maxBar = Math.max(...bars.map(b => b.score), 1);
                return (
                    <div style={{ marginBottom: "8px" }}>
                        <div className="flex items-end gap-2 justify-between" style={{ height: "80px" }}>
                            {bars.map((bar, i) => {
                                const barH = Math.round((bar.score / maxBar) * 72);
                                const barColor = bar.score >= 66 ? "#4CAF7D" : bar.score >= 41 ? "#D4A574" : bar.score > 0 ? "#C75B5B" : "var(--border-0)";
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                                        {bar.score > 0 && (
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)" }}>{bar.score}</span>
                                        )}
                                        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: barH > 0 ? `${barH}px` : "3px",
                                                    background: barColor,
                                                    borderRadius: "3px 3px 0 0",
                                                    transition: "height 0.4s ease",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 justify-between mt-1">
                            {bars.map((bar, i) => (
                                <span key={i} style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-3)" }}>
                                    {bar.label}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            })()}

            <div>
                <h2 className="text-xl font-bold tracking-wide text-text mb-1 flex items-center gap-2">
                    Bu Haftanın Odakları
                </h2>
                <p className="text-xs text-text-muted">
                    Haftayı kazanmak için tamamlaman gereken minimum hedefler.
                </p>
            </div>

            {/* Haftalık Takip */}
            <div className="p-5 sm:p-6 border border-border/50 bg-surface/30">
                <div className="flex items-center justify-between mb-5 border-b border-border/50 pb-2">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-text-muted flex items-center gap-2">
                        Minimum Kazanımlar
                    </h3>
                    <span className="text-[10px] font-bold text-text-muted bg-background px-2 py-1 rounded-sm border border-border/50">{doneCount}/{weeklyTasks.length} Tamamlandı</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {weeklyTasks.map(task => (
                        <div 
                            key={task.id}
                            onClick={() => toggleWeeklyTask(task.id)}
                            className={`flex items-center justify-between p-4 border transition-all cursor-pointer ${
                                task.done 
                                    ? "border-transparent bg-surface/30" 
                                    : "border-border bg-background hover:bg-surface-hover hover:border-text-muted"
                            }`}
                        >
                            <div className="flex-1 flex gap-3 items-center min-w-0 pr-4">
                                <span className="shrink-0 text-lg opacity-80">{task.icon}</span>
                                <span className={`text-[13px] font-medium leading-relaxed truncate ${task.done ? 'line-through text-text-muted opacity-50' : 'text-text'}`}>
                                    {task.text}
                                </span>
                            </div>
                            <div className={`w-6 h-6 shrink-0 flex items-center justify-center border transition-colors ${
                                task.done 
                                    ? "border-accent-green bg-accent-green text-black" 
                                    : "border-border bg-transparent text-transparent"
                            }`}>
                                <span className="text-sm font-bold">✓</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PAZAR ŞARJ GÜNÜ */}
            <CollapsibleBlock title="Pazar — Şarj Günü" icon="🔋">
                <div className="space-y-3">
                    {/* Sabah */}
                    <div className="p-3 sm:p-4 border border-border/40 bg-background/50 transition-colors">
                        <h4 className="text-sm font-bold text-text mb-2 tracking-wide flex items-center gap-2">
                            <span className="opacity-80">☀️</span> Sabah <span className="text-text-muted text-[10px] uppercase font-normal tracking-wider">(09:00-12:00)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-text-muted ml-7 list-disc">
                            <li>Sabah duası + görselleştirme</li>
                            <li>Haftalık meal prep (5 günlük tavuk hazırla)</li>
                            <li>Haftalık gözden geçirme: Ne iyi gitti? Ne kötü gitti?</li>
                        </ul>
                    </div>

                    {/* Öğle */}
                    <div className="p-3 sm:p-4 border border-border/40 bg-background/50 transition-colors">
                        <h4 className="text-sm font-bold text-text mb-2 tracking-wide flex items-center gap-2">
                            <span className="opacity-80">📖</span> Öğleden Sonra <span className="text-text-muted text-[10px] uppercase font-normal tracking-wider">(14:00-17:00)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-text-muted ml-7 list-disc">
                            <li>Biyografi oku (minimum 50 sayfa veya 1 saat)</li>
                            <li>Not al: Bu insandan ne öğrendim? Hayatıma nasıl uygularım?</li>
                        </ul>
                    </div>

                    {/* Akşam */}
                    <div className="p-3 sm:p-4 border border-border/40 bg-background/50 transition-colors group">
                        <h4 className="text-sm font-bold text-text tracking-wide flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="opacity-80">🎬</span> Akşam <span className="text-text-muted text-[10px] uppercase font-normal tracking-wider">(19:00-22:00)</span>
                            </span>
                            <span className="text-[9px] text-accent-amber font-bold tracking-widest border border-accent-amber/30 px-1.5 py-0.5 bg-accent-amber/5">
                                FİLM ZAMANI
                            </span>
                        </h4>
                        
                        <div className="ml-7 mt-3">
                            <div className="text-text font-medium text-xs mb-1">» {todaysMovie.title}</div>
                            <div className="text-[11px] text-text-muted/80 italic leading-relaxed">
                                Neden izliyoruz: {todaysMovie.reason}
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleBlock>
        </section>
    );
}
