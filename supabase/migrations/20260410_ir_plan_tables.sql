-- IR Plan tables migration
-- Run in Supabase SQL Editor if tables do not already exist.
-- This file is idempotent: IF NOT EXISTS guards on tables/indexes and
-- DO $$ ... EXCEPTION WHEN duplicate_object guards on policies make it
-- safe to re-run against an environment that already has these tables.

-- Incident Response Plans
CREATE TABLE IF NOT EXISTS ir_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  employee_count TEXT,
  incident_commander JSONB NOT NULL DEFAULT '{}',
  it_contact JSONB NOT NULL DEFAULT '{}',
  communications_lead JSONB NOT NULL DEFAULT '{}',
  legal_counsel JSONB DEFAULT '{}',
  insurance_info JSONB DEFAULT '{}',
  additional_contacts JSONB DEFAULT '[]',
  critical_systems JSONB DEFAULT '[]',
  recovery_priorities JSONB DEFAULT '[]',
  has_msp BOOLEAN DEFAULT false,
  msp_info JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_tested_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

ALTER TABLE ir_plans ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "ir_plans_select" ON ir_plans FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_plans_insert" ON ir_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_plans_update" ON ir_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_plans_delete" ON ir_plans FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Incident logs
CREATE TABLE IF NOT EXISTS ir_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES ir_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT DEFAULT 'unknown',
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  summary TEXT,
  action_log JSONB DEFAULT '[]',
  lessons_learned TEXT,
  plan_updates_needed TEXT,
  workflow_state JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ir_incidents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "ir_incidents_select" ON ir_incidents FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_incidents_insert" ON ir_incidents FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_incidents_update" ON ir_incidents FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_ir_incidents_user_status ON ir_incidents (user_id, status);
CREATE INDEX IF NOT EXISTS idx_ir_incidents_plan ON ir_incidents (plan_id, created_at DESC);

-- Tabletop exercises
CREATE TABLE IF NOT EXISTS ir_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES ir_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_type TEXT NOT NULL,
  participants JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  decisions JSONB DEFAULT '[]',
  score INTEGER,
  findings JSONB DEFAULT '[]',
  summary_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ir_exercises ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "ir_exercises_select" ON ir_exercises FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_exercises_insert" ON ir_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "ir_exercises_update" ON ir_exercises FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_ir_exercises_plan ON ir_exercises (plan_id, created_at DESC);

-- Column additions for databases where these tables already exist from
-- earlier manual SQL that predates this migration. Safe to re-run.
ALTER TABLE ir_incidents ADD COLUMN IF NOT EXISTS workflow_state JSONB DEFAULT '{}';

-- Enforce that ir_incidents.plan_id and ir_exercises.plan_id always reference
-- a plan owned by the same user_id. RLS prevents reading other users' plans
-- but does not prevent inserting a row with a foreign plan_id under your own
-- user_id, so we add a trigger that checks ownership at write time. This is
-- defense in depth and protects writes coming from any path (server route,
-- client direct, future migrations).
CREATE OR REPLACE FUNCTION check_ir_plan_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ir_plans WHERE id = NEW.plan_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'plan_id does not belong to user_id';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ir_incidents_plan_ownership ON ir_incidents;
CREATE TRIGGER trg_ir_incidents_plan_ownership
  BEFORE INSERT OR UPDATE ON ir_incidents
  FOR EACH ROW EXECUTE FUNCTION check_ir_plan_ownership();

DROP TRIGGER IF EXISTS trg_ir_exercises_plan_ownership ON ir_exercises;
CREATE TRIGGER trg_ir_exercises_plan_ownership
  BEFORE INSERT OR UPDATE ON ir_exercises
  FOR EACH ROW EXECUTE FUNCTION check_ir_plan_ownership();
