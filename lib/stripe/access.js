import { PAID_STATUSES } from "./entitlement"

/**
 * Returns the per-feature access flags for a given plan + status pair.
 * The status check ensures that only `active` or `trialing` subscriptions
 * grant entitlements; other statuses (`incomplete`, `past_due`, `canceled`,
 * `unpaid`, `paused`) revert to free-tier access for that user.
 */
export function getPlanAccess(plan, status = "active") {
  const isPaid = PAID_STATUSES.includes(status) && plan !== "free"

  return {
    canTakeAssessment: isPaid,
    canDownloadReports: isPaid,
    canAccessPolicies: isPaid && ["professional", "msp"].includes(plan),
    policyLimit: plan === "starter" ? 2 : null,
    canAccessNewsFeed: isPaid,
    canManageClients: isPaid && plan === "msp",
    maxClients: isPaid && plan === "msp" ? 10 : 0,
  }
}
