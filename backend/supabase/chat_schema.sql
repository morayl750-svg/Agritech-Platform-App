-- AgriSmart Enterprise Platform - Chat Messages & Sessions SQL Schema for Supabase
-- Database: Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    user_id VARCHAR(100) DEFAULT 'admin_user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'model', 'ai')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configure Row Level Security (RLS) & Public Policies
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public insert chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow public read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert chat_messages" ON public.chat_messages;

CREATE POLICY "Allow public read chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
