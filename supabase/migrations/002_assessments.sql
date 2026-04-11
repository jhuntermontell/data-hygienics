-- Migration: assessments and responses
-- Idempotent: safe to run repeatedly. Schemas mirror what the application
-- code reads/writes (see app/tools/cyber-audit/assessment/page.js,
-- app/tools/cyber-audit/results/page.js, lib/cyber-audit/scoring.js).

CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'in_progress',
  assessment_type TEXT DEFAULT 'comprehensive',
  industry TEXT,
  employee_count TEXT,
  has_insurance TEXT,
  score INTEGER,
  section_scores JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_completed
  ON assessments (user_id, completed_at DESC);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own assessments' AND tablename = 'assessments') THEN
    CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own assessments' AND tablename = 'assessments') THEN
    CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own assessments' AND tablename = 'assessments') THEN
    CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own assessments' AND tablename = 'assessments') THEN
    CREATE POLICY "Users can delete own assessments" ON assessments FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Per-question response rows for an assessment
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  question_key TEXT NOT NULL,
  section TEXT,
  answer JSONB,
  answered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (assessment_id, question_key)
);

CREATE INDEX IF NOT EXISTS idx_responses_assessment ON responses (assessment_id);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own responses' AND tablename = 'responses') THEN
    CREATE POLICY "Users can view own responses" ON responses FOR SELECT
      USING (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own responses' AND tablename = 'responses') THEN
    CREATE POLICY "Users can insert own responses" ON responses FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own responses' AND tablename = 'responses') THEN
    -- WITH CHECK matches USING: the post-update row must still reference an
    -- assessment owned by the current user. This prevents reparenting a
    -- response row to a different (foreign) assessment via UPDATE.
    CREATE POLICY "Users can update own responses" ON responses FOR UPDATE
      USING (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()))
      WITH CHECK (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own responses' AND tablename = 'responses') THEN
    CREATE POLICY "Users can delete own responses" ON responses FOR DELETE
      USING (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()));
  END IF;
END $$;
