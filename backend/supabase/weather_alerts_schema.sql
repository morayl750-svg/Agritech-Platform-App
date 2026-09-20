-- ============================================================
-- AgriSmart: Weather Alerts Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS weather_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL DEFAULT 'default-user',
  region      TEXT NOT NULL,
  phone_number TEXT,
  alert_types TEXT[] NOT NULL DEFAULT ARRAY['rain','drought'],
  threshold_mm DECIMAL(6,2) NOT NULL DEFAULT 20.0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  last_alerted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_weather_alerts" ON weather_alerts
  FOR ALL USING (true) WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_weather_alerts_user ON weather_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_region ON weather_alerts(region);

-- Sample data (optional — waxaad saari kartaa)
INSERT INTO weather_alerts (region, phone_number, alert_types, threshold_mm, is_active)
VALUES
  ('Lower Shabelle', '+252615000001', ARRAY['rain','flood'], 25.0, true),
  ('Mogadishu',      '+252615000002', ARRAY['rain','storm'], 15.0, true),
  ('Bay & Bakool',   NULL,            ARRAY['drought'],      10.0, false)
ON CONFLICT DO NOTHING;
