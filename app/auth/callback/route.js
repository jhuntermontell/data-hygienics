import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/utils/safe-redirect"

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNext(searchParams.get("next"))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // A Clear Path link that fails goes back to the Path's own sign-in page.
  const audience = next.match(/^\/path\/(home|business)(?:[/?]|$)/)?.[1]
  const failed = audience ? `/path/save?for=${audience}&error=link` : "/tools/cyber-audit/login?error=auth"
  return NextResponse.redirect(`${origin}${failed}`)
}
