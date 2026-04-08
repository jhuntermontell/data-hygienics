// This module is kept only for backward compatibility during migration.
// It re-exports a no-op provider and a hook that reads directly from Supabase.
"use client"

import { createContext, useContext } from "react"

const AuthContext = createContext({ user: null, profile: null, loading: false })

// No-op provider. Children render immediately, no blocking.
export function AuthProvider({ children }) {
  return children
}

// Deprecated. Components should use getSession() directly.
export function useAuth() {
  return useContext(AuthContext)
}
