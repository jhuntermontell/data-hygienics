"use client"

import { createContext, useContext, useEffect, useState } from "react"
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
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchSubscription() {
    if (!user) {
      setSubscription(null)
      setPurchases([])
      setLoading(false)
      return
    }

    const supabase = createClient()

    const [{ data: sub }, { data: purchaseData }] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("one_time_purchases")
        .select("*")
        .eq("user_id", user.id),
    ])

    setSubscription(sub)
    setPurchases(purchaseData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscription()
  }, [user])

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
        loading,
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
