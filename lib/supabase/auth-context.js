"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "./client"

const AuthContext = createContext({ user: null, profile: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Safety timeout — never stay in loading state longer than 3 seconds
    timeoutRef.current = setTimeout(() => {
      setLoading(false)
    }, 3000)

    async function getInitial() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()
          setProfile(data)
        }
      } catch {
        // Auth check failed — treat as logged out
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
      clearTimeout(timeoutRef.current)
    }
    getInitial()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle()
          setProfile(data)
        } else {
          setProfile(null)
        }
        // Always clear loading on any auth event
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeoutRef.current)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
