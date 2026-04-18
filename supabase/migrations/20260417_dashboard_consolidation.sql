-- 1. Gün bazlı filtreleme
ALTER TABLE task_templates
  ADD COLUMN active_days TEXT[] DEFAULT NULL;

-- 2. Kötü alışkanlık streak
CREATE TABLE bad_habit_streaks (
  id SERIAL PRIMARY KEY,
  habit_key TEXT UNIQUE NOT NULL,
  habit_label TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_check_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO bad_habit_streaks (habit_key, habit_label) VALUES
  ('no_outside_food', 'Dışarıdan yemek yemedim'),
  ('no_porn', 'Pornografi izlemedim'),
  ('started_not_postponed', 'Ertelemedim, başladım'),
  ('selective_sharing', 'Herkese her şeyi anlatmadım');

-- 3. Günlük alışkanlık log
CREATE TABLE bad_habit_logs (
  id SERIAL PRIMARY KEY,
  habit_key TEXT NOT NULL REFERENCES bad_habit_streaks(habit_key),
  log_date DATE NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_key, log_date)
);

-- 4. Su takibi
CREATE TABLE water_log (
  id SERIAL PRIMARY KEY,
  log_date DATE UNIQUE NOT NULL,
  bottles_completed INTEGER DEFAULT 0 CHECK (bottles_completed BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Haftalık aksiyon sorusu
CREATE TABLE weekly_actions (
  id SERIAL PRIMARY KEY,
  week_start_date DATE UNIQUE NOT NULL,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS
ALTER TABLE bad_habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bad_habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON bad_habit_streaks FOR ALL USING (true);
CREATE POLICY "allow_all" ON bad_habit_logs FOR ALL USING (true);
CREATE POLICY "allow_all" ON water_log FOR ALL USING (true);
CREATE POLICY "allow_all" ON weekly_actions FOR ALL USING (true);
