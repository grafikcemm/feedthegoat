/* ── Mock Data ─────────────────────────────────────────────── */

export interface DailyMotivation {
    aforizma: string;
    olumlama: string;
}

export const motivations: DailyMotivation[] = [
    {
        aforizma:
            "Disiplin, motivasyon bittiğinde devam etmektir. Seni kimse kurtarmayacak — kendin kalk.",
        olumlama:
            "Bugün dünden daha güçlüsün. Her 'hayır' bir zırh, her tekrar bir zafer.",
    },
    {
        aforizma:
            "Acı geçicidir. Vazgeçersen sonsuza kadar sürer. Kes bahaneleri, başla.",
        olumlama:
            "Strateji: önce en zor görevi yap. Korku sana yol gösteriyor — oraya yürü.",
    },
    {
        aforizma:
            "Kurt sürüden ayrılmadı, sürü kurda ayak uyduramadı. Yalnızlığın gücünü kullan.",
        olumlama:
            "Sen bir makinasın. Duygular veri, karar değil. Planına sadık kal, sapma.",
    },
];

export const dailyTasks = [
    { id: "task-1", label: "06:00 Uyanış & Yüze Buz Sürme", icon: "🧊", layer: "asla_kirma" },
    { id: "task-3", label: "Vitaminlerin tamamını iç", icon: "💊", layer: "asla_kirma" },
    { id: "task-8", label: "3L Su Tüketimi", icon: "💧", layer: "asla_kirma" },
    { id: "task-tw", label: "Her gün Twitter haber paylaşımı", icon: "🐦", layer: "enerjin_varsa" },
    { id: "task-5", label: "20 sayfa kitap oku", icon: "📖", layer: "enerjin_varsa" },
    { id: "task-gym", label: "Spor (Gym)", icon: "💪", layer: "gym" },
];

export const weeklyTasks = [
    { id: "weekly-1", label: "Cumartesi veya Pazar Neo Skala 1 Kurs", icon: "🎓" },
    { id: "weekly-2", label: "Müsait oldukça Gönenç Akademi’den videolar izle kişisel gelişime devam et", icon: "🧠" },
];

export const goalCards = [
    {
        title: "1. TEMEL VE 'SÜPER GÜÇ' EDİNİMİ (İLK 3 AY)",
        color: "accent-green",
        items: [
            "İngilizce",
            "UI/UX Tasarımları (Figma, Relume, Framer, Lovable, Bolt.new)",
            "Motion Design",
            "JavaScript Temelleri + Python Basics",
            "Prompt Engineering (Stratejik Seviye)",
            "AI Ajanları (AI Agents) Mimarisi",
            "Vibe Coding + Cursor IDE + Clean Code Prensipleri",
            "N8N Otomasyonları (API, Webhook, Apify, Apollo.io, Instantly.ai)",
        ],
    },
    {
        title: "KİŞİSEL TEKNİK HEDEFLERİM",
        color: "accent-amber",
        items: [
            "JavaScript + Python Temelleri",
            "Dijital & Finansal Okuryazarlık",
            "Girişkenlik Öğren",
            "Growth Marketing & Value-Based Pricing Sistematiği",
            "Database Mantığı (Supabase)",
            "Vibe Marketing & Storytelling/Copywriting",
            "Marka İletişimi, Satış & İkna Psikolojisi",
            "Veri Okuryazarlığı (GA4 + Meta Ads + Supabase)",
            "AI Content Multiplier (OpusClip + ElevenLabs)",
            "Prompt Engineering & AI Orkestrasyon",
        ],
    },
    {
        title: "SENE İÇİNDE HEDEFLERİM",
        color: "accent-red",
        items: [
            "After Effects (Motion Design) kursunu bitir",
            "AI Agent Workflow'ları Kur ve Hizmet Olarak Sat (n8n)",
            "Kişisel YouTube kanalını kur ve uzmanlığını sat",
            "Bozma Creative ajans hesabını faaliyete geçir",
            "AI ile YouTube/TikTok/IG kısa videoları (Yan hesap)",
            "Müşteri bulma — Cold Outreach + Discovery Call Script",
            "UI/UX Design System Oluştur (Figma)",
            "Client Journey Sistemi Kur (Notion + n8n)",
            "Günlük Taste Building Rutini (30 dk)",
            "AEO/GEO Farkındalığı (Not al, 2027 uygula)",
        ],
    },
];

export const darkMirrorMessages = [
    "BUGÜN DE KENDİNE VERDİĞİN SÖZÜ BOZDUN.\nAynaya bak — o yüz, başarısızlığı normalleştiren bir yüz.\nYarın aynı bahaneyi söyleyeceksin. Ama bunu biliyorsun zaten.\nDİSİPLİNSİZ ADAM, KENDİNE YALAN SÖYLEYEN ADAMDIR.",
    "6 GÖREV. TEK BİR GÜN.\nBunu bile yapamıyorsan, büyük hayallerinden bahsetmeyi bırak.\nHer gece tamamlanmamış bir liste, sana ne olduğunu hatırlatıyor:\nHENÜZ HAZIR DEĞİLSİN. VE BU SENİN SEÇİMİN.",
    "RAHATA KAÇTIN. YİNE.\nBedenin konfor istiyor, ama konfor seni öldürüyor.\nBugün pes eden adam, yarın da pes edecek.\nKENDİNİ KANDIR AMA AYNAYI KANDIRAMAZSIN.",
];
