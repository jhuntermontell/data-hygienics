"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Shield, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const supabase = getSupabaseBrowserClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  // Synchronous in-flight guard so a rapid double-click cannot send two
  // password reset emails before setLoading(true) takes effect.
  const submitInFlight = useRef(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    if (submitInFlight.current) return
    submitInFlight.current = true
    setLoading(true)
    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/tools/cyber-audit/reset-password`,
      })
    } catch (err) {
      // Swallow errors - we show the same message regardless of success for
      // security reasons (don't leak which emails are registered).
      console.error("Password reset error:", err)
    } finally {
      setSubmitted(true)
      setLoading(false)
      // Leave submitInFlight locked: the form is now in the "submitted"
      // state and the input is no longer rendered, so there's nothing to
      // click again. This also prevents a second submit if the user
      // somehow re-enters the form.
    }
  }

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
            {submitted ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFF6FF] border border-blue-200 mb-6">
                  <CheckCircle className="w-8 h-8 text-[#1D4ED8]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Check your email</h1>
                <p className="text-[#475569] text-sm leading-relaxed mb-6">
                  If an account exists with that email, you will receive a reset link shortly. Check your inbox and spam folder.
                </p>
                <Link
                  href="/tools/cyber-audit/login"
                  className="inline-flex items-center gap-2 text-[#1D4ED8] hover:text-[#1E40AF] text-sm font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Reset your password</h1>
                <p className="text-[#475569] mb-8">
                  Enter your email address and we will send you a link to set a new password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <p className="text-[#475569] text-sm mt-6 text-center">
                  Remembered it?{" "}
                  <Link
                    href="/tools/cyber-audit/login"
                    className="text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
