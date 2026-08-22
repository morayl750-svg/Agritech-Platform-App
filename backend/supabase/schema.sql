-- AgriSmart Enterprise Platform - PostgreSQL Schema & Seed Data for Supabase
-- Database: Supabase PostgreSQL (Somali Agricultural Intelligence Context)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Dashboard Metrics Table
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    trend_value VARCHAR(20) NOT NULL,
    trend_label VARCHAR(10) CHECK (trend_label IN ('up', 'down')) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AI Insights Table
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    region VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'Sparkles' NOT NULL,
    icon_color VARCHAR(50) DEFAULT 'text-emerald-500' NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Weather Data Table
CREATE TABLE IF NOT EXISTS public.weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(100) NOT NULL,
    temperature NUMERIC(4, 1) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    humidity VARCHAR(20) NOT NULL,
    wind_speed VARCHAR(20) NOT NULL,
    rain_mm VARCHAR(20) NOT NULL,
    forecast_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies (Enable Public Read for Demo)
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read dashboard_metrics" ON public.dashboard_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read ai_insights" ON public.ai_insights FOR SELECT USING (true);
CREATE POLICY "Allow public read weather_data" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Allow public read chat_sessions" ON public.chat_sessions FOR SELECT USING (true);

-- --- SEED DATA (Somali Context: Mogadishu, USD, Lower Shabelle, Sorghum/Sesame) ---

-- Clean existing seed data
TRUNCATE TABLE public.dashboard_metrics, public.ai_insights, public.weather_data, public.chat_sessions CASCADE;

-- Insert Dashboard Metrics
INSERT INTO public.dashboard_metrics (title, value, trend_value, trend_label, icon_name) VALUES
('Total Yield (Q3)', '142 MT', '+8.4%', 'up', 'BarChart3'),
('Active Plots', '23', '+2', 'up', 'MapPin'),
('Marketplace Sales', 'USD $1,250', '+12.1%', 'up', 'TrendingUp'),
('Pest Risk Index', 'Medium', '+0.3', 'down', 'AlertTriangle');

-- Insert AI Field Insights
INSERT INTO public.ai_insights (type, title, description, region, icon_name, icon_color) VALUES
('sowing-window', 'Optimal sowing window: 3–7 Aug', 'Lower Shabelle region — forecasted rainfall 18 mm, soil moisture 62%. Sorghum and sesame advised.', 'Lower Shabelle', 'CloudSun', 'text-sky-500'),
('armyworm-risk', 'Fall Armyworm risk elevated — Middle Juba', '3 plots flagged. Scout Plot S-07 and S-12 immediately. Neem-based spray recommended.', 'Middle Juba', 'AlertTriangle', 'text-amber-500'),
('harvest-complete', 'Harvest complete — Plot H-04 Sorghum', 'Yield: 4.2 MT. Quality grade A. Ready for Marketplace listing.', 'Lower Shabelle', 'CheckCircle2', 'text-emerald-500'),
('sesame-price', 'Sesame price up 11% on Mogadishu exchange', 'Current: USD $520/quintal. Consider listing remaining stock within 72 h.', 'Mogadishu', 'TrendingUp', 'text-emerald-500');

-- Insert Weather Snapshot & 7-Day Forecast
INSERT INTO public.weather_data (location, temperature, condition, humidity, wind_speed, rain_mm, forecast_json) VALUES
('Mogadishu, Somalia', 29.0, 'Partly Cloudy', '58%', '14 km/h', '6 mm', '[
  {"day": "Thu", "tempCelsius": 28, "rainHeight": 20},
  {"day": "Fri", "tempCelsius": 30, "rainHeight": 32},
  {"day": "Sat", "tempCelsius": 27, "rainHeight": 14},
  {"day": "Sun", "tempCelsius": 31, "rainHeight": 40},
  {"day": "Mon", "tempCelsius": 29, "rainHeight": 28},
  {"day": "Tue", "tempCelsius": 27, "rainHeight": 18},
  {"day": "Wed", "tempCelsius": 30, "rainHeight": 36}
]'::jsonb);

-- Insert Chat History Sessions
INSERT INTO public.chat_sessions (title, created_at) VALUES
('Sorghum Rust Diagnosis', NOW() - INTERVAL '1 hour'),
('Tomato Irrigation Schedule', NOW() - INTERVAL '1 day'),
('Market Price for Maize', NOW() - INTERVAL '3 days'),
('Weather Impact on Sesame', NOW() - INTERVAL '5 days'),
('Lower Shabelle Soil Moisture', NOW() - INTERVAL '7 days');
