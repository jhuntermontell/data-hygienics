"use client"
import { motion } from "framer-motion"
import {
  Shield,
  FileText,
  BookOpen,
  AlertTriangle,
  Store,
  LifeBuoy,
  FileCheck2,
  Sparkles,
  GraduationCap,
  ClipboardList,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export const activeTools = [
  {
    icon: Shield,
    name: "Cyber Audit",
    badge: "Free to start",
    headline: "Know where you stand",
    body: "Start with a free 5-minute security check or dive deep with our comprehensive industry-specific audit.",
    cta: "Start Assessment",
    href: "/tools/cyber-audit",
  },
  {
    icon: FileText,
    name: "Policy Library",
    badge: "9 policies",
    headline: "The policies your insurance requires, ready in minutes",
    body: "Built from NIST and SANS frameworks and customized to your company. Download as a branded PDF.",
    cta: "Explore Policies",
    href: "/tools/policies",
  },
  {
    icon: LifeBuoy,
    name: "Incident Response Planner",
    badge: "Interactive",
    headline: "A real plan for when things go wrong",
    body: "Build a personalized incident response plan with step-by-step guided workflows, real-time action logging, and tabletop exercises your insurance broker will recognize.",
    cta: "Build Your Plan",
    href: "/tools/ir-plan",
  },
  {
    icon: BookOpen,
    name: "Controls Library",
    badge: "Free forever",
    headline: "Every cybersecurity control, explained for real people",
    body: "What each control means, why it matters. You determine if business needs it.",
    cta: "Browse Controls",
    href: "/controls",
  },
  {
    icon: AlertTriangle,
    name: "Threat Library",
    badge: "By industry",
    headline: "The threats targeting your industry right now",
    body: "Real attack patterns explained for business leaders, not security analysts.",
    cta: "View Threats",
    href: "/threats",
  },
]

export const comingSoonTools = [
  {
    icon: Store,
    name: "Vendor Reviews",
    headline: "Is your software actually secure?",
    body: "Plain-English security reviews of the tools your business already uses. No sponsorships or affiliate links.",
  },
  {
    icon: FileCheck2,
    name: "Insurance Readiness",
    headline: "Speak your carrier's language",
    body: "See exactly how your security posture maps to what Coalition, Cowbell, and Travelers ask on their applications.",
  },
  {
    icon: Sparkles,
    name: "AI Readiness",
    headline: "AI is here. Make sure you're ready.",
    body: "Find out what AI tools fit your business, what risks they introduce, and how to protect your data while using them.",
  },
  {
    icon: GraduationCap,
    name: "Glossary",
    headline: "Cybersecurity jargon, translated",
    body: "Every term you've nodded along to in a meeting but never actually understood, now in plain English. This is a judgement free zone.",
  },
  {
    icon: ClipboardList,
    name: "Compliance Checklists",
    headline: "Does your industry have rules? Find out.",
    body: "HIPAA, PCI, CMMC, SOC 2. A plain-English checklist of what applies to your business and whether you're meeting it.",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function ActiveToolCard({ tool }) {
  const Icon = tool.icon
  return (
    <motion.div
      variants={item}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-7 flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#1D4ED8]" />
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] tracking-wide uppercase">
          {tool.badge}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-snug">{tool.headline}</h3>
      <p className="text-[#475569] text-sm leading-relaxed mb-5 flex-1">{tool.body}</p>
      <Link
        href={tool.href}
        className="inline-flex items-center gap-1 text-[#1D4ED8] hover:text-[#1E40AF] text-sm font-semibold transition-colors"
      >
        {tool.cta} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  )
}

export function ComingSoonCard({ tool }) {
  const Icon = tool.icon
  return (
    <motion.div
      variants={item}
      className="rounded-xl border border-[#E5E7EB] p-7 flex flex-col"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="w-11 h-11 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#94A3B8]" />
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] tracking-wide uppercase">
          Coming Soon
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-snug">{tool.headline}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{tool.body}</p>
    </motion.div>
  )
}

export function ToolsGrid({ showHeader = true }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {showHeader && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="text-[#1D4ED8] text-xs font-medium tracking-wide">
              Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-2 leading-tight tracking-tight">
              Security tools built for your business
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#475569] text-base max-w-xl mb-14"
          >
            Professional-grade cybersecurity tools, designed for the people actually running the business.
          </motion.p>
        </>
      )}

      {/* Active tools: 2x2 grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {activeTools.map((tool) => (
          <ActiveToolCard key={tool.name} tool={tool} />
        ))}
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-14">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <p className="text-[#94A3B8] text-xs font-medium tracking-wider uppercase">On the horizon</p>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      {/* Coming soon tools: 3x2 grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {comingSoonTools.map((tool) => (
          <ComingSoonCard key={tool.name} tool={tool} />
        ))}
      </motion.div>
    </div>
  )
}

export default function ToolsPreview() {
  return (
    <section id="tools" className="py-24 bg-white">
      <ToolsGrid />
    </section>
  )
}
