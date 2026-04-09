-- Migration: promo codes for beta tester access
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'professional',
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read promo codes to validate them" ON promo_codes;
CREATE POLICY "Anyone can read promo codes to validate them"
ON promo_codes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Only service role can modify promo codes" ON promo_codes;
CREATE POLICY "Only service role can modify promo codes"
ON promo_codes FOR ALL USING (false);

CREATE TABLE IF NOT EXISTS promo_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  promo_code_id UUID REFERENCES promo_codes(id) NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, promo_code_id)
);

ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see their own redemptions" ON promo_redemptions;
CREATE POLICY "Users can see their own redemptions"
ON promo_redemptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can redeem codes" ON promo_redemptions;
CREATE POLICY "Users can redeem codes"
ON promo_redemptions FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Beta tester seed code
INSERT INTO promo_codes (code, plan, max_uses, expires_at)
VALUES ('BETAPIONEER', 'professional', 50, '2026-07-01T00:00:00Z')
ON CONFLICT (code) DO NOTHING;
