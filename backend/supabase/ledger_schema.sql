-- AgriSmart Enterprise Platform - Financial Ledger Database Schema & Seed Data
-- Database: Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) Policy
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all transactions" ON public.transactions;

CREATE POLICY "Allow all transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- 3. Somali Farm Context Seed Data
INSERT INTO public.transactions (type, amount, description, category, date) VALUES
('income', 1050.00, 'Sold 100kg Export White Sesame (Afgooye coop)', 'Produce Sales', '2026-08-01'),
('expense', 245.00, 'Bought Drip Irrigation Kit (1 Acre Complete)', 'Equipment', '2026-08-03'),
('income', 640.00, 'Marketplace Sorghum Bulk Grain Sale', 'Produce Sales', '2026-07-25'),
('expense', 136.00, 'Neem Bio-Pesticide & Organic Cow Manure Compost', 'Fertilizers & Bio', '2026-07-28'),
('income', 380.00, 'Camel Dairy Milk Wholesale Batch', 'Livestock Sales', '2026-07-20'),
('expense', 180.00, 'Tractor Field Tilling & Fuel Rental', 'Farm Operations', '2026-07-15'),
('income', 450.00, 'Livestock Goat Herd Sale (5 Head)', 'Livestock Sales', '2026-07-10'),
('expense', 120.00, 'Farm Seasonal Labor Wages (Lower Shabelle)', 'Labor', '2026-07-05');
