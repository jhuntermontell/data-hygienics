"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, User, Building2 } from "lucide-react"
import Link from "next/link"

export default function AuthForm({ mode = "login" }) {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isRegister = mode === "register"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, company_name: companyName },
          },
        })
        if (error) throw error

        // Email confirmation is disabled, so signUp returns a session directly.
        // Save the profile row, then go straight to the dashboard.
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            company_name: companyName,
          })
        }

        // Full page reload ensures auth state propagates to all contexts
        window.location.href = "/tools/cyber-audit/dashboard"
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      window.location.href = "/tools/cyber-audit/dashboard"
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
        {isRegister ? "Create Your Account" : "Welcome Back"}
      </h2>
      <p className="text-[#475569] mb-8">
        {isRegister
          ? "Sign up to start your free cybersecurity assessment."
          : "Log in to continue your assessment."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegister && (
          <>
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
          </>
        )}
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

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              id="password"
              type="password"
              placeholder={isRegister ? "Create a password (min 6 chars)" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-10"
            />
          </div>
          {!isRegister && (
            <div className="mt-2 flex justify-end">
              <Link
                href="/tools/cyber-audit/forgot-password"
                className="text-[#1D4ED8] hover:text-[#1E40AF] text-xs font-medium underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>

        {error && (
          <p className="text-[#DC2626] text-sm bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isRegister ? "Creating account..." : "Signing in..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {isRegister ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-[#475569] text-sm mt-6 text-center">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href="/tools/cyber-audit/login"
              className="text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/tools/cyber-audit/register"
              className="text-[#1D4ED8] hover:text-[#1E40AF] underline underline-offset-2"
            >
              Sign up free
            </Link>
          </>
        )}
      </p>
    </motion.div>
  )
}
