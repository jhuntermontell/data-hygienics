"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import AuthForm from "../components/AuthForm"
import { Shield } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { safeNext } from "@/lib/utils/safe-redirect"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const redirectTo = safeNext(searchParams.get("next"))
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      if (session) {
        // Already authenticated: send the user to the requested destination
        // (or the dashboard if no/invalid next was provided).
        window.location.href = redirectTo
      } else {
        setChecking(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [redirectTo])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/tools/cyber-audit" className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors">
              <Shield className="w-5 h-5 text-[#1D4ED8]" />
              <span className="text-sm font-semibold tracking-wide uppercase">Cyber Audit</span>
            </Link>
          </div>
          <AuthForm mode="login" redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  )
}
