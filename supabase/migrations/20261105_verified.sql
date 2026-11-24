-- Migration: Data Hygienics Verified, step 2 of the build order in
-- design/verified/baseline.md section 8: the tables of section 5 and the
-- public projection the verify page reads.
--
-- One Verified record per account in baseline 2027.1: the owner's account is
-- the business. The record is seventeen lines (verified_controls), each with
-- a state, a proof type and dates. The rules engine (lib/verified/evaluate.js)
-- is the only thing that writes a state; the AI Hygienist and the reviewer
-- in the queue only produce facts. Nothing here grades, scores or counts.
--
-- Stored keys, never renamed: control ids, state ids, proof type ids,
-- sources and review statuses. They are CHECK constraints rather than
-- Postgres enums so a later baseline can add a value without a type change.
--
-- Who reads what:
--   owner (authenticated)  their own record and lines, and reads of their own
--                          evidence, checks, connections (without the token)
--                          and insurer answers. Owners never write a state.
--   service role           everything, from the evaluate step, the evidence
--                          route, the connectors and the weekly checks.
--   anon (the public)      nothing in the base tables. The only public thing
--                          is the view verified_public, which projects the
--                          columns spec section 4 allows and nothing else.
--
-- Retention (spec section 5): evidence files are deleted 30 days after a
-- record lapses unless the owner exports them. `retention_until` on each
-- evidence row is set when the record lapses (trigger below); the file in
-- the private bucket is removed by the cleanup job once that day passes.
-- Check summaries and control states are the record's history and are kept.
--
-- Idempotent: re-running is safe.

-- ── verified_records ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verified_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL CHECK (length(business_name) BETWEEN 1 AND 120),
  -- The public URL: /verify/<slug>.
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 80),
  -- The domain the owner chose to show on the page; null shows none.
  primary_domain TEXT CHECK (primary_domain IS NULL OR (primary_domain ~ '^[a-z0-9.-]+\.[a-z]{2,}$' AND length(primary_domain) <= 253)),
  -- The industry overlay (lib/verified/baseline.js OVERLAYS).
  industry TEXT NOT NULL DEFAULT 'general' CHECK (industry IN ('general', 'healthcare', 'financial', 'legal', 'government', 'retail')),
  baseline_version TEXT NOT NULL DEFAULT '2027.1' CHECK (baseline_version ~ '^\d{4}\.\d+$'),
  -- The verify page is on only when the owner turned it on.
  public BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'lapsed')),
  lapsed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((status = 'lapsed') = (lapsed_at IS NOT NULL))
);

-- One record per account (spec decision 2). Organizations with several
-- users arrive with the agency plan and their own migration.
CREATE UNIQUE INDEX IF NOT EXISTS verified_records_user_idx ON verified_records (user_id);

COMMENT ON TABLE verified_records IS
  'One Data Hygienics Verified record per account. Public pages read only the view verified_public.';

-- ── verified_controls ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verified_controls (
  record_id UUID NOT NULL REFERENCES verified_records(id) ON DELETE CASCADE,
  control_id TEXT NOT NULL CHECK (control_id ~ '^[a-z][a-z0-9_]{1,40}$'),
  state TEXT NOT NULL CHECK (state IN ('passed', 'open', 'expired', 'drifted', 'not_applicable')),
  -- The MFA tier reached (0 to 3); null on every other line. The only
  -- number in the record.
  tier SMALLINT CHECK (tier IS NULL OR tier BETWEEN 0 AND 3),
  -- The weakest proof the pass rests on: the public label never claims more
  -- than was checked.
  proof_type TEXT CHECK (proof_type IS NULL OR proof_type IN ('api', 'dns', 'generated', 'document', 'attested')),
  -- Every proof type the pass rests on, strongest first (evaluate.js reads
  -- it back for drift).
  proofs TEXT[] NOT NULL DEFAULT '{}',
  -- The facts the rule was evaluated on: summaries (counts, states, dates),
  -- never names, lists of people or raw responses.
  facts JSONB,
  passed_at DATE,
  valid_until DATE,
  evaluated_at DATE NOT NULL,
  -- The rule's sentence. Public only on a not_applicable line.
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (record_id, control_id),
  CHECK (state <> 'passed' OR (proof_type IS NOT NULL AND passed_at IS NOT NULL))
);

