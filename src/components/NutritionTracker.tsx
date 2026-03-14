"use client";

import { useState, useEffect } from "react";

interface MealItem {
    text: string;
}

interface Meal {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    calories: number;
    protein: number;
    items: MealItem[];
}

const MEALS: Meal[] = [
    {
        id: "breakfast",
        icon: "☀️",
        title: "CEO'nun Güç Kahvaltısı",
        subtitle: "Kolesterolü zıplatmadan, proteinle güne başlama sanatı.",
        calories: 350,
        protein: 30,
        items: [
            { text: "Omlet: 2 Tam Yumurta + 3 Yumurta Beyazı (Sarıları atıyoruz)" },
            { text: "Et: 3-4 Dilim Hindi Füme" },
            { text: "Yağ: 10-12 adet Zeytin" },
            { text: "Yeşillik: Sınırsız Salatalık + Limon" },
            { text: "❌ Asla Yok: Peynir, ekmek, yulaf" },
        ]
    },
    {
        id: "snack",
        icon: "🥤",
        title: "Taktiksel Yakıt",
        subtitle: "Akşama kadar kan şekerini dengede tut.",
        calories: 350,
        protein: 25,
        items: [
            { text: "Seçenek 1 (Tatlı): 1 Ölçek VMAX Vegan Protein + 1 Küçük Muz + Su" },
            { text: "Seçenek 2 (Tuzlu): 1 Kutu Dardanel Light Ton Balığı + 2 Salatalık" },
            { text: "Ekstra: 15 Adet Çiğ Badem (+100 kal)" }
        ]
    },
    {
        id: "main",
        icon: "💪",
        title: "İnşaat ve Onarım",
        subtitle: "Antrenman sonrası kasları doyuracağımız ana merkez.",
        calories: 700,
        protein: 60,
        items: [
            { text: "Ana: 250g Tavuk Göğsü VEYA 200g Az Yağlı Dana Kıyma" },
            { text: "Karb: 6-7 Yemek Kaşığı Basmati Pirinç VEYA 2 Haşlanmış Patates" },
            { text: "Şifa: 1 Yemek Kaşığı Çiğ Sızma Zeytinyağı" },
            { text: "Yeşillik: Salatalık + bol limonlu su" },
        ]
    },
    {
        id: "closing",
        icon: "🌙",
        title: "Kapanış ve Temizlik",
        subtitle: "Yatmadan önce.",
        calories: 200,
        protein: 5,
        items: [
            { text: "Kuruyemiş: 1 Avuç Çiğ Badem veya Çiğ Ceviz (Kavrulmuş değil!)" },
            { text: "Biyolojik Süpürge: 1 tatlı kaşığı Karnıyarık Otu Tozu + 2 bardak su" },
        ]
    },
];

const TARGET_CALORIES = 1600;
const TARGET_PROTEIN = 120;

