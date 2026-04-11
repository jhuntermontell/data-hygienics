// Centralized entitlement helpers. Every place that decides "is this user
// paid?" should call into here so the rules cannot drift across UI, API
// routes, and database queries.

export const PAID_STATUSES = ["active", "trialing"]

/**
 * Is this subscription row currently entitled to paid features?
 *
 * Returns true only when:
 *   - status is one of PAID_STATUSES
 *   - plan is not 'free'
 *   - current_period_end (if present) has not yet passed
 */
export function isSubscriptionPaid(subscription) {
  if (!subscription) return false
  if (!PAID_STATUSES.includes(subscription.status)) return false
  if (!subscription.plan || subscription.plan === "free") return false
  if (subscription.current_period_end) {
    const end = new Date(subscription.current_period_end).getTime()
    if (Number.isFinite(end) && end < Date.now()) return false
  }
  return true
}

export function hasOneTimePurchase(purchases, purchaseType) {
  if (!Array.isArray(purchases)) return false
  return purchases.some((p) => p.purchase_type === purchaseType)
}
