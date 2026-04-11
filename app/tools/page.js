import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import Link from "next/link"
import { Shield, FileText, ClipboardList, BookOpen, Clock, ArrowRight, Building2 } from "lucide-react"

export const metadata = {
  title: "Security Tools for Small Business | Data Hygienics",
  description: "Professional-grade cybersecurity tools designed for the CFO, office manager, and firm partner. Cyber Audit, Policy Library, Vendor Scorecards, and Controls Library.",
  alternates: { canonical: "https://datahygienics.com/tools" },
}

const activeTools = [
  {
    icon: Shield,
    name: "Cyber Audit",
    badge: "Live",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8]",
    description: "Take a 20-minute industry-specific assessment and get a scored report your insurance broker will recognize. The assessment covers 8 security domains, maps to NIST CSF and CIS Controls, and produces two downloadable PDFs: one formatted for your insurance application, one that tells your team exactly what to fix and in what order. The average small business scores a 62 out of 100 on their first assessment. Now you will know where you stand.",
    consequence: "Coalition, one of the largest cyber insurers in the U.S., reported that 56% of small business claims in 2023 involved ransomware or funds transfer fraud. Knowing your gaps before a claim is filed changes the conversation with your broker.",
    cta: "Start Free Assessment",
    href: "/tools/cyber-audit",
  },
  {
    icon: FileText,
    name: "Policy Library",
    badge: "Live",
    badgeColor: "bg-[#F0FDFA] text-[#0F766E]",
    description: "Generate the nine cybersecurity policies your insurance provider wants to see, customized to your organization, in under an hour. Built from NIST, SANS, and ISACA frameworks and translated into plain English. A law firm paying a consultant to draft these policies would spend between $4,500 and $18,000. You can download all nine for $199.",
    consequence: "The FTC's updated Safeguards Rule, which took effect in 2023, requires financial services firms to maintain a written information security program. Firms without documented policies face civil penalties of up to $100,000 per violation.",
    cta: "Browse Policies",
    href: "/tools/policies",
  },
  {
    icon: ClipboardList,
    name: "Vendor Security Scorecards",
    badge: "Live",
    badgeColor: "bg-[#ECFDF5] text-[#059669]",
    secondBadge: "Free",
    description: "Before your office manager renews the company's Dropbox subscription or your bookkeeper signs up for a new payroll platform, check our vendor scorecard. We score ten of the most common small business tools on encryption, access controls, compliance certifications, breach history, and SMB fit. Dropbox has experienced three distinct security incidents since 2012. QuickBooks cannot enforce MFA across its user base. Now you can make informed decisions about the tools your business already uses.",
    consequence: null,
    cta: "View Scorecards",
    href: "/vendors",
  },
  {
    icon: BookOpen,
    name: "Controls Library",
    badge: "Free",
    badgeColor: "bg-[#ECFDF5] text-[#059669]",
    description: "Every major cybersecurity control explained in plain English. What it means, why insurance underwriters care about it, and how it applies specifically to your industry. Thirty controls mapped to NIST CSF and CIS Controls 18, with industry-specific notes for healthcare, legal, financial services, and government contractors. No account required.",
    consequence: null,
    cta: "Browse Controls",
    href: "/controls",
  },
]

const comingSoon = [
  {
    icon: Building2,
    name: "Client Assessment Portal (MSP / Advisor)",
    description: "For IT providers, insurance brokers, and advisors who run assessments on behalf of clients. Manage up to ten client workspaces, track scores across your book, and produce branded reports under your firm name. Built for the MSP who wants to deliver more value without building the infrastructure from scratch.",
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-4">
            The Security Toolkit Built for Small Business
          </h1>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Professional-grade cybersecurity tools designed for the CFO, office manager, and firm partner who need answers, not another sales pitch.
          </p>
        </div>
      </section>

      {/* Active Tools */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-10">Available Now</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activeTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.name} className="bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1D4ED8]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#0F172A]">{tool.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                      {tool.secondBadge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">{tool.secondBadge}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed mb-4 flex-1">{tool.description}</p>
                  {tool.consequence && (
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 border-l-2 border-[#E2E8F0] pl-3 italic">
                      {tool.consequence}
                    </p>
                  )}
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-[#1D4ED8] text-sm font-semibold hover:text-[#1E40AF] transition-colors"
                  >
                    {tool.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Coming Soon</h2>
          <p className="text-[#475569] text-sm mb-10 max-w-xl">
            More tools are on the way.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {comingSoon.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.name} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm opacity-80">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#475569]">{tool.name}</h3>
                      <span className="text-[9px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> In Development
                      </span>
                    </div>
                  </div>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{tool.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1D4ED8]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Start with what you have.</h2>
          <p className="text-blue-100 text-base mb-8">
            The Cyber Audit and Controls Library are free to use. No credit card. No sales call. Start there and upgrade when you are ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center bg-white text-[#1D4ED8] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/controls"
              className="inline-flex items-center border border-white/40 text-white font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all"
            >
              Browse Controls
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
