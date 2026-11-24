// The public side of Data Hygienics Verified: reading one record for the
// verify page at /verify/<slug> (design/verified/baseline.md section 4).
//
// The page reads the view `verified_public` and nothing else
// (supabase/migrations/20261105_verified.sql). The view already holds only
// what the spec allows on a public page, so this file shapes rows; it never
// filters secrets out, because none reach it. It uses the anon key with no
// session: the view is readable by everyone, by design.
//
// Returns { status, record }:
//   "found"    the record, shaped for the page
//   "empty"    the view answered and holds no public record for this slug
//   "missing"  the view is not there yet, the keys are not set, or the read
//              failed; the page shows its "no checked record yet" state and
//              never fails
import { createClient } from "@supabase/supabase-js"
import { CONTROL_IDS, STATE_IDS, PROOF_ORDER } from "@/lib/verified/baseline"

// Our own record, the first real one (spec section 8, step 2).
export const OWN_SLUG = "data-hygienics"
export const OWN_NAME = "Data Hygienics"

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DAY = /^\d{4}-\d{2}-\d{2}$/

const COLUMNS =
  "slug,business_name,primary_domain,baseline_version,checked_at,control_id,state,proof_type,passed_at,valid_until,evaluated_at,tier,reason"

const day = (v) => (typeof v === "string" && DAY.test(v.slice(0, 10)) ? v.slice(0, 10) : null)

function shape(rows) {
  const first = rows[0]
  const lines = {}
  for (const row of rows) {
    if (!CONTROL_IDS.includes(row.control_id) || !STATE_IDS.includes(row.state)) continue
    lines[row.control_id] = {
      state: row.state,
      proofType: PROOF_ORDER.includes(row.proof_type) ? row.proof_type : null,
      passedAt: day(row.passed_at),
      validUntil: day(row.valid_until),
      evaluatedAt: day(row.evaluated_at),
      tier: row.control_id === "mfa" && Number.isInteger(row.tier) ? row.tier : null,
      reason: row.state === "not_applicable" && typeof row.reason === "string" ? row.reason : null,
    }
  }
  return {
    slug: first.slug,
    businessName: String(first.business_name || ""),
    primaryDomain: first.primary_domain || null,
    baselineVersion: String(first.baseline_version || ""),
    checkedAt: day(first.checked_at),
    lines,
  }
}

export async function readPublicRecord(slug) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || typeof slug !== "string" || !SLUG.test(slug) || slug.length > 80) return { status: "missing", record: null }
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase.from("verified_public").select(COLUMNS).eq("slug", slug)
    if (error) {
      if (process.env.NODE_ENV !== "production") console.debug("[verify] record not read:", error.code || error.message)
      return { status: "missing", record: null }
    }
    if (!Array.isArray(data) || data.length === 0) return { status: "empty", record: null }
    return { status: "found", record: shape(data) }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.debug("[verify] record not read:", err?.name || "error")
    return { status: "missing", record: null }
  }
}
