// Who is asking, and may they use the member assistant? Server-only.
//
// Resolves the user exactly the way app/api/policies/save does (cookie
// session first, bearer token fallback, service-role client for lookups),
// then reads the subscription, one-time purchases and admin flag and asks
// getPlanAccess for canAccessAssistant.
//
// Returns { userId, service } on success, or { status, error } for the route
// to send: 401 signed out, 403 not a member, 503 when a lookup fails (fail
// closed: an outage never grants access, and never tells a paying member to
// upgrade either).
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient } from "../supabase/server.js"
import { getPlanAccess } from "../stripe/access.js"
import { BREAK_MESSAGE } from "./usage.js"

export const NOT_MEMBER_MESSAGE = "Ask Data Hygienics is for members. See /pricing."

export async function resolveMember(request) {
  let userId = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.id) userId = user.id
  } catch {
    // ignore: fall through to the bearer token
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { status: userId ? 503 : 401, error: userId ? BREAK_MESSAGE : "Sign in to use the assistant." }
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!userId) {
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "")
      try {
        const {
          data: { user },
        } = await service.auth.getUser(token)
        if (user?.id) userId = user.id
      } catch {
        // ignore: treated as signed out
      }
    }
  }

  if (!userId) return { status: 401, error: "Sign in to use the assistant." }

  const [
    { data: sub, error: subError },
    { data: purchases, error: purchaseError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    service.from("subscriptions").select("plan, status, current_period_end").eq("user_id", userId).maybeSingle(),
    service.from("one_time_purchases").select("purchase_type, metadata").eq("user_id", userId),
    service.from("profiles").select("is_admin").eq("id", userId).maybeSingle(),
  ])

  if (subError || purchaseError || profileError) {
    console.error(
      "Assistant entitlement lookup failed:",
      JSON.stringify(subError || purchaseError || profileError)
    )
    return { status: 503, error: BREAK_MESSAGE }
  }

  const access = getPlanAccess(
    sub?.plan || "free",
    sub?.status || "inactive",
    purchases || [],
    profile?.is_admin === true
  )

  if (!access.canAccessAssistant) {
    return { status: 403, error: NOT_MEMBER_MESSAGE, pricing: "/pricing" }
  }

  return { userId, service }
}
