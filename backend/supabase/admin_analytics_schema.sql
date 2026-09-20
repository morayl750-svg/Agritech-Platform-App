-- ============================================================
-- AgriSmart: Admin Analytics Views (Feature 12)
-- Run in Supabase SQL Editor
-- ============================================================

-- View: Tirada alaabta ka gadan
CREATE OR REPLACE VIEW admin_top_products AS
SELECT
  p.id,
  p.name as product_name,
  COALESCE(p.category, 'Dalagyo') as category,
  p.price,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM marketplace_products p
LEFT JOIN orders o ON o.product_id = p.id AND o.payment_status = 'completed'
GROUP BY p.id, p.name, p.category, p.price
ORDER BY order_count DESC
LIMIT 10;

-- View: Dakhliga maalin walba
CREATE OR REPLACE VIEW admin_daily_revenue AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount) as revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE payment_status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
