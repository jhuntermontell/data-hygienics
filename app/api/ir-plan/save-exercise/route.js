import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { loadUserAccess } from "@/lib/stripe/user-access"

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

    // Entitlement. Same resolution the IR plan UI uses: paid plan or promo,
    // one-time purchases (Documentation Pack) and the admin flag.
    const { access, error: accessError } = await loadUserAccess(service, userId)
    if (accessError) {
      console.error("Exercise entitlement lookup failed:", JSON.stringify(accessError))
      return NextResponse.json(
        { error: "Could not verify access. Please try again." },
        { status: 500 }
      )
    }

    if (!access.canAccessIRPlan) {
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
