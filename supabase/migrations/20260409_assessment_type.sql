-- Migration: add assessment_type to distinguish Quick Assessment from Comprehensive
-- Run this in the Supabase SQL editor before deploying the quick assessment flow.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS assessment_type TEXT DEFAULT 'comprehensive';

CREATE INDEX IF NOT EXISTS idx_assessments_user_completed
  ON assessments (user_id, completed_at DESC);

UPDATE assessments
  SET assessment_type = 'comprehensive'
  WHERE assessment_type IS NULL;
