-- Migration: admin flag on profiles for platform-wide entitlement override
--
-- Adds an is_admin boolean to profiles. When true, the entitlement resolver
-- in lib/stripe/access.js grants full agency-tier access regardless of
-- subscription state. Used for founder access, beta testers, and internal
-- QA without creating synthetic subscription rows.
--
-- Idempotent: re-running is safe.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Explicit index since admin checks will hit every entitlement resolution
-- on every authenticated request. Small table, but worth making the
-- lookup trivial.
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON profiles (is_admin)
  WHERE is_admin = TRUE;

COMMENT ON COLUMN profiles.is_admin IS
  'When true, grants full agency-tier platform access regardless of subscription. Bypasses Stripe entitlement entirely. Set manually via SQL for trusted users only.';

-- Security: prevent authenticated users from promoting themselves to admin.
-- The profiles RLS policy allows users to UPDATE their own row, so without
-- this trigger a user could do:
--   supabase.from('profiles').update({ is_admin: true }).eq('id', user.id)
-- The trigger silently resets is_admin to its previous value for any
-- non-service-role caller. Service role and postgres bypass this because
-- they are the only contexts used for intentional admin grants (SQL editor,
-- service-role scripts).
CREATE OR REPLACE FUNCTION prevent_self_admin_promotion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF current_setting('role') NOT IN ('service_role', 'postgres', 'supabase_admin') THEN
      NEW.is_admin := OLD.is_admin;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS guard_admin_flag ON profiles;
CREATE TRIGGER guard_admin_flag
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_admin_promotion();
