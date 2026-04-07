"use client"

import { AuthProvider } from "@/lib/supabase/auth-context"
import { SubscriptionProvider } from "@/lib/hooks/useSubscription"

export function Providers({ children }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </AuthProvider>
  )
}
