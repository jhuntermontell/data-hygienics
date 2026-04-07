"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { getQuestionsForIndustry } from "@/lib/questions"
import {
  calculateSectionScores,
  getLetterGrade,
  getGaps,
} from "@/lib/cyber-audit/scoring"
import Navbar from "@/app/components/Navbar"
import ScoreGauge from "../components/ScoreGauge"
import SectionBreakdown from "../components/SectionBreakdown"
import GapList from "../components/GapList"
import UpgradeModal from "../components/UpgradeModal"
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
  const [showPdf, setShowPdf] = useState(null) // null | "insurance" | "remediation"
  const [showUpgrade, setShowUpgrade] = useState(false)
  // TODO: Connect Stripe - check actual subscription status
  const isPaid = false

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/tools/cyber-audit/login")
      setUserEmail(user.email)

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(profileData)

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  const industry = assessment.industry || "Other / General Business"
  const sections = getQuestionsForIndustry(industry)
  const score = assessment.score
  const { grade, label, color } = getLetterGrade(
    score,
    industry,
    assessment.employee_count
  )
  const sectionScores = assessment.section_scores
    ? JSON.parse(assessment.section_scores)
    : calculateSectionScores(answers, sections)
  const gaps = getGaps(answers, sections)
  const summary = getSummary(score, assessment.has_insurance)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
              Cyber Audit Results
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Your Security Report</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-zinc-500 text-sm">
              Completed{" "}
              {new Date(assessment.completed_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {assessment.industry && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500 text-xs font-medium">{assessment.industry}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Insurance warning */}
        {assessment.has_insurance === "No" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 mb-8 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-300 text-sm font-semibold mb-1">No Cyber Insurance Detected</p>
              <p className="text-orange-300/70 text-xs leading-relaxed">
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
          className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={score} />
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <span className={`text-6xl font-black ${color}`}>{grade}</span>
                <span className={`text-lg font-semibold ${color}`}>
                  {label}
                </span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
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
          className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8 mb-8"
        >
          <SectionBreakdown sectionScores={sectionScores} />
        </motion.div>

        {/* Gap list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8 mb-8"
        >
          <GapList gaps={gaps} isPaid={isPaid} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-3"
        >
          <Button onClick={() => isPaid ? setShowPdf("insurance") : setShowUpgrade(true)}>
            <span className="flex items-center gap-2">
              {isPaid ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Insurance Report
            </span>
          </Button>
          <Button variant="outline" onClick={() => isPaid ? setShowPdf("remediation") : setShowUpgrade(true)}>
            <span className="flex items-center gap-2">
              {isPaid ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Remediation Report
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/tools/cyber-audit/dashboard")}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/tools/cyber-audit/assessment")}
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </span>
          </Button>
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

        {showUpgrade && (
          <UpgradeModal onClose={() => setShowUpgrade(false)} />
        )}
      </div>
    </div>
  )
}
