export interface GelisimLevel {
  title: string;
  description: string;
}

// Fallback config when Supabase phase title/subtitle is missing.
// Keyed by phase_number. DB data always takes priority.
export const GELISIM_CONFIG: Record<number, GelisimLevel> = {
  1: { title: "Frontend Temeli",          description: "HTML, CSS ve JavaScript temellerini pekiştir" },
  2: { title: "React / Next.js",           description: "Modern React patterns ve Next.js App Router" },
  3: { title: "UI/UX ve Tasarım Gözü",     description: "Figma, tasarım sistemleri, kullanıcı deneyimi" },
  4: { title: "AI Araçları ve Otomasyon",  description: "Claude, n8n, Cursor ile iş akışları kurma" },
  5: { title: "Portfolyo Projeleri",       description: "Gerçek kullanıcı problemi çözen projeler yap" },
  6: { title: "İçerik / Görünürlük",       description: "Öğrendiklerini paylaş, kitle oluştur" },
  7: { title: "Gerçek Ürün Geliştirme",    description: "Kendi ürününü sıfırdan piyasaya çıkar" },
};
