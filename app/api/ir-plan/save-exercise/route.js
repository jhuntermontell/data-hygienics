import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"

const ALLOWED_FIELDS = new Set([
  "plan_id",
  "scenario_type",
  "participants",
  "started_at",
  "completed_at",
  "decisions",
  "score",
  "findings",
  "summary_text",
])

/**
 * Server-side tabletop exercise save. Validates entitlement, verifies the
 * referenced plan belongs to the authenticated user, then inserts the
 * exercise. Also bumps last_tested_at on the plan as a non-blocking step.
 */
export async function POST(request) {
  try {
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

    // Entitlement
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

    // Parse + whitelist exercise data
    const body = await request.json().catch(() => ({}))
    const incoming = body.exerciseData || {}
    if (!incoming.plan_id || !incoming.scenario_type) {
      return NextResponse.json({ error: "Invalid exercise data" }, { status: 400 })
    }

    // Verify the plan belongs to the authenticated user
    const { data: planRow } = await service
      .from("ir_plans")
      .select("id")
      .eq("id", incoming.plan_id)
      .eq("user_id", userId)
      .maybeSingle()
    if (!planRow) {
      return NextResponse.json(
        { error: "Plan not found or not owned by user" },
        { status: 403 }
      )
    }

    const sanitized = {}
    for (const key of Object.keys(incoming)) {
      if (ALLOWED_FIELDS.has(key)) sanitized[key] = incoming[key]
    }
    sanitized.user_id = userId

    const { data, error } = await service
      .from("ir_exercises")
      .insert(sanitized)
      .select()
      .single()

    if (error) {
      console.error("Exercise save error:", error)
      return NextResponse.json({ error: "Failed to save exercise" }, { status: 500 })
    }

    // Non-blocking: bump last_tested_at on the plan
    const { error: updateError } = await service
      .from("ir_plans")
      .update({ last_tested_at: new Date().toISOString() })
      .eq("id", sanitized.plan_id)
      .eq("user_id", userId)
    if (updateError) {
      console.error("Failed to update last_tested_at:", updateError)
    }

    return NextResponse.json({ exercise: data })
  } catch (err) {
    console.error("Exercise save route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
