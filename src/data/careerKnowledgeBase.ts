export type KnowledgeStatus =
  | "not_started"
  | "in_progress"
  | "known"
  | "needs_practice"
  | "skip_relearning"
  | "completed"
  | "archived";

export type SkillDepth = "awareness" | "practical" | "deep";
export type SkillPriority = "now" | "next" | "later" | "archive";
export type OutputType =
  | "project"
  | "case_study"
  | "workflow"
  | "note"
  | "portfolio_piece"
  | "automation";

export interface CareerKnowledgeItem {
  id: string;
  originalTitle: string;
  turkishTitle: string;
  shortDescription: string;
  whyLearn: string;
  relevanceToCem: string;
  howToLearn: string[];
  resources: {
    udemySearchTerms?: string[];
    youtubeSearchTerms?: string[];
    docs?: string[];
    projectIdeas?: string[];
  };
  completionProof: string[];
  prerequisites: string[];
  avoidIfAlreadyKnown?: string[];
  depth: SkillDepth;
  priority: SkillPriority;
  estimatedTime?: string;
  outputType: OutputType;
  archivedFromMainList?: boolean;
}

export const CAREER_KNOWLEDGE_BASE: CareerKnowledgeItem[] = [
  {
    id: "domain-ai-workflow",
    originalTitle: "Domain-Specific AI Workflow Architecture & Creative Operations (CreOps) Disiplini",
    turkishTitle: "Sektöre Özel AI İş Akışı Mimarisi",
    shortDescription: "Belirli bir iş alanı için AI destekli operasyon, içerik ve otomasyon akışları tasarlama becerisi.",
    whyLearn:
      "Genel AI bilgisi yerine işe özel AI workflow kurabilmek Cem'i farklılaştırır. Feed The Goat, DUNYA FOOD, içerik üretimi ve otomasyon sistemleri için doğrudan kullanılabilir.",
    relevanceToCem:
      "Cem'in kurduğu sistemlerin (ajans, içerik, kişisel ürünler) arka planını AI ile güçlendirmesini sağlar.",
    howToLearn: [
      "1 gerçek problemi seç (örn. içerik üretim süreci).",
      "Manuel adımları kağıda dök.",
      "AI ile hangi adımların otomatikleşeceğini belirle.",
      "n8n veya API ile mini workflow kur.",
      "Feed The Goat veya DUNYA FOOD üzerinde test et.",
    ],
    resources: {
      udemySearchTerms: ["AI workflow automation n8n", "AI operations workflow", "business process automation AI"],
      youtubeSearchTerms: ["n8n AI agent tutorial", "AI workflow automation", "creative operations AI"],
      docs: ["n8n.io/docs", "platform.openai.com/docs"],
      projectIdeas: ["Feed The Goat içerik akışı için AI görev ayrıştırma sistemi kur."],
    },
    completionProof: [
      "En az 1 gerçek workflow yazılı olarak tasarlandı.",
      "Çalışan mini otomasyon kuruldu.",
    ],
    prerequisites: ["Temel API kullanımı", "n8n veya benzeri otomasyon aracı"],
    depth: "practical",
    priority: "now",
    estimatedTime: "2-3 hafta",
    outputType: "workflow",
  },
  {
    id: "ai-native-product-dev",
    originalTitle: "AI-Native Product Development & Vibe Coding",
    turkishTitle: "AI Destekli Ürün Geliştirme",
    shortDescription: "Cursor, Claude Code ve LLM asistanları kullanarak hızlı prototip ve gerçek ürün çıkarma becerisi.",
    whyLearn:
      "Cem zaten Claude Code ve Cursor kullanıyor. Bu alanda sistematik bir çerçeve geliştirmek, her proje başlangıcını hızlandırır.",
    relevanceToCem:
      "Feed The Goat bu becerinin canlı örneği. Öğrenilen her şey direkt projede uygulanabilir.",
    howToLearn: [
      "Cursor ve Claude Code prompt tekniklerini çalış.",
      "Bir mini özellik için AI yardımıyla end-to-end akış yaz.",
      "Sıfırdan bir küçük araç veya dashboard bileşeni üret.",
    ],
    resources: {
      youtubeSearchTerms: ["Cursor AI full stack tutorial", "Claude Code project tutorial", "vibe coding tutorial"],
      docs: ["cursor.sh/docs", "docs.anthropic.com"],
      projectIdeas: ["Feed The Goat'ta yeni bir sekme veya widget sıfırdan ekle."],
    },
    completionProof: [
      "AI asistanıyla en az 1 çalışan özellik sıfırdan eklendi.",
    ],
    prerequisites: ["Temel React/Next.js", "Claude Code kurulumu"],
    depth: "practical",
    priority: "now",
    estimatedTime: "1-2 hafta",
    outputType: "project",
  },
  {
    id: "nextjs-app-router",
    originalTitle: "Next.js 14 App Router & React Server Components",
    turkishTitle: "Next.js App Router",
    shortDescription: "Next.js 14 App Router, Server Components, Server Actions ve modern React pattern'ları.",
    whyLearn:
      "Feed The Goat zaten Next.js 14 App Router kullanıyor. Bu sistemi derinlemesine anlamak, bug çözme süresini yarıya indirir.",
    relevanceToCem:
      "Her gün kullanılan teknoloji. Teorik öğrenmek yerine doğrudan Feed The Goat üzerinde pratik yap.",
    howToLearn: [
      "Server Component ve Client Component farkını öğren.",
      "Server Actions ile form submit nasıl çalışır, bak.",
      "Feed The Goat'taki bir server action'ı izleyerek anla.",
    ],
    resources: {
      docs: ["nextjs.org/docs/app"],
      youtubeSearchTerms: ["Next.js 14 App Router tutorial", "React Server Components tutorial"],
      projectIdeas: ["Feed The Goat'ta yeni bir Supabase tablosu ile server action yaz."],
    },
    completionProof: [
      "Server action ile çalışan form eklendi.",
      "Server component ile data fetch yapıldı.",
    ],
    prerequisites: ["Temel React", "JavaScript async/await"],
    avoidIfAlreadyKnown: ["useEffect data fetch", "API routes"],
    depth: "deep",
    priority: "now",
    estimatedTime: "1-2 hafta",
    outputType: "project",
  },
  {
    id: "typescript-intermediate",
    originalTitle: "TypeScript & Type-Safe Development",
    turkishTitle: "TypeScript Orta Seviye",
    shortDescription: "Generic tipler, utility types, type narrowing ve type-safe API çağrıları.",
    whyLearn:
      "Feed The Goat TypeScript ile yazılı. Type errorları çözmek ve güvenli kod yazmak için intermediate TS bilgisi şart.",
    relevanceToCem:
      "Günlük kodlama kalitesini artırır. Özellikle Supabase tipleriyle çalışırken kritik.",
    howToLearn: [
      "TypeScript utility types'ı öğren (Partial, Pick, Omit, Record).",
      "Generic function nasıl yazılır, bir örnek yaz.",
      "Feed The Goat'taki mevcut tip hatalarını düzelt.",
    ],
    resources: {
      docs: ["typescriptlang.org/docs"],
      youtubeSearchTerms: ["TypeScript intermediate tutorial", "TypeScript generics tutorial"],
      projectIdeas: ["Feed The Goat'ta bir data tipi için generic helper yaz."],
    },
    completionProof: [
      "Generic bir utility function yazıldı ve kullanıldı.",
    ],
    prerequisites: ["Temel TypeScript", "JavaScript"],
    avoidIfAlreadyKnown: ["interface/type farkı", "basic generics"],
    depth: "practical",
    priority: "next",
    estimatedTime: "1 hafta",
    outputType: "note",
  },
  {
    id: "tailwind-advanced",
    originalTitle: "Advanced Tailwind CSS & Design Systems",
    turkishTitle: "Tailwind ve Tasarım Sistemi",
    shortDescription: "Tailwind CSS ile tutarlı tasarım sistemi kurma, custom config ve component patterns.",
    whyLearn:
      "Feed The Goat'ın tüm UI'ı Tailwind ile yazılı. Mevcut design system'i anlamak ve geliştirmek için.",
    relevanceToCem:
      "Sade, tutarlı arayüzler Cem'in en çok önem verdiği şey. Bu beceri direkt sonuç üretir.",
    howToLearn: [
      "tailwind.config.js'te custom renkler ve fontlar nasıl eklenir, dene.",
      "Tekrar eden class gruplarını component ile soyutla.",
    ],
    resources: {
      docs: ["tailwindcss.com/docs"],
      youtubeSearchTerms: ["Tailwind CSS advanced patterns", "Tailwind design system"],
    },
    completionProof: [
      "Tailwind config'e özel token eklendi.",
      "Tekrar eden bir class bloğu component'e taşındı.",
    ],
    prerequisites: ["Temel Tailwind CSS", "HTML/CSS"],
    avoidIfAlreadyKnown: ["flex/grid layout", "responsive classes"],
    depth: "practical",
    priority: "next",
    estimatedTime: "3-5 gün",
    outputType: "portfolio_piece",
  },
  {
    id: "supabase-advanced",
    originalTitle: "Supabase & PostgreSQL Advanced Patterns",
    turkishTitle: "Supabase İleri Seviye",
    shortDescription: "RLS, row-level security, joins, edge functions ve real-time subscriptions.",
    whyLearn:
      "Feed The Goat'ın tüm verisi Supabase'de. Daha karmaşık sorgular ve güvenli yapılar için gerekli.",
    relevanceToCem:
      "Yeni tablo veya özellik eklerken hata yapmamak için.",
    howToLearn: [
      "Supabase dashboard'da bir tablo için RLS policy yaz.",
      "İki tabloyu join eden bir query yaz.",
    ],
    resources: {
      docs: ["supabase.com/docs"],
      youtubeSearchTerms: ["Supabase RLS tutorial", "Supabase advanced queries Next.js"],
      projectIdeas: ["Feed The Goat'ta career_phases ve career_skills join query'sini optimize et."],
    },
    completionProof: [
      "RLS policy yazıldı ve test edildi.",
      "Multi-table join query çalıştırıldı.",
    ],
    prerequisites: ["Temel SQL", "Supabase client kullanımı"],
    depth: "practical",
    priority: "next",
    estimatedTime: "3-5 gün",
    outputType: "project",
  },
  {
    id: "openrouter-llm-api",
    originalTitle: "OpenRouter & LLM API Integration",
    turkishTitle: "OpenRouter ile AI API Entegrasyonu",
    shortDescription: "OpenRouter üzerinden farklı LLM'leri API ile çağırma, prompt engineering ve maliyet optimizasyonu.",
    whyLearn:
      "Feed The Goat'ın AI asistan sistemi OpenRouter kullanıyor. Bu sistemi geliştirmek ve yeni AI endpointleri eklemek için şart.",
    relevanceToCem:
      "Asistan ekranı, görev ayrıştırma ve finans analizi direkt bu altyapı üzerinde çalışıyor.",
    howToLearn: [
      "openrouter.ai API dokümantasyonunu oku.",
      "Farklı modellerin fiyat/performans farkını anla.",
      "Yeni bir prompt + endpoint yaz (örn. kariyer analizi).",
    ],
    resources: {
      docs: ["openrouter.ai/docs"],
      youtubeSearchTerms: ["OpenRouter API tutorial", "LLM API integration Next.js"],
      projectIdeas: ["Feed The Goat'ta kariyer analizi endpointi ekle."],
    },
    completionProof: [
      "Çalışan bir AI endpoint yazıldı.",
      "Prompt doğru JSON döndürüyor.",
    ],
    prerequisites: ["Next.js API routes", "fetch/async"],
    avoidIfAlreadyKnown: ["fetch ile API çağrısı", "JSON parse"],
    depth: "practical",
    priority: "now",
    estimatedTime: "3-5 gün",
    outputType: "automation",
  },
  {
    id: "n8n-automation",
    originalTitle: "n8n Workflow Automation",
    turkishTitle: "n8n ile Otomasyon",
    shortDescription: "n8n'de görsel workflow oluşturma, webhook kurma ve harici API entegrasyonu.",
    whyLearn:
      "Cem'in ajans ve içerik üretim süreçlerini otomatikleştirmek için güçlü bir araç.",
    relevanceToCem:
      "DUNYA FOOD veya kişisel içerik süreçleri için tekrarlayan işleri ortadan kaldırır.",
    howToLearn: [
      "n8n'i local veya cloud'da kur.",
      "Basit bir webhook → işlem → bildirim akışı yap.",
      "Harici bir API (örn. Supabase veya Gmail) ile entegre et.",
    ],
    resources: {
      docs: ["docs.n8n.io"],
      youtubeSearchTerms: ["n8n tutorial beginners", "n8n AI automation workflow"],
      projectIdeas: ["Feed The Goat daily summary e-posta ile gönder."],
    },
    completionProof: [
      "Çalışan bir n8n workflow kuruldu.",
      "En az bir harici API entegrasyonu yapıldı.",
    ],
    prerequisites: ["Temel API kavramları", "JSON"],
    depth: "practical",
    priority: "next",
    estimatedTime: "1-2 hafta",
    outputType: "automation",
  },
  {
    id: "ui-ux-design-eye",
    originalTitle: "UI/UX Design Fundamentals & Figma",
    turkishTitle: "UI/UX ve Tasarım Gözü",
    shortDescription: "Figma ile wireframe ve tasarım oluşturma, kullanıcı deneyimi prensipleri.",
    whyLearn:
      "Cem'in ürettiği arayüzlerin daha profesyonel görünmesi için temel tasarım kararları önemli.",
    relevanceToCem:
      "Feed The Goat UI'ı tasarlarken kararlar alma sürecini hızlandırır.",
    howToLearn: [
      "Figma'da bir basit arayüz çiz.",
      "Spacing, color ve typography temellerini öğren.",
      "Mevcut bir UI'ı kopyalama alıştırması yap.",
    ],
    resources: {
      youtubeSearchTerms: ["Figma tutorial beginners", "UI design fundamentals"],
      projectIdeas: ["Feed The Goat'un bir ekranını Figma'da çiz."],
    },
    completionProof: [
      "Bir ekran wireframe'i Figma'da tamamlandı.",
    ],
    prerequisites: ["Temel HTML/CSS"],
    depth: "awareness",
    priority: "next",
    estimatedTime: "1 hafta",
    outputType: "portfolio_piece",
  },
  {
    id: "content-production-system",
    originalTitle: "Content Production Workflow & Creative Operations",
    turkishTitle: "İçerik Üretim Sistemi",
    shortDescription: "İçerik, video, reels ve sosyal medya üretim süreçlerini sistemleştirme.",
    whyLearn:
      "Cem zaten X, Instagram reels ve içerik üretiyor. Süreçsiz içerik enerjisi eritir.",
    relevanceToCem:
      "Haftalık içerik üretimini sistematik hale getirmek zaman ve enerji tasarrufu sağlar.",
    howToLearn: [
      "Bir içerik üretim süreci adımlarını yaz.",
      "Tekrarlayan adımlar için checklist oluştur.",
      "Bir içerik takvimi şablonu yap.",
    ],
    resources: {
      youtubeSearchTerms: ["content creation workflow", "social media content system"],
      projectIdeas: ["Haftalık X ve reels için içerik takvimi oluştur."],
    },
    completionProof: [
      "Bir içerik üretim süreci dökümanlandı.",
      "1 haftalık içerik takvimi oluşturuldu.",
    ],
    prerequisites: [],
    depth: "practical",
    priority: "later",
    estimatedTime: "2-3 gün",
    outputType: "workflow",
  },
  {
    id: "agencyos",
    originalTitle: "AgencyOS'u Tamamla ve Aktif Et",
    turkishTitle: "AgencyOS Kurulumu",
    shortDescription: "Ajans yönetim sistemi kurulumu ve aktivasyonu.",
    whyLearn: "Ajans operasyonlarını merkezi bir sistemde yönetmek için.",
    relevanceToCem: "Ajans işlerini organize eder.",
    howToLearn: [],
    resources: {},
    completionProof: [],
    prerequisites: [],
    depth: "practical",
    priority: "archive",
    outputType: "project",
    archivedFromMainList: true,
  },
  {
    id: "grafikcem-branding",
    originalTitle: "Grafikcem Detaylı Branding Planlaması",
    turkishTitle: "Grafikcem Marka Planlaması",
    shortDescription: "Grafikcem için detaylı branding ve kimlik planlaması.",
    whyLearn: "Kişisel marka kimliğini netleştirmek için.",
    relevanceToCem: "Kişisel marka çalışması.",
    howToLearn: [],
    resources: {},
    completionProof: [],
    prerequisites: [],
    depth: "awareness",
    priority: "archive",
    outputType: "case_study",
    archivedFromMainList: true,
  },
];

export function getKnowledgeItem(titleOrId: string): CareerKnowledgeItem | undefined {
  const lower = titleOrId.toLowerCase();
  return CAREER_KNOWLEDGE_BASE.find(
    item =>
      item.id === titleOrId ||
      item.originalTitle.toLowerCase().includes(lower) ||
      item.turkishTitle.toLowerCase().includes(lower)
  );
}

export function getActiveKnowledgeItems(): CareerKnowledgeItem[] {
  return CAREER_KNOWLEDGE_BASE.filter(item => !item.archivedFromMainList);
}
