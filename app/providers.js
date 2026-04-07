"use client"

// No context providers needed — auth comes from Supabase session directly,
// subscription data is fetched on demand with localStorage caching.
export function Providers({ children }) {
  return children
}
