-- Phase 2: Character System, Scoring Engine & Dopamine Loop
-- Feed The Goat — Migration

-- 1a. Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('discipline', 'production', 'health', 'bonus')) DEFAULT 'production',
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'day', 'evening')) DEFAULT 'day',
  points INT NOT NULL DEFAULT 5,
  priority TEXT CHECK (priority IN ('P1', 'P2', 'P3')) DEFAULT NULL,
  is_bonus BOOLEAN NOT NULL DEFAULT FALSE,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1b. Daily scores table
CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  discipline_points INT NOT NULL DEFAULT 0,
  production_points INT NOT NULL DEFAULT 0,
  health_points INT NOT NULL DEFAULT 0,
  bonus_points INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  finalized BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_scores_date ON daily_scores(date DESC);

-- 1c. Goat state table (singleton row)
CREATE TABLE IF NOT EXISTS goat_state (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  consistency_days INT NOT NULL DEFAULT 0,
  current_stage TEXT NOT NULL DEFAULT 'OGLAK'
    CHECK (current_stage IN ('OGLAK', 'GENC_KECI', 'DAG_KECISI', 'ALFA_KECI', 'MISTIK_KECI', 'GOAT')),
  current_mood TEXT NOT NULL DEFAULT 'AC'
    CHECK (current_mood IN ('AC', 'TOK', 'ALFA', 'DURGUN')),
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  ritim_koruma_count INT NOT NULL DEFAULT 1,
  last_finalized_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO goat_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 1d. Energy check-ins
CREATE TABLE IF NOT EXISTS energy_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  energy TEXT NOT NULL CHECK (energy IN ('LOW', 'MID', 'HIGH')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1e. RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE goat_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_checkins ENABLE ROW LEVEL SECURITY;

-- Allow all for anon (single-user app, no auth)
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on daily_scores" ON daily_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on goat_state" ON goat_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on energy_checkins" ON energy_checkins FOR ALL USING (true) WITH CHECK (true);

-- 1f. Seed today's tasks
INSERT INTO tasks (title, category, time_of_day, points, priority, is_bonus, is_done, date) VALUES
  ('06:30 Uyanış + Yüze Buz', 'discipline', 'morning', 15, NULL, false, false, CURRENT_DATE),
  ('Dişlerini fırçala + gargara yap', 'discipline', 'morning', 5, NULL, false, false, CURRENT_DATE),
  ('Vitaminlerin tamamını iç', 'discipline', 'morning', 5, NULL, false, false, CURRENT_DATE),
  ('15 sayfa kitap oku', 'discipline', 'morning', 10, NULL, false, false, CURRENT_DATE),
  ('Beykent vizelerini tamamla', 'production', 'day', 25, 'P1', false, false, CURRENT_DATE),
  ('Anasayfada bulunan Claude Code & N8N videolarını bitir', 'production', 'day', 20, 'P1', false, false, CURRENT_DATE),
  ('Grafikcem reels çekimlerini & editlerini yap', 'production', 'day', 15, 'P2', false, false, CURRENT_DATE),
  ('YouTube otomasyonu için fikir al bir saas yapılabilir mi bak', 'production', 'day', 15, 'P2', false, false, CURRENT_DATE),
  ('Bugünkü X paylaşımını yap', 'production', 'evening', 15, NULL, false, false, CURRENT_DATE),
  ('23:00 öncesi yat', 'discipline', 'evening', 5, NULL, true, false, CURRENT_DATE),
  ('Ekstra 10 sayfa oku', 'discipline', 'evening', 5, NULL, true, false, CURRENT_DATE),
  ('İngilizce çalış', 'production', 'evening', 10, NULL, true, false, CURRENT_DATE)
ON CONFLICT DO NOTHING;
