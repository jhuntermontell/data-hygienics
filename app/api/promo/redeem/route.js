import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const { code } = await request.json()
    const trimmed = typeof code === "string" ? code.trim() : ""
    if (!trimmed) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }

    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Case-insensitive lookup
    const { data: promo, error: lookupErr } = await service
      .from("promo_codes")
      .select("*")
      .ilike("code", trimmed)
      .maybeSingle()

    if (lookupErr || !promo) {
      return NextResponse.json({ error: "invalid" }, { status: 404 })
    }

    if (promo.expires_at && new Date(promo.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "expired" }, { status: 400 })
    }

    if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
      return NextResponse.json({ error: "exhausted" }, { status: 400 })
    }

    // Insert redemption (UNIQUE(user_id, promo_code_id) prevents double-spend)
    const { error: insertErr } = await service
      .from("promo_redemptions")
      .insert({ user_id: user.id, promo_code_id: promo.id })

    if (insertErr) {
      // 23505 = unique_violation — already redeemed by this user
      if (insertErr.code === "23505") {
        return NextResponse.json({
          ok: true,
          plan: promo.plan,
          alreadyRedeemed: true,
        })
      }
      return NextResponse.json({ error: "redeem_failed" }, { status: 500 })
    }

    // Increment current_uses
    await service
      .from("promo_codes")
      .update({ current_uses: promo.current_uses + 1 })
      .eq("id", promo.id)

    return NextResponse.json({ ok: true, plan: promo.plan })
  } catch (err) {
    console.error("Promo redeem error:", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
