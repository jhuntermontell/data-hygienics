-- Replaces existing UPDATE policies with hardened versions that include
-- WITH CHECK clauses. The earlier migrations (001, 002, 004) only run their
-- CREATE POLICY statements when the policy does not yet exist, so any
-- environment that received the original (weaker) USING-only policies will
-- never see the WITH CHECK upgrade unless we explicitly drop and recreate.
--
-- DROP IF EXISTS + CREATE is safe to run on:
--   1. Fresh databases where the hardened policies were created via 001-004
--      (the DROP removes them, the CREATE puts them back identical).
--   2. Older databases where the original USING-only policies were applied
--      (the DROP removes the weak version, the CREATE installs the hardened
--      version).
--
-- Policy names below match the EXACT names used in 001_profiles.sql,
-- 002_assessments.sql, and 004_generated_policies.sql.

-- profiles ------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- assessments ---------------------------------------------------------------
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- generated_policies --------------------------------------------------------
-- Note: the policy is "Users can update own generated policies" (with the
-- word "generated"), not "Users can update own policies".
DROP POLICY IF EXISTS "Users can update own generated policies" ON generated_policies;
CREATE POLICY "Users can update own generated policies" ON generated_policies
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- responses -----------------------------------------------------------------
-- The responses table has no user_id column; ownership flows through
-- assessment_id → assessments.user_id. The hardened policy uses an EXISTS
-- subquery in BOTH USING and WITH CHECK so a row cannot be re-parented to
-- a foreign assessment via UPDATE.
DROP POLICY IF EXISTS "Users can update own responses" ON responses;
CREATE POLICY "Users can update own responses" ON responses
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_id AND a.user_id = auth.uid()));
