-- AgriSmart Enterprise Platform - Marketplace SQL Schema & Seed Data for Supabase
-- Database: Supabase PostgreSQL

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Seeds', 'Tools', 'Fertilizers', 'Produce')) NOT NULL,
    seller_name VARCHAR(100) NOT NULL,
    image_url TEXT NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    unit VARCHAR(50) DEFAULT 'unit' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);

-- --- SEED DATA (Somali Context: Mogadishu, Lower Shabelle, Afgooye, Sorghum/Sesame) ---

TRUNCATE TABLE public.products CASCADE;

INSERT INTO public.products (name, description, price, category, seller_name, image_url, stock, unit) VALUES
(
  'Drought-Resistant Sorghum Seeds 10kg',
  'Certified high-yield Sorghum seeds tailored for arid Lower Shabelle soil conditions.',
  18.50,
  'Seeds',
  'Lower Shabelle Seed Co.',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
  150,
  'bag'
),
(
  'Drip Irrigation Kit (1/2 Acre)',
  'Complete drip line system with emitters, mainlines, and pressure regulators for water efficiency.',
  120.00,
  'Tools',
  'Mogadishu AgroTech',
  'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
  25,
  'kit'
),
(
  'Organic Neem Pesticide 5L',
  'Natural bio-pesticide highly effective against Fall Armyworm and crop aphids.',
  34.00,
  'Fertilizers',
  'Horn BioProtec Mogadishu',
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
  80,
  'bottle'
),
(
  'Grade A White Sesame Yield 50kg',
  'Cleaned, premium export-grade white sesame harvested from Afgooye farms.',
  52.00,
  'Produce',
  'Afgooye Farmers Cooperative',
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
  500,
  'bag'
),
(
  'NPK 15-15-15 Compound Fertilizer 50kg',
  'Balanced soil fertilizer providing essential nitrogen, phosphorus, and potassium for optimal growth.',
  45.00,
  'Fertilizers',
  'Somali Fertilizer Supply',
  'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
  200,
  'bag'
),
(
  'Solar Water Pump System 1.5HP',
  'Submersible solar-powered irrigation pump designed for off-grid Somali farmland.',
  340.00,
  'Tools',
  'Sunshine Energy Mogadishu',
  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
  12,
  'set'
),
(
  'Hybrid Yellow Maize Seeds 10kg',
  'Fast-maturing maize seed variety resistant to foliar diseases in Middle Juba.',
  22.00,
  'Seeds',
  'Juba Valley Seeds',
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  90,
  'bag'
),
(
  'Fresh Red Onion Bulk (100kg)',
  'Freshly harvested red onions from Shabelle riverbanks, cured for long storage life.',
  65.00,
  'Produce',
  'Shabelle River Produce',
  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=600&q=80',
  40,
  'sack'
);
