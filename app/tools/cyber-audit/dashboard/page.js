"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import Navbar from "@/app/components/Navbar"
import { Button } from "@/components/ui/button"
import {
  Shield,
  ArrowRight,
  LogOut,
  PlayCircle,
  CheckCircle2,
  BarChart3,
  Building2,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [responseCount, setResponseCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: assessments } = await supabase
          .from("assessments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)

        if (assessments?.length > 0) {
          const latest = assessments[0]
          setAssessment(latest)

          // Calculate total questions for this industry
          if (latest.industry) {
            const sections = getQuestionsForIndustry(latest.industry)
            const total = sections.reduce((sum, s) => sum + s.questions.length, 0)
            setTotalQuestions(total)
          }

          if (latest.status === "in_progress") {
            const { count } = await supabase
              .from("responses")
              .select("*", { count: "exact", head: true })
              .eq("assessment_id", latest.id)
            setResponseCount(count || 0)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const startAssessment = () => {
    // Assessment creation now happens in the assessment page via intake modal
    router.push("/tools/cyber-audit/assessment")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/tools/cyber-audit/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  const progress = assessment && totalQuestions > 0
    ? Math.round((responseCount / totalQuestions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
                Cyber Audit
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8"
        >
          {!assessment && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Ready to Get Started?
                </h2>
              </div>
              <p className="text-zinc-400 mb-6">
                Your cybersecurity assessment takes about 30 minutes. We will
                tailor the questions to your industry and provide an instant
                scored report with actionable recommendations.
              </p>
              <Button onClick={startAssessment}>
                <span className="flex items-center gap-2">
                  Start Assessment
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </>
          )}

          {assessment?.status === "in_progress" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Assessment In Progress
                </h2>
              </div>
              {assessment.industry && (
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-500 text-xs font-medium">{assessment.industry}</span>
                </div>
              )}
              <p className="text-zinc-400 mb-4">
                {totalQuestions > 0
                  ? `You've answered ${responseCount} of ${totalQuestions} questions. Pick up where you left off.`
                  : "Pick up where you left off."}
              </p>
              {totalQuestions > 0 && (
                <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              )}
              <Button
                onClick={() => router.push("/tools/cyber-audit/assessment")}
              >
                <span className="flex items-center gap-2">
                  Continue Assessment
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </>
          )}

          {assessment?.status === "completed" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Assessment Complete
                </h2>
              </div>
              {assessment.industry && (
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-500 text-xs font-medium">{assessment.industry}</span>
                </div>
              )}
              <p className="text-zinc-400 mb-2">
                Your score:{" "}
                <span className="text-white font-bold text-lg">
                  {assessment.score}/100
                </span>
              </p>
              <p className="text-zinc-500 text-sm mb-6">
                Completed on{" "}
                {new Date(assessment.completed_at).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/tools/cyber-audit/results")}
                >
                  <span className="flex items-center gap-2">
                    View Results
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button variant="outline" onClick={startAssessment}>
                  Retake Assessment
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
