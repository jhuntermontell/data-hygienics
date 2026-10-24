-- Migration: saved Paths (app/path).
--
-- The Path works without an account: answers and progress live in the
-- visitor's browser (lib/path/storage.js). Signing in saves them here so they
-- follow the person across devices. One row per user per audience ("home" or
-- "business"); a household owner who also runs a business keeps both.
--
-- `answers` holds the quiz answers (priorities or industry, knowledge level,
-- presentation style, time budget, environment). `progress` maps step ids to
-- { status: "done" | "skipped", at: ISO date }. Both are plain JSON so new
-- quiz questions and steps need no migration. Never store free text here.
--
-- Idempotent: re-running is safe.

CREATE TABLE IF NOT EXISTS path_profiles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audience TEXT NOT NULL CHECK (audience IN ('home', 'business')),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, audience)
);

ALTER TABLE path_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own path" ON path_profiles;
CREATE POLICY "Users can view own path" ON path_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own path" ON path_profiles;
CREATE POLICY "Users can insert own path" ON path_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own path" ON path_profiles;
CREATE POLICY "Users can update own path" ON path_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own path" ON path_profiles;
CREATE POLICY "Users can delete own path" ON path_profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION touch_path_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS path_profiles_touch ON path_profiles;
CREATE TRIGGER path_profiles_touch
  BEFORE UPDATE ON path_profiles
  FOR EACH ROW
  EXECUTE FUNCTION touch_path_profiles_updated_at();
