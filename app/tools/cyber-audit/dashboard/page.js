"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Shield,
  ArrowRight,
  LogOut,
  PlayCircle,
  CheckCircle2,
  BarChart3,
  Building2,
  Newspaper,
  Lock,
  FileText,
  ClipboardList,
  KeyRound,
  AlertTriangle,
  Clock,
} from "lucide-react"

const COMING_SOON_TOOLS = [
  { icon: ClipboardList, name: "Vendor Risk Scorecard", desc: "Rate your vendors on security posture" },
  { icon: KeyRound, name: "Password Audit Tool", desc: "Check password policy strength" },
  { icon: AlertTriangle, name: "Incident Response Planner", desc: "Build your IR plan step by step" },
]

function getFirstName(profile, user) {
  if (profile?.full_name) return profile.full_name.split(" ")[0]
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0]
  const email = user?.email || ""
  const local = email.split("@")[0] || ""
  const name = local.replace(/[._-]/g, " ").split(" ")[0]
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [responseCount, setResponseCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  // TODO: Connect Stripe - check actual subscription status
  const isPaid = false

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)

        const { data: assessments } = await supabase
          .from("assessments").select("*").eq("user_id", user.id)
          .order("created_at", { ascending: false }).limit(1)

        if (assessments?.length > 0) {
          const latest = assessments[0]
          setAssessment(latest)

          if (latest.industry) {
            const sections = getQuestionsForIndustry(latest.industry)
            setTotalQuestions(sections.reduce((sum, s) => sum + s.questions.length, 0))
          }

          if (latest.status === "in_progress") {
            const { count } = await supabase.from("responses")
              .select("*", { count: "exact", head: true }).eq("assessment_id", latest.id)
            setResponseCount(count || 0)
          }
        }

        if (assessments?.[0]?.industry) {
          const { data: newsData } = await supabase.from("news_cache")
            .select("*").eq("industry", assessments[0].industry)
            .order("cached_at", { ascending: false }).limit(5)
          setNews(newsData || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [])

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

  const industry = assessment?.industry
  const firstName = getFirstName(profile, user)
  const progress = assessment && totalQuestions > 0
    ? Math.round((responseCount / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-6 pt-28 pb-20 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {firstName}
            </h1>
            {industry && (
              <div className="flex items-center gap-2 mt-1.5">
                <Building2 className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400 text-sm">{industry}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </motion.div>

        {/* Quick Stats */}
        {assessment?.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 text-center">
              <p className="text-3xl font-black text-white">{assessment.score}</p>
              <p className="text-zinc-500 text-xs mt-1">Security Score</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 text-center">
              <p className="text-lg font-bold text-zinc-300 truncate">{industry || "N/A"}</p>
              <p className="text-zinc-500 text-xs mt-1">Industry</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 text-center">
              <p className="text-lg font-bold text-zinc-300">
                {new Date(assessment.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Last Assessment</p>
            </div>
          </motion.div>
        )}

        {/* Your Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4">Your Tools</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cyber Audit - Active */}
            <div className="rounded-2xl border border-blue-500/30 bg-[#0d0d0d] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cyber Audit</h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs mb-4">
                Industry-tailored cybersecurity assessment with scored results and downloadable reports.
              </p>

              {!assessment && (
                <Button size="sm" onClick={() => router.push("/tools/cyber-audit/assessment")}>
                  <span className="flex items-center gap-2">
                    Start Assessment <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Button>
              )}
              {assessment?.status === "in_progress" && (
                <>
                  {totalQuestions > 0 && (
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  <Button size="sm" onClick={() => router.push("/tools/cyber-audit/assessment")}>
                    <span className="flex items-center gap-2">
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Button>
                </>
              )}
              {assessment?.status === "completed" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => router.push("/tools/cyber-audit/results")}>
                    View Results
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => router.push("/tools/cyber-audit/assessment")}>
                    Retake
                  </Button>
                </div>
              )}
            </div>

            {/* Coming soon tools */}
            {COMING_SOON_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.name} className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 opacity-60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-400">{tool.name}</h3>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> COMING SOON
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-600 text-xs">{tool.desc}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Your Reports */}
        {assessment?.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4">Your Reports</h2>
            <div className="grid gap-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-zinc-300">Insurance Report</p>
                    <p className="text-xs text-zinc-600">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push("/tools/cyber-audit/results")}>
                  {isPaid ? "Download" : <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Unlock</span>}
                </Button>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm text-zinc-300">Remediation Report</p>
                    <p className="text-xs text-zinc-600">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => router.push("/tools/cyber-audit/results")}>
                  {isPaid ? "Download" : <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Unlock</span>}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Industry News - gated for free users */}
        {industry && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Trending in {industry} Cybersecurity
                </h2>
                <p className="text-zinc-500 text-xs">Updated daily</p>
              </div>
            </div>

            {/* First headline always visible */}
            <div className="border-b border-zinc-800/50 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{news[0].title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{news[0].summary}</p>
            </div>

            {/* Rest blurred for free users */}
            {isPaid ? (
              <div className="grid gap-3">
                {news.slice(1).map((item) => (
                  <div key={item.id} className="border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-zinc-200 mb-1">{item.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="filter blur-sm pointer-events-none select-none">
                  {news.slice(1, 3).map((item) => (
                    <div key={item.id} className="border-b border-zinc-800/50 pb-3 mb-3">
                      <h3 className="text-sm font-semibold text-zinc-400 mb-1">{item.title}</h3>
                      <p className="text-xs text-zinc-600">{item.summary}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700 rounded-xl px-5 py-3 text-sm font-semibold text-blue-400 hover:border-blue-500/40 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Subscribe to unlock your industry news feed
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  )
}
