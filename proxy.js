import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

// Prefix-matched. Any pathname that startsWith one of these requires a
// valid Supabase session. Public marketing pages, the cyber-audit landing
// page, controls/threats/vendors libraries, and login/register/forgot
// pages are intentionally NOT in this list.
const PROTECTED_ROUTES = [
  "/tools/cyber-audit/dashboard",
  "/tools/cyber-audit/assessment",
  "/tools/cyber-audit/results",
  "/tools/policies",
  "/tools/ir-plan",
]

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session on every request to keep cookies alive
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only redirect to login for protected routes
  const pathname = request.nextUrl.pathname
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = "/tools/cyber-audit/login"
    // Preserve the originally requested URL (path + search) so the login
    // page can return the user there after a successful sign-in.
    const original = pathname + (request.nextUrl.search || "")
    url.search = `?next=${encodeURIComponent(original)}`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
