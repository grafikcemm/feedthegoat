"use client";

import { useState, useEffect, useMemo } from "react";

interface ContentItem {
    id: number;
    url: string;
    type: string;
    category: string;
    notes: string;
    date: string;
    isUsed?: boolean;
}

const TYPE_ICONS: Record<string, string> = {
    "Reels": "🎬",
    "Carousel": "🖼️",
    "Post": "📱",
    "Story": "📖",
    "Diğer": "🔗"
};

export default function ContentArsenal() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form states
    const [url, setUrl] = useState("");
    const [type, setType] = useState("Reels");
    const [category, setCategory] = useState("Hook");
    const [notes, setNotes] = useState("");

    // Filter & Search states
    const [filterType, setFilterType] = useState("Hepsi");
    const [filterCategory, setFilterCategory] = useState("Hepsi");
    const [searchQuery, setSearchQuery] = useState("");

    // Random Inspiration State
    const [randomItem, setRandomItem] = useState<ContentItem | null>(null);

    const types = ["Reels", "Carousel", "Post", "Story", "Diğer"];
    const categories = ["Hook", "Tasarım", "Geçiş", "CTA", "Müzik", "Konsept", "Diğer"];

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("goat-content-arsenal");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setItems(parsed);
            } catch (e) {
                console.error("Failed to parse Content Arsenal data");
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("goat-content-arsenal", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // Pick a random item on load or when button clicked
    const pickRandomItem = () => {
        if (items.length > 0) {
            const randomIndex = Math.floor(Math.random() * items.length);
            setRandomItem(items[randomIndex]);
        } else {
            setRandomItem(null);
        }
    };

    useEffect(() => {
        if (isLoaded && !randomItem && items.length > 0) {
            pickRandomItem();
        }
    }, [isLoaded, items.length]);

    const handleAdd = () => {
        if (!url.trim()) return;
        const newItem: ContentItem = {
            id: Date.now(),
            url,
            type,
            category,
            notes,
            date: new Date().toLocaleDateString("tr-TR"),
            isUsed: false
        };
        setItems([newItem, ...items]);
        setUrl("");
        setNotes("");

        // If it's the first item, set it as random
        if (items.length === 0) {
            setRandomItem(newItem);
        }
    };

    const toggleUsed = (id: number) => {
        setItems(items.map(item => item.id === id ? { ...item, isUsed: !item.isUsed } : item));
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
        if (randomItem?.id === id) pickRandomItem();
    };

    const filteredItems = items.filter(item => {
        if (filterType !== "Hepsi" && item.type !== filterType) return false;
        if (filterCategory !== "Hepsi" && item.category !== filterCategory) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            if (!item.notes.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query)) {
                return false;
            }
        }
        return true;
    });

    // Stats calculations
    const stats = useMemo(() => {
        const total = items.length;
        const usedCount = items.filter(i => i.isUsed).length;

        const typeCounts = items.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const catCounts = items.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        let maxCat = "-";
        let maxCatCount = 0;
        for (const [cat, count] of Object.entries(catCounts)) {
            if (count > maxCatCount) {
                maxCatCount = count;
                maxCat = cat;
            }
        }

        return {
            total,
            usedCount,
            reels: typeCounts["Reels"] || 0,
            carousel: typeCounts["Carousel"] || 0,
            post: typeCounts["Post"] || 0,
            maxCat,
            maxCatCount
        };
    }, [items]);

    if (!isLoaded) return null;

    return (
        <section className="mb-8 mt-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-2">
                İçerik Cephane Deposu
            </h2>
            <p className="text-xs text-text-muted mb-4 uppercase tracking-wider leading-relaxed">
                Beğendiğin reels, carousel, post linklerini biriktir. İçerik üretirken referans olarak kullan.
            </p>

            {/* İstatistik Bandı */}
            <div className="bg-surface border border-border px-3 py-2 mb-6 text-[10px] md:text-xs uppercase tracking-widest font-bold flex flex-wrap gap-x-4 gap-y-2 text-text/80 items-center justify-between">
                <div>
                    <span className="text-accent-green">{stats.total} İçerik Kaydedildi</span>
                    <span className="mx-2 opacity-50">|</span>
                    {stats.reels} Reels, {stats.carousel} Carousel, {stats.post} Post
                    <span className="mx-2 opacity-50">|</span>
                    <span className="text-accent-amber">En çok: {stats.maxCat} ({stats.maxCatCount})</span>
                </div>
                <div className="text-text-muted">
                    {stats.usedCount}/{stats.total} Kullanıldı
                </div>
            </div>

            {/* "Bugün Bundan Esinlen" Kutusu */}
            {randomItem && (
                <div className="brutalist-card mb-6 border-l-4 border-l-accent-amber bg-surface/20 p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{TYPE_ICONS[randomItem.type] || "🔗"}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-accent-amber">
                                💡 Bugün Bundan Esinlen
                            </span>
                        </div>
                        <button
                            onClick={pickRandomItem}
                            className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 border border-border hover:bg-surface text-text-muted hover:text-text transition-colors"
                        >
                            🔄 Başka Göster
                        </button>
                    </div>
                    <div className="text-xs text-text/90 mb-2 italic">
                        "{randomItem.notes || "Not eklenmemiş."}"
                    </div>
                    <a href={randomItem.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-accent-green hover:underline break-all">
                        İçeriğe Git &rarr;
                    </a>
                </div>
            )}

            {/* Arama Alanı */}
            <div className="mb-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                    <input
                        type="text"
                        placeholder="İçeriklerde ara (not veya kategori)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-border pl-8 pr-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-accent-green text-text placeholder:text-text-muted/50"
                    />
                </div>
            </div>

            {/* Ekleme Formu (Daha kompakt) */}
            <div className="brutalist-card p-3 border border-border bg-surface/10 mb-6 flex flex-col gap-3">
                <input
                    type="url"
                    placeholder="İçerik Linki (URL)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-1.5 text-xs focus:outline-none focus:border-accent-green text-text placeholder:text-text-muted/50"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex gap-2 sm:w-1/3">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-1/2 sm:w-full bg-background border border-border px-1 py-1.5 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent-green text-text"
                        >
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-1/2 sm:w-full bg-background border border-border px-1 py-1.5 text-[10px] uppercase tracking-widest focus:outline-none focus:border-accent-green text-text"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <textarea
                        placeholder="Neden kaydettin?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="sm:w-1/2 bg-background border border-border px-2 py-1.5 text-[10px] focus:outline-none focus:border-accent-green resize-none h-8 text-text placeholder:text-text-muted/50"
                    />
                    <button
                        onClick={handleAdd}
                        className="sm:w-1/6 py-1.5 bg-text text-black font-bold uppercase tracking-widest text-[10px] hover:bg-text-muted transition-colors"
                    >
                        Ekle
                    </button>
                </div>
            </div>

            {/* Filtreler */}
            {items.length > 0 && (
                <div className="flex gap-2 mb-4">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-1/2 bg-surface/50 border border-border p-1.5 text-[9px] uppercase tracking-widest focus:outline-none text-text-muted"
                    >
                        <option value="Hepsi">Tüm Türler</option>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-1/2 bg-surface/50 border border-border p-1.5 text-[9px] uppercase tracking-widest focus:outline-none text-text-muted"
                    >
                        <option value="Hepsi">Tüm Kategoriler</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            )}

            {/* Liste */}
            <div className="space-y-3">
                {filteredItems.map(item => (
                    <div key={item.id} className={`brutalist-card p-3 border transition-colors ${item.isUsed ? 'bg-accent-green/5 border-accent-green/30' : 'border-border bg-surface/10'}`}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Thumbnail / Icon area */}
                            <div className="w-12 h-12 shrink-0 bg-surface border border-border flex items-center justify-center text-2xl">
                                {TYPE_ICONS[item.type] || "🔗"}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-text/10 text-text">
                                        {item.type}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber">
                                        {item.category}
                                    </span>
                                    <span className="text-[9px] text-text-muted tabular-nums tracking-widest ml-auto">{item.date}</span>
                                </div>
                                <p className="text-xs text-text/90 mb-1 break-words">
                                    {item.notes || "Not eklenmedi."}
                                </p>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-accent-green hover:underline truncate block">
                                    {item.url}
                                </a>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col justify-end gap-2 shrink-0 mt-2 sm:mt-0">
                                <button
                                    onClick={() => toggleUsed(item.id)}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 py-1 border text-[9px] uppercase font-bold tracking-widest transition-colors ${item.isUsed ? 'bg-accent-green text-background border-accent-green' : 'bg-transparent border-border hover:border-accent-green text-text-muted'}`}
                                >
                                    {item.isUsed ? 'Kullanıldı ✓' : 'Kullandım'}
                                </button>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    className="px-2 py-1 border border-border hover:border-accent-red text-text-muted hover:text-accent-red text-[9px] uppercase font-bold tracking-widest transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-border text-text-muted text-xs uppercase tracking-widest">
                        Depo boş. İçerik biriktirmeye başla.
                    </div>
                ) : filteredItems.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-border text-text-muted text-xs uppercase tracking-widest">
                        Aramaya uygun içerik bulunamadı.
                    </div>
                )}
            </div>
        </section>
    );
}
