-- 20260418_fix_active_tasks_schema.sql
-- Fixes missing table and aligns column naming with the application logic (is_priority)

-- 1. Ensure the table exists and has the correct basic structure
CREATE TABLE IF NOT EXISTS active_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'active' CHECK (category IN ('active', 'waiting')),
  sort_order SERIAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clean up old naming and add the correct column
ALTER TABLE active_tasks DROP COLUMN IF EXISTS is_urgent;
ALTER TABLE active_tasks ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT false;

-- 3. Set up RLS (Open access for single-user dev environment)
ALTER TABLE active_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on active_tasks" ON active_tasks;
CREATE POLICY "Allow all on active_tasks" ON active_tasks FOR ALL USING (true) WITH CHECK (true);
