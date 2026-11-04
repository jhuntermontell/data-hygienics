-- Migration: home map results (app/map/home).
--
-- Counts per outcome, an item count and a check date. Never the map itself,
-- never free text.
--
-- The home map lives in the member's browser, in a file they save and on
-- paper (lib/map/storage.js; the custody rule in
-- design/strategy/five-year-value-roadmap.md). For a signed-in member, the
-- page saves only `resultFor()` from lib/map.js here, so progress survives a
-- new phone without the inventory leaving the house. One row per user per
-- audience ("home" now, "business" later).
--
-- `counts` maps outcome keys (lib/path.js OUTCOMES) to
-- { weak, watch, ok, handled } integers. No device names, brands, models,
-- answers or labels belong in this table. The page keeps working if this
-- table is missing: the save is best effort (lib/map/sync.js).
--
-- Idempotent: re-running is safe.

CREATE TABLE IF NOT EXISTS home_map_results (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audience TEXT NOT NULL CHECK (audience IN ('home', 'business')),
  counts JSONB NOT NULL DEFAULT '{}'::jsonb,
  items INTEGER NOT NULL DEFAULT 0,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, audience)
);

ALTER TABLE home_map_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own home map result" ON home_map_results;
CREATE POLICY "Users can view own home map result" ON home_map_results
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own home map result" ON home_map_results;
CREATE POLICY "Users can insert own home map result" ON home_map_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own home map result" ON home_map_results;
CREATE POLICY "Users can update own home map result" ON home_map_results
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own home map result" ON home_map_results;
CREATE POLICY "Users can delete own home map result" ON home_map_results
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION touch_home_map_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS home_map_results_touch ON home_map_results;
CREATE TRIGGER home_map_results_touch
  BEFORE UPDATE ON home_map_results
  FOR EACH ROW
  EXECUTE FUNCTION touch_home_map_results_updated_at();
