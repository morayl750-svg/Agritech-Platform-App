-- ============================================================
-- AgriSmart: Direct Messages & Conversations Schema (Feature 07)
-- Run in Supabase SQL Editor
-- ============================================================

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  buyer_name TEXT NOT NULL DEFAULT 'Martida',
  seller_name TEXT NOT NULL DEFAULT 'Beeraleyga',
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Direct messages table
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer', 'seller')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Realtime replication enable
ALTER TABLE direct_messages REPLICA IDENTITY FULL;

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_conversations') THEN
    CREATE POLICY "allow_all_conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_direct_messages') THEN
    CREATE POLICY "allow_all_direct_messages" ON direct_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
