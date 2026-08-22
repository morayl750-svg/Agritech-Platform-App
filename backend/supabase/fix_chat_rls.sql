-- AgriSmart Enterprise Platform - Complete Chat Tables & RLS Fix Script
-- Copy & paste this ENTIRE block into Supabase SQL Editor and click RUN

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create chat_sessions table if missing
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    user_id VARCHAR(100) NULL DEFAULT 'admin_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add user_id column if chat_sessions already exists without it
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS user_id VARCHAR(100) NULL DEFAULT 'admin_user';

-- 2. Create chat_messages table if missing
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'model', 'ai')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies and grant full permissive access for demo
DROP POLICY IF EXISTS "Allow all chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow all chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public read chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public insert chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert chat_messages" ON public.chat_messages;

CREATE POLICY "Allow all chat_sessions" ON public.chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
