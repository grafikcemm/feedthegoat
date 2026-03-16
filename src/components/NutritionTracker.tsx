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
        subtitle: "Sebze yok. Kahve serbest, şekersiz.",
        calories: 350,
        protein: 37,
        items: [
            { text: "2 tam yumurta" },
            { text: "1 ölçek protein tozu + su" },
            { text: "1 küçük muz" }
        ]
    },
    {
        id: "snack",
        icon: "🥤",
        title: "Taktiksel Yakıt",
        subtitle: "Alternatif: Ton balığı yerine 1 ölçek protein + 1 elma",
        calories: 250,
        protein: 28,
        items: [
            { text: "1 kutu light ton balığı" },
            { text: "2 adet pirinç patlağı" },
            { text: "10 adet çiğ badem" }
        ]
    },
    {
        id: "main",
        icon: "💪",
        title: "İnşaat ve Onarım",
        subtitle: "Antrenman gününde bunu antrenman sonrası kullan.",
        calories: 760,
        protein: 86,
        items: [
            { text: "250 g tavuk göğsü" },
            { text: "250 g haşlanmış patates VEYA 150 g pişmiş basmati pirinç" },
            { text: "1 yemek kaşığı zeytinyağı" },
            { text: "150 g süzme yoğurt / laktozsuz yoğurt (rahatsız ederse çıkar, 80-100 g ekstra tavuk ekle)" }
        ]
    },
    {
        id: "closing",
        icon: "🌙",
        title: "Kapanış ve Temizlik",
        subtitle: "Yatmadan önce.",
        calories: 240,
        protein: 28,
        items: [
            { text: "1 ölçek protein tozu" },
            { text: "15 g fıstık ezmesi VEYA 15 adet badem" },
        ]
    },
];

const TARGET_CALORIES = 1600;
const TARGET_PROTEIN = 180;

export default function NutritionTracker() {
    const [eaten, setEaten] = useState<Record<string, boolean>>({});
    const [lastMealTime, setLastMealTime] = useState<string>("");
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
