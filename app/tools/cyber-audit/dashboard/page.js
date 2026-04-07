"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import { getSubscription, clearSubscriptionCache } from "@/lib/stripe/subscription"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Shield,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Building2,
  Newspaper,
  Lock,
  FileText,
  ClipboardList,
  KeyRound,
  AlertTriangle,
  Clock,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react"

const COMING_SOON_TOOLS = [
  { icon: ClipboardList, name: "Vendor Risk Scorecard", desc: "Rate your vendors on security posture" },
  { icon: KeyRound, name: "Password Audit Tool", desc: "Check password policy strength" },
  { icon: AlertTriangle, name: "Incident Response Planner", desc: "Build your IR plan step by step" },
]

const PLAN_LABELS = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
  msp: "MSP / Advisor",
}

const PLAN_FEATURES = {
  starter: ["Full cybersecurity assessment & reports", "Industry news feed", "2 customizable policies"],
  professional: ["Unlimited assessments & reports", "All 9 insurance-ready policies", "Score tracking over time"],
  msp: ["Everything in Professional", "Up to 10 client assessments", "Client management dashboard"],
}

function getFirstName(profile, user) {
  if (profile?.full_name) return profile.full_name.split(" ")[0]
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0]
  return "there"
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [responseCount, setResponseCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [news, setNews] = useState([])
  const [policies, setPolicies] = useState([])
  const [sub, setSub] = useState({ plan: "free", access: { canAccessNewsFeed: false }, subscription: null, purchases: [] })
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  const plan = sub.plan
  const access = sub.access
  const subscription = sub.subscription
  const purchases = sub.purchases
  const isPaid = plan !== "free"

  useEffect(() => {
    async function load() {
      // Get session directly
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }

      const currentUser = session.user
      setUser(currentUser)

      try {
        // Load everything in parallel
        const [profileResult, assessmentResult, policyResult, subData] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
          supabase.from("assessments").select("*").eq("user_id", currentUser.id)
            .order("created_at", { ascending: false }).limit(1),
          supabase.from("generated_policies").select("policy_type, company_name, updated_at")
            .eq("user_id", currentUser.id).order("updated_at", { ascending: false }),
          getSubscription(currentUser.id),
        ])

        setProfile(profileResult.data)
        setSub(subData)
        setPolicies(policyResult.data || [])

        const assessments = assessmentResult.data
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

          if (latest.industry) {
            const { data: newsData } = await supabase.from("news_cache")
              .select("*").eq("industry", latest.industry)
              .order("cached_at", { ascending: false }).limit(5)
            setNews(newsData || [])
          }
        }

        // Show welcome banner if returning from payment
        if (searchParams.get("welcome") === "true" && subData.plan !== "free") {
          setShowWelcome(true)
        }
      } catch (err) {
        console.error("Dashboard load error:", err)
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    clearSubscriptionCache()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  async function handleManageBilling() {
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error("Portal error:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  const industry = assessment?.industry
  const firstName = getFirstName(profile, user)
  const progress = assessment && totalQuestions > 0
    ? Math.round((responseCount / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-6 pt-28 pb-20 w-full">
        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl border border-[#1D4ED8]/20 bg-[#EFF6FF] p-5 relative"
            >
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#475569]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#1D4ED8] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2">
                    Welcome to {PLAN_LABELS[plan] || "your plan"}!
                  </h3>
                  <p className="text-xs text-[#475569] mb-2">Here&apos;s what you can do now:</p>
                  <ul className="space-y-1">
                    {(PLAN_FEATURES[plan] || []).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Welcome back, {firstName}
            </h1>
            {industry && (
              <div className="flex items-center gap-2 mt-1.5">
                <Building2 className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-[#475569] text-sm">{industry}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[#94A3B8] hover:text-[#475569] transition-colors text-sm"
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
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-5 text-center">
              <p className="text-3xl font-black text-[#0F172A]">{assessment.score}</p>
              <p className="text-[#94A3B8] text-xs mt-1">Security Score</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-5 text-center">
              <p className="text-lg font-bold text-[#475569] truncate">{industry || "N/A"}</p>
              <p className="text-[#94A3B8] text-xs mt-1">Industry</p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-5 text-center">
              <p className="text-lg font-bold text-[#475569]">
                {new Date(assessment.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-[#94A3B8] text-xs mt-1">Last Assessment</p>
            </div>
          </motion.div>
        )}

        {/* Your Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.07 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#EFF6FF] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <h2 className="text-lg font-bold text-[#0F172A]">Your Plan</h2>
          </div>

          {isPaid ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {PLAN_LABELS[plan]}
                  <span className="ml-2 text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </p>
                {subscription?.current_period_end && (
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Renews {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={handleManageBilling}>
                Manage Billing
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#475569]">You&apos;re on the free plan</p>
                {purchases.length > 0 && (
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {purchases.length} one-time purchase{purchases.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <Link href="/pricing">
                <Button size="sm">
                  <span className="flex items-center gap-2">
                    Upgrade <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Your Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-[#0F172A] mb-4">Your Tools</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#1D4ED8]/30 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#EFF6FF] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#1D4ED8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Cyber Audit</h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
                </div>
              </div>
              <p className="text-[#475569] text-xs mb-4">
                Industry-tailored cybersecurity assessment with scored results and downloadable reports.
              </p>
              {!assessment && (
                <Link href="/tools/cyber-audit/assessment">
                  <Button size="sm">
                    <span className="flex items-center gap-2">
                      Start Assessment <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Button>
                </Link>
              )}
              {assessment?.status === "in_progress" && (
                <>
                  {totalQuestions > 0 && (
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mb-3 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  <Link href="/tools/cyber-audit/assessment">
                    <Button size="sm">
                      <span className="flex items-center gap-2">
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Button>
                  </Link>
                </>
              )}
              {assessment?.status === "completed" && (
                <div className="flex gap-2">
                  <Link href="/tools/cyber-audit/results"><Button size="sm">View Results</Button></Link>
                  <Link href="/tools/cyber-audit/assessment"><Button size="sm" variant="outline">Retake</Button></Link>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#0F766E]/20 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0F766E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Policy Library</h3>
                  <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded">Active</span>
                </div>
              </div>
              <p className="text-[#475569] text-xs mb-4">
                Generate all 9 insurance-required cybersecurity policies, customized for your organization.
              </p>
              <Link href="/tools/policies">
                <Button size="sm" variant="outline">
                  <span className="flex items-center gap-2">
                    {policies.length > 0 ? `${policies.length} of 9 done` : "Get started"} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Button>
              </Link>
            </div>

            {COMING_SOON_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.name} className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 opacity-60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#475569]">{tool.name}</h3>
                      <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> COMING SOON
                      </span>
                    </div>
                  </div>
                  <p className="text-[#94A3B8] text-xs">{tool.desc}</p>
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
            className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Your Reports</h2>
            <div className="grid gap-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#1D4ED8]" />
                  <div>
                    <p className="text-sm text-[#0F172A]">Insurance Report</p>
                    <p className="text-xs text-[#94A3B8]">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link href="/tools/cyber-audit/results">
                  <Button size="sm" variant="outline">
                    {isPaid ? "Download" : <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Unlock</span>}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-[#0F172A]">Remediation Report</p>
                    <p className="text-xs text-[#94A3B8]">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link href="/tools/cyber-audit/results">
                  <Button size="sm" variant="outline">
                    {isPaid ? "Download" : <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Unlock</span>}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Policies */}
        {policies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">My Policies</h2>
              <Link href="/tools/policies" className="text-[#1D4ED8] text-xs font-semibold hover:text-[#1E40AF]">
                View all
              </Link>
            </div>
            <div className="grid gap-3">
              {policies.slice(0, 4).map((p) => (
                <div key={p.policy_type} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#1D4ED8]" />
                    <div>
                      <p className="text-sm text-[#0F172A] font-medium capitalize">{p.policy_type.replace(/-/g, " ")}</p>
                      <p className="text-xs text-[#94A3B8]">{new Date(p.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href={`/tools/policies/${p.policy_type}`}
                    className="text-[#1D4ED8] text-xs font-semibold hover:text-[#1E40AF]">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Industry News */}
        {industry && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Trending in {industry} Cybersecurity
                </h2>
                <p className="text-[#94A3B8] text-xs">Updated daily</p>
              </div>
            </div>

            <div className="border-b border-[#E2E8F0] pb-3 mb-3">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{news[0].title}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{news[0].summary}</p>
            </div>

            {access.canAccessNewsFeed ? (
              <div className="grid gap-3">
                {news.slice(1).map((item) => (
                  <div key={item.id} className="border-b border-[#E2E8F0] pb-3 last:border-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#475569] leading-relaxed">{item.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="filter blur-sm pointer-events-none select-none">
                  {news.slice(1, 3).map((item) => (
                    <div key={item.id} className="border-b border-[#E2E8F0] pb-3 mb-3">
                      <h3 className="text-sm font-semibold text-[#475569] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#94A3B8]">{item.summary}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 bg-white/80 border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-semibold text-[#1D4ED8] hover:border-[#1D4ED8]/40 transition-colors shadow-sm"
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
