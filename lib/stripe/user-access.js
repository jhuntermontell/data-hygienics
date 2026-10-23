import { getPlanAccess } from "./access"
import { isSubscriptionPaid } from "./entitlement"

/**
 * Resolve a user's effective plan and merged access flags from their raw
 * entitlement rows. Shared by getSubscription (client) and loadUserAccess
 * (API routes) so the UI and the routes that enforce paid features cannot
 * disagree about who is entitled.
 *
 * Promo codes take precedence over Stripe: the first redemption whose code
 * is not expired or exhausted supplies the plan and counts as active.
 * Otherwise a paid Stripe subscription supplies it, else "free". One-time
 * purchases (Documentation Pack, legacy bundles) and the admin flag are
 * merged in by getPlanAccess.
 */
export function resolveUserAccess({ subscription, purchases, redemptions, isAdmin }) {
  let promoPlan = null
  for (const r of redemptions || []) {
    const pc = r.promo_codes
    if (!pc) continue
    const expired = pc.expires_at && new Date(pc.expires_at).getTime() < Date.now()
    const exhausted = pc.max_uses !== null && pc.current_uses >= pc.max_uses
    if (!expired && !exhausted) {
      promoPlan = pc.plan
      break
    }
  }

  const stripePlan = isSubscriptionPaid(subscription)
    ? subscription.plan || "free"
    : "free"

  const plan = promoPlan || stripePlan
  const isPromo = !!promoPlan
  // Promo grants are treated as active for the purpose of access checks.
  const status = promoPlan ? "active" : (subscription?.status || "active")

  return {
    plan,
    isPromo,
    access: getPlanAccess(plan, status, purchases || [], isAdmin === true),
  }
}

/**
 * Server-side entitlement lookup for API routes. Pass a service-role client
 * and the user id from the authenticated session (never from the request
 * body). Returns { error } when any lookup fails so the route can answer
 * 500 instead of telling a paying user to upgrade during a Supabase outage.
 */
export async function loadUserAccess(service, userId) {
  const [subResult, purchaseResult, promoResult, profileResult] = await Promise.all([
    service
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle(),
    service
      .from("one_time_purchases")
      .select("purchase_type, metadata")
      .eq("user_id", userId),
    service
      .from("promo_redemptions")
      .select("promo_code_id, promo_codes(plan, expires_at, max_uses, current_uses)")
      .eq("user_id", userId),
    service
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle(),
  ])

  const error =
    subResult.error || purchaseResult.error || promoResult.error || profileResult.error
  if (error) return { error, plan: null, isPromo: false, access: null }

  return {
    error: null,
    ...resolveUserAccess({
      subscription: subResult.data,
      purchases: purchaseResult.data,
      redemptions: promoResult.data,
      isAdmin: profileResult.data?.is_admin === true,
    }),
  }
}
