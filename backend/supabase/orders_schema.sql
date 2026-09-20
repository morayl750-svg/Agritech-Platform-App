-- ============================================================
-- AgriSmart: Orders & Mobile Payments Schema (Feature 09)
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('evc_plus', 'zaad', 'amiin', 'cash')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_reference TEXT UNIQUE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_orders') THEN
    CREATE POLICY "allow_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Sample completed orders for testing analytics
INSERT INTO orders (product_name, quantity, unit_price, total_amount, buyer_name, buyer_phone, payment_method, payment_status, payment_reference, paid_at)
VALUES
('Mesego (Sorghum) 50kg', 2, 22.50, 45.00, 'Axmed Cali', '+252615551122', 'evc_plus', 'completed', 'AGS-EVC-101', now() - interval '2 days'),
('Moos Macaan (Bananas)', 10, 3.00, 30.00, 'Faadumo Nuur', '+252615553344', 'zaad', 'completed', 'AGS-ZAD-102', now() - interval '1 day'),
('Galley Cusub (Maize)', 5, 8.00, 40.00, 'Xasan Shire', '+252615555566', 'evc_plus', 'completed', 'AGS-EVC-103', now() - interval '3 hours');
