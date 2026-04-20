CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instructor TEXT,
  status TEXT DEFAULT 'on_track'
    CHECK (status IN ('critical', 'on_track', 'safe')),
  midterm_score INTEGER CHECK (midterm_score BETWEEN 0 AND 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam_date DATE NOT NULL,
  type TEXT DEFAULT 'exam'
    CHECK (type IN ('exam', 'assignment', 'project')),
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS university_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  points INTEGER NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON universities FOR ALL USING (true);
CREATE POLICY "allow_all" ON courses FOR ALL USING (true);
CREATE POLICY "allow_all" ON exams FOR ALL USING (true);
CREATE POLICY "allow_all" ON university_points FOR ALL USING (true);

-- Seed
INSERT INTO universities (name, slug) VALUES
  ('Beykent', 'beykent'),
  ('AÖF', 'aof')
ON CONFLICT (slug) DO NOTHING;
