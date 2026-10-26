// GET: this month's assistant usage and caps for the signed-in member, for
// the meter on /tools/ask. Same auth and entitlement as POST /api/assistant:
// 401 signed out, 403 not a member (with { pricing: "/pricing" }), 503 when
// usage can't be read (fail closed).
//
// 200 { messagesToday, dailyCap, monthUsed, monthCap, month }
import { NextResponse } from "next/server"
import { resolveMember } from "@/lib/assistant/auth"
import { readUsage, BREAK_MESSAGE } from "@/lib/assistant/usage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const member = await resolveMember(request)
    if (member.error) {
      return NextResponse.json(
        member.pricing ? { error: member.error, pricing: member.pricing } : { error: member.error },
        { status: member.status, headers: { "Cache-Control": "no-store" } }
      )
    }
    const usage = await readUsage(member.service, member.userId)
    if (usage.error) {
      console.error("Assistant usage lookup failed:", JSON.stringify(usage.error))
      return NextResponse.json({ error: BREAK_MESSAGE }, { status: 503 })
    }
    return NextResponse.json(
      {
        messagesToday: usage.messagesToday,
        dailyCap: usage.dailyCap,
        monthUsed: usage.monthUsed,
        monthCap: usage.monthCap,
        month: usage.month,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("Assistant usage route error:", err?.message || err)
    return NextResponse.json({ error: BREAK_MESSAGE }, { status: 500 })
  }
}
