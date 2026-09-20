-- AgriSmart Enterprise Platform - Community Forum Database Schema & Seed Data
-- Database: Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Community Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Pest Control', 'Market Prices', 'Weather', 'Livestock', 'General')),
    upvotes INTEGER DEFAULT 0 CHECK (upvotes >= 0),
    replies_count INTEGER DEFAULT 0 CHECK (replies_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) Policy
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all posts" ON public.posts;

CREATE POLICY "Allow all posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);

-- 3. Somali Context Seed Data
INSERT INTO public.posts (title, content, author_name, category, upvotes, replies_count) VALUES
('How to treat early stages of camel pox (Bariise) in Shabelle riverlands?', 
 'Our herd near Afgooye is showing mild skin lesions. We quarantined the affected 4 camels. Looking for recommended veterinary sprays or traditional remedies.', 
 'Jama Ali', 'Livestock', 14, 6),

('Current sesame prices in Bakaara & Afgooye wholesale markets?', 
 'Sacks of grade A white sesame (Xabxab) are currently trading around $105/sack. Are prices expected to rise next week before export shipments leave Mogadishu port?', 
 'Amina Barre', 'Market Prices', 22, 11),

('Fall Armyworm outbreak alert in Middle Juba maize fields', 
 'Warning to all maize farmers in Juba valley: inspect leaf whorls for early caterpillar damage. Neem-based bio-pesticide spray is proving effective.', 
 'Dr. Osman Warsame', 'Pest Control', 31, 15),

('Best drip irrigation tubing for hard clay soil in Lower Shabelle?', 
 'We are converting 2 acres of sorghum to drip irrigation. Looking for recommendations on emitter spacing and filter maintenance against river silt.', 
 'Hassan Mire', 'General', 9, 4),

('Early Gu season rain forecasts & soil moisture prep', 
 'Meteorological updates indicate above-average Gu rainfall starting early April. Recommend completing field tilling and bund preparation this week.', 
 'Farhiya Nur', 'Weather', 18, 8);