COMMENT ON TABLE verified_controls IS
  'The seventeen lines of a Verified record. Written only by the rules engine through the service role.';

-- ── verified_evidence ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verified_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES verified_records(id) ON DELETE CASCADE,
  control_id TEXT NOT NULL CHECK (control_id ~ '^[a-z][a-z0-9_]{1,40}$'),
  -- What was uploaded: a document, a screenshot, a console export.
  kind TEXT NOT NULL CHECK (kind ~ '^[a-z][a-z0-9_]{1,40}$'),
  -- A path in the private evidence bucket, never a public URL.
  storage_path TEXT NOT NULL CHECK (length(storage_path) BETWEEN 1 AND 512),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- The Hygienist's extraction: facts with a pointer to where in the
  -- document each came from, and a confidence. Null until extracted.
  extracted_facts JSONB,
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'confirmed', 'corrected', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  -- Set when the record lapses: the file is deleted after this day unless
  -- the owner exported it.
  retention_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((review_status = 'pending') = (reviewed_at IS NULL))
);

CREATE INDEX IF NOT EXISTS verified_evidence_record_idx ON verified_evidence (record_id, control_id);
CREATE INDEX IF NOT EXISTS verified_evidence_queue_idx ON verified_evidence (review_status, uploaded_at) WHERE review_status = 'pending';

COMMENT ON TABLE verified_evidence IS
  'Uploaded evidence and the facts extracted from it. The reviewer confirms facts; the rules engine decides the state. Files are deleted 30 days after a record lapses (retention_until).';

-- ── verified_checks ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verified_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES verified_records(id) ON DELETE CASCADE,
  control_id TEXT NOT NULL CHECK (control_id ~ '^[a-z][a-z0-9_]{1,40}$'),
  source TEXT NOT NULL CHECK (source IN ('m365', 'google', 'dns', 'external')),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- A summary (counts, states, policy names, dates), never the raw response.
  facts JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- SHA-256 of the raw response, kept for dispute. The response itself is
  -- not stored.
  raw_hash TEXT CHECK (raw_hash IS NULL OR raw_hash ~ '^[0-9a-f]{64}$'),
  -- True when the facts differ from the previous check of the same control.
  changed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS verified_checks_record_idx ON verified_checks (record_id, control_id, checked_at DESC);

COMMENT ON TABLE verified_checks IS
  'One row per live check (tenant, DNS, outside-in): the summary facts, the time and a hash of the raw response. Kept as the record''s history.';

-- ── verified_connections ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verified_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES verified_records(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('m365', 'google')),
  -- An opaque id for the tenant, never its name.
  tenant_ref TEXT NOT NULL CHECK (length(tenant_ref) BETWEEN 1 AND 200),
  -- The read-only scopes granted, in plain English on the connection screen.
  scopes TEXT[] NOT NULL DEFAULT '{}',
  -- Encrypted with a server-side key held outside Supabase, never with the
  -- Supabase keys. Owners cannot read this column (grants below).
  token_ciphertext TEXT,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  last_check_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (record_id, provider)
);

COMMENT ON TABLE verified_connections IS
  'A connected Microsoft 365 or Google Workspace tenant, by opaque reference. Tokens are encrypted with a server-side key and never reach the owner or a public page.';

-- ── insurer_answers ───────────────────────────────────────────────────────
-- Reserved for the carrier pack (spec section 5). Drift compares a check's
-- facts against a "yes" the owner gave an insurer.

