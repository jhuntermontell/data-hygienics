"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry, QUICK_SECTIONS, QUICK_DISCOVERY_GUIDES } from "@/lib/questions"
import {
  calculateSectionScores,
  getLetterGrade,
  getGaps,
} from "@/lib/cyber-audit/scoring"
import { getRemediationPlan } from "@/lib/cyber-audit/remediation"
import { getSubscription } from "@/lib/stripe/subscription"
import Navbar from "@/app/components/Navbar"
import ScoreGauge from "../components/ScoreGauge"
import SectionBreakdown from "../components/SectionBreakdown"
import GapList from "../components/GapList"
import UpgradeModal from "../components/UpgradeModal"
import RemediationPlan from "../components/RemediationPlan"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Download,
  ArrowLeft,
  RotateCcw,
  Building2,
  AlertTriangle,
  FileText,
  Lock,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

const PdfReport = dynamic(() => import("../components/PdfReport"), {
  ssr: false,
})

function getSummary(score, hasInsurance) {
  let summary = ""
  if (score >= 90)
    summary = "Your business has strong cybersecurity practices in place. Keep up the great work and continue to review your security posture regularly."
  else if (score >= 80)
    summary = "You are in good shape overall. There are a few areas to improve, but your foundational security practices are solid."
  else if (score >= 70)
    summary = "Your security posture is fair. There are meaningful gaps that should be addressed soon to reduce your risk exposure."
  else if (score >= 60)
    summary = "Your business has significant security gaps. We recommend prioritizing the high-priority items below to strengthen your defenses."
  else
    summary = "Your business is at critical risk. Multiple fundamental security controls are missing. We strongly recommend addressing the high-priority gaps immediately."

  if (hasInsurance === "No" && score < 80) {
    summary += " Without cyber insurance, your business bears the full financial cost of any breach. We strongly recommend obtaining coverage alongside addressing these gaps."
  }

  return summary
}

