import { PAID_STATUSES } from "./entitlement"

// Shared constant for the legacy Starter plan's 2-paid-policy cap. Lived in
// three files before; consolidating here means changing the limit only
// touches one place (and this cap will never change again anyway because
// Starter is grandfathered, but the consolidation still prevents drift).
export const STARTER_POLICY_LIMIT = 2

// Admin access shape: every boolean flag true and no policy cap. Admins
// (profiles.is_admin = true) have no Stripe subscription and bypass all plan
// and purchase logic. If you add a flag to emptyAccess(), set it here too.
function adminAccess() {
  const access = emptyAccess()
  access.canTakeAssessment = true
  access.canDownloadReports = true
  access.canAccessPolicies = true
  access.canAccessIRPlan = true
  access.canAccessNewsFeed = true
  access.canAccessQuarterlyReview = true
  access.canAccessAssistant = true
  return access
}

// Default-deny access shape. Used for free users and as the base that
// plan-specific and purchase-derived flags OR into.
function emptyAccess() {
  return {
    // Core features
    canTakeAssessment: false,
    canDownloadReports: false,
    canAccessPolicies: false,
    canAccessIRPlan: false,
    canAccessNewsFeed: false,
    // Starter-era policy cap. null means "no cap" (unlimited or not applicable).
    policyLimit: null,
    // Ongoing Protection: quarterly reassessment. Reserved vocabulary; it
    // gets an enforcement point once the feature ships.
    canAccessQuarterlyReview: false,
    // Ask Data Hygienics (/tools/ask): the member assistant. Both
    // membership doors, every other paid plan and the Documentation Pack.
    // The monthly token cap in lib/assistant/limits.js bounds everyone's use.
    canAccessAssistant: false,
  }
}

// Returns the flags granted by a given plan + status pair alone, ignoring
// any one-time purchases. Callers that want the full picture (plan flags
// OR purchase-derived flags) should use getPlanAccess with its purchases
// argument instead.
function accessFromPlan(plan, status) {
  const isPaid = PAID_STATUSES.includes(status) && plan !== "free"
  const access = emptyAccess()

  if (!isPaid) return access

  switch (plan) {
    // --------------- Membership (current catalog) ---------------
    // One membership, two doors. The door chosen at checkout is the plan
    // value (lib/stripe/prices.js getActivePriceToPlan maps every Home price,
    // founding included, to member_home and every Business price to
    // member_business). Membership is current, not legacy.
    case "member_home": {
      // Home membership: Ask Data Hygienics, and nothing else. The saved
      // Path is account-based already (path_profiles), so "your Path on
      // every device" needs no flag; the business tools stay with the
      // Business door and the Documentation Pack.
      access.canAccessAssistant = true
      break
    }
    case "member_business": {
      // Business membership: the replacement for Ongoing Protection, with
      // identical grants. Keep this case in step with "protection".
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessQuarterlyReview = true
      access.canAccessAssistant = true
      break
    }

    // --------------- Retired from sale, still honored ---------------
    case "protection": {
      // Ongoing Protection: everything the Documentation Pack unlocks, plus
      // the news feed and quarterly reassessment. No longer sold (Business
      // membership replaced it) but honored for anyone who holds it.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessQuarterlyReview = true
      access.canAccessAssistant = true
      break
    }

    // --------------- Legacy catalog (grandfathered) ---------------
    case "agency": {
      // Legacy Agency Plan (retired, never purchasable again). Grandfathered
      // subscribers and promo codes with plan = 'agency' keep everything in
      // Ongoing Protection.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessQuarterlyReview = true
      access.canAccessAssistant = true
      break
    }
    case "starter": {
      // Legacy Starter: full assessment + reports + news feed + 2 paid
      // policies + IR plan. Kept intact so existing Starter subscribers do
      // not lose anything they already paid for. No new signups reach
      // this plan value — the pricing page does not surface it.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessNewsFeed = true
      access.canAccessIRPlan = true
      access.policyLimit = STARTER_POLICY_LIMIT
      access.canAccessAssistant = true
      break
    }
    case "professional": {
      // Legacy Professional: full assessment, policy library, IR plan and
      // news feed.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessAssistant = true
      break
    }
    case "msp": {
      // Legacy MSP / Advisor plan (retired). Same grants as Professional.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessAssistant = true
      break
    }

    default:
      // Unknown plan value. Treat as free for safety rather than granting
      // everything. Log so we notice if an unexpected plan string lands in
      // the database.
      console.warn(`accessFromPlan: unknown plan value "${plan}", treating as free`)
      break
  }

  return access
}

// OR one-time purchase grants into an access object. The Documentation Pack
// unlocks the whole "get-ready kit" surface (assessment + reports + full
// policy library + IR plan); legacy assessment/policy/individual bundles
// preserve the grants their original owners paid for.
function applyPurchaseGrants(access, purchases) {
  if (!Array.isArray(purchases) || purchases.length === 0) return access

  const has = (type) => purchases.some((p) => p.purchase_type === type)

  if (has("docs_pack")) {
    access.canTakeAssessment = true
    access.canDownloadReports = true
    access.canAccessPolicies = true
    access.canAccessIRPlan = true
    // Removes any policy cap inherited from a legacy plan because the docs
    // pack is explicitly "all nine policies".
    access.policyLimit = null
    // One-time buyers get the assistant too; the monthly token cap
    // (lib/assistant/limits.js) is what bounds their ongoing use.
    access.canAccessAssistant = true
  }

  if (has("assessment_bundle")) {
    access.canTakeAssessment = true
    access.canDownloadReports = true
  }

  if (has("policy_bundle")) {
    access.canAccessPolicies = true
    access.policyLimit = null
  }

  // individual_policy purchases are per-slug and not expressible as a
  // boolean flag. Policy-route code still reads them directly from
  // subData.purchases.

  return access
}

/**
 * Returns the per-feature access flags for a given plan + status pair.
 *
 * The status check ensures that only `active` or `trialing` subscriptions
 * grant entitlements; other statuses (`incomplete`, `past_due`, `canceled`,
 * `unpaid`, `paused`) revert to free-tier access for that user.
 *
 * Optional third argument: an array of one-time purchase rows. When
 * provided, purchase-derived grants are OR'd into the returned object so
 * a single call produces the full access picture. This replaces the
 * previous pattern of "fetch plan flags, then manually re-check
 * subData.hasPurchase(...) everywhere".
 *
 * Optional fourth argument: when true, short-circuits to the admin access
 * object (every flag true, no policy cap). Used for users with
 * profiles.is_admin = true. Bypasses all plan and purchase logic.
 */
export function getPlanAccess(plan, status = "active", purchases = [], isAdmin = false) {
  if (isAdmin) return adminAccess()
  const access = accessFromPlan(plan, status)
  return applyPurchaseGrants(access, purchases)
}

// True if the plan identifier corresponds to a grandfathered catalog entry
// that the pricing UI should not surface for new signups. The retired
// Agency and MSP plans are legacy: still honored, never sold.
export function isLegacyPlan(plan) {
  return (
    plan === "starter" ||
    plan === "professional" ||
    plan === "msp" ||
    plan === "agency"
  )
}
