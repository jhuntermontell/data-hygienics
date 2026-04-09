import { createClient } from "@/lib/supabase/client"
import { getPlanAccess } from "./access"

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
 * Returns { plan, access, subscription, purchases, hasPurchase, isPromo }.
 *
 * Promo codes take precedence over Stripe: if the user has redeemed a valid
 * promo code (not expired, not over max_uses), the plan from that promo is
 * returned and `isPromo` is true.
 *
 * Always defaults to 'free' on any error.
 */
export async function getSubscription(userId) {
  const free = {
    plan: "free",
    access: getPlanAccess("free"),
    subscription: null,
    purchases: [],
    hasPurchase: () => false,
    isPromo: false,
  }

  if (!userId) return free

  // Check cache first
  const cached = getCached()
  if (cached && cached.userId === userId) {
    return {
      ...cached.result,
      hasPurchase: (type) =>
        (cached.result.purchases || []).some((p) => p.purchase_type === type),
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
    const stripePlan =
      subscription?.status === "active"
        ? subscription.plan || "free"
        : "free"

    const plan = promoPlan || stripePlan
    const isPromo = !!promoPlan

    const result = {
      plan,
      access: getPlanAccess(plan),
      subscription,
      purchases,
      isPromo,
    }

    setCache({ userId, result })

    return {
      ...result,
      hasPurchase: (type) => purchases.some((p) => p.purchase_type === type),
    }
  } catch {
    return free
  }
}
