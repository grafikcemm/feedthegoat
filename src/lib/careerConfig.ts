export interface CareerTask {
  key: string;             // unique identifier, e.g. "phase1_task_1"
  title: string;
  category: 'DİJİTAL' | 'SALES' | 'PRODUCT' | 'PHYSICAL';
  priority: 'CRİTİCAL' | 'İMPORTANT' | 'NORMAL';
  description?: string;
}

export interface CareerPhase {
  number: number;
  key: string;             // e.g. "phase1"
  title: string;           // e.g. "TEMEL OMURGA"
  slogan: string;          // e.g. "Araçlarını Öğren, Temeli Kur"
  duration: string;        // e.g. "0-30 GÜN"
  amac: string;
  cikisKriterleri: string[];
  tasks: CareerTask[];
}

export const CAREER_PHASES: CareerPhase[] = [
  {
    number: 1,
    key: 'phase1',
    title: 'TEMEL OMURGA',
    slogan: 'Araçlarını Öğren, Temeli Kur',
    duration: '0-30 GÜN',
    amac: 'Bu fazda hiçbir şey satmıyorsun. Araçları öğren, lisansını al, ilk workflow\'unu kur. Altyapın olmadan ürün yok, ürün olmadan satış yok.',
    cikisKriterleri: [
      'n8n\'de çalışan minimum 1 pipeline olmalı',
      'Claude API\'ye Postman veya n8n\'den istek atabilmeli',
      'Prompt Engineering temellerini okumuş olmalı',
      'İHA-1 eğitimine kayıt yapılmış olmalı',
      'Cursor IDE kurulu ve ilk test yapılmış olmalı',
    ],
    tasks: [
      { key: 'phase1_task_1', title: 'LLM Orchestration & Prompt Systems', category: 'DİJİTAL', priority: 'CRİTİCAL', description: 'Claude, Gemini, Perplexity ile stratejik seviye prompt sistemleri.' },
      { key: 'phase1_task_2', title: 'n8n Automation Foundations', category: 'DİJİTAL', priority: 'CRİTİCAL', description: 'n8n ile satılabilir seviyede otomasyon pipeline\'ları.' },
      { key: 'phase1_task_3', title: 'API & Entegrasyon Okuryazarlığı', category: 'DİJİTAL', priority: 'İMPORTANT', description: 'REST API, JSON, webhook, auth kavramlarını anlama.' },
      { key: 'phase1_task_4', title: 'SHGM İHA-1 Ticari Pilot Lisansı', category: 'PHYSICAL', priority: 'CRİTİCAL', description: 'İHA-1 ticari lisans eğitimi ve sertifika süreci.' },
      { key: 'phase1_task_5', title: 'Vibe Coding + Cursor IDE', category: 'DİJİTAL', priority: 'İMPORTANT', description: 'Doğal dil ile web sitesi, dashboard veya küçük app\'ler.' },
    ],
  },
  {
    number: 2,
    key: 'phase2',
    title: 'PROTOTİP VE KURULUM',
    slogan: 'Satacağın Şeyi Yap',
    duration: '31-60 GÜN',
    amac: 'Elinde somut, gösterebileceğin ürünler ve sistemler oluştur. Demo olmadan satış yok. Fiyatın olmadan teklif yok. Script\'in olmadan görüşme yok.',
    cikisKriterleri: [
      'Çalışan Voice Agent demosu (video kaydıyla)',
      '3 kademeli fiyat paketi hazır',
      'Discovery Call scripti yazılmış ve 3 kez prova edilmiş',
      'Client Journey süreci tanımlı (Notion\'da)',
      'En az 1 dijital ürün Gumroad\'da yayında',
    ],
    tasks: [
      { key: 'phase2_task_1', title: 'Voice Agent Prototype', category: 'DİJİTAL', priority: 'CRİTİCAL', description: 'Diş kliniği senaryosuyla çalışan Voice Agent demosu.' },
      { key: 'phase2_task_2', title: 'Offer & Positioning', category: 'SALES', priority: 'CRİTİCAL', description: '3 kademeli fiyat paketi ve profesyonel teklif yapısı.' },
      { key: 'phase2_task_3', title: 'Discovery Call System', category: 'SALES', priority: 'CRİTİCAL', description: 'Satış görüşmesi scripti, itiraz karşılama dosyası.' },
      { key: 'phase2_task_4', title: 'Agentic UX / AI Landing Page Systems', category: 'DİJİTAL', priority: 'İMPORTANT', description: 'Voice Agent sayfası, servis sayfası, müşteri formları.' },
      { key: 'phase2_task_5', title: 'Client Journey System', category: 'SALES', priority: 'İMPORTANT', description: 'Müşterinin onboarding\'den teslimata kadar geçeceği süreç.' },
      { key: 'phase2_task_6', title: 'Template / Prompt / Dijital Ürün Katmanı', category: 'PRODUCT', priority: 'İMPORTANT', description: 'Gumroad\'da satışa hazır 2-3 dijital ürün (Prompt kit, otomasyon template).' },
    ],
  },
  {
    number: 3,
    key: 'phase3',
    title: 'İLK MÜŞTERİ VE VAKA ANALİZİ',
    slogan: 'Bul, Sun, Kanıtla',
    duration: '61-90 GÜN',
    amac: 'Demo ve fiyatın var artık. Şimdi gerçek dünyada test zamanı.',
    cikisKriterleri: [
      'Cold outreach sistemi çalışıyor (günlük 50+ mail)',
      'En az 10 Discovery Call yapılmış',
      '3 pilot müşteriye Voice Agent entegre edilmiş',
      'En az 1 ücretli retainer sözleşmesi imzalanmış',
      'En az 1 Case Study yayında',
    ],
    tasks: [
      { key: 'phase3_task_1', title: 'Cold Outreach Engine', category: 'SALES', priority: 'CRİTİCAL', description: 'Apollo + Instantly + n8n otonom e-posta makinesi.' },
      { key: 'phase3_task_2', title: 'İlk 10 Discovery Call + 3 Pilot Müşteri', category: 'SALES', priority: 'CRİTİCAL', description: 'Gerçek B2B saha satış görüşmeleri.' },
      { key: 'phase3_task_3', title: 'Case Study Production System', category: 'SALES', priority: 'İMPORTANT', description: 'Her memnun müşteriden, Linkedin ve Instagram formatlı vaka analizi.' },
      { key: 'phase3_task_4', title: 'Newsletter + Lead Magnet', category: 'PRODUCT', priority: 'İMPORTANT', description: 'Beehiiv newsletter + PDF lead magnet + mail sekansı.' },
    ],
  },
  {
    number: 4,
    key: 'phase4',
    title: 'ÖLÇEKLEME VE ÜRÜNLEŞTİRME',
    slogan: 'Motoru Hızlandır',
    duration: '3-6 AY',
    amac: 'Satış kanalları oturdu. Şimdi sistemi ölçekleme ve ajans yapısını büyütme zamanı.',
    cikisKriterleri: [
      '5 aktif retainer müşteri',
      'Aylık stabil inbound lead akışı',
      'Bozma Creative ajansı tüm varlıklarıyla aktif',
    ],
    tasks: [
      { key: 'phase4_task_1', title: 'AaaS Müşteri Ölçekleme', category: 'SALES', priority: 'İMPORTANT', description: '5-12 aktif retainer müşteri bandına çıkış.' },
      { key: 'phase4_task_2', title: 'Instagram 85K → B2B Inbound Funnel', category: 'DİJİTAL', priority: 'İMPORTANT', description: 'İçerik dilini değiştir, genel motiveden hizmet odaklıya.' },
      { key: 'phase4_task_3', title: 'Bozma Creative Ajans Lansmanı', category: 'DİJİTAL', priority: 'NORMAL', description: 'Kurumsal ajans yapısının tüm mecralarda lansmanı.' },
      { key: 'phase4_task_4', title: 'Drone Kurumsal Satış Başlangıcı', category: 'SALES', priority: 'İMPORTANT', description: 'AaaS ve Marka hizmetine Drone fiziksel çekim paketini ekle.' },
    ],
  },
  {
    number: 5,
    key: 'phase5',
    title: 'SİSTEMLEŞME VE OTORİTE',
    slogan: 'Pazarı Domine Et',
    duration: '6-12 AY',
    amac: 'Müşteri akışı otomatize edildi. Artık thought leadership ve premium ürün zamanı.',
    cikisKriterleri: [
      '100K TL MRR barajını geçmek',
      'Aktif bir email veya Skool topluluğu',
      'Sektörde "AI Automation Agency" olarak tanınmak',
    ],
    tasks: [
      { key: 'phase5_task_1', title: 'Ücretli Topluluk Lansmanı (Skool/Discord)', category: 'PRODUCT', priority: 'İMPORTANT', description: 'Aylık küçük aboneliklerle "AI Destekli Kreatifler" ağı.' },
      { key: 'phase5_task_2', title: 'Newsletter Ekosistemi', category: 'DİJİTAL', priority: 'NORMAL', description: 'Email bülteninin 2500+ aboneye gelip B2B sponsorluk.' },
      { key: 'phase5_task_3', title: 'MRR 100K TL Hedefi', category: 'SALES', priority: 'CRİTİCAL', description: 'Tüm sistemlerin toplam tekrar eden gelirinin eşiği.' },
      { key: 'phase5_task_4', title: 'Vibe Coding ile Mikro-SaaS', category: 'PRODUCT', priority: 'NORMAL', description: 'Mevcut müşterilere veya hedef kitleye özel, üyelik tabanlı.' },
    ],
  },
  {
    number: 6,
    key: 'phase6',
    title: 'FİZİKSEL SİGORTA KATMANI',
    slogan: 'Fiziksel Yetenek + B Planı',
    duration: 'PARALEL İLERLER',
    amac: 'Dijital sistemler patlasa dahi elde tutulacak donanım becerileri.',
    cikisKriterleri: [
      '50 saat drone uçuş tecrübesi',
      '3 kurumsal drone çekim projesi tamamlanması',
      'KNX akıllı ev sistemleri eğitimine giriş',
    ],
    tasks: [
      { key: 'phase6_task_1', title: 'Drone Flight Practice & Portfolio', category: 'PHYSICAL', priority: 'CRİTİCAL', description: 'Uçuş yeteneklerinin bileylenmesi ve profesyonel post-production.' },
      { key: 'phase6_task_2', title: 'KNX Smart Home Sertifikası', category: 'PHYSICAL', priority: 'NORMAL', description: 'Akıllı binalar için fiziksel ve elektrik temelli eğitim.' },
    ],
  },
];

// Helper: total task count across all phases
export const TOTAL_CAREER_TASKS = CAREER_PHASES.reduce((sum, p) => sum + p.tasks.length, 0);

// Helper: phase completion percentage given a set of completed task keys
export function getPhaseCompletionPct(phase: CareerPhase, completedKeys: Set<string>): number {
  if (phase.tasks.length === 0) return 0;
  const done = phase.tasks.filter(t => completedKeys.has(t.key)).length;
  return Math.round((done / phase.tasks.length) * 100);
}

// Helper: compute auto-current phase from completion data
// Rule: current phase = first phase with < 80% completion
export function computeCurrentPhase(completedKeys: Set<string>): number {
  for (const phase of CAREER_PHASES) {
    const pct = getPhaseCompletionPct(phase, completedKeys);
    if (pct < 80) return phase.number;
  }
  return 6; // all phases ≥80% — show last phase
}
