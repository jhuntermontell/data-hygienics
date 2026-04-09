"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Shield, CheckCircle, Loader2 } from "lucide-react"

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Supabase auto-exchanges the recovery token in the URL hash for a session.
    // Give it a moment, then check whether we have a valid session.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true)
        setChecking(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true)
      }
      setChecking(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try the reset link again.")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  const pwStrength = passwordStrength(password)
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][pwStrength]
  const strengthColor = ["", "#DC2626", "#EA580C", "#CA8A04", "#0F766E", "#059669"][pwStrength]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/tools/cyber-audit"
              className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              <Shield className="w-5 h-5 text-[#1D4ED8]" />
              <span className="text-sm font-semibold tracking-wide uppercase">Cyber Audit</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {success ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] mb-6">
                  <CheckCircle className="w-8 h-8 text-[#059669]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Your password has been updated.</h1>
                <p className="text-[#475569] text-sm leading-relaxed mb-6">
                  You can now sign in with your new password.
                </p>
                <Link href="/tools/cyber-audit/login">
                  <Button className="w-full">Sign in</Button>
                </Link>
              </div>
            ) : !hasSession ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Reset link expired</h1>
                <p className="text-[#475569] text-sm leading-relaxed mb-6">
                  This password reset link is no longer valid. Request a new one to continue.
                </p>
                <Link href="/tools/cyber-audit/forgot-password">
                  <Button className="w-full">Request new link</Button>
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Set a new password</h1>
                <p className="text-[#475569] mb-8">
                  Choose a strong password you haven&apos;t used before.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        className="pl-10"
                      />
                    </div>
                    {password && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${(pwStrength / 5) * 100}%`,
                              backgroundColor: strengthColor,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: strengthColor }}>
                          {strengthLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-[#DC2626] text-sm bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl px-4 py-2.5">
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Set New Password"
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
