-- ============================================================
-- AgriSmart: Yield Predictions Schema (Feature 06)
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS yield_predictions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 TEXT NOT NULL DEFAULT 'default-user',
  crop_type               TEXT NOT NULL,
  region                  TEXT NOT NULL,
  area_hectares           DECIMAL(8, 2) NOT NULL,
  planting_date           DATE NOT NULL,
  irrigation_type         TEXT,
  soil_type               TEXT,
  ai_analysis             TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE yield_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_yield_predictions" ON yield_predictions FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_yield_predictions_user ON yield_predictions(user_id, created_at DESC);
