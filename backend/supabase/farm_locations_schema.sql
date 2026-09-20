-- ============================================================
-- AgriSmart: Farm Locations Schema (Feature 03 - Farm Map)
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS farm_locations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT NOT NULL DEFAULT 'default-user',
  name             TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('crop_plot', 'livestock_station', 'water_source', 'storage')),
  latitude         DECIMAL(10, 7) NOT NULL,
  longitude        DECIMAL(10, 7) NOT NULL,
  region           TEXT NOT NULL DEFAULT 'Lower Shabelle',
  description      TEXT,
  area_hectares    DECIMAL(8, 2),
  crop_type        TEXT,
  livestock_count  INTEGER,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE farm_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_farm_locations" ON farm_locations FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_farm_locations_user ON farm_locations(user_id);

-- Sample data
INSERT INTO farm_locations (name, type, latitude, longitude, region, description, area_hectares, crop_type) VALUES
  ('Beerta Koonfur', 'crop_plot',         1.9500, 44.5000, 'Lower Shabelle', 'Beeraha Sorghum-ka', 5.5, 'Sorghum'),
  ('Xoolaha Dhexe',  'livestock_station', 2.0500, 44.5500, 'Lower Shabelle', 'Xarunta Geeliiga',   NULL, NULL),
  ('Beerta Webiga',  'crop_plot',         2.1000, 44.4500, 'Lower Shabelle', 'Beeraha Banaanadaha', 3.2, 'Bananas'),
  ('Kaydka Koonfur', 'storage',           1.9800, 44.4800, 'Lower Shabelle', 'Kaydka Dhaqaanka',   NULL, NULL)
ON CONFLICT DO NOTHING;
