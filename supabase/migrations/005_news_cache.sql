-- Migration: news_cache (industry threat news, refreshed by cron)
-- Idempotent. Schema mirrors app/api/news/refresh/route.js.

CREATE TABLE IF NOT EXISTS news_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_cache_industry
  ON news_cache (industry, created_at DESC);

ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- News is shown to authenticated paid users on the dashboard. Reads are
  -- allowed for any authenticated user; the dashboard component decides
  -- whether to display them based on subscription tier.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read news cache' AND tablename = 'news_cache') THEN
    CREATE POLICY "Authenticated users can read news cache" ON news_cache FOR SELECT TO authenticated USING (true);
  END IF;
  -- Writes are performed by the cron route via the service role key.
END $$;
