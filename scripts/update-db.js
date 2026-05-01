const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching phases...');
  const { data: phases } = await supabase.from('career_phases').select('*');
  const getPhaseId = (num) => phases.find(p => p.phase_number === num)?.id;

  console.log('Fetching skills...');
  const { data: skills } = await supabase.from('career_skills').select('*');
  const getSkill = (title) => skills.find(s => s.title === title || s.title.includes(title));

  // ADIM 2: PHASES
  const phaseUpdates = [
    { phase_number: 1, title: "AI-Native Operating Core", subtitle: "Hazırlık ve Ustalık" },
    { phase_number: 2, title: "Stack Specialization & Vertical Pick", subtitle: "Dikey Pazar ve Stack Derinleşmesi" },
    { phase_number: 3, title: "Authority & Distribution Engine", subtitle: "İnsan Faktörü ve Pazar Girişi" },
    { phase_number: 4, title: "Productization & Team Layer", subtitle: "Sistemleşme ve Ürünleşme" },
    { phase_number: 5, title: "Owned Audience & Knowledge Products", subtitle: "Pasif Gelir ve Topluluk" },
    { phase_number: 6, title: "Physical Moat & AI-Resistant Income", subtitle: "Gerçek Dünya Bağlantısı ve Dirençli Gelir" },
  ];

  for (const update of phaseUpdates) {
    const pId = getPhaseId(update.phase_number);
    if (pId) {
      await supabase.from('career_phases').update({ title: update.title, subtitle: update.subtitle }).eq('id', pId);
      console.log(`Updated Phase ${update.phase_number}`);
    }
  }

  // ADIM 3: SKILLS
  // Let's create an array of actions
  // format: { action: 'update', searchTitle: '...', newTitle?: '...', desc?: '...', wef_tag?: '...' }
  // format: { action: 'insert', phaseNum: X, type: '...', title: '...', desc: '...', wef_tag?: '...', sortOrder: X }
  // format: { action: 'delete', searchTitle: '...' }

  const skillActions = [
    // FAZ 1
    { action: 'update', searchTitle: 'Adobe After Effects', desc: "Saf motion artık premium tek başına satmıyor. AE + AI Video Pipeline (Runway, Kling, Veo) hibrit iş akışı primli alan. Timeline, keyframe, kompozisyon temelleri + AI hibrit kompozit." },
    { action: 'update', searchTitle: 'Claude & Claude Code', wef_tag: 'AI_BIG_DATA' },
    { action: 'update', searchTitle: 'Claude & Adobe Entegrasyonu', newTitle: "Creative Stack Orchestration", desc: "Claude + Adobe + n8n + Supabase + Cursor stack'ini tek bir yaratıcı operasyon hattı olarak yönet. Salt entegrasyon değil; orkestrasyon.", wef_tag: 'TECH_LITERACY' },
    { action: 'update', searchTitle: 'N8N Detaylı Kursu', desc: "n8n derinleşmesi: agent yönetimi, RAG, otomasyonun iş akışına entegrasyonu. Saf otomasyon değil; kreatif domain özelinde n8n.", wef_tag: 'SYSTEMS' },
    { action: 'update', searchTitle: 'AgencyOS\'u Tamamla' }, // KEEP description, just find it
    { action: 'update', searchTitle: 'Prompt Mühendisliği', newTitle: "Domain-Specific AI Workflow Architecture", desc: "Salt 'prompt yazmak' commodity'leşti. Senin moat'ın: kreatif iş akışı için domain-specific AI mimari kurmak. Persona + Bağlam + Görev + Format dörtlüsü, agent zincirleme, kalite kontrol.", wef_tag: 'AI_BIG_DATA' },
    { action: 'insert', phaseNum: 1, type: 'teknik', title: "Creative Operations (CreOps) Disiplini", desc: "Ajansların 2026 odağı: AI iş akışlarını yöneten katman. Süreç, kalite, varyasyon yönetimi, rapor şablonları. Türkiye'de bu unvanı kullanan az kişi var; arz boş, talep yüksek.", wef_tag: 'SYSTEMS', sortOrder: 9 },
    { action: 'insert', phaseNum: 1, type: 'teknik', title: "Performance Creative Reading", desc: "CTR, CPA, ROAS, hook rate, retention curve okuma. Motion ve creative çıktıyı performans verisine bağla. Tasarımcı + medya alıcı hibrit profili = premium.", wef_tag: 'ANALYTICAL', sortOrder: 10 },
    { action: 'insert', phaseNum: 1, type: 'teknik', title: "3D Temelleri (C4D veya Blender)", desc: "İş ilanlarının %70'i 3D'yi 'tercih edilir' olarak listeliyor. Temel seviye yeter, derinleşme şart değil. AI motion ile birleşince premium kapısı.", sortOrder: 11 },
    
    { action: 'update', searchTitle: 'Branding ve Tasarımsal Teori', wef_tag: 'CREATIVE_THINKING' },
    { action: 'update', searchTitle: 'Dijital Okuryazarlık', desc: "Spesifik yığın (Notion + Supabase + n8n + Claude Code + Vercel) üzerinde derin operatörlük. 'Genel okuryazarlık' yerine stack-bazlı uzmanlık.", wef_tag: 'TECH_LITERACY' },
    { action: 'update', searchTitle: 'Uyum Sağlama', desc: "WEF 2030'un en hızlı büyüyen self-efficacy becerisi: resilience, flexibility, agility. Haftalık öğrenme + aylık retro + araç-pazar adaptasyonu sistemi.", wef_tag: 'RESILIENCE' },
    { action: 'insert', phaseNum: 1, type: 'kisisel', title: "Yaratıcı Düşünme Disiplini", desc: "WEF 2030'da en hızlı büyüyen 4. beceri. AI'ın taklit edemediği tek alan; günlük 30 dakika konsept üretimi, lateral düşünme egzersizi, brief'siz yaratım.", wef_tag: 'CREATIVE_THINKING', sortOrder: 12 },

    // FAZ 2
    { action: 'delete', searchTitle: 'YouTube Photoshop Highlights' },
    { action: 'insert', phaseNum: 2, type: 'teknik', title: "Editorial Photoshop & Composite Mastery", desc: "AI'ın yetmediği yer: editorial composite, retouching, color grading. Kapak, magazin, premium reklam görseli. Saf 'Photoshop kullanıcısı' değil; editorial sanatçı.", sortOrder: 1 },
    { action: 'update', searchTitle: 'Grafikcem Detaylı Branding Planlaması' },
    { action: 'update', searchTitle: 'B2B Satış Sistemini Değerlendir', wef_tag: 'SERVICE' },
    { action: 'update', searchTitle: 'UI/UX Uzmanlaşma', desc: "WEF'in en hızlı büyüyen 8. mesleği ve 'emerging skill' kategorisinde. AI'nın tetiklediği yeni ürünlerin tasarım katmanı. Online kurs + 1 vaka çalışması.", wef_tag: 'DESIGN_UX' },
    { action: 'update', searchTitle: 'Temel Python Öğrenimi', newTitle: "Python for AI Workflow Engineering", desc: "Yüzeyde kalırsa pasif kalır. AI iş akışı otomasyonu için bir-iki seviye yukarı: Pandas, BeautifulSoup, Anthropic SDK, n8n custom node.", wef_tag: 'TECH_LITERACY' },
    { action: 'delete', searchTitle: 'Temel Sibergüvenlik' },
    { action: 'insert', phaseNum: 2, type: 'teknik', title: "Vertical Pick — Dikey Pazar Seçimi", desc: "Bir ana dikey + bir yedek seç. Önerilen: (1) DTC E-commerce Performance Creative, (2) Emlak/İnşaat Hibrit Prodüksiyon (Faz 6 ile sinerji). Üç vaka olmadan ana mesajı değiştirme.", wef_tag: 'ANALYTICAL', sortOrder: 8 },
    { action: 'insert', phaseNum: 2, type: 'teknik', title: "Performance Creative Sprint Şablonu", desc: "Tek DTC markası için 30 günde 20 reel + 50 statik + raporlama. Üç farklı brief üzerinde tekrar et — 3 vaka çıkar.", sortOrder: 9 },
    
    { action: 'update', searchTitle: 'Diksiyon ve Ses', wef_tag: 'LEADERSHIP' },
    { action: 'update', searchTitle: 'Finansal Okuryazarlık', wef_tag: 'ANALYTICAL' },
    { action: 'update', searchTitle: 'Yaratıcılık Geliştirme', wef_tag: 'CREATIVE_THINKING' },
    { action: 'update', searchTitle: 'Hikaye Anlatıcılığı', wef_tag: 'CREATIVE_THINKING' },

    // FAZ 3
    { action: 'update', searchTitle: 'Vaka Analizi İçerik Formatı', desc: "Carousel post yerine vaka analizi. Bir vaka = 100 carousel kadar değer. AI'ın taklit edemediği kişisel sermaye." },
    { action: 'update', searchTitle: 'Vibe Marketing' },
    { action: 'update', searchTitle: 'Kişisel YouTube Kanalı Kur', newTitle: "YouTube Authority Channel — AI Creative Ops Case Studies", desc: "Vaka çalışması, before/after, sistem kurulum videoları. Generic 'tasarım dersi' değil; otorite kanalı." },
    { action: 'insert', phaseNum: 3, type: 'teknik', title: "LinkedIn Authority Track", desc: "B2B retainer satışını 3-5x artıran tek kanal. Haftada 3 post + ayda 2 long-form. Türkiye'de 'AI-native creative ops' konuşan az kişi var.", wef_tag: 'LEADERSHIP', sortOrder: 8 },
    { action: 'insert', phaseNum: 3, type: 'teknik', title: "English Newsletter Lansmanı", desc: "Beehiiv veya Substack, B2B owned audience. Faz 5 dijital ürünlerin kitlesini önceden inşa eder. EUR pazarına kapı.", sortOrder: 9 },

    { action: 'update', searchTitle: 'Topluluk Önünde Konuşma', wef_tag: 'LEADERSHIP' },
    { action: 'update', searchTitle: 'Girişkenlik', desc: "Soğuk görüşme + ağ kurma. Haftalık 1 B2B temas — pazarlama değil, müşteri konuşması.", wef_tag: 'LEADERSHIP' },
    { action: 'update', searchTitle: 'Marka İletişimi', wef_tag: 'EMPATHY' },
    { action: 'update', searchTitle: 'Retainer Müşteri Yönetimi', wef_tag: 'SERVICE' },

    // FAZ 4
    { action: 'update', searchTitle: 'Creative Operations Paketi', desc: "İçerik operasyonlarını AI ile otomasyonlaştıran paket; aylık retainer formatında satılır. Faz 1'de öğrenilen CreOps disiplininin pazara çıkmış hali.", wef_tag: 'SYSTEMS' },
    { action: 'delete', searchTitle: 'Mobil Uygulama Geliştirme' },
    { action: 'insert', phaseNum: 4, type: 'teknik', title: "Fractional Creative Director Hizmeti", desc: "Aylık sabit ücret (~50.000-100.000 TL), hafta 1-2 toplantı + sistem denetimi + ekip yönlendirme. Türkiye'de bu rolü sunan kişi az; arz-talep boşluğu.", wef_tag: 'LEADERSHIP', sortOrder: 8 },
    { action: 'insert', phaseNum: 4, type: 'teknik', title: "İlk Freelance İşbirlikçi", desc: "1 motion editor + 1 prompt operator. AgencyOS'tan sonra ölçekleme katmanı. Sen 'üreten' değil, 'yöneten' olursun.", wef_tag: 'TALENT_MGMT', sortOrder: 9 },
    
    { action: 'update', searchTitle: 'Maskülenite ve Karakter Gelişimi', wef_tag: 'MOTIVATION' },
    { action: 'insert', phaseNum: 4, type: 'kisisel', title: "Talent Management & Delegasyon", desc: "WEF 2030 Top 10 büyüyen beceri. Onboarding, brief verme, kalite kontrol, geri bildirim — AI orkestrasyonunun insan tarafı.", wef_tag: 'TALENT_MGMT', sortOrder: 10 },
    { action: 'insert', phaseNum: 4, type: 'kisisel', title: "Systems Thinking", desc: "Tek tek görev değil; süreçleri sistem olarak görmek. Süreç haritalama, döngü tasarımı, ölçülebilir çıktı.", wef_tag: 'SYSTEMS', sortOrder: 11 },

    // FAZ 5
    { action: 'update', searchTitle: 'Dijital Ürün — Gumroad', desc: "Mega-Prompt Kütüphanesi, n8n şablonlar, mini eğitimler. Ürün ana motor değil; retainer üstüne ek katman." },
    { action: 'update', searchTitle: 'Newsletter → Owned Audience', desc: "Aylık ücretli abonelik veya B2B sponsorluk sistemine geçiş. Faz 3'te kurduğun kitleyi paraya çevirme katmanı." },
    { action: 'insert', phaseNum: 5, type: 'teknik', title: "B2B Workshop / In-House Training", desc: "Şirketlere 'AI Creative Operations' 2 günlük eğitim. Tek seferlik 60.000-150.000 TL aralığında satılır, retainer'a kapı açar.", wef_tag: 'LEADERSHIP', sortOrder: 8 },
    { action: 'insert', phaseNum: 5, type: 'teknik', title: "English Service Page", desc: "grafikcem.com/services-en — Avrupa müşterisi için EUR fiyatlamalı paket sayfası. Tek sayfa, üç paket, açık takvim.", sortOrder: 9 },

    { action: 'update', searchTitle: 'Eğitim Liderliği', wef_tag: 'LEADERSHIP' },
    { action: 'update', searchTitle: 'Discord / Ücretli Topluluk', wef_tag: 'EMPATHY' },

    // FAZ 6
    { action: 'update', searchTitle: 'İHA-1 Ticari', desc: "SHGM onaylı kurumdan ticari drone ehliyeti alımı. Emlak/inşaat/etkinlik dikeyi ile birleştirildiğinde aylık retainer kapısı." },
    { action: 'update', searchTitle: 'Hibrit Prodüksiyon', desc: "Drone + saha çekimi + röportaj + aynı gün kurgu + ertesi gün motion varyasyonları. Tek günlük paket fiyatı: 25.000-80.000 TL." },
    { action: 'insert', phaseNum: 6, type: 'teknik', title: "Saha Prodüksiyon Ekipman Stack'i", desc: "Sony FX3/FX30 sınıfı kamera, Rode Wireless GO mikrofon, ışık + softbox, gimbal. Ekipman senin elindeyse 'git oraya çek' işi sende kalır — AI ne kadar gelişirse gelişsin.", sortOrder: 8 },
    { action: 'insert', phaseNum: 6, type: 'teknik', title: "Photogrammetry / 3D Reality Capture", desc: "Drone + iPhone LiDAR + Polycam ile inşaat/emlak/müze 3D dokümantasyonu. Proje başı 50.000-200.000 TL. Türkiye'de neredeyse boş niş.", sortOrder: 9 },
    { action: 'insert', phaseNum: 6, type: 'teknik', title: "İHA-2 veya KNX Akıllı Ev", desc: "İki yol: İHA-2 (25kg+, zirai/endüstriyel) veya KNX Partner sertifikası (akıllı ev tasarımı + AI görselleştirme hibridi). Faz 1-2 sonuçlarına göre seç. Kararı şimdi verme; data biriktir.", sortOrder: 10 },

    { action: 'update', searchTitle: 'Vaka Analizi Yayımla', desc: "İlk hibrit prodüksiyon projesini case study olarak yayınla. Drone + saha + AI kurgu = entegre paket kanıtı. Bu Faz 6'nın 'pazara çıkış' anıdır." },
  ];

  for (const item of skillActions) {
    if (item.action === 'delete') {
      const skill = getSkill(item.searchTitle);
      if (skill) {
        await supabase.from('career_skills').delete().eq('id', skill.id);
        console.log(`Deleted: ${item.searchTitle}`);
      }
    } else if (item.action === 'update') {
      const skill = getSkill(item.searchTitle);
      if (skill) {
        const payload = {};
        if (item.newTitle) payload.title = item.newTitle;
        if (item.desc) payload.description = item.desc;
        if (item.wef_tag) payload.wef_tag = item.wef_tag;
        
        if (Object.keys(payload).length > 0) {
          await supabase.from('career_skills').update(payload).eq('id', skill.id);
          console.log(`Updated: ${skill.title} ->`, payload);
        }
      } else {
        console.log(`WARN: Could not find skill to update: ${item.searchTitle}`);
      }
    } else if (item.action === 'insert') {
      // check if it exists already by title
      const existing = skills.find(s => s.title === item.title);
      if (!existing) {
        const pId = getPhaseId(item.phaseNum);
        if (pId) {
          await supabase.from('career_skills').insert({
            phase_id: pId,
            skill_type: item.type,
            title: item.title,
            description: item.desc,
            wef_tag: item.wef_tag || null,
            sort_order: item.sortOrder,
            is_completed: false
          });
          console.log(`Inserted: ${item.title}`);
        }
      } else {
        console.log(`WARN: Already exists: ${item.title}`);
      }
    }
  }

  console.log('Done!');
}

main();
