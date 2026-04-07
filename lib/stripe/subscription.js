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
 * Returns { plan, access, subscription, purchases, hasPurchase }.
 * Always defaults to 'free' on any error.
 */
export async function getSubscription(userId) {
  const free = {
    plan: "free",
    access: getPlanAccess("free"),
    subscription: null,
    purchases: [],
    hasPurchase: () => false,
  }

  if (!userId) return free

  // Check cache first
  const cached = getCached()
  if (cached && cached.userId === userId) {
    return cached.result
  }

  try {
    const supabase = createClient()

    const [subResult, purchaseResult] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("one_time_purchases")
        .select("*")
        .eq("user_id", userId),
    ])

    const subscription = subResult.data
    const purchases = purchaseResult.data || []

    const plan =
      subscription?.status === "active"
        ? subscription.plan || "free"
        : "free"

    const result = {
      plan,
      access: getPlanAccess(plan),
      subscription,
      purchases,
      hasPurchase: (type) => purchases.some((p) => p.purchase_type === type),
    }

    setCache({ userId, result })
    return result
  } catch {
    return free
  }
}