export default function NutritionTracker() {
    const [eaten, setEaten] = useState<Record<string, boolean>>({});
    const [lastMealTime, setLastMealTime] = useState<string>("");
    const [fastingProgress, setFastingProgress] = useState(0);
    const [fastingStatus, setFastingStatus] = useState<string>("");
    const [isClient, setIsClient] = useState(false);

    // Load state from localStorage
    useEffect(() => {
        setTimeout(() => {
            setIsClient(true);
        }, 0);
        
        const dateStr = new Date().toISOString().split("T")[0];
        const saved = localStorage.getItem(`goat-nutrition-v2-${dateStr}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => {
                    setEaten(parsed.eaten || {});
                    setLastMealTime(parsed.lastMealTime || "");
                }, 0);
            } catch (e) {
                console.error("Failed to parse nutrition state", e);
            }
        }
    }, []);

    // Fasting calculation tick
    useEffect(() => {
        if (!isClient || !lastMealTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            
            // Last meal was today or yesterday? Let's assume if it's after now, it was yesterday.
            // A simpler approach: Parse HH:mm and attach it to a Date object.
            const [hours, mins] = lastMealTime.split(":").map(Number);
            
            const lastMealDate = new Date();
            lastMealDate.setHours(hours, mins, 0, 0);

            if (lastMealDate > now) {
                // Must be from yesterday
                lastMealDate.setDate(lastMealDate.getDate() - 1);
            }

            const targetMilli = lastMealDate.getTime() + (16 * 60 * 60 * 1000); // +16 hours
            const diffMilli = now.getTime() - lastMealDate.getTime();
            const remainingMilli = targetMilli - now.getTime();

            if (remainingMilli <= 0) {
                setFastingStatus("Oruç Tamamlandı! ✓");
                setFastingProgress(100);
            } else {
                const hoursLeft = Math.floor(remainingMilli / (1000 * 60 * 60));
                const minsLeft = Math.floor((remainingMilli % (1000 * 60 * 60)) / (1000 * 60));
                setFastingStatus(`${hoursLeft}s ${minsLeft}d kaldı`);
                const prog = Math.min((diffMilli / (16 * 60 * 60 * 1000)) * 100, 100);
                setFastingProgress(prog);
            }
        }, 60000); // 1 minute interval for performance

        return () => clearInterval(interval);
    }, [lastMealTime, isClient]);

    // Save state to localStorage
    useEffect(() => {
        if (!isClient) return;
        const dateStr = new Date().toISOString().split("T")[0];
        localStorage.setItem(`goat-nutrition-v2-${dateStr}`, JSON.stringify({ eaten, lastMealTime }));
    }, [eaten, lastMealTime, isClient]);

    const toggleEaten = (mealId: string) => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        setEaten(prev => ({
            ...prev,
            [mealId]: !prev[mealId]
        }));
    };

    // Calculate totals
    const totalCalories = MEALS.reduce((sum, meal) => 
        eaten[meal.id] ? sum + meal.calories : sum, 0
    );
    const totalProtein = MEALS.reduce((sum, meal) => 
        eaten[meal.id] ? sum + meal.protein : sum, 0
    );

    const proteinProgress = Math.min((totalProtein / TARGET_PROTEIN) * 100, 100);
    const isOverCalories = totalCalories > TARGET_CALORIES;

    if (!isClient) return null;

    return (
        <section className="mb-4">
            {/* Fasting (Oruç) Tracker */}
            <div className="border mb-4 bg-black" style={{ borderColor: "#1E1E1E" }}>
                <div className="p-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: "#1E1E1E", backgroundColor: "#0A0A1A" }}>
                    <div className="flex items-center gap-2">
                        <span className="text-base">⏳</span>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                                16:8 ORUÇ TAKİBİ
                            </span>
                            {lastMealTime && (
                                <span className={`text-[9px] uppercase tracking-wider font-bold ${fastingProgress >= 100 ? "text-accent-green" : "text-accent-red"}`}>
                                    {fastingStatus}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-text-muted uppercase">Son Yemek:</span>
                        <input 
                            type="time" 
                            value={lastMealTime}
                            onChange={(e) => setLastMealTime(e.target.value)}
                            className="bg-surface/20 border border-border px-2 py-1 text-xs text-white uppercase font-bold focus:outline-none focus:border-text transition-colors"
                        />
                    </div>
                </div>
                {lastMealTime && (
                    <div className="w-full h-1.5 bg-background">
                        <div 
                            className="h-full transition-all duration-1000 ease-linear"
                            style={{ 
                                width: `${fastingProgress}%`,
                                backgroundColor: fastingProgress >= 100 ? "#00FF88" : "#FF3B3B" 
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Main Card (Now Pulses when something is active) */}
            <div 
                className="border shadow-[0_0_15px_rgba(255,255,255,0.05)] custom-nutrition-card relative"
                style={{ 
                    backgroundColor: "#111111",
                    borderColor: "#333333"
                }}
            >
                {/* Glowing border effect */}
                <div className="absolute inset-0 border border-white/20 animate-pulse pointer-events-none"></div>
                {/* Header */}
                <div 
                    className="p-3 flex items-center justify-between"
                    style={{ backgroundColor: "#0A0A1A" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-base">🍽️</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                            BESLENME
                        </span>
                    </div>
                    <span 
                        className="text-[11px] font-bold tabular-nums"
                        style={{ color: isOverCalories ? "#FFB800" : "#FFFFFF" }}
                    >
                        {totalCalories} / {TARGET_CALORIES} kal
                    </span>
                </div>

                {/* Protein Progress */}
                <div className="px-3 py-2 border-b" style={{ borderColor: "#1E1E1E" }}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] uppercase tracking-wider text-text-muted">
                            Protein
                        </span>
                        <span className="text-[10px] font-bold tabular-nums text-text-muted">
                            {totalProtein}g / {TARGET_PROTEIN}g
                        </span>
                    </div>
                    <div 
                        className="h-2 w-full"
                        style={{ backgroundColor: "#1E1E1E" }}
                    >
                        <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                                width: `${proteinProgress}%`,
                                backgroundColor: proteinProgress >= 100 ? "#00FF88" : "#00FF88"
                            }}
                        />
                    </div>
                </div>

                {/* Meals List */}
                <div className="divide-y" style={{ borderColor: "#1E1E1E" }}>
                    {MEALS.map((meal) => {
                        const isEaten = eaten[meal.id];

                        return (
                            <div key={meal.id}>
                                {/* Meal Row */}
                                <div 
                                    className="px-3 py-2.5 flex items-center gap-3"
                                    style={{ borderColor: "#1E1E1E" }}
                                >
                                    <span className="text-sm">{meal.icon}</span>
                                    
                                    <div className="flex-1 min-w-0">
                                        <span 
                                            className={`text-[11px] font-semibold ${isEaten ? "line-through opacity-50" : ""}`}
                                            style={{ color: "#FFFFFF" }}
                                        >
                                            {meal.title}
                                        </span>
                                    </div>

                                    <span 
                                        className="text-[10px] tabular-nums"
                                        style={{ color: "#888888" }}
                                    >
                                        {meal.calories} kal
                                    </span>

                                    {/* Eaten Checkbox */}
                                    <button
                                        onClick={() => toggleEaten(meal.id)}
                                        className={`w-11 h-11 shrink-0 border flex items-center justify-center text-sm font-bold transition-colors ${
                                            isEaten 
                                                ? "bg-accent-green border-accent-green text-black" 
                                                : "border-border bg-transparent text-transparent hover:border-text-muted"
                                        }`}
                                    >
                                        ✓
                                    </button>
                                </div>

                                {/* Detail (Always open) */}
                                <div 
                                    className="overflow-hidden bg-[#0D0D0D]"
                                >
                                    <div className="px-4 py-3 pl-10 space-y-2">
                                        {/* Subtitle */}
                                        <p 
                                            className="text-[10px] italic"
                                            style={{ color: "#888888" }}
                                        >
                                            {meal.subtitle}
                                        </p>
                                        
                                        {/* Calorie/Protein Info */}
                                        <p className="text-[9px] uppercase tracking-wider text-accent-green font-bold">
                                            {meal.calories} kal | {meal.protein}g Protein
                                        </p>

                                        {/* Items */}
                                        <ul className="space-y-1">
                                            {meal.items.map((item, idx) => (
                                                <li 
                                                    key={idx}
                                                    className="text-[10px] pl-2 border-l"
                                                    style={{ 
                                                        color: "#CCCCCC",
                                                        borderColor: "#333333"
                                                    }}
                                                >
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