CREATE TABLE IF NOT EXISTS insurer_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES verified_records(id) ON DELETE CASCADE,
  carrier TEXT NOT NULL CHECK (length(carrier) BETWEEN 1 AND 120),
  question_id TEXT NOT NULL CHECK (question_id ~ '^[a-z0-9][a-z0-9_.-]{0,80}$'),
  -- The control the question maps to, when it maps to one.
  control_id TEXT CHECK (control_id IS NULL OR control_id ~ '^[a-z][a-z0-9_]{1,40}$'),
  answer TEXT NOT NULL CHECK (answer IN ('yes', 'no')),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS insurer_answers_record_idx ON insurer_answers (record_id, carrier);

COMMENT ON TABLE insurer_answers IS
  'What the owner answered a carrier, for drift alerts. Never on a public page; which carrier a business applied to is private.';

-- ── updated_at ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION touch_verified_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS verified_records_touch ON verified_records;
CREATE TRIGGER verified_records_touch BEFORE UPDATE ON verified_records
  FOR EACH ROW EXECUTE FUNCTION touch_verified_updated_at();

DROP TRIGGER IF EXISTS verified_controls_touch ON verified_controls;
CREATE TRIGGER verified_controls_touch BEFORE UPDATE ON verified_controls
  FOR EACH ROW EXECUTE FUNCTION touch_verified_updated_at();

DROP TRIGGER IF EXISTS verified_evidence_touch ON verified_evidence;
CREATE TRIGGER verified_evidence_touch BEFORE UPDATE ON verified_evidence
  FOR EACH ROW EXECUTE FUNCTION touch_verified_updated_at();

DROP TRIGGER IF EXISTS verified_connections_touch ON verified_connections;
CREATE TRIGGER verified_connections_touch BEFORE UPDATE ON verified_connections
  FOR EACH ROW EXECUTE FUNCTION touch_verified_updated_at();

-- ── Lapse: start the evidence retention clock ─────────────────────────────
-- When a record lapses, every evidence row gets retention_until 30 days
-- out. Reactivating clears it. Control states and check rows are untouched:
-- they are the history.

CREATE OR REPLACE FUNCTION verified_records_on_lapse()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'lapsed' AND (OLD.status IS DISTINCT FROM 'lapsed') THEN
    UPDATE verified_evidence
      SET retention_until = (COALESCE(NEW.lapsed_at, now()) + INTERVAL '30 days')::date
      WHERE record_id = NEW.id;
  ELSIF NEW.status = 'active' AND OLD.status = 'lapsed' THEN
    UPDATE verified_evidence SET retention_until = NULL WHERE record_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS verified_records_lapse ON verified_records;
CREATE TRIGGER verified_records_lapse AFTER UPDATE OF status ON verified_records
  FOR EACH ROW EXECUTE FUNCTION verified_records_on_lapse();

-- ── Row-level security ────────────────────────────────────────────────────

ALTER TABLE verified_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurer_answers ENABLE ROW LEVEL SECURITY;

-- Owners read and write their own record (the name, the domain shown, the
-- page on or off). Status and lapsed_at follow billing and are set only by
-- the service role: the guard trigger below keeps an owner from un-lapsing
-- a record, the way guard_admin_flag keeps profiles.is_admin.
DROP POLICY IF EXISTS "Owners can view own verified record" ON verified_records;
CREATE POLICY "Owners can view own verified record" ON verified_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can create own verified record" ON verified_records;
CREATE POLICY "Owners can create own verified record" ON verified_records
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'active');

DROP POLICY IF EXISTS "Owners can update own verified record" ON verified_records;
CREATE POLICY "Owners can update own verified record" ON verified_records
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION guard_verified_record_status()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status IS DISTINCT FROM OLD.status OR NEW.lapsed_at IS DISTINCT FROM OLD.lapsed_at)
     AND current_setting('role') NOT IN ('service_role', 'postgres', 'supabase_admin') THEN
    NEW.status := OLD.status;
    NEW.lapsed_at := OLD.lapsed_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS verified_records_guard_status ON verified_records;
CREATE TRIGGER verified_records_guard_status BEFORE UPDATE ON verified_records
  FOR EACH ROW EXECUTE FUNCTION guard_verified_record_status();

