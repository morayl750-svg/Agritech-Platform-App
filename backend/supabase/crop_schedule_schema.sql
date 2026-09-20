-- ============================================================
-- AgriSmart: Crop Schedule & Tasks Schema (Feature 08)
-- Run in Supabase SQL Editor
-- ============================================================

-- Jadwalka beerista
CREATE TABLE IF NOT EXISTS crop_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  plot_name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Lower Shabelle',
  planting_date DATE NOT NULL,
  estimated_harvest_date DATE NOT NULL,
  watering_interval_days INTEGER DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'active', 'harvested', 'failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task-yada jadwalka
CREATE TABLE IF NOT EXISTS schedule_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES crop_schedule(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('plant', 'water', 'fertilize', 'inspect', 'harvest', 'other')),
  task_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  is_done BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE crop_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_crop_schedule') THEN
    CREATE POLICY "allow_all_crop_schedule" ON crop_schedule FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_schedule_tasks') THEN
    CREATE POLICY "allow_all_schedule_tasks" ON schedule_tasks FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
