-- AgriSmart Enterprise Platform - Livestock & Crops Database Schema & Seed Data
-- Database: Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Livestock Table
CREATE TABLE IF NOT EXISTS public.livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_type VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 0),
    health_status VARCHAR(50) NOT NULL CHECK (health_status IN ('Healthy', 'Sick', 'Recovering')),
    last_vaccination DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crops Table
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    plot_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Planted', 'Growing', 'Ready', 'Harvested')),
    planted_date DATE NOT NULL,
    expected_yield VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all livestock" ON public.livestock;
DROP POLICY IF EXISTS "Allow all crops" ON public.crops;

CREATE POLICY "Allow all livestock" ON public.livestock FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all crops" ON public.crops FOR ALL USING (true) WITH CHECK (true);

-- 4. Seed Data for Livestock
INSERT INTO public.livestock (animal_type, count, health_status, last_vaccination, notes) VALUES
('Camel', 45, 'Healthy', '2026-05-10', 'Lower Shabelle milk herd grazing near Afgooye riverbank'),
('Goat', 120, 'Healthy', '2026-06-01', 'Somali goat breed raised for dairy & local meat supply'),
('Cattle', 30, 'Recovering', '2026-07-15', 'Recovering from seasonal fever; under supplement diet'),
('Sheep', 85, 'Healthy', '2026-05-20', 'Blackhead Somali sheep breed in East Pasture Plot 2'),
('Goat', 12, 'Sick', '2026-07-28', 'Quarantined in North Barn for respiratory treatment');

-- 5. Seed Data for Crops
INSERT INTO public.crops (crop_name, plot_number, status, planted_date, expected_yield) VALUES
('Drought-Resistant Sorghum', 'Plot H-04', 'Growing', '2026-05-12', '12 Sacks (1,200 kg)'),
('Export White Sesame (Xabxab)', 'Plot A-12', 'Ready', '2026-04-18', '8 Sacks (800 kg)'),
('Hybrid White Maize', 'Plot B-02', 'Harvested', '2026-03-10', '25 Sacks (2,500 kg)'),
('Roma Tomatoes', 'Plot C-01', 'Planted', '2026-07-02', '15 Crates (375 kg)'),
('Cavendish Bananas', 'Plot D-05', 'Growing', '2026-02-15', '40 Crates (1,200 kg)');
