-- ────────────────────────────────────────
-- İŞ 1 — SCHEMA GÜNCELLEMESİ
-- ────────────────────────────────────────

-- courses tablosuna subsection kolonu ekle (E-Sertifika için)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS subsection TEXT DEFAULT NULL;
-- NULL = normal ders, 'esertifika' = E-Sertifika dersi

-- exams tablosuna exam_period kolonu ekle
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS exam_period TEXT DEFAULT NULL;
-- 'final' | 'butunleme' | 'ara_sinav' | 'yaz_okulu'


-- ────────────────────────────────────────
-- İŞ 2 — BEYKENT DERSLERİ VE SINAVLARI
-- ────────────────────────────────────────

-- Beykent derslerini ekle
WITH beykent AS (
  SELECT id FROM universities WHERE slug = 'beykent'
)
INSERT INTO courses (university_id, name, instructor, status) VALUES
  ((SELECT id FROM beykent), 'Fotoğraf Teknikleri', 'osmanulucay@beykent.edu.tr', 'safe'),
  ((SELECT id FROM beykent), 'Kentsel Grafik', 'elifdag@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'İletişim ve Yapay Zeka', 'cemcaliskan@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'İnteraktif Medya Tasarımı', 'muratuluk@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'Temel Tasarım Pratikleri', 'nilarkan@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'İngilizce II', 'nurcancakmak@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'Görsel İletişim Tasarımı Bitirme Çalışması', 'nilarkan@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'İletişim Kuramları', 'gokceaslaner@beykent.edu.tr', 'on_track'),
  ((SELECT id FROM beykent), 'Dijital Oyun Tasarımı', 'cemcaliskan@beykent.edu.tr', 'on_track')
ON CONFLICT DO NOTHING;

-- Beykent akademik takvim sınavları
WITH beykent AS (
  SELECT id FROM universities WHERE slug = 'beykent'
)
INSERT INTO exams (university_id, title, exam_date, type, exam_period) VALUES
  ((SELECT id FROM beykent), 'Final Sınavları Başlangıcı', '2026-06-15', 'exam', 'final'),
  ((SELECT id FROM beykent), 'Final Sınavları Bitişi', '2026-06-28', 'exam', 'final'),
  ((SELECT id FROM beykent), 'Bütünleme Sınavları Başlangıcı', '2026-07-06', 'exam', 'butunleme'),
  ((SELECT id FROM beykent), 'Bütünleme Sınavları Bitişi', '2026-07-12', 'exam', 'butunleme')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────
-- İŞ 3 — AÖF DERSLERİ VE SINAVLARI
-- ────────────────────────────────────────

-- AÖF normal dersler
WITH aof AS (
  SELECT id FROM universities WHERE slug = 'aof'
)
INSERT INTO courses (university_id, name, status, subsection) VALUES
  ((SELECT id FROM aof), 'Halkla İlişkiler', 'on_track', NULL),
  ((SELECT id FROM aof), 'Yeni İletişim Teknolojileri', 'on_track', NULL),
  ((SELECT id FROM aof), 'İletişim Kuramları', 'on_track', NULL),
  ((SELECT id FROM aof), 'Marka ve Yönetimi', 'on_track', NULL),
  ((SELECT id FROM aof), 'Pazarlama İletişimi', 'on_track', NULL)
ON CONFLICT DO NOTHING;

-- E-Sertifika dersleri (subsection = 'esertifika')
WITH aof AS (
  SELECT id FROM universities WHERE slug = 'aof'
)
INSERT INTO courses (university_id, name, status, subsection) VALUES
  ((SELECT id FROM aof), 'Marka ve Yönetimi', 'on_track', 'esertifika'),
  ((SELECT id FROM aof), 'Marka İletişim Kampanyaları', 'on_track', 'esertifika'),
  ((SELECT id FROM aof), 'Marka İletişimi Tasarımı ve Uygulamaları', 'on_track', 'esertifika')
ON CONFLICT DO NOTHING;

-- AÖF akademik takvim sınavları
WITH aof AS (
  SELECT id FROM universities WHERE slug = 'aof'
)
INSERT INTO exams (university_id, title, exam_date, type, exam_period) VALUES
  ((SELECT id FROM aof), 'Bahar Dönemi Ara Sınavı', '2026-04-04', 'exam', 'ara_sinav'),
  ((SELECT id FROM aof), 'Bahar Dönemi Final Sınavı', '2026-05-09', 'exam', 'final'),
  ((SELECT id FROM aof), 'Yaz Okulu Sınavı', '2026-08-22', 'exam', 'yaz_okulu')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────
-- DOĞRULAMA SORGULARI
-- ────────────────────────────────────────

-- Derslerin özeti
SELECT u.name as university, c.name as course, c.subsection, c.status 
FROM courses c
JOIN universities u ON u.id = c.university_id
ORDER BY u.name, c.subsection NULLS FIRST, c.name;

-- Sınavların özeti
SELECT u.name as university, e.title, e.exam_date, e.exam_period
FROM exams e
JOIN universities u ON u.id = e.university_id
ORDER BY e.exam_date;
