-- Migration: pricing restructure (Documentation Pack / Ongoing Protection / Agency Plan)
--
-- Adds two new canonical plan values to the subscriptions.plan CHECK
-- constraint and a quantity column for per-seat Agency billing. Preserves
-- the legacy starter / professional / msp values so grandfathered
-- subscribers remain valid.
--
-- Idempotent: re-running is safe.

-- ----------------------------------------------------------------------------
-- 1. Replace the plan CHECK constraint with one that allows the new catalog.
--    Old: ('free', 'starter', 'professional', 'msp')
--    New: old values + 'protection' + 'agency'
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_plan_check
    CHECK (plan IN ('free', 'starter', 'professional', 'msp', 'protection', 'agency'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 2. Add a quantity column for per-seat Agency Plan billing. Legacy MSP
--    subscribers hardcode their 10-client cap in access.js; the Agency Plan
--    derives its cap from subscription.quantity so the webhook must persist
--    it whenever a subscription is synced from Stripe.
--
--    Default 1 matches Stripe's convention for non-per-seat subscriptions,
--    so filling this column for existing rows does not change their
--    entitlement semantics.
-- ----------------------------------------------------------------------------
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- ----------------------------------------------------------------------------
-- 3. Expand the one_time_purchases.purchase_type implicit vocabulary.
--    purchase_type is a free-text column (no CHECK constraint) so no DDL
--    change is required to accept the new 'docs_pack' value. This comment
--    records the vocabulary expansion for grep-ability:
--
--      assessment_bundle  (legacy, grandfathered)
--      policy_bundle      (legacy, grandfathered)
--      individual_policy  (legacy, grandfathered)
--      docs_pack          (NEW — Documentation Pack $299)
-- ----------------------------------------------------------------------------
