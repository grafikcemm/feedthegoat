export type Category = "digital" | "sales" | "product" | "physical" | "mindset";
export type Phase = 1 | 2 | 3 | 4 | 5 | 6;
export type Priority = "critical" | "important" | "normal";
export type Status = "active" | "planned" | "waiting" | "completed" | "removed";

export interface LearningCourse {
  name: string;
  platform: string;
  cost: "free" | "paid";
  level: "beginner" | "intermediate" | "advanced";
  url?: string;
}

export interface LearningPathStep {
  order: number;
  action: string;
  stopPoint: string;
}

export interface StepByStepPlan {
  stage: "start" | "apply" | "output";
  steps: string[];
}

export interface Goal {
  id: string;
  title: string;
  shortDescription: string;
  category: Category;
  phase: Phase;
  priority: Priority;
  status: Status;
  whyItMatters: string;
  supportsCareerTrack: string;
  outcome: string;
  stepByStepPlan: StepByStepPlan[];
  learningPath: LearningPathStep[];
  courses: LearningCourse[];
  tools: string[];
  prerequisites: string[]; // array of goal ids
  timeEstimate: string;
  dailyHours: string;
  firstAction: string;
  successMetric: string;
  avoidThis: string;
  nextUnlock: string[];
  tags: string[];
  removedReason?: string;
  replacedBy?: string;
}

export interface PhaseInfo {
  number: Phase;
  title: string;
  subtitle: string;
  timeframe: string;
  description: string;
  exitCriteria: string[];
  color: string;
}

export const PHASES: PhaseInfo[] = [
  {
    number: 1,
    title: "TEMEL OMURGA",
    subtitle: "Araçlarını öğren, temeli kur",
    timeframe: "0-30 gün",
    description: "Bu fazda hiçbir şey satmıyorsun. Araçları öğren, lisansını al, ilk workflow'unu kur. Altyapın olmadan ürün yok, ürün olmadan satış yok.",
    exitCriteria: [
      "n8n'de çalışan minimum 1 pipeline olmalı",
      "Claude API'ye Postman veya n8n'den istek atabilmeli",
      "Prompt Engineering temellerini okumuş olmalı",
      "İHA-1 eğitimine kayıt yapılmış olmalı",
      "Cursor IDE kurulu ve ilk test yapılmış olmalı"
    ],
    color: "border-blue-500"
  },
  {
    number: 2,
    title: "PROTOTİP VE KURULUM",
    subtitle: "Satacağın Şeyi Yap",
    timeframe: "31-60 gün",
    description: "Elinde somut, gösterebileceğin ürünler ve sistemler oluştur. Demo olmadan satış yok. Fiyatın olmadan teklif yok. Script'in olmadan görüşme yok.",
    exitCriteria: [
      "Çalışan Voice Agent demosu (video kaydıyla)",
      "3 kademeli fiyat paketi hazır",
      "Discovery Call scripti yazılmış ve 3 kez prova edilmiş",
      "Client Journey süreci tanımlı (Notion'da)",
      "En az 1 dijital ürün Gumroad'da yayında"
    ],
    color: "border-purple-500"
  },
  {
    number: 3,
    title: "İLK MÜŞTERİ VE VAKA ANALİZİ",
    subtitle: "Bul, Sun, Kanıtla",
    timeframe: "61-90 gün",
    description: "Demo ve fiyatın var artık. Şimdi gerçek dünyada test zamanı.",
    exitCriteria: [
      "Cold outreach sistemi çalışıyor (günlük 50+ mail)",
      "En az 10 Discovery Call yapılmış",
      "3 pilot müşteriye Voice Agent entegre edilmiş",
      "En az 1 ücretli retainer sözleşmesi imzalanmış",
      "En az 1 Case Study yayında"
    ],
    color: "border-green-500"
  },
  {
    number: 4,
    title: "ÖLÇEKLEME VE ÜRÜNLEŞTİRME",
    subtitle: "Motoru Hızlandır",
    timeframe: "3-6 ay",
    description: "Satış kanalları oturdu. Şimdi sistemi ölçekleme ve ajans yapısını büyütme zamanı.",
    exitCriteria: [
      "5 aktif retainer müşteri",
      "Aylık stabil inbound lead akışı",
      "Bozma Creative ajansı tüm varlıklarıyla aktif"
    ],
    color: "border-orange-500"
  },
  {
    number: 5,
    title: "SİSTEMLEŞME VE OTORİTE",
    subtitle: "Pazarı Domine Et",
    timeframe: "6-12 ay",
    description: "Müşteri akışı otomatize edildi. Artık thought leadership ve premium ürün zamanı.",
    exitCriteria: [
      "100K TL MRR barajını geçmek",
      "Aktif bir email veya Skool topluluğu",
      "Sektörde 'AI Automation Agency' olarak tanınmak"
    ],
    color: "border-amber-500"
  },
  {
    number: 6,
    title: "FİZİKSEL SİGORTA KATMANI",
    subtitle: "Fiziksel Yetenek + B Planı",
    timeframe: "Paralel İlerler",
    description: "Dijital sistemler patlasa dahi elde tutulacak donanım becerileri.",
    exitCriteria: [
      "50 saat drone uçuş tecrübesi",
      "3 kurumsal drone çekim projesi tamamlanması",
      "KNX akıllı ev sistemleri eğitimine giriş"
    ],
    color: "border-red-500"
  }
];

