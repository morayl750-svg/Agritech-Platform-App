-- ============================================================
-- AgriSmart: Market Prices Schema (Feature 05)
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS market_prices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity     TEXT NOT NULL,
  commodity_so  TEXT NOT NULL,
  price_usd     DECIMAL(10, 4) NOT NULL,
  unit          TEXT NOT NULL DEFAULT 'kg',
  market        TEXT NOT NULL DEFAULT 'Bakaaraha',
  region        TEXT NOT NULL DEFAULT 'Mogadishu',
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  source        TEXT DEFAULT 'manual'
);

CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON market_prices(commodity, recorded_at DESC);
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_market_prices" ON market_prices FOR ALL USING (true) WITH CHECK (true);

-- Seed: 30 days of sample price history for 4 commodities
INSERT INTO market_prices (commodity, commodity_so, price_usd, unit, market, region, recorded_at)
SELECT
  t.commodity, t.commodity_so,
  GREATEST(0.05, t.base_price + (RANDOM() * t.variance * 2 - t.variance)),
  t.unit, t.market, t.region,
  NOW() - (gs.day || ' days')::INTERVAL
FROM (
  VALUES
    ('Sorghum', 'Masago',  0.45, 0.08, 'kg', 'Bakaaraha',  'Mogadishu'),
    ('Maize',   'Galley',  0.38, 0.06, 'kg', 'Bakaaraha',  'Mogadishu'),
    ('Sesame',  'Simsim',  1.20, 0.15, 'kg', 'Bakaaraha',  'Mogadishu'),
    ('Bananas', 'Muus',    0.25, 0.04, 'kg', 'Xamar Weyne','Mogadishu')
) AS t(commodity, commodity_so, base_price, variance, unit, market, region),
generate_series(1, 30) AS gs(day)
ON CONFLICT DO NOTHING;