DROP POLICY IF EXISTS "Owners can delete own verified record" ON verified_records;
CREATE POLICY "Owners can delete own verified record" ON verified_records
  FOR DELETE USING (auth.uid() = user_id);

-- The lines: owners read their own. No owner write: states come from the
-- rules engine through the service role.
DROP POLICY IF EXISTS "Owners can view own verified controls" ON verified_controls;
CREATE POLICY "Owners can view own verified controls" ON verified_controls
  FOR SELECT USING (EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid()));

-- Evidence: owners read their own and may add a pending upload. Extraction,
-- review and retention are written only through the service role.
DROP POLICY IF EXISTS "Owners can view own verified evidence" ON verified_evidence;
CREATE POLICY "Owners can view own verified evidence" ON verified_evidence
  FOR SELECT USING (EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can add pending verified evidence" ON verified_evidence;
CREATE POLICY "Owners can add pending verified evidence" ON verified_evidence
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid() AND r.status = 'active')
    AND review_status = 'pending' AND extracted_facts IS NULL AND reviewed_by IS NULL AND reviewed_at IS NULL AND retention_until IS NULL
  );

-- Checks, connections and insurer answers: owners read their own. Writes
-- come from the connectors, the weekly checks and the carrier pack, all
-- through the service role.
DROP POLICY IF EXISTS "Owners can view own verified checks" ON verified_checks;
CREATE POLICY "Owners can view own verified checks" ON verified_checks
  FOR SELECT USING (EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can view own verified connections" ON verified_connections;
CREATE POLICY "Owners can view own verified connections" ON verified_connections
  FOR SELECT USING (EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can view own insurer answers" ON insurer_answers;
CREATE POLICY "Owners can view own insurer answers" ON insurer_answers
  FOR SELECT USING (EXISTS (SELECT 1 FROM verified_records r WHERE r.id = record_id AND r.user_id = auth.uid()));

-- ── Grants ────────────────────────────────────────────────────────────────
-- Supabase grants new tables to anon and authenticated by default. The
-- public reads nothing in the base tables, and no owner ever reads a token.

REVOKE ALL ON verified_records, verified_controls, verified_evidence, verified_checks, verified_connections, insurer_answers FROM anon;

REVOKE ALL ON verified_connections FROM authenticated;
GRANT SELECT (id, record_id, provider, tenant_ref, scopes, granted_at, revoked_at, last_check_at, created_at, updated_at)
  ON verified_connections TO authenticated;

-- ── verified_public: the only thing the verify page reads ─────────────────
-- Spec section 4. One row per line of each record whose owner turned the
-- page on and whose record is active. It projects: the business name and
-- the domain the owner chose to show, the baseline version, the day the
-- record was last checked, and per line the control id, the state, the
-- proof type (the page turns ids into the public labels from
-- lib/verified/baseline.js), the dates and the MFA tier. The rule's reason
-- is public only on a not_applicable line, where the page shows it.
--
-- It never carries: user ids, the industry overlay, facts, evidence,
-- checks, connections, tenant references, reviewer names, insurer answers
-- or the reason on any other state (reasons can name counts).
--
-- The view runs with its owner's rights (not security_invoker), so anon can
-- read it while the base tables stay closed. Nothing in it is a count.

CREATE OR REPLACE VIEW verified_public AS
  SELECT
    r.slug,
    r.business_name,
    r.primary_domain,
    r.baseline_version,
    MAX(c.evaluated_at) OVER (PARTITION BY r.id) AS checked_at,
    c.control_id,
    c.state,
    c.proof_type,
    c.passed_at,
    c.valid_until,
    c.evaluated_at,
    CASE WHEN c.control_id = 'mfa' THEN c.tier END AS tier,
    CASE WHEN c.state = 'not_applicable' THEN c.reason END AS reason
  FROM verified_records r
  JOIN verified_controls c ON c.record_id = r.id
  WHERE r.public = TRUE AND r.status = 'active';

COMMENT ON VIEW verified_public IS
  'The public projection of Verified records: what was checked and when, per line. The only relation a public page reads.';

GRANT SELECT ON verified_public TO anon, authenticated;
