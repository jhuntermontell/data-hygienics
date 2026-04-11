-- Migration: generated_policies
-- Idempotent. Schema mirrors app/tools/policies/[slug]/page.js where the
-- wizard upserts on (user_id, policy_type).

CREATE TABLE IF NOT EXISTS generated_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_type TEXT NOT NULL,
  company_name TEXT,
  policy_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, policy_type)
);

CREATE INDEX IF NOT EXISTS idx_generated_policies_user
  ON generated_policies (user_id);

ALTER TABLE generated_policies ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own generated policies' AND tablename = 'generated_policies') THEN
    CREATE POLICY "Users can view own generated policies" ON generated_policies FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own generated policies' AND tablename = 'generated_policies') THEN
    CREATE POLICY "Users can insert own generated policies" ON generated_policies FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own generated policies' AND tablename = 'generated_policies') THEN
    CREATE POLICY "Users can update own generated policies" ON generated_policies FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own generated policies' AND tablename = 'generated_policies') THEN
    CREATE POLICY "Users can delete own generated policies" ON generated_policies FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
