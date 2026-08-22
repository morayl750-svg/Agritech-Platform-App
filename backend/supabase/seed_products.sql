-- AgriSmart Enterprise Platform - 20 Product Seed Catalog for Supabase
-- Database: Supabase PostgreSQL
-- Context: Somalia Agriculture (Mogadishu, Lower Shabelle, Middle Juba, Afgooye, Hargeisa)

-- 1. Ensure Table Exists
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

-- 2. Configure Row Level Security (RLS) & Public Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);

-- 3. Clear Existing Records
TRUNCATE TABLE public.products CASCADE;

-- 4. Insert 20 Comprehensive Seed Products (5 Seeds, 5 Tools, 5 Fertilizers, 5 Produce)
INSERT INTO public.products (name, description, price, category, seller_name, stock, unit, image_url) VALUES

-- --- SEEDS (5) ---
(
  'Drought-Resistant Sorghum Seeds 10kg',
  'Certified high-yield Sorghum seeds tailored for arid Lower Shabelle soil conditions and erratic rainfall.',
  18.50,
  'Seeds',
  'Lower Shabelle Seed Co.',
  150,
  'bag',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
),
(
  'Hybrid White Maize Seeds 10kg',
  'Fast-maturing white maize seed variety highly resistant to foliar blight common in Middle Juba.',
  22.00,
  'Seeds',
  'Juba Valley Seeds',
  90,
  'bag',
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'
),
(
  'Premium White Sesame Seeds (Xabxab) 5kg',
  'Export-grade white sesame seeds treated for fast germination in riverine silt soils.',
  28.00,
  'Seeds',
  'Afgooye Seed Producers',
  120,
  'bag',
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
),
(
  'Heirloom Roma Tomato Seeds 500g',
  'High-germination tomato seed strain producing dense, transport-friendly tomatoes.',
  14.00,
  'Seeds',
  'Shabelle Horticulture Suppliers',
  200,
  'pack',
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
),
(
  'Fast-Yield Solo Papaya Seeds 250g',
  'Tropical papaya seed variety yielding sweet, large fruits suitable for local Banaadir markets.',
  19.50,
  'Seeds',
  'Banaadir Seed Lab',
  85,
  'pack',
  'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=600&q=80'
),

-- --- TOOLS (5) ---
(
  'Drip Irrigation Kit (1 Acre Complete)',
  'Complete drip line system with emitters, mainlines, and pressure regulators for maximum water efficiency.',
  245.00,
  'Tools',
  'Mogadishu AgroTech',
  25,
  'kit',
  'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80'
),
(
  'Heavy-Duty Farming Hoe (Yambo)',
  'Forged carbon steel hand hoe built for tilling hard clay and sandy-loam soils.',
  12.50,
  'Tools',
  'Hargeisa Steel & Tool Co.',
  300,
  'unit',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
),
(
  'Submersible Solar Water Pump 1.5HP',
  'High-efficiency solar-powered irrigation pump designed for off-grid Somali farmland boreholes.',
  380.00,
  'Tools',
  'Sunshine Energy Mogadishu',
  15,
  'set',
  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
),
(
  'Heavy-Duty Galvanized Wheelbarrow 100L',
  'Puncture-proof pneumatic tire wheelbarrow ideal for carrying harvest bags, compost, and soil.',
  48.00,
  'Tools',
  'Baidoa Farm Supplies',
  75,
  'unit',
  'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'
),
(
  'Ergonomic Stainless Steel Harvesting Sickle',
  'Curved serrated blade designed for rapid manual grain and grass forage harvesting.',
  8.50,
  'Tools',
  'Jowhar Agricultural Tools',
  180,
  'unit',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
),

-- --- FERTILIZERS (5) ---
(
  'Organic Cow Manure Compost 50kg',
  'Aged, nutrient-rich organic compost improving soil water retention and microbial health.',
  16.00,
  'Fertilizers',
  'Shabelle Bio-Organics',
  400,
  'bag',
  'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
),
(
  'Neem-Based Bio Pesticide 5L',
  'Natural organic bio-pesticide concentrate highly effective against Fall Armyworm and crop aphids.',
  34.00,
  'Fertilizers',
  'Horn BioProtec Mogadishu',
  80,
  'bottle',
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'
),
(
  'NPK 15-15-15 Compound Fertilizer 50kg',
  'Balanced soil fertilizer providing essential nitrogen, phosphorus, and potassium for vegetative growth.',
  45.00,
  'Fertilizers',
  'Somali Fertilizer Supply',
  200,
  'bag',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80'
),
(
  'Granular Urea Nitrogen Fertilizer 46% N 50kg',
  'High-nitrogen top-dressing fertilizer boosting leafy green growth in sorghum and maize crops.',
  42.00,
  'Fertilizers',
  'National Agro-Inputs Corp',
  250,
  'bag',
  'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80'
),
(
  'Concentrated Liquid Seaweed Extract 1L',
  'Foliar bio-stimulant rich in micro-nutrients enhancing crop drought tolerance and root depth.',
  24.00,
  'Fertilizers',
  'Kismayo Marine BioTech',
  110,
  'bottle',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
),

-- --- PRODUCE (5) ---
(
  'Export-Quality White Sesame Sack 100kg',
  'Triple-cleaned, premium export-grade white sesame harvested from Afgooye cooperative farms.',
  105.00,
  'Produce',
  'Afgooye Farmers Cooperative',
  180,
  'sack',
  'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=600&q=80'
),
(
  'Fresh Roma Tomatoes Crate 25kg',
  'Sun-ripened, firm red tomatoes harvested daily from Lower Shabelle riverbank farms.',
  18.00,
  'Produce',
  'Lower Shabelle River Farms',
  90,
  'crate',
  'https://images.unsplash.com/photo-1546470427-227c7369a649?auto=format&fit=crop&w=600&q=80'
),
(
  'Export Grade Somali Seedless Lemons 50kg',
  'Juicy, aromatic yellow lemons grown in Hiiraan citrus orchards for wholesale distribution.',
  32.00,
  'Produce',
  'Hiiraan Citrus Orchards',
  140,
  'sack',
  'https://images.unsplash.com/photo-1534531148831-7ab3f27f8a7e?auto=format&fit=crop&w=600&q=80'
),
(
  'Grade A Sorghum Harvest Grain 100kg',
  'Cleaned red sorghum grain ready for milling or animal feed processing.',
  58.00,
  'Produce',
  'Bay Region Grain Trade',
  320,
  'sack',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
),
(
  'Fresh Somali Bananas Crate 30kg',
  'Sweet, organically grown Cavendish bananas harvested from Lower Juba plantations.',
  22.50,
  'Produce',
  'Lower Juba Banana Estates',
  210,
  'crate',
  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'
);
