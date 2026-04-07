"use client"

import { AuthProvider } from "@/lib/supabase/auth-context"

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
