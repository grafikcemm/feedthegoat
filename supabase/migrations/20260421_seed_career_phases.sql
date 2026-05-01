-- Seed Career Phases and Skills

-- Clear existing data (be careful in production, but here we want to ensure clean state for the repo)
TRUNCATE TABLE career_skills CASCADE;
TRUNCATE TABLE career_phases CASCADE;

-- Insert Phases
INSERT INTO career_phases (id, title, subtitle, description, is_active, is_unlocked, sort_order) VALUES
(1, 'FAZ 1', 'TEMEL OMURGA', 'Dijital yetkinlikleri maksimize et, otomasyonu öğren. Ayak işlerini yapay zekaya devretmeyi öğren.', true, true, 1),
(2, 'FAZ 2', 'HİZMET VE OUTREACH', 'Paketle, duyur ve ilk satışı yap. Öğrenilenleri paraya çevirme ve pazarlama.', false, true, 2),
(3, 'FAZ 3', 'OTORİTE İNŞAASI', 'Güven kazan, kanıt sun ve ölçeklen. Referans ve case study odaklı büyüme.', false, true, 3),
(4, 'FAZ 4', 'İÇERİK MOTORU', 'Görünür ol, inbound (gelen) talep yarat. İçerik pazarlaması ile mıknatıs etkisi.', false, true, 4),
(5, 'FAZ 5', 'SİSTEMLEŞME VE STRATEJİ', 'Senin zamanın azalsın, sistem çalışsın. İlk ürün, ilk ekip, net pozisyon.', false, true, 5),
(6, 'FAZ 6', 'FİZİKSEL SİGORTA', 'Dijital dışında gelir ve güvenlik katmanı. IHA-1 lisansı, drone ticari kullanım.', false, true, 6);

-- Insert Skills for Phase 1
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(1, 'Prompt Engineering', 'Claude API, ChatGPT', 'Anthropic docs, learnprompting.org', '10 farklı use case için çalışan sistem promptu yaz', 'critical', true, 1),
(1, 'n8n Otomasyon', 'n8n + Supabase + Webhook', 'n8n Academy, YouTube', '3 çalışan otomasyon iş akışı kur ve canlıya al', 'critical', false, 2),
(1, 'Voice Agent', 'Vapi.ai', 'vapi.ai/docs, YouTube', '1 çalışan demo voice agent kur, telefon araması yap', 'important', false, 3),
(1, 'After Effects', 'Adobe After Effects', 'School of Motion, YouTube', '3 farklı motion graphics template yap', 'important', false, 4),
(1, 'Cursor / Claude Code', 'Cursor IDE', 'Pratik uygulama', 'Feed The Goat''u bağımsız olarak geliştirebilmek', 'continue', false, 5);

-- Insert Skills for Phase 2
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(2, 'B2B Satış & Outreach', 'LinkedIn, Gmail, Lemlist', 'Alex Hormozi YouTube, Lemlist blog', '20 kişiye outreach yap, 3 discovery call al', 'critical', false, 1),
(2, 'Hizmet Paketleme', 'Notion veya PDF', 'Dan Lok fiyatlandırma videoları', 'Fiyatlı 3 hizmet paketi yaz ve yayına al', 'critical', false, 2),
(2, 'Landing Page', 'Next.js + Tailwind', 'Grafikcem.com güncellemesi', 'Canlı landing page — açık adres, CTA butonu, iletişim formu', 'important', false, 3),
(2, 'AI Görsel Workflow', 'Midjourney + Kling + Topaz', 'Pratik uygulama', '3 müşteri için AI görsel paketi teslim et', 'important', false, 4);

-- Insert Skills for Phase 3
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(3, 'Discovery Call', 'Zoom veya telefon', 'SPIN Selling kitabı, Hormozi call framework', '10 discovery call yap — not al, analiz et', 'critical', false, 1),
(3, 'Case Study Yazma', 'Notion veya web sayfası', 'Copyhackers blog', '2 gerçek müşteri case study''si yaz ve yayınla', 'critical', false, 2),
(3, 'Müşteri Yönetimi', 'Notion + WhatsApp/Mail', 'Freelance deneyimi sistematizasyonu', '3 pilot müşteriyi sorunsuz teslim et, referans al', 'important', false, 3);

-- Insert Skills for Phase 4
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(4, 'İçerik Pazarlama', 'LinkedIn + Instagram', 'Justin Welsh, @grafikcem büyütme planı', 'Haftada 3 post, 3 ay kesintisiz — toplam 36 post', 'critical', false, 1),
(4, 'CRM Otomasyon', 'n8n + Supabase', 'Faz 1 uygulaması', 'Müşteri pipeline''ı otomatik takip eden sistem kurulu', 'critical', false, 2),
(4, 'Outsource', 'Upwork, Freelancer grupları', 'İş devretme pratikleri', '1 tekrarlayan görevi başka birine devret', 'important', false, 3);

-- Insert Skills for Phase 5
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(5, 'SaaS / Ürün Geliştirme', 'Next.js + Stripe + Supabase', 'Stripe docs, Lemon Squeezy', '1 dijital ürün için ödeme sistemi canlıda', 'critical', false, 1),
(5, 'Marka Pozisyonlama', 'Notion, PDF, web', 'April Dunford — Positioning kitabı', 'Net "ben kimim, kime ne yapıyorum" yaz', 'critical', false, 2),
(5, 'Ekip & Operasyon', 'Notion + ClickUp', 'Standart SOP dokümantasyonu', 'Tüm hizmetlerin için standart SOP dokümanı hazır', 'important', false, 3);

-- Insert Skills for Phase 6
INSERT INTO career_skills (phase_id, area, tool, learn_from, exit_criteria, priority, is_done, sort_order) VALUES
(6, 'IHA-1 Drone Lisansı', 'Türkiye SHY-IHA mevzuatı', 'SHY-IHA resmi doküman', 'IHA-1 sertifikası alındı', 'critical', false, 1),
(6, 'Drone Ticari Kullanım', 'DJI drone + editing', 'Real estate drone video tutorialları', '2 ücretli ticari çekim tamamla', 'important', false, 2);
