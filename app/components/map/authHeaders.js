import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// The signed-in member's bearer header, or {} when signed out. Same approach
// as AskChat: the session is read from the browser, nothing is sent to get it.
export async function authHeaders() {
  try {
    const {
      data: { session },
    } = await getSupabaseBrowserClient().auth.getSession()
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  } catch {
    return {}
  }
}
