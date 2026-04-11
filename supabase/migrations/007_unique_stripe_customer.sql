-- Partial unique index on stripe_customer_id.
--
-- Why partial: free users have no Stripe customer (NULL), so a plain UNIQUE
-- constraint would only allow ONE NULL row. The partial index applies the
-- unique constraint only to non-null values, which is exactly what we want.
--
-- This protects the webhook ownership logic, which uses .maybeSingle() on
-- queries keyed by stripe_customer_id and would error or return surprising
-- results if two rows shared a customer.
--
-- IMPORTANT — before applying to any environment with existing data:
--
--   SELECT stripe_customer_id, COUNT(*)
--   FROM subscriptions
--   WHERE stripe_customer_id IS NOT NULL
--   GROUP BY stripe_customer_id
--   HAVING COUNT(*) > 1;
--
-- If that query returns rows, resolve them manually (typically: keep the
-- most recent row by updated_at, NULL out or delete the older ones) BEFORE
-- running this migration. The CREATE INDEX statement below will fail if
-- duplicates exist.

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id_unique
  ON subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