export default function ResultsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [assessment, setAssessment] = useState(null)
  const [answers, setAnswers] = useState({})
  const [userEmail, setUserEmail] = useState("")
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPdf, setShowPdf] = useState(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = "/tools/cyber-audit/login"
        return
      }
      const user = session.user
      setUserEmail(user.email)

      const [profileResult, subData] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        getSubscription(user.id),
      ])
      setProfile(profileResult.data)
      setIsPaid(subData.access.canDownloadReports || subData.hasPurchase("assessment_bundle"))

      const { data: assessments } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (!assessments?.length) {
        return router.push("/tools/cyber-audit/dashboard")
      }

      setAssessment(assessments[0])

      const { data: responses } = await supabase
        .from("responses")
        .select("question_key, answer")
        .eq("assessment_id", assessments[0].id)

      if (responses) {
        const loaded = {}
        responses.forEach((r) => {
          loaded[r.question_key] = r.answer
        })
        setAnswers(loaded)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1D4ED8]/30 border-t-[#1D4ED8] rounded-full animate-spin" />
      </div>
    )
  }

  const isQuick = assessment.assessment_type === "quick"
  const industry = assessment.industry || "Other / General Business"
  const sections = isQuick ? QUICK_SECTIONS : getQuestionsForIndustry(industry)
  const score = assessment.score
  const { grade, label, color } = getLetterGrade(
    score,
    industry,
    assessment.employee_count
  )
  const sectionScores = assessment.section_scores
    ? (typeof assessment.section_scores === "string"
        ? JSON.parse(assessment.section_scores)
        : assessment.section_scores)
    : calculateSectionScores(answers, sections)
  const gaps = getGaps(answers, sections)
  const summary = getSummary(score, assessment.has_insurance)

  // Discovery tasks (for "I don't know" answers on quick assessment)
  const discoveryItems = isQuick
    ? Object.entries(answers)
        .filter(([, val]) => typeof val === "string" && val.toLowerCase().includes("don't know"))
        .map(([key]) => {
          const question = QUICK_SECTIONS.flatMap((s) => s.questions).find((q) => q.key === key)
          return {
            key,
            questionText: question?.text || key,
            guide: QUICK_DISCOVERY_GUIDES[key] || "Ask your IT provider about this control.",
          }
        })
    : []

  // Remediation plan (comprehensive only)
  const remediationPlan = !isQuick ? getRemediationPlan(gaps, industry) : []

  const quickVisibleGaps = gaps.slice(0, 3)
  const hiddenGapCount = Math.max(0, gaps.length - 3)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Assessment type indicator */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase ${
              isQuick
                ? "bg-[#EFF6FF] text-[#1D4ED8]"
                : "bg-[#F0FDFA] text-[#0F766E]"
            }`}
          >
            <Shield className="w-3 h-3" />
            {isQuick ? "Quick Security Check" : `Comprehensive Cyber Audit${assessment.industry ? ` - ${assessment.industry}` : ""}`}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-[#0F172A]">Your Security Report</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[#94A3B8] text-sm">
              Completed{" "}
              {new Date(assessment.completed_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {assessment.industry && !isQuick && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#94A3B8] text-xs font-medium">{assessment.industry}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Insurance warning (comprehensive only) */}
        {!isQuick && assessment.has_insurance === "No" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[#D97706]/20 bg-[#FFFBEB] p-5 mb-8 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#D97706] text-sm font-semibold mb-1">No Cyber Insurance Detected</p>
              <p className="text-[#D97706]/70 text-xs leading-relaxed">
                Your business does not currently have cyber insurance. This report can be used to support your application. We strongly recommend obtaining coverage. The average cost of a data breach for small businesses exceeds $120,000.
              </p>
            </div>
          </motion.div>
        )}

        {/* Score overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={score} />
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <span className={`text-6xl font-black ${color}`}>{grade}</span>
                <span className={`text-lg font-semibold ${color}`}>{label}</span>
              </div>
              <p className="text-[#475569] text-sm leading-relaxed max-w-md">
                {summary}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
        >
          <SectionBreakdown sectionScores={sectionScores} />
        </motion.div>

        {/* Gap list */}
        {isQuick ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
            >
              <GapList gaps={quickVisibleGaps} isPaid={true} />

              {hiddenGapCount > 0 && (
                <div className="mt-6 rounded-2xl bg-[#EFF6FF] border border-[#1D4ED8]/15 p-6 text-center">
                  <h4 className="text-base font-bold text-[#0F172A] mb-2">
                    You have {gaps.length} gaps identified.
                  </h4>
                  <p className="text-[#475569] text-sm leading-relaxed mb-5 max-w-md mx-auto">
                    The comprehensive assessment digs deeper into each of these areas with product-specific questions, configuration checks, and a prioritized remediation plan your insurance broker will recognize.
                  </p>
                  <Link href="/pricing">
                    <Button>
                      <span className="flex items-center gap-2">
                        Unlock the Comprehensive Assessment
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>
                  <p className="text-[#94A3B8] text-xs mt-3">
                    Or continue exploring with your free account.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Discovery tasks */}
            {discoveryItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-5 h-5 text-[#0F766E]" />
                  <h3 className="text-lg font-bold text-[#0F172A]">Things to find out</h3>
                </div>
                <p className="text-[#475569] text-sm mb-5">
                  You answered &quot;I don&apos;t know&quot; on {discoveryItems.length} question{discoveryItems.length === 1 ? "" : "s"}. Here&apos;s how to get the answers.
                </p>
                <div className="space-y-3">
                  {discoveryItems.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
                    >
                      <p className="text-sm font-semibold text-[#0F172A] mb-2">
                        {item.questionText}
                      </p>
                      <p className="text-[#475569] text-xs leading-relaxed">{item.guide}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PDF note for quick */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 text-[#94A3B8] text-xs mb-6"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Downloadable reports are available with the comprehensive assessment.</span>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
            >
              <GapList gaps={gaps} isPaid={isPaid} />
            </motion.div>

            {/* Remediation plan (comprehensive only) */}
            {remediationPlan.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm p-8 mb-8"
              >
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-[#0F172A]">Your Remediation Plan</h3>
                  <p className="text-[#475569] text-sm mt-1">
                    Prioritized steps tailored to the gaps we identified.
                  </p>
                </div>
                <RemediationPlan plan={remediationPlan} answers={answers} />
              </motion.div>
            )}
          </>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-3"
        >
          {!isQuick && (
            <>
              <Button onClick={() => (isPaid ? setShowPdf("insurance") : setShowUpgrade(true))}>
                <span className="flex items-center gap-2">
                  {isPaid ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Insurance Report
                </span>
              </Button>
              <Button variant="outline" onClick={() => (isPaid ? setShowPdf("remediation") : setShowUpgrade(true))}>
                <span className="flex items-center gap-2">
                  {isPaid ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Remediation Report
                </span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => router.push("/tools/cyber-audit/dashboard")}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </span>
          </Button>
          {!isQuick && (
            <Button variant="ghost" onClick={() => router.push("/tools/cyber-audit/assessment")}>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </span>
            </Button>
          )}
        </motion.div>

        {showPdf && (
          <PdfReport
            reportType={showPdf}
            score={score}
            grade={grade}
            label={label}
            sectionScores={sectionScores}
            gaps={gaps}
            fullName={profile?.full_name}
            companyName={profile?.company_name}
            email={userEmail}
            date={assessment.completed_at}
            industry={industry}
            employeeCount={assessment.employee_count}
            hasInsurance={assessment.has_insurance}
            onClose={() => setShowPdf(null)}
          />
        )}

        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </div>
    </div>
  )
}
