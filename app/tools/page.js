import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import Link from "next/link"
import { Shield, FileText, BookOpen, ArrowRight, LifeBuoy, MessageCircle } from "lucide-react"

export const metadata = {
  title: "Business Tools for AI-Era Security | Data Hygienics",
  description: "Plain-English security tools for small businesses working alongside AI: a scored Cyber Audit, a Policy Library with an AI Acceptable Use Policy, and an incident response planner.",
  alternates: { canonical: "https://datahygienics.com/tools" },
}

const activeTools = [
  {
    icon: Shield,
    name: "Cyber Audit",
    badge: "Live",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8]",
    description: "Start with the free 5-minute Quick Check, or take the full 20 to 30 minute audit tailored to your industry, including how your team uses AI tools and what data goes into them. The full audit maps to the National Institute of Standards and Technology (NIST) Cybersecurity Framework 2.0 and the Center for Internet Security (CIS) Controls. You get a plain-English score and two PDFs: a summary you can share, and a plan that tells your team what to fix first.",
    consequence: "AI makes phishing emails cleaner and fake voices convincing. Knowing your gaps, including the AI ones, tells you where to start.",
    cta: "Start the free Quick Check",
    href: "/tools/cyber-audit",
  },
  {
    icon: FileText,
    name: "Policy Library",
    badge: "Live",
    badgeColor: "bg-[#F0FDFA] text-[#0F766E]",
    description: "Generate the nine security policies a small business actually needs, customized to your organization, in under an hour. Start with the AI Acceptable Use Policy, free with a free account: a short rule for which AI tools your team can use and what data stays out of them. Each policy draws on guidance from NIST, the SANS Institute (a security training body) and ISACA (an IT audit association), and the Documentation Pack includes all nine.",
    consequence: "Your team may already use AI tools at work, with or without a rule. A written policy turns guesswork into a shared standard.",
    cta: "Browse policies",
    href: "/tools/policies",
  },
  {
    icon: LifeBuoy,
    name: "Incident Response Planner",
    badge: "Live",
    badgeColor: "bg-[#FEE2E2] text-[#DC2626]",
    description: "Build a personalized incident response plan, rehearse it with tabletop exercises (guided practice run-throughs), and keep the timestamped notes your team, your lawyer and your insurer (if you have one) will ask for. Scenarios include deepfake payment fraud and an employee pasting client data into a chatbot.",
    consequence: "Ransomware (malware that locks your files for a ransom), business email compromise and deepfake payment requests move fast. A plan that is written, tested, and reachable outside your normal network gives your team a decision path before stress takes over.",
    cta: "Build your plan",
    href: "/tools/ir-plan",
  },
  {
    icon: MessageCircle,
    name: "Ask Data Hygienics",
    badge: "Members",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8]",
    description: "Ask a question about securing your home or small business and get a short answer drawn only from our published research, with a link to every page it uses. When our research doesn't cover something, it says we don't know yet. Included with Ongoing Protection and the Documentation Pack.",
    consequence: null,
    cta: "Ask a question",
    href: "/tools/ask",
  },
  {
    icon: BookOpen,
    name: "Controls Library",
    badge: "Free",
    badgeColor: "bg-[#ECFDF5] text-[#059669]",
    description: "Every core security control explained in plain English, with no account required: what it means, why it matters, and how it applies to your industry. Includes controls for AI acceptable use and for checking payment requests through a second channel. Mapped to the NIST Cybersecurity Framework 2.0 and CIS Controls v8, with notes for healthcare, financial services, retail and government contractors.",
    consequence: null,
    cta: "Browse controls",
    href: "/controls",
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
            Business tools
          </h1>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Security tools for the owner, office manager, or whoever got handed IT at a small organization. Built for AI-era threats, written in plain English, and the only thing we sell.
          </p>
        </div>
      </section>

      {/* Active Tools */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-10">Available now</h2>
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

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1D4ED8]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Start with what you have</h2>
          <p className="text-blue-100 text-base mb-8">
            Start with the free Quick Check, browse the Controls Library or get the AI Acceptable Use Policy (free with a free account). None of it needs a credit card or a sales call. Upgrade when you&apos;re ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center bg-white text-[#1D4ED8] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
            >
              Start the free Quick Check
            </Link>
            <Link
              href="/controls"
              className="inline-flex items-center border border-white/40 text-white font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all"
            >
              Browse controls
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
