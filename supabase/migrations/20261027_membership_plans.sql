-- Migration: membership plans (Data Hygienics Membership, Home and Business)
--
-- Adds the two membership plan values to the subscriptions.plan CHECK
-- constraint. One membership, two doors: the door chosen at checkout is
-- stored as the plan value, so no new column is needed. Every earlier value
-- stays valid: 'protection' (retired from sale, still honored) and the
-- grandfathered 'starter', 'professional', 'msp' and 'agency'.
--
--   Old: ('free', 'starter', 'professional', 'msp', 'protection', 'agency')
--   New: old values + 'member_home' + 'member_business'
--
-- promo_codes.plan is free text, so promo codes for members need no DDL.
--
-- Idempotent: re-running is safe. The drop removes whichever version of the
-- constraint exists (003_subscriptions.sql or 20260411_pricing_restructure.sql)
-- and the add re-creates it with the full list.

DO $$ BEGIN
  ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_plan_check
    CHECK (plan IN (
      'free',
      'starter',
      'professional',
      'msp',
      'protection',
      'agency',
      'member_home',
      'member_business'
    ));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
