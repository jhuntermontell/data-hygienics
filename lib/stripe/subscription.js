import { createClient } from "@/lib/supabase/client"
import { getPlanAccess } from "./access"
import { isSubscriptionPaid } from "./entitlement"

const CACHE_KEY = "dh_subscription"
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (Date.now() - cached.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return cached.data
  } catch {
    return null
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // localStorage full or unavailable
  }
}

export function clearSubscriptionCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // ignore
  }
}

/**
 * Fetch the user's subscription and purchases from Supabase.
 * Returns { plan, access, subscription, purchases, hasPurchase, isPromo,
 * entitlementUnknown }.
 *
 * Promo codes take precedence over Stripe: if the user has redeemed a valid
 * promo code (not expired, not over max_uses), the plan from that promo is
 * returned and `isPromo` is true.
 *
 * On a fetch error the function returns a free-shaped object with
 * `entitlementUnknown: true` so callers can distinguish "actually free"
 * from "could not check". Failure-derived results are NOT cached.
 *
 * Pass `{ skipCache: true }` to bypass both the cache read and the cache
 * write. This is the right choice during post-checkout polling, where the
 * webhook may not have landed yet and we do not want to memoize the
 * pre-webhook free state.
 */
export async function getSubscription(userId, { skipCache = false } = {}) {
  const free = {
    plan: "free",
    access: getPlanAccess("free"),
    subscription: null,
    purchases: [],
    hasPurchase: () => false,
    isPromo: false,
    entitlementUnknown: false,
  }

  if (!userId) return free

  // Check cache first (unless skipCache was requested)
  if (!skipCache) {
    const cached = getCached()
    if (cached && cached.userId === userId) {
      return {
        ...cached.result,
        hasPurchase: (type) =>
          (cached.result.purchases || []).some((p) => p.purchase_type === type),
      }
    }
  }

  try {
    const supabase = createClient()

    const [subResult, purchaseResult, promoResult] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("one_time_purchases")
        .select("*")
        .eq("user_id", userId),
      supabase
        .from("promo_redemptions")
        .select("promo_code_id, promo_codes(plan, expires_at, max_uses, current_uses)")
        .eq("user_id", userId),
    ])

    // If any of the three queries returned an error, treat the whole result
    // as "unknown". Do NOT cache it, do NOT lock the user out of paid
    // features they may legitimately have.
    if (subResult.error || purchaseResult.error || promoResult.error) {
      console.error(
        "Subscription fetch failed:",
        subResult.error || purchaseResult.error || promoResult.error
      )
      return {
        ...free,
        entitlementUnknown: true,
      }
    }

    const subscription = subResult.data
    const purchases = purchaseResult.data || []
    const redemptions = promoResult.data || []

    // 1. Check promo redemptions first
    let promoPlan = null
    for (const r of redemptions) {
      const pc = r.promo_codes
      if (!pc) continue
      const expired = pc.expires_at && new Date(pc.expires_at).getTime() < Date.now()
      const exhausted = pc.max_uses !== null && pc.current_uses >= pc.max_uses
      if (!expired && !exhausted) {
        promoPlan = pc.plan
        break
      }
    }

    // 2. Fall through to Stripe subscription if no valid promo
    const stripePlan = isSubscriptionPaid(subscription)
      ? subscription.plan || "free"
      : "free"

    const plan = promoPlan || stripePlan
    const isPromo = !!promoPlan
    // Promo grants are treated as active for the purpose of access checks.
    const status = promoPlan ? "active" : (subscription?.status || "active")

    // Pass purchases into getPlanAccess so `access` is the merged view of
    // plan-derived grants + purchase-derived grants. A free user with a
    // Documentation Pack purchase has canAccessPolicies === true here even
    // though plan === "free".
    const result = {
      plan,
      access: getPlanAccess(plan, status, purchases),
      subscription,
      purchases,
      isPromo,
      entitlementUnknown: false,
    }

    // Only cache real results, never failure-derived free states. Also
    // skip the write entirely when the caller asked for skipCache (used by
    // post-checkout polling so a transient pre-webhook free state never
    // gets memoized).
    if (!skipCache) {
      setCache({ userId, result })
    }

    return {
      ...result,
      hasPurchase: (type) => purchases.some((p) => p.purchase_type === type),
    }
  } catch (err) {
    console.error("Subscription fetch threw:", err)
    return {
      ...free,
      entitlementUnknown: true,
    }
  }
}
