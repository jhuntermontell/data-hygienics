"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import AuthForm from "../components/AuthForm"
import { Shield, User, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { safeNext } from "@/lib/utils/safe-redirect"

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  )
}

function RegisterPageInner() {
  const searchParams = useSearchParams()
  const redirectTo = safeNext(searchParams.get("next"))

  // mode: "checking" | "register" | "complete-profile" | "check-failed"
  const [mode, setMode] = useState("checking")
  const [user, setUser] = useState(null)
  // Single mounted flag shared by both the initial mount effect and the
  // retry button's checkProfile() call. Async results from either path
  // discard any state updates after the component unmounts.
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  async function checkProfile() {
    if (!isMountedRef.current) return
    setMode("checking")
    const supabase = getSupabaseBrowserClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!isMountedRef.current) return

    if (!session) {
      setMode("register")
      return
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, company_name")
      .eq("id", session.user.id)
      .maybeSingle()

    if (!isMountedRef.current) return

    if (error) {
      // Real query error (not "no rows found"). Do NOT fall through to the
      // register form — that would mix two incompatible states. Show a
      // retryable error instead.
      console.error("Profile lookup failed on register page:", error)
      setUser(session.user)
      setMode("check-failed")
      return
    }

    if (profile) {
      // Already fully registered — send them on their way.
      window.location.href = redirectTo
      return
    }

    // Session exists but no profile row → partial registration. Show the
    // completion form.
    setUser(session.user)
    setMode("complete-profile")
  }

  useEffect(() => {
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!isMountedRef.current) return
      if (!session) {
        setMode("register")
        return
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, company_name")
        .eq("id", session.user.id)
        .maybeSingle()
      if (!isMountedRef.current) return
      if (error) {
        console.error("Profile lookup failed on register page:", error)
        setUser(session.user)
        setMode("check-failed")
        return
      }
      if (profile) {
        window.location.href = redirectTo
        return
      }
      setUser(session.user)
      setMode("complete-profile")
    })()
  }, [redirectTo])

  if (mode === "checking") {
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
          {mode === "check-failed" ? (
            <ProfileCheckErrorView onRetry={checkProfile} />
          ) : mode === "complete-profile" ? (
            <CompleteProfileForm user={user} redirectTo={redirectTo} />
          ) : (
            <AuthForm mode="register" redirectTo={redirectTo} />
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileCheckErrorView({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
        We could not verify your profile status
      </h2>
      <p className="text-[#475569] text-sm leading-relaxed mb-6">
        This is usually a temporary issue. Please try again in a moment.
      </p>
      <Button onClick={onRetry} className="w-full">
        Try Again
      </Button>
    </motion.div>
  )
}

function CompleteProfileForm({ user, redirectTo }) {
  const supabase = getSupabaseBrowserClient()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [companyName, setCompanyName] = useState(user?.user_metadata?.company_name || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  // Synchronous in-flight guard so a rapid double-click cannot fire two
  // upserts before setSaving(true) takes effect.
  const submitInFlight = useRef(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fullName.trim() || !companyName.trim()) return
    if (submitInFlight.current) return
    submitInFlight.current = true
    setSaving(true)
    setError("")
    let willRedirect = false
    try {
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim(),
        company_name: companyName.trim(),
      })
      if (upsertError) {
        console.error("Profile completion failed:", upsertError)
        setError("We could not save your profile. Please try again.")
        setSaving(false)
        return
      }
      willRedirect = true
      window.location.href = redirectTo
    } finally {
      if (!willRedirect) {
        submitInFlight.current = false
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Finish setting up your account</h2>
      <p className="text-[#475569] mb-8">
        We just need a couple more details before you can continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              id="fullName"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              id="companyName"
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <p className="text-[#DC2626] text-sm bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <Button type="submit" disabled={saving || !fullName.trim() || !companyName.trim()} className="w-full">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
