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
    { id: "task-1", label: "06:00 Uyanış & Yüze Buz Sürme", icon: "🧊" },
    { id: "task-2", label: "Her sabah 30 dakika yürüyüş", icon: "🚶‍♂️" },
    { id: "task-3", label: "Vitaminlerin tamamını iç", icon: "💊" },
    { id: "task-4", label: "Antrenmanını yap", icon: "🏋️" },
    { id: "task-5", label: "25 sayfa kitap oku", icon: "📖" },
    { id: "task-6", label: "🧠 DERİN ODAKLANMA (1 SAAT)", icon: "🧠" },
    { id: "task-7", label: "HER AKŞAM 1 SAAT İNGİLİZCE ÇALIŞ", icon: "🌐" },
    { id: "task-8", label: "📵 EKRAN SÜRESİ KISITLAMASI", icon: "📵" },
    { id: "task-9", label: "3L SU TÜKETİMİ", icon: "💧" },
    { id: "task-10", label: "ŞEKER TÜKETMEME (SIFIR TAVİZ)", icon: "🚫" },
];

export const goalCards = [
    {
        title: "İLK 3 AY (SÜPER GÜÇ)",
        color: "accent-green",
        items: [
            "UI/UX (Figma)",
            "AI Agents",
            "Vibe Coding",
            "n8n Automations",
        ],
    },
    {
        title: "AKTİF GÖREVLER",
        color: "accent-amber",
        items: [
            "AI Reklam Kursu",
            "2026 Otomasyonları",
            "İnsanlara 'Hayır' Demeyi Öğren",
        ],
    },
    {
        title: "SENE İÇİ HEDEFLER",
        color: "accent-red",
        items: [
            "Bozma Creative Ajansı",
            "Kişisel Youtube Kanalı",
            "Kendi Müşterini Bul",
        ],
    },
];

export const darkMirrorMessages = [
    "BUGÜN DE KENDİNE VERDİĞİN SÖZÜ BOZDUN.\nAynaya bak — o yüz, başarısızlığı normalleştiren bir yüz.\nYarın aynı bahaneyi söyleyeceksin. Ama bunu biliyorsun zaten.\nDİSİPLİNSİZ ADAM, KENDİNE YALAN SÖYLEYEN ADAMDIR.",
    "6 GÖREV. TEK BİR GÜN.\nBunu bile yapamıyorsan, büyük hayallerinden bahsetmeyi bırak.\nHer gece tamamlanmamış bir liste, sana ne olduğunu hatırlatıyor:\nHENÜZ HAZIR DEĞİLSİN. VE BU SENİN SEÇİMİN.",
    "RAHATA KAÇTIN. YİNE.\nBedenin konfor istiyor, ama konfor seni öldürüyor.\nBugün pes eden adam, yarın da pes edecek.\nKENDİNİ KANDIR AMA AYNAYI KANDIRAMAZSIN.",
];
