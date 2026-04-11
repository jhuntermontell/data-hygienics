-- Migration: subscriptions and one-time purchases (Stripe state)
-- Idempotent. Schemas mirror app/api/stripe/webhook/route.js and
-- lib/stripe/subscription.js.

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'inactive',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub
  ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON subscriptions (stripe_customer_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscription' AND tablename = 'subscriptions') THEN
    CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  -- Inserts and updates are performed by the Stripe webhook via the service
  -- role key, which bypasses RLS. No client-side write policy is exposed.
END $$;

CREATE TABLE IF NOT EXISTS one_time_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_price_id TEXT,
  purchase_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user
  ON one_time_purchases (user_id);

ALTER TABLE one_time_purchases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own purchases' AND tablename = 'one_time_purchases') THEN
    CREATE POLICY "Users can view own purchases" ON one_time_purchases FOR SELECT USING (auth.uid() = user_id);
  END IF;
  -- Writes are service-role only, performed by the Stripe webhook.
END $$;

-- Idempotent constraint additions for databases where the table predates
-- these constraints. Used by the webhook upsert (Task 3) to make replayed
-- Stripe events safe to apply.
DO $$ BEGIN
  ALTER TABLE subscriptions
    ADD CONSTRAINT unique_stripe_subscription UNIQUE (stripe_subscription_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE one_time_purchases
    ADD CONSTRAINT unique_payment_intent UNIQUE (stripe_payment_intent_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Restrict the plan column to known values. Wrapped in a DO block so
-- re-runs do not error if the constraint already exists.
DO $$ BEGIN
  ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_plan_check
    CHECK (plan IN ('free', 'starter', 'professional', 'msp'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
