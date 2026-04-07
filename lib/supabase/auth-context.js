// This module is kept only for backward compatibility during migration.
// It re-exports a no-op provider and a hook that reads directly from Supabase.
"use client"

import { createContext, useContext } from "react"

const AuthContext = createContext({ user: null, profile: null, loading: false })

// No-op provider — children render immediately, no blocking
export function AuthProvider({ children }) {
  return children
}

// Deprecated — components should use getSession() directly
export function useAuth() {
  return useContext(AuthContext)
}
