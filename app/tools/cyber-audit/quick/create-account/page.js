"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { QUICK_SECTIONS } from "@/lib/questions/quick"
import { calculateTotalScore, calculateSectionScores, getGaugeColor } from "@/lib/cyber-audit/scoring"
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react"

const QUICK_LEAD_KEY = "dh_quick_lead"
const QUICK_ANSWERS_KEY = "dh_quick_answers"

function BlurredGauge({ score }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getGaugeColor(score)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          transform="rotate(-90 100 100)"
        />
      </svg>
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-[110px] h-[70px] rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center">
          <Lock className="w-5 h-5 text-[#94A3B8]" />
        </div>
      </div>
    </div>
  )
}

export default function QuickCreateAccountPage() {
  const router = useRouter()
  const supabase = createClient()
  const [lead, setLead] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewScore, setPreviewScore] = useState(0)

  useEffect(() => {
    try {
      const leadRaw = localStorage.getItem(QUICK_LEAD_KEY)
      const answersRaw = localStorage.getItem(QUICK_ANSWERS_KEY)
      if (!leadRaw || !answersRaw) {
        router.replace("/tools/cyber-audit/quick")
        return
      }
      const l = JSON.parse(leadRaw)
      const a = JSON.parse(answersRaw)
      setLead(l)
      setAnswers(a)
      setEmail(l.email || "")
      // Compute preview score for the gauge (so the arc fill is visible even though the number is hidden)
      const score = calculateTotalScore(a, QUICK_SECTIONS)
      setPreviewScore(score)
    } catch {
      router.replace("/tools/cyber-audit/quick")
    }
  }, [router])

  function validatePassword(pw) {
    if (pw.length < 8) return "Password must be at least 8 characters."
    if (!/[A-Z]/.test(pw) && !/[0-9]/.test(pw))
      return "Password must contain at least one uppercase letter or number."
    return null
  }

  function passwordStrength(pw) {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!lead || !answers) {
      setError("Session expired. Please restart the assessment.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const pwError = validatePassword(password)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)

    try {
      // 1. Create Supabase auth account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${lead.firstName} ${lead.lastName}`,
            company_name: lead.companyName,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes("already")) {
          setError("It looks like you already have an account.")
          setLoading(false)
          return
        }
        throw signUpError
      }

      const user = signUpData.user
      if (!user) {
        throw new Error("Account creation failed. Please try again.")
      }

      // Email confirmation is disabled, so signUp returns a session directly.
      // The user is logged in immediately, proceed to write their assessment.

      // 2. Create profile
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: `${lead.firstName} ${lead.lastName}`,
          company_name: lead.companyName,
        },
        { onConflict: "id" }
      )

      // 3. Score the assessment
      const score = calculateTotalScore(answers, QUICK_SECTIONS)
      const sectionScores = calculateSectionScores(answers, QUICK_SECTIONS)
      const now = new Date().toISOString()

      // 4. Create assessment record (assessment_type: "quick")
      const { data: assessmentRow, error: assessmentErr } = await supabase
        .from("assessments")
        .insert({
          user_id: user.id,
          status: "completed",
          assessment_type: "quick",
          started_at: lead.startedAt || now,
          completed_at: now,
          score,
          section_scores: JSON.stringify(sectionScores),
          industry: null,
          employee_count: null,
          has_insurance: null,
        })
        .select()
        .single()

      if (assessmentErr) throw assessmentErr

      // 5. Save all responses
      const responseRows = Object.entries(answers).map(([question_key, answer]) => ({
        assessment_id: assessmentRow.id,
        question_key,
        answer,
        answered_at: now,
      }))

      if (responseRows.length > 0) {
        const { error: responseError } = await supabase
          .from("responses")
          .insert(responseRows)
        if (responseError) {
          console.error("Failed to save quick assessment responses:", responseError)
          // Do NOT clear localStorage; the user's answers are still the
          // only persisted copy. Do NOT redirect. Surface an error so the
          // user can retry from the same page with the same local data.
          setError(
            "Your answers could not be saved. Please try again. Your responses are still here."
          )
          setLoading(false)
          return
        }
      }

      // 6. Clear localStorage (only after the response insert succeeded)
      try {
        localStorage.removeItem(QUICK_LEAD_KEY)
        localStorage.removeItem(QUICK_ANSWERS_KEY)
      } catch {}

      // 7. Navigate to results
      window.location.href = "/tools/cyber-audit/results"
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (!lead || !answers) return null

  const pwStrength = passwordStrength(password)
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][pwStrength]
  const strengthColor = ["", "#DC2626", "#EA580C", "#CA8A04", "#0F766E", "#059669"][pwStrength]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-md mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8"
        >
          {/* Blurred score teaser */}
          <div className="flex justify-center mb-6">
            <BlurredGauge score={previewScore} />
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
            Your results are ready.
          </h1>
          <p className="text-[#475569] text-sm text-center leading-relaxed mb-2">
            Create a free account to view your full security report in a secure, private space.
          </p>
          <p className="text-[#94A3B8] text-xs text-center mb-6">
            We take security seriously. Your results are stored securely and only visible to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
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
              <Label htmlFor="confirmPassword">Confirm password</Label>
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
              <div className="text-[#DC2626] text-xs bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl px-4 py-2.5">
                {error}{" "}
                {error.includes("already have an account") && (
                  <>
                    <Link
                      href="/tools/cyber-audit/login"
                      className="underline underline-offset-2 font-semibold"
                    >
                      Sign in to view your results.
                    </Link>
                    <span className="block mt-1.5 text-[#DC2626]/80">
                      Forgot your password?{" "}
                      <Link
                        href="/tools/cyber-audit/forgot-password"
                        className="underline underline-offset-2 font-semibold"
                      >
                        Reset it here.
                      </Link>
                    </span>
                  </>
                )}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create My Account and View Results
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
