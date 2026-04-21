import { PAID_STATUSES } from "./entitlement"

// Shared constant for the legacy Starter plan's 2-paid-policy cap. Lived in
// three files before; consolidating here means changing the limit only
// touches one place (and this cap will never change again anyway because
// Starter is grandfathered, but the consolidation still prevents drift).
export const STARTER_POLICY_LIMIT = 2

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
    // Ongoing Protection features (several are wired to flags now but will
    // only have enforcement points once the features ship. Listing them
    // here reserves the vocabulary and lets the pricing page render them
    // accurately from day one).
    canAccessQuarterlyReview: false,
    canAccessCarrierAlerts: false,
    canAccessEvidenceExport: false,
    // Agency features
    canManageClients: false,
    maxClients: 0,
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
    // --------------- New catalog ---------------
    case "protection": {
      // Ongoing Protection: everything the Documentation Pack unlocks, plus
      // the quarterly / carrier / evidence features (enforcement wires in
      // as those ship).
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessQuarterlyReview = true
      access.canAccessCarrierAlerts = true
      access.canAccessEvidenceExport = true
      break
    }
    case "agency": {
      // Agency Plan: everything in Protection plus multi-tenant client
      // management. maxClients is a static ceiling here; callers that care
      // about the actual seat count should read the subscription.quantity
      // column (or pass a subscription row into getAgencyMaxClients).
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canAccessQuarterlyReview = true
      access.canAccessCarrierAlerts = true
      access.canAccessEvidenceExport = true
      access.canManageClients = true
      // 0 here is a sentinel meaning "derive from subscription.quantity".
      // getAgencyMaxClients() below does that derivation.
      access.maxClients = 0
      break
    }

    // --------------- Legacy catalog (grandfathered) ---------------
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
      break
    }
    case "professional": {
      // Legacy Professional: full access minus agency features.
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      break
    }
    case "msp": {
      // Legacy MSP: Professional plus client management with a 10-client
      // ceiling (the old hardcoded cap, not per-seat billed).
      access.canTakeAssessment = true
      access.canDownloadReports = true
      access.canAccessPolicies = true
      access.canAccessIRPlan = true
      access.canAccessNewsFeed = true
      access.canManageClients = true
      access.maxClients = 10
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
 */
export function getPlanAccess(plan, status = "active", purchases = []) {
  const access = accessFromPlan(plan, status)
  return applyPurchaseGrants(access, purchases)
}

/**
 * Derive the true client cap for an Agency Plan subscription. The Agency
 * SKU is billed per-unit, so the real ceiling lives on the subscription
 * row as `quantity`. Returns 0 for any plan that is not "agency". Legacy
 * MSP subscribers should read access.maxClients instead.
 */
export function getAgencyMaxClients(subscription) {
  if (!subscription) return 0
  if (subscription.plan !== "agency") return 0
  const qty = Number(subscription.quantity)
  return Number.isFinite(qty) && qty > 0 ? qty : 0
}

// True if the plan identifier corresponds to a grandfathered catalog entry
// that the new pricing UI should not surface for new signups.
export function isLegacyPlan(plan) {
  return plan === "starter" || plan === "professional" || plan === "msp"
}