export const CAREER_GOALS: Goal[] = [
  // --- PHASE 1 ---
  {
    id: "prompt-systems",
    title: "LLM Orchestration & Prompt Systems",
    shortDescription: "Claude, Gemini, Perplexity ile stratejik seviye prompt yazabilme.",
    category: "digital",
    phase: 1,
    priority: "critical",
    status: "active",
    whyItMatters: "Prompt yazmak senin ana silahın. AaaS sistemlerinin beyni LLM'ler. Onlara ne kadar iyi talimat verirsen, müşteriye o kadar iyi sonuç sunarsın.",
    supportsCareerTrack: "B2B AaaS Builder. Kurduğun her Voice Agent, her outreach botu, her otomasyon Claude API üzerinde prompt ile çalışıyor.",
    outcome: "5 sektör için production-ready system prompt kütüphanesi hazır.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: [
          "Anthropic'in resmi prompt engineering dokümanını oku.",
          "Anthropic Github ücretsiz kurslarını tamamla.",
          "Temel kavramları (system prompt, prefill, temperature vb.) anla."
        ]
      },
      {
        stage: "apply",
        steps: [
          "5 sektör belirle: diş kliniği, emlak, güzellik, restoran, eğitim.",
          "Her sektör için birer system prompt yaz ve Postman/n8n ile Claude'da test et.",
          "Multi-step prompt zincirleri dene."
        ]
      },
      {
        stage: "output",
        steps: [
          "Hazır 5 sektör promptunu Notion'a kaydet.",
          "n8n için injection template'i oluştur."
        ]
      }
    ],
    learningPath: [
      { order: 1, action: "Anthropic Docs Oku", stopPoint: "Temeller anlaşılınca." },
      { order: 2, action: "Anthropic Courses", stopPoint: "Pratikler bitince." },
      { order: 3, action: "5 Sektör Uygulaması", stopPoint: "5 prompt elde edince dur." }
    ],
    courses: [
      { name: "Anthropic Prompt Courses", platform: "GitHub", cost: "free", level: "beginner", url: "github.com/anthropics/courses" },
      { name: "Advanced Prompting", platform: "YouTube", cost: "free", level: "intermediate" }
    ],
    tools: ["Claude API", "Postman", "Notion", "n8n"],
    prerequisites: [],
    timeEstimate: "6-8 hafta",
    dailyHours: "1.5-2 saat",
    firstAction: "Anthropic Docs > Prompt Engineering oku.",
    successMetric: "5 test edilmiş sektör system prompt'u",
    avoidThis: "Mükemmeliyetçilik düşmandır. Teoriye aylarca saplanma. Yeterince iyi prompt production'a girer.",
    nextUnlock: ["voice-agent", "n8n-foundations"],
    tags: ["prompt", "ai", "claude"]
  },
  {
    id: "n8n-foundations",
    title: "n8n Automation Foundations",
    shortDescription: "n8n ile satılabilir seviyede otomasyon pipeline'ları kurabilme",
    category: "digital",
    phase: 1,
    priority: "critical",
    status: "active",
    whyItMatters: "n8n senin AaaS işinin motoru. Müşteriye sattığın her sistem n8n üzerinde çalışacak.",
    supportsCareerTrack: "B2B AaaS Builder. Lead gen, CRM entegrasyonu, bildirim motoru.",
    outcome: "Baştan sona çalışan bir B2B lead generation pipeline.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: [
          "VPS (Hetzner vb.) üzerine Docker ile n8n self-hosted kur.",
          "Webhook, HTTP, Set, Code, Google Sheets nodelarını öğren."
        ]
      },
      {
        stage: "apply",
        steps: [
          "Apify + n8n entegrasyonu ile Google Maps'ten veri çek.",
          "Apollo.io + n8n ile B2B email eşleşmesi.",
          "Claude ile otomatik kişiselleştirilmiş 'pitch' metni üret."
        ]
      },
      {
        stage: "output",
        steps: [
          "Test pipeline'ı çalıştır.",
          "Workflow yedeklerini JSON olarak al ve Notion dokümanına koy."
        ]
      }
    ],
    learningPath: [
      { order: 1, action: "n8n Docs 'Getting Started'", stopPoint: "Sistem kurulunca." },
      { order: 2, action: "Cole Medin YouTube Tutorial", stopPoint: "İlk proxy webhook kurulunca." }
    ],
    courses: [
      { name: "n8n Resmi Docs", platform: "n8n.io", cost: "free", level: "beginner", url: "docs.n8n.io" }
    ],
    tools: ["n8n", "Docker", "Hetzner VPS", "Apify", "Apollo.io", "Telegram Bot"],
    prerequisites: [],
    timeEstimate: "8-12 hafta",
    dailyHours: "2-3 saat",
    firstAction: "Docker ile Hetzner'da n8n sunucunu ayağa kaldır.",
    successMetric: "1 Çalışan lead gen pipeline, uçtan uca çalışıyor.",
    avoidThis: "Evdeki lambaları açma otomasyonuna vakit harcama, sadece para kazandıran B2B senaryoları yap.",
    nextUnlock: ["cold-outreach", "voice-agent"],
    tags: ["automation", "n8n", "api"]
  },
  {
    id: "api-literacy",
    title: "API & Entegrasyon Okuryazarlığı",
    shortDescription: "REST API, JSON, webhook, auth kavramlarını anlama.",
    category: "digital",
    phase: 1,
    priority: "important",
    status: "active",
    whyItMatters: "Herhangi bir servisi AI'ya bağlamak için API dokümanı okuyabilmelisin.",
    supportsCareerTrack: "Sistem mimarisi için zorunlu altyapı.",
    outcome: "İstediğin dokümanına bakıp n8n'de 5 dakika içinde bağlamak.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: [
          "REST API temelleri videosunu izle (FreeCodeCamp).",
          "Postman indir."
        ]
      },
      {
        stage: "apply",
        steps: [
          "Postman ile GET ve POST testleri yap.",
          "Auth Headers ve Bearer token mantığını anla."
        ]
      },
      {
        stage: "output",
        steps: [
          "Postman'da 5 favori servisin test koleksiyonunu yarat."
        ]
      }
    ],
    learningPath: [
      { order: 1, action: "FreeCodeCamp APIs Basics", stopPoint: "İzleme bitince." },
      { order: 2, action: "Postman Uygulaması", stopPoint: "5 farklı API'ye bağlanılınca." }
    ],
    courses: [
      { name: "APIs for Beginners", platform: "YouTube", cost: "free", level: "beginner" }
    ],
    tools: ["Postman", "Curl"],
    prerequisites: [],
    timeEstimate: "4-6 hafta",
    dailyHours: "1 saat",
    firstAction: "Postman'da Claude API'ye ilk isteğini gönder.",
    successMetric: "n8n olmadan 5 API'ye saf HTTP request atabilmek.",
    avoidThis: "Sıfırdan backend yazmaya kalkma. Sen sadece API 'tüketicisisin'. Developer olma takıntısını bırak.",
    nextUnlock: [],
    tags: ["api", "postman"]
  },
  {
    id: "iha1-license",
    title: "SHGM İHA-1 Ticari Pilot Lisansı",
    shortDescription: "İHA-1 ticari lisans eğitimi ve sertifika süreci.",
    category: "physical",
    phase: 1,
    priority: "critical",
    status: "active",
    whyItMatters: "Fiziksel dünyadaki yeteneğin, AI'ın dokunamayacağı donanım becerisi. 'Moravec Paradoksu' sigortan.",
    supportsCareerTrack: "AaaS müşterilerine hibrit paketler (Dijital PR + Fiziksel Tanıtım).",
    outcome: "İHA-1 Ticari Pilot Lisansı.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: [
          "SHGM portalına kayıt ol.",
          "Onaylı İstanbul eğitim kurslarını araştır ve tarihe karar ver."
        ]
      },
      {
        stage: "apply",
        steps: [
          "4 günlük 32 saatlik eğitimi tamamla.",
          "Teorik ve pratik sınavları geç."
        ]
      },
      {
        stage: "output",
        steps: [
          "Lisansı eline al."
        ]
      }
    ],
    learningPath: [
      { order: 1, action: "SHGM Onaylı Kurs", stopPoint: "Lisans alınınca." }
    ],
    courses: [
      { name: "İHA-1 Ticari Sertifika Eğitimi", platform: "Çeşitli Okullar", cost: "paid", level: "intermediate", url: "iha.shgm.gov.tr" }
    ],
    tools: ["SHGM Portalı"],
    prerequisites: [],
    timeEstimate: "2-3 hafta",
    dailyHours: "Eğitim haftası tam gün",
    firstAction: "iha.shgm.gov.tr'den okullara bak.",
    successMetric: "SHGM sisteminde onaylı pilot olarak görünmek.",
    avoidThis: "Lisanssız kesinlikle ticari drone alma.",
    nextUnlock: ["drone-practice"],
    tags: ["drone", "lisans"]
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding + Cursor IDE",
    shortDescription: "Doğal dil ile web sitesi, dashboard veya küçük app'ler üretmek.",
    category: "digital",
    phase: 1,
    priority: "important",
    status: "active",
    whyItMatters: "Hızlıca demolar ve ürünleşmiş landing pageler üretmelisin.",
    supportsCareerTrack: "Demo yeteneği, form tasarımı, UX.",
    outcome: "2 Deploy edilmiş canlı proje.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: [
          "Cursor IDE indir ve Anthropic anahtarı bağla."
        ]
      },
      {
        stage: "apply",
        steps: [
          "İlk Voice Agent Demo landing sayfası promptunu yaz.",
          "Gelen kodu Vercel üzerinde anında yayına al."
        ]
      },
      {
        stage: "output",
        steps: [
          "Voice Agent sayfasını optimize et.",
          "Ajansın kendi formlarını (Tally.so / custom form) entegre et."
        ]
      }
    ],
    learningPath: [
      { order: 1, action: "Cursor kurulumu", stopPoint: "Tamamlanınca." },
      { order: 2, action: "Landing page V1 yayını", stopPoint: "Domain aktif olunca." }
    ],
    courses: [],
    tools: ["Cursor", "Vercel", "Bolt.new", "Lovable", "v0.dev"],
    prerequisites: [],
    timeEstimate: "6-8 hafta",
    dailyHours: "Haftada 5 saat",
    firstAction: "Cursor'u aç ve 'Bir B2B ajans landing sayfası yap' de.",
    successMetric: "Canlıda 2 farklı sayfa.",
    avoidThis: "Oturup saatlerce useState, useEffect, CSS Flexbox teorisine dalma.",
    nextUnlock: ["agentic-ux"],
    tags: ["cursor", "vibe-coding", "coding"]
  },

  // --- PHASE 2 ---
  {
    id: "voice-agent",
    title: "Voice Agent Prototype",
    shortDescription: "Diş kliniği senaryosuyla çalışan Voice Agent demosu.",
    category: "digital",
    phase: 2,
    priority: "critical",
    status: "planned",
    whyItMatters: "En yüksek değerli ve marjlı AaaS ürünün. İlk satılacak şey.",
    supportsCareerTrack: "Ana gelir motoru.",
    outcome: "3 dilde çalışan bir diş kliniği Voice Agent demosu.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: ["Vapi.ai veya Synthflow ile hesabını aç.", "Diş kliniği için temel senaryo yaz."]
      },
      {
        stage: "apply",
        steps: ["Telefonda test et.", "API maliyet tablosunu çıkar."]
      },
      {
        stage: "output",
        steps: ["OBS ile konuşurken ekran kaydını al ve demo video oluştur."]
      }
    ],
    learningPath: [
      { order: 1, action: "Vapi Quick Start", stopPoint: "1 Demo çalışınca." }
    ],
    courses: [
      { name: "Vapi Docs", platform: "Web", cost: "free", level: "beginner" }
    ],
    tools: ["Vapi.ai", "Loom", "OBS"],
    prerequisites: ["prompt-systems"],
    timeEstimate: "3-4 hafta",
    dailyHours: "2 saat",
    firstAction: "Vapi.ai da hesap aç.",
    successMetric: "Yayınlanmış kaliteli demo videosu.",
    avoidThis: "Tüm edge case'leri yakalamaya çalışma. Mükemmel aksan için ElevenLabs ile delirme.",
    nextUnlock: ["discovery-call"],
    tags: ["voice", "agent", "sales"]
  },
  {
    id: "offer-positioning",
    title: "Offer & Positioning",
    shortDescription: "3 kademeli fiyat paketi ve profesyonel teklif yapısı.",
    category: "sales",
    phase: 2,
    priority: "critical",
    status: "planned",
    whyItMatters: "Bir teklifin yoksa işin yoktur.",
    supportsCareerTrack: "AaaS ve Marka satışlarının omurgası.",
    outcome: "Canva PDF formatında hazır teklif paketi.",
    stepByStepPlan: [
      {
        stage: "start",
        steps: ["Rakip fiyatlarını Reddit ve sektör bloglarından araştır."]
      },
      {
        stage: "apply",
        steps: ["Starter, Growth ve Enterprise olarak 3 paket oluştur.", "TL bazlı kurulum ücreti (Setup) ve aylık MRR ücretini belirle."]
      },
      {
        stage: "output",
        steps: ["Canva'da teklif PDF'i şablonu oluştur.", "Örnek bir sözleşme metni çek."]
      }
    ],
    learningPath: [{ order: 1, action: "Pazar Karşılaştırması", stopPoint: "Fiyatlar belli olunca." }],
    courses: [{ name: "$100M Offers", platform: "Kitap/Hormozi", cost: "paid", level: "beginner" }],
    tools: ["Canva", "Notion"],
    prerequisites: ["voice-agent"],
    timeEstimate: "2 hafta",
    dailyHours: "Haftada 5 saat",
    firstAction: "3 paketin adını ve ne içereceğini alt alta yaz.",
    successMetric: "Herhangi bir müşteriye 15 dakikada customize edilip atılacak PDF.",
    avoidThis: "Fiyatta saatlerce takılı kalma, ilk 3 müşteri senin gerçekçi piyasa fiyatını kendi belirleyecek.",
    nextUnlock: ["cold-outreach"],
    tags: ["sales", "pricing", "business"]
  },
  {
    id: "discovery-call",
    title: "Discovery Call System",
    shortDescription: "Satış görüşmesi scripti, itiraz karşılama dosyası.",
    category: "sales",
    phase: 2,
    priority: "critical",
    status: "planned",
    whyItMatters: "Telefonda tıkanırsan tüm n8n bilgin çöpe gider.",
    supportsCareerTrack: "Satış yüzdelerini artırır.",
    outcome: "15dk script ve 10 itirazlık dosya.",
    stepByStepPlan: [
      { stage: "start", steps: ["Alex Hormozi'nin Discovery senaryolarını incele."] },
      { stage: "apply", steps: ["Kendi 5 aşamalı görüşme scriptini Türkçe yaz.", "En popüler 10 B2B itirazına karşı akılda kalıcı yanıtlar hazırla."] },
      { stage: "output", steps: ["Arkadaşlarla veya kendi kendine 3 prova yap.", "Calendly linkini aktif et."] }
    ],
    learningPath: [{ order: 1, action: "Script formatlama", stopPoint: "Tamamlanınca." }],
    courses: [],
    tools: ["Calendly", "Notion", "Zoom"],
    prerequisites: ["offer-positioning"],
    timeEstimate: "1-2 hafta",
    dailyHours: "1 saat",
    firstAction: "Calendly linkini aç.",
    successMetric: "Script metni ve itiraz dosyasının hazır olması.",
    avoidThis: "Okuduğun tüm satış taktiklerini kitaptan bulup harmanlamaya çalışma, sade kal.",
    nextUnlock: ["first-customers"],
    tags: ["sales", "communication"]
  },
  {
    id: "agentic-ux",
    title: "Agentic UX / AI Landing Page Systems",
    shortDescription: "Voice Agent sayfası, servis sayfası, müşteri formları.",
    category: "digital",
    phase: 2,
    priority: "important",
    status: "planned",
    whyItMatters: "Soğuk ulaşımda itibar önemlidir. Gidilen sitenin lüks ve güvenilir hissi vermesi gerekir.",
    supportsCareerTrack: "Lead-gen süreçlerine profesyonel vitrin.",
    outcome: "3 canlı Vercel sitesi ve Tally onboarding formu.",
    stepByStepPlan: [
      { stage: "start", steps: ["Vibe coding becerini kullan ve prompt yaz."] },
      { stage: "apply", steps: ["Bozma Creative ajans hizmetlerini listeleyen koyu tema landing'i oluştur.", "Formu entegre et."] },
      { stage: "output", steps: ["Yayına al ve domaine bağla."] }
    ],
    learningPath: [{ order: 1, action: "v0.dev ile prototipler", stopPoint: "Çıktı tatmin edene kadar." }],
    courses: [],
    tools: ["v0.dev", "Cursor", "Tally.so", "Vercel"],
    prerequisites: ["vibe-coding"],
    timeEstimate: "2-3 hafta",
    dailyHours: "5 saat / hafta",
    firstAction: "v0.dev promptunu hazırla.",
    successMetric: "Canlı ve domainli web siteleri.",
    avoidThis: "Pixel-perfect buton padding'leri ile takıntı yapma.",
    nextUnlock: ["agency-launch"],
    tags: ["design", "ux", "landing"]
  },
  {
    id: "client-journey",
    title: "Client Journey System",
    shortDescription: "Müşterinin onboarding'den teslimata kadar geçeceği Notiona sistemi.",
    category: "sales",
    phase: 2,
    priority: "important",
    status: "planned",
    whyItMatters: "Bu sistem 'Biz Ciddi Bir Ajansız' imajını pekiştirir.",
    supportsCareerTrack: "Referans satışlarının kilidi.",
    outcome: "Notion CRM + Tally Brief formu + 3 n8n onboarding maili.",
    stepByStepPlan: [
      { stage: "start", steps: ["Notion Müşteri Database'i yarat."] },
      { stage: "apply", steps: ["Brief formunu yap.", "N8n webhook ile Tally -> Notion tetiklemesini bağla."] },
      { stage: "output", steps: ["Tetiklenince müşteriye hoş geldin emaili atan akışı bağla."] }
    ],
    learningPath: [{ order: 1, action: "Notion template", stopPoint: "Bittiğinde." }],
    courses: [],
    tools: ["Notion", "Tally.so", "n8n", "Gmail"],
    prerequisites: ["n8n-foundations"],
    timeEstimate: "1-2 hafta",
    dailyHours: "2 saat",
    firstAction: "Notion database aç.",
    successMetric: "Otomatik email giden CRM sistemi.",
    avoidThis: "Karmaşık Salesforce yapıları kurmaya çalışma, 4 sütunlu Notion yeter.",
    nextUnlock: [],
    tags: ["crm", "automation"]
  },
  {
    id: "digital-products",
    title: "Template / Prompt / Dijital Ürün Katmanı",
    shortDescription: "Gumroad'da satışa hazır 2-3 dijital ürün (Prompt kit, workflow vs).",
    category: "product",
    phase: 2,
    priority: "important",
    status: "planned",
    whyItMatters: "Pasif gelir ve kitlenin varlığını paraya dönüşme ihtimalini test etme.",
    supportsCareerTrack: "Yan gelir kolu.",
    outcome: "Gumroad'da 3 ürün.",
    stepByStepPlan: [
      { stage: "start", steps: ["Gumroad hesabı aç."] },
      { stage: "apply", steps: ["Hazırladığın 5 sektörlük prompt kitini paketle ($29).", "Hazırladığın n8n şemasını JSON olarak paketle ($49)."] },
      { stage: "output", steps: ["Instagram Reels'leri ile trafik bas.", "İlk satışı kolla."] }
    ],
    learningPath: [{ order: 1, action: "Gumroad satışı", stopPoint: "Satış çıkana kadar bekle." }],
    courses: [],
    tools: ["Gumroad", "Instagram"],
    prerequisites: ["prompt-systems"],
    timeEstimate: "2 hafta",
    dailyHours: "1 saat",
    firstAction: "Gumroad mağazası tasarla.",
    successMetric: "3 canlı ürün + ilk satın alım bildirimi.",
    avoidThis: "Kimse almazsa diye düşünüp vazgeçme; zaten sıfırın altı maliyet.",
    nextUnlock: [],
    tags: ["product", "passive-income", "gumroad"]
  },

  // --- PHASE 3 ---
  {
    id: "cold-outreach",
    title: "Cold Outreach Engine",
    shortDescription: "Apollo + Instantly + n8n otonom e-posta makinesi.",
    category: "sales",
    phase: 3,
    priority: "critical",
    status: "planned",
    whyItMatters: "Günde 50 kişiye sen elle ulalaşamazsın, bu ölçeklenmeyi çözer.",
    supportsCareerTrack: "Doğrudan ajans müşteri hattı.",
    outcome: "Otonom günlük mail atan lead gen pipeline.",
    stepByStepPlan: [
      { stage: "start", steps: ["Instantly hesabı al ve yedek domainlerini ısındır (warm-up)."] },
      { stage: "apply", steps: ["Apollo.io'dan sadece hedef kitle (diş, klinik vs) çek.", "3 farklı açılış yazısı (A/B) metni hazırla."] },
      { stage: "output", steps: ["Günlük 50 emaili serbest bırak e-posta istatistiklerini izle."] }
    ],
    learningPath: [{ order: 1, action: "Instantly Docs", stopPoint: "Warm-up bitince." }],
    courses: [{ name: "Cold Email B2B", platform: "YouTube", cost: "free", level: "beginner" }],
    tools: ["Apollo.io", "Instantly.ai", "n8n"],
    prerequisites: ["offer-positioning", "n8n-foundations"],
    timeEstimate: "3 hafta",
    dailyHours: "Günlük takip",
    firstAction: "Gönderici domaine karar ver ve Instantly.ai hesap aç.",
    successMetric: "Günlük stabil %1-2 toplantı yanıt oranı.",
    avoidThis: "Deli gibi bir günde 1000 mail atıp domaini banlatma.",
    nextUnlock: ["first-customers"],
    tags: ["email", "sales", "outreach"]
  },
  {
    id: "first-customers",
    title: "İlk 10 Discovery Call + 3 Pilot Müşteri",
    shortDescription: "Gerçek B2B saha satış görüşmeleri.",
    category: "sales",
    phase: 3,
    priority: "critical",
    status: "planned",
    whyItMatters: "Olasılıkları ve kağıt üzerindeki planları gerçek MRR'a çevirdiği yer.",
    supportsCareerTrack: "Ajansın hayat bulması.",
    outcome: "3 pilot kabul, minimum 1 ücretli retainer kalış.",
    stepByStepPlan: [
      { stage: "start", steps: ["Mailden veya linkedin'den gelen leadlere takvim at."] },
      { stage: "apply", steps: ["Discovery call testlerini gerçekleştir.", "Bedava pilot (sadece API ücretini karşılama) şartı ile 3 yere entegre ol."] },
      { stage: "output", steps: ["14 gün sonunda faturalandırma pazarlığı yap.", "İlk parayı al."] }
    ],
    learningPath: [{ order: 1, action: "Discovery Pratik", stopPoint: "Call sayısı 10 olana kadar." }],
    courses: [],
    tools: ["Stripe/iyzico/Havale", "Zoom", "Calendly"],
    prerequisites: ["cold-outreach", "discovery-call"],
    timeEstimate: "4-6 hafta",
    dailyHours: "Görüşme sıklığına bağlı",
    firstAction: "İlk toplantıyı ayarla.",
    successMetric: "İlk ödemenin hesaba geçmesi.",
    avoidThis: "Her itirazda fiyatta indirime gitme.",
    nextUnlock: ["case-study"],
    tags: ["sales", "mrr", "closing"]
  },
  {
    id: "case-study",
    title: "Case Study Production System",
    shortDescription: "Her memnun müşteriden, Linkedin ve Instagram formatlı kanıt çıkarma.",
    category: "sales",
    phase: 3,
    priority: "important",
    status: "planned",
    whyItMatters: "Kanıt, marketingden çok daha ucuza satandır.",
    supportsCareerTrack: "Güven ve marka inşası.",
    outcome: "1 vaka analizi PDF'i ve Sosyal medya postu.",
    stepByStepPlan: [
      { stage: "start", steps: ["Pilot müşteriden Before/After kıyaslamasını yapacak metrikleri çek."] },
      { stage: "apply", steps: ["Problem -> Çözüm -> Sonuç dokümanını yaz."] },
      { stage: "output", steps: ["Müşteriden zoom üstünden veya raw video ile testimonial çek ve yayınla."] }
    ],
    learningPath: [{ order: 1, action: "Müşteri görüşmesi", stopPoint: "Kanıt alınınca." }],
    courses: [],
    tools: ["Canva", "LinkedIn"],
    prerequisites: ["first-customers"],
    timeEstimate: "3-5 gün",
    dailyHours: "1 saat",
    firstAction: "Template'i Canva'da oluştur.",
    successMetric: "1 Müşteri logosu + Referansının web sitesinde durması.",
    avoidThis: "Destan uzunluğunda hikaye yazmak. Kimse okumaz, metrikleri ver.",
    nextUnlock: [],
    tags: ["marketing", "proof", "sales"]
  },
  {
    id: "newsletter",
    title: "Newsletter + Lead Magnet",
    shortDescription: "Beehiiv newsletter + PDF lead magnet + mail sekansı.",
    category: "product",
    phase: 3,
    priority: "important",
    status: "planned",
    whyItMatters: "Organik 85K kitleni B2B hedefine yavaşça asimile etmek için huni lazım.",
    supportsCareerTrack: "Inbound müşteri rotası yaratır.",
    outcome: "Canlı ve optimize çalışan bir Beehiiv formu ve arkasında mail serisi.",
    stepByStepPlan: [
      { stage: "start", steps: ["Beehiiv hesabı aç.", "15 Sayfalık B2B AI başlama rehberi PDF'i yaz."] },
      { stage: "apply", steps: ["Instagram profiline link ekle.", "Hoşgeldin ve 3'lü email akışı kur."] },
      { stage: "output", steps: ["Haftalık B2B automation içerikleri atmaya başla."] }
    ],
    learningPath: [{ order: 1, action: "Beehiiv testleri", stopPoint: "Form ve linkler tam düzgün çalışınca." }],
    courses: [],
    tools: ["Beehiiv", "Canva", "Instagram"],
    prerequisites: ["offer-positioning"],
    timeEstimate: "2 hafta",
    dailyHours: "2 saat",
    firstAction: "Beehiiv aç.",
    successMetric: "İlk 500 abonenin maillere açık girmesi.",
    avoidThis: "Her gün mail atmak ve okuru sıkmak.",
    nextUnlock: ["newsletter-scale"],
    tags: ["content", "newsletter", "marketing"]
  },

  // --- PHASE 4 ---
  {
    id: "scale-aaas",
    title: "AaaS Müşteri Ölçekleme",
    shortDescription: "5-12 aktif retainer müşteri bandına çıkış & sistemleştirme.",
    category: "sales",
    phase: 4,
    priority: "important",
    status: "planned",
    whyItMatters: "Ajansın kârlılığa geçtiği asıl aşama. Operasyon yükünü otomatize etme.",
    supportsCareerTrack: "Ana gelir motoru MRR'ın tırmanışı.",
    outcome: "Gelirde sürdürülebilir büyüme + junior/freelancer kullanım.",
    stepByStepPlan: [
      { stage: "start", steps: ["Onboarding sürecini %90 otonom hale getir.", "Referral (tavsiye) indirim programını müşterilerine duyur."] },
      { stage: "apply", steps: ["Outreach hacmini 3 katına çıkar (3 email hesabı -> 10 email hesabı)."] },
      { stage: "output", steps: ["Müşteri sayısına bağlı olarak teknik destekler için junior n8n/prompt mühendisi testine başla."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Instantly.ai", "Notion", "Slack"],
    prerequisites: ["first-customers", "case-study"],
    timeEstimate: "3-4 ay",
    dailyHours: "Management ağırlıklı",
    firstAction: "Referral program şartlarını belirle.",
    successMetric: "Sürdürülebilir 5+ aktif müşteri ve %10'dan az churn rate.",
    avoidThis: "Operasyona fazlasıyla gömülüp satış yapmayı bırakmak.",
    nextUnlock: ["agency-launch", "mrr-target"],
    tags: ["sales", "agency", "scale"]
  },
  {
    id: "inbound-funnel",
    title: "Instagram 85K → B2B Inbound Funnel",
    shortDescription: "İçerik dilini değiştir, genel motiveden hizmet satıcısına geç.",
    category: "digital",
    phase: 4,
    priority: "important",
    status: "planned",
    whyItMatters: "Büyük kitleni 'beğenici' kitlesinden 'alıcı' veya en azından nitelikli takipçiye dönüştürmek.",
    supportsCareerTrack: "Cold-email bağımlılığını azaltır, organik büyüme.",
    outcome: "Haftalık 3 ajans-focused Reels ve otomatik DM otomasyonu (ManyChat).",
    stepByStepPlan: [
      { stage: "start", steps: ["Manychat ve Instagram entegrasyonu kur."] },
      { stage: "apply", steps: ["Reels üret: 'Dişçiyseniz şöyle voice agent yapılır.'", "'Ajans' kelimesini yorumla, ManyChat rehber PDF atıp huninin içine (newsletter) alsın."] },
      { stage: "output", steps: ["Instagram leadlerini Notion'da potansiyel müşteri sekmesine akıt."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Instagram", "ManyChat", "n8n"],
    prerequisites: ["newsletter", "agentic-ux"],
    timeEstimate: "1-2 ay",
    dailyHours: "1 saat",
    firstAction: "ManyChat kurulumu ve ilk kelime tetikleyicisini ayarla.",
    successMetric: "E-mail harici kanaldan alınan minimum 2 Discovery Call.",
    avoidThis: "Genç, lise kitlesine hitap eden içerik yapmaya devam etme.",
    nextUnlock: [],
    tags: ["marketing", "inbound", "social"]
  },
  {
    id: "agency-launch",
    title: "Bozma Creative Ajans Lansmanı",
    shortDescription: "Kurumsal ajans yapısının tüm mecraalarda netleştirilmesi.",
    category: "digital",
    phase: 4,
    priority: "normal",
    status: "planned",
    whyItMatters: "Piyasadaki imaj, solo-freelancer'dan ajans kimliğine geçiş.",
    supportsCareerTrack: "Güven algısı ve fiyat kırma isteklerine karşı duruş.",
    outcome: "LinkedIn sayfası, Google Maps/Business kaydı ve oturmuş brand.",
    stepByStepPlan: [
      { stage: "start", steps: ["LinkedIn 'Bozma Creative' sayfasını SEO uyumlu yap."] },
      { stage: "apply", steps: ["Case Study gönderilerini 'biz' diliyle yayınla.", "Google Business profilini onaylat."] },
      { stage: "output", steps: ["Ekstrem durumlarda fiziksel veya sanal şirket adresi yapılanmasına geç."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["LinkedIn", "Google Business"],
    prerequisites: ["scale-aaas", "agentic-ux"],
    timeEstimate: "2-3 hafta",
    dailyHours: "Küçük haftalık iş",
    firstAction: "LinkedIn Business page açılışı.",
    successMetric: "Kurumsal hesaplarda minimum 100 takipçi.",
    avoidThis: "Sahte ofis görüntüleri veya aşırı kurumsal yalanlarla şişme.",
    nextUnlock: [],
    tags: ["branding", "agency"]
  },
  {
    id: "drone-sales",
    title: "Drone Kurumsal Satış Başlangıcı",
    shortDescription: "AaaS ve Marka hizmetine Drone fiziksel çekim paketini çapraz olarak satmak.",
    category: "sales",
    phase: 4,
    priority: "important",
    status: "planned",
    whyItMatters: "İHA-1 yatırımı sonrası bunu doğrudan faturaya çevirmek ve rakipten tamamen ayrışmak.",
    supportsCareerTrack: "Hibrit paket gelir motoru.",
    outcome: "Drone kullanımlı ilk case study ve satış.",
    stepByStepPlan: [
      { stage: "start", steps: ["Mevcut AaaS / Web müşterilerine 'Tesis çekiminizi drone ile ekleyelim' maili at."] },
      { stage: "apply", steps: ["Ayrıca emlak portföyleri gibi görsel sektörlü hedeflere direk teklif sun."] },
      { stage: "output", steps: ["İşi teslim et ve ajans portfolyo klibini (showreel) güncelle."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["DJI", "Post-production", "CRM"],
    prerequisites: ["iha1-license"],
    timeEstimate: "2 ay",
    dailyHours: "Hafta sonları",
    firstAction: "Teklif paketlerine Drone Add-on fiyatı ekle.",
    successMetric: "Drone üzerinden gelen ilk spesifik fatura.",
    avoidThis: "Sürekli 'kendin için' drone uçurmaya dönme, ticariye dök.",
    nextUnlock: [],
    tags: ["drone", "sales", "hybrid"]
  },

  // --- PHASE 5 ---
  {
    id: "community",
    title: "Ücretli Topluluk Lansmanı (Skool/Discord)",
    shortDescription: "Aylık küçük aboneliklerle 'AI Destekli Kreatifler' ağı.",
    category: "product",
    phase: 5,
    priority: "important",
    status: "planned",
    whyItMatters: "Büyük çaplı eğitim yerine sürdürülebilir networking modeli ile düzenli gelir.",
    supportsCareerTrack: "Ağ inşası ve eğitim tarafının otomasyonu.",
    outcome: "Aylık 20-30$, min 100-200 üyeli komünite.",
    stepByStepPlan: [
      { stage: "start", steps: ["Skool hesabını açıp free-tier topluluk test yapısı kur.", "1 aylık content takvimi çıkart."] },
      { stage: "apply", steps: ["Instagram ve newsletter üzerinden waitlist oluştur.", "Launch andiyatında indirimli VIP pass sat."] },
      { stage: "output", steps: ["Haftalık 1 live-call, grup içi challenge ile topluluğu aktif tut."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Skool", "Discord", "Gumroad/Stripe"],
    prerequisites: ["newsletter", "inbound-funnel"],
    timeEstimate: "3-4 ay",
    dailyHours: "Günde 2 saat community management",
    firstAction: "Skool'un çalışma mantığını incele.",
    successMetric: "Stabil 100 üstü ücretli abone.",
    avoidThis: "Yetersiz vakitle erken community açıp insanları soğumuş boş gruplara dahil etmek.",
    nextUnlock: [],
    tags: ["product", "community", "mrr"]
  },
  {
    id: "newsletter-scale",
    title: "Newsletter Ekosistemi",
    shortDescription: "Email bülteninin 2500+ aboneye gelip B2B sponsorluk noktasına ulaşması.",
    category: "digital",
    phase: 5,
    priority: "normal",
    status: "planned",
    whyItMatters: "Medya assets'in kendi başına ayrı bir ürüne dönüşmesi.",
    supportsCareerTrack: "Marka otoritesi ve dolaylı gelir.",
    outcome: "Sponsor alan bülten.",
    stepByStepPlan: [
      { stage: "start", steps: ["Bültendeki opt-in ve referral mantığını aktif et."] },
      { stage: "apply", steps: ["İçerik pazarlaması ile spesifik abone acquisition çalış."] },
      { stage: "output", steps: ["İlk B2B yazılım markasıyla sponsorluk deal'i bağla."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Beehiiv", "Twitter/LinkedIn"],
    prerequisites: ["newsletter"],
    timeEstimate: "6+ Ay",
    dailyHours: "Haftada 4 saat bülten edit",
    firstAction: "Beehiiv referral modülünü aktif et.",
    successMetric: "Sponsorlardan düzenli bülten geliri.",
    avoidThis: "Salt kopyala-yapıştır yapay zeka haberi atmak (kişilik katmalısın).",
    nextUnlock: [],
    tags: ["marketing", "newsletter", "media"]
  },
  {
    id: "mrr-target",
    title: "MRR 100K TL Hedefi",
    shortDescription: "Tüm sistemlerin toplam tekrar eden gelirinin eşiği aşması.",
    category: "sales",
    phase: 5,
    priority: "critical",
    status: "planned",
    whyItMatters: "Bu aşama sana delegasyon (iş devretme) finansmanını sağlar.",
    supportsCareerTrack: "Ajansın kendi kendini besleyecek kritik kütlesi.",
    outcome: "Yüksek operasyon serbestliği.",
    stepByStepPlan: [
      { stage: "start", steps: ["Tüm fiyatlandırmaları optimize et ve karsız işten churn et/etmeye başla."] },
      { stage: "apply", steps: ["High-ticket satış sistemine (Aylık 15K+ paketler) daha fazla asıl."] },
      { stage: "output", steps: ["Vergi, gider vs sızıntıları kontrol altında tut."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Excel/Sheets", "Muhasebe DB"],
    prerequisites: ["scale-aaas"],
    timeEstimate: "8-12 ay",
    dailyHours: "0",
    firstAction: "Mevcut gelir-gider tablosunun MRR analizini net çıkar.",
    successMetric: "3 ay ardışık 100K TL+ hacim.",
    avoidThis: "MRR kovalamak uğruna aşırı indirim ve 'evet'çiliğe düşmek.",
    nextUnlock: [],
    tags: ["sales", "milestone", "mrr"]
  },
  {
    id: "micro-saas",
    title: "Vibe Coding ile Mikro-SaaS",
    shortDescription: "Mevcut müşterilere veya hedef kitleye özel, üyelik sistemiyle satan otomasyon aracı/dashboard.",
    category: "product",
    phase: 5,
    priority: "normal",
    status: "planned",
    whyItMatters: "AJANS (hizmet saati) bataklığından tam ürünlü servise atlama tahtası.",
    supportsCareerTrack: "AaaS modelinin SaaS modeline evrimi.",
    outcome: "Kendi yarattığın yazılımsal minyatür ürün.",
    stepByStepPlan: [
      { stage: "start", steps: ["Mevcut müşterilerin sık yaptığı veya ajansının en çok yorulan ortak derdini teşhis et."] },
      { stage: "apply", steps: ["Cursor + Stripe API bağlayarak bir app arayüzü çiz."] },
      { stage: "output", steps: ["Bunu sadece belli bir üyelikle login olunan küçük panele çevirip sat."] }
    ],
    learningPath: [],
    courses: [],
    tools: ["Cursor", "Supabase", "Stripe", "Next.JS"],
    prerequisites: ["vibe-coding", "agentic-ux"],
    timeEstimate: "TBD",
    dailyHours: "Vibe code hours",
    firstAction: "Sektör ağrı noktası (pain-point) tespiti.",
    successMetric: "İlk 10 ücretli SaaS üyesi.",
    avoidThis: "Fikrine aşık olmak; ürün pazar uyumu olmadan önce aylarca kodlatmak.",
    nextUnlock: [],
    tags: ["product", "coding", "saas"]
  },

  // --- PHASE 6 ---
  {
    id: "drone-practice",
    title: "Drone Flight Practice & Portfolio",
    shortDescription: "Uçuş yeteneklerinin bileylemesi ve profesyonel post-production işleyişi.",
    category: "physical",
    phase: 6,
    priority: "critical",
    status: "planned",
    whyItMatters: "Kağıt üstündeki İHA-1, 50 saat pratiği yoksa sadece risktir.",
    supportsCareerTrack: "Drone sinematografisi + güvenli kurumsal çekim yeteneği.",
    outcome: "3 portfolyo dosyası ve 50+ güvenli loglanmış uçuş saati.",
    stepByStepPlan: [
      { stage: "start", steps: ["DJI Air 3 (veya Mini 4 Pro) ekipman yatırımını yap.", "Güvenli dış alan test uçuşları yap."] },
      { stage: "apply", steps: ["Kompozisyon, ışık saatleri (golden hour) ve manuel ayarları (ND filtre) öğren."] },
      { stage: "output", steps: ["DaVinci Resolve ile Color Grading temel düzeyini öğren."] }
    ],
    learningPath: [{ order: 1, action: "Pratik Uçuşlar", stopPoint: "Bittiğinde." }],
    courses: [{ name: "DJI Tutorials", platform: "YouTube", cost: "free", level: "beginner" }],
    tools: ["Drone", "DaVinci Resolve", "Filters"],
    prerequisites: ["iha1-license"],
    timeEstimate: "Yıl geneli",
    dailyHours: "Hafta sonu",
    firstAction: "İlk güvenli arazini bul (harita).",
    successMetric: "Kazasız 50 saat logo devri.",
    avoidThis: "Pahalı kameraya/lense geçiş iştahı; hikaye post'ta yaratılır.",
    nextUnlock: [],
    tags: ["drone", "hardware", "video"]
  },
  {
    id: "knx",
    title: "KNX Smart Home Sertifikası",
    shortDescription: "Akıllı binalar için fiziksel ve elektrik temelli kalibrasyon kurulum becerisi.",
    category: "physical",
    phase: 6,
    priority: "normal",
    status: "waiting", // parked
    whyItMatters: "Bu senin en güçlü 'B-Plan' yedek fiziki sigortan. Elektrik+Otomasyon.",
    supportsCareerTrack: "Güvence hissi ve olası pivot ihtimali.",
    outcome: "KNX kurulum belgesi ve altyapı öğrenimi.",
    stepByStepPlan: [
      { stage: "start", steps: ["Mevcut ajans oturduktan sonra Bosmer'de 5 günlük eğitime karar ver."] },
      { stage: "apply", steps: ["Eğitime bizzat giderek temel hat mantığını, kablolama protokolünü kavra."] },
      { stage: "output", steps: ["Kendini acil durum donanımlı tesisatçısı/yazılımcısı gibi hazırla."] }
    ],
    learningPath: [],
    courses: [{ name: "KNX Basic Course Bosch/Bosmer", platform: "Fiziksel", cost: "paid", level: "beginner" }],
    tools: ["KNX ETS"],
    prerequisites: ["mrr-target"], // En azından maddi rahatlık veya ileriki aşama beklemeli
    timeEstimate: "5 gün",
    dailyHours: "Tam gün kamp",
    firstAction: "Parked (Şimdilik eylem yok).",
    successMetric: "Sertifika alımı.",
    avoidThis: "Dijital makine dönerken erken zamanda gidip konsantrasyonu dağıtmak.",
    nextUnlock: [],
    tags: ["hardware", "smart-home", "insurance"]
  },

  // --- ARCHIVED / REMOVED ---
  {
    id: "archived-ae",
    title: "After Effects / Motion Design Derinleşme",
    shortDescription: "Gereksiz aşırı uzmanlaşma - Elendi.",
    category: "digital",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "AI video üreticileri (Runway, Sora, Kling) bu alanı hızla ele geçiriyor. Ustalaşmaya çalışmak batan gemiyi boyamak.",
    replacedBy: "Vibe Coding + Cursor IDE (daha yüksek kaldıraçlı)"
  },
  {
    id: "archived-js",
    title: "JavaScript / Python Syntax Ezberleme",
    shortDescription: "Developer olma hayali - Elendi.",
    category: "digital",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "Cursor IDE ve Bolt.new çağında syntax ezberleme vakit israfı. Senin görevin mimariyi kurmak, API bağlamak. Developer olmak değil.",
    replacedBy: "API & Entegrasyon Okuryazarlığı (Faz 1)"
  },
  {
    id: "archived-certs",
    title: "Google UX / GA4 / HubSpot Sertifikaları",
    shortDescription: "Diplomasız alanda diploma satmak - Elendi.",
    category: "digital",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "Müşteriler sertifika değil sonuç istiyor. 'Bu sistem bana ayda kaç saat kazandıracak?' sorusu sertifikadan önemli.",
    replacedBy: "Agentic UX / AI Landing Page projeleri (kendin yapmak)"
  },
  {
    id: "archived-print",
    title: "Baskı Teknikleri / InDesign Derinleşme",
    shortDescription: "Ölü sektör - Elendi.",
    category: "digital",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "Sektör dijitale kaydı. Matbaa ve masaüstü yayıncılık geçmişte kaldı.",
    replacedBy: "Yok. Bu alan kapandı."
  },
  {
    id: "archived-news",
    title: "Günlük X/Twitter AI Haberi Tüketimi",
    shortDescription: "Doomscrolling / Parlayan Nesne Sendromu - Elendi.",
    category: "mindset",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "Tüketim paniğe sürüklüyor. Stratejik değer yok. Pazar sabahı 1 saat kaliteli newsletter okumak yeterli.",
    replacedBy: "Sabah Bloğu Disiplini"
  },
  {
    id: "archived-low-clients",
    title: "Sadece Sosyal Medya Tasarımı Satan Müşteriler",
    shortDescription: "Metalaşmış ürün satışı - Elendi.",
    category: "sales",
    phase: 1,
    priority: "normal",
    status: "removed",
    whyItMatters: "-",
    supportsCareerTrack: "-",
    outcome: "-",
    stepByStepPlan: [],
    learningPath: [],
    courses: [],
    tools: [],
    prerequisites: [],
    timeEstimate: "-",
    dailyHours: "-",
    firstAction: "-",
    successMetric: "-",
    avoidThis: "-",
    nextUnlock: [],
    tags: [],
    removedReason: "Banner/post tasarımı commodity (metalaştı). Düşük bütçeli ve zaman emici. Sadece tasarım işi kabul edilmeyecek.",
    replacedBy: "B2B AaaS sistemi + Hibrit Paketler"
  }
];
