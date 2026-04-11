import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"

const ALLOWED_FIELDS = new Set([
  "company_name",
  "industry",
  "employee_count",
  "incident_commander",
  "it_contact",
  "communications_lead",
  "legal_counsel",
  "insurance_info",
  "additional_contacts",
  "critical_systems",
  "recovery_priorities",
  "has_msp",
  "msp_info",
  "status",
])

/**
 * Server-side IR plan save. Validates entitlement (active paid sub or
 * unexpired promo) and forces user_id to the authenticated user so the
 * client cannot spoof ownership. RLS still backs this up at the DB level.
 */
export async function POST(request) {
  try {
    // Resolve user from cookie session, falling back to bearer token
    let userId = null
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) userId = user.id
    } catch {
      // ignore
    }

    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    if (!userId) {
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "")
        const {
          data: { user },
        } = await service.auth.getUser(token)
        if (user?.id) userId = user.id
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Entitlement check
    const { data: sub } = await service
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle()

    const hasActiveSub = isSubscriptionPaid(sub)

    let hasPromo = false
    const { data: redemptions } = await service
      .from("promo_redemptions")
      .select("promo_code_id, promo_codes(plan, expires_at, max_uses, current_uses)")
      .eq("user_id", userId)
    for (const r of redemptions || []) {
      const pc = r.promo_codes
      if (!pc) continue
      const expired =
        pc.expires_at && new Date(pc.expires_at).getTime() < Date.now()
      const exhausted =
        pc.max_uses !== null && pc.current_uses >= pc.max_uses
      if (!expired && !exhausted) {
        hasPromo = true
        break
      }
    }

    if (!hasActiveSub && !hasPromo) {
      return NextResponse.json({ error: "Subscription required" }, { status: 403 })
    }

    // Parse and whitelist plan data
    const body = await request.json().catch(() => ({}))
    const incoming = body.planData || {}
    if (!incoming.company_name || typeof incoming.company_name !== "string") {
      return NextResponse.json({ error: "Invalid plan data" }, { status: 400 })
    }

    const sanitized = {}
    for (const key of Object.keys(incoming)) {
      if (ALLOWED_FIELDS.has(key)) sanitized[key] = incoming[key]
    }
    sanitized.user_id = userId
    sanitized.updated_at = new Date().toISOString()

    const { data, error } = await service
      .from("ir_plans")
      .upsert(sanitized, { onConflict: "user_id" })
      .select()
      .single()

    if (error) {
      console.error("IR plan save error:", error)
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (err) {
    console.error("IR plan save route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
