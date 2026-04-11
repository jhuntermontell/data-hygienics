"use client"

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPlanAccess } from "@/lib/stripe/access"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"
import { useAuth } from "@/lib/supabase/auth-context"

const SubscriptionContext = createContext({
  plan: "free",
  access: getPlanAccess("free"),
  loading: true,
  subscription: null,
  purchases: [],
  hasPurchase: () => false,
  entitlementUnknown: false,
  refresh: () => {},
})

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  // True when the most recent fetch failed. Consumers can use this to show
  // "Unable to verify subscription" messaging instead of locked UI.
  const [entitlementUnknown, setEntitlementUnknown] = useState(false)
  const timeoutRef = useRef(null)

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setPurchases([])
      setEntitlementUnknown(false)
      setLoading(false)
      return
    }

    // Initiating a fetch for an authenticated user. Mark loading=true so
    // the exposed loading flag (authLoading || loading) stays truthy until
    // both auth AND this query are resolved.
    setLoading(true)
    try {
      const supabase = createClient()

      const [subResult, purchaseResult] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("one_time_purchases")
          .select("*")
          .eq("user_id", user.id),
      ])

      // Supabase returns { data: null, error: ... } on failure rather than
      // throwing. Treat that as "entitlement unknown" so we don't show
      // locked UI to a paid user during a transient outage.
      if (subResult.error || purchaseResult.error) {
        console.error(
          "useSubscription fetch error:",
          subResult.error || purchaseResult.error
        )
        setSubscription(null)
        setPurchases([])
        setEntitlementUnknown(true)
        setLoading(false)
        return
      }

      setSubscription(subResult.data)
      setPurchases(purchaseResult.data || [])
      setEntitlementUnknown(false)
    } catch (err) {
      console.error("useSubscription fetch threw:", err)
      setEntitlementUnknown(true)
    }
    setLoading(false)
  }, [user])

  // Fetch on user change
  useEffect(() => {
    if (authLoading) return

    // Set a max loading timeout of 2 seconds
    timeoutRef.current = setTimeout(() => {
      setLoading(false)
    }, 2000)

    fetchSubscription().finally(() => {
      clearTimeout(timeoutRef.current)
    })

    return () => clearTimeout(timeoutRef.current)
  }, [user, authLoading, fetchSubscription])

  // Re-fetch when page gains focus (e.g. returning from Stripe checkout)
  useEffect(() => {
    if (!user) return

    const handleFocus = () => {
      fetchSubscription()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [user, fetchSubscription])

  const plan = isSubscriptionPaid(subscription)
    ? subscription.plan || "free"
    : "free"
  const access = getPlanAccess(plan, subscription?.status || "active")

  function hasPurchase(type) {
    return purchases.some((p) => p.purchase_type === type)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        access,
        // Loading is true if EITHER auth is still resolving OR the
        // subscription query is in flight. Was previously `&&` which
        // dropped to false as soon as auth resolved, even if the
        // subscription fetch was still pending.
        loading: authLoading || loading,
        subscription,
        purchases,
        hasPurchase,
        // True when the most recent fetch errored (Supabase outage,
        // network failure). Consumers should show "Unable to verify
        // subscription" rather than locked UI when this is true.
        entitlementUnknown,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}
