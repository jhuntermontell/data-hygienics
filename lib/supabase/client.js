import { createBrowserClient } from "@supabase/ssr"

// Lazy module-level singleton. The Supabase browser client is safe to share
// across the entire app: it manages session state and event listeners
// internally and recreating it per render or per component creates duplicate
// auth listeners and wastes work. We initialize lazily so the createBrowserClient
// call never runs during SSR.
let client = null

function init() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return client
}

// Preferred name for new code.
export function getSupabaseBrowserClient() {
  return init()
}

// Backwards-compatible alias used throughout the existing codebase.
export function createClient() {
  return init()
}
