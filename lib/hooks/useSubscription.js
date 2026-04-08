"use client"

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPlanAccess } from "@/lib/stripe/access"
import { useAuth } from "@/lib/supabase/auth-context"

const SubscriptionContext = createContext({
  plan: "free",
  access: getPlanAccess("free"),
  loading: true,
  subscription: null,
  purchases: [],
  hasPurchase: () => false,
  refresh: () => {},
})

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef(null)

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null)
      setPurchases([])
      setLoading(false)
      return
    }

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

      setSubscription(subResult.data)
      setPurchases(purchaseResult.data || [])
    } catch {
      // Query failed, default to free
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

  const plan =
    subscription?.status === "active" ? subscription.plan || "free" : "free"
  const access = getPlanAccess(plan)

  function hasPurchase(type) {
    return purchases.some((p) => p.purchase_type === type)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        access,
        loading: loading && authLoading,
        subscription,
        purchases,
        hasPurchase,
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
