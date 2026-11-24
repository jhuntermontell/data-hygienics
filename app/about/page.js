import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import Link from "next/link"
import { ShieldCheck, Scale, Lightbulb, Briefcase, Building2, Heart, Laptop, DollarSign, House, Sparkles } from "lucide-react"
import { breadcrumbSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"

export const metadata = {
  title: "About Data Hygienics",
  description: "Data Hygienics is the independent field guide to living and working securely alongside AI, for households and small businesses.",
  alternates: { canonical: `${SITE.url}/about` },
}

const beliefs = [
  {
    icon: Lightbulb,
    title: "Clarity is a right, not a luxury",
    text: "Every household and every business owner deserves to understand their security in plain English. Not just the ones who can afford a dedicated security team.",
  },
  {
    icon: Scale,
    title: "Independence matters",
    text: "We sell only our own membership and business tools, and we say so wherever they appear. We take no referral fees, use no affiliate links and have no financial relationship with any company we write about. That independence is the foundation for everything else.",
  },
  {
    icon: ShieldCheck,
    title: "Knowledge changes outcomes",
    text: "When an owner or office manager can walk into a conversation with their IT provider and ask the right questions, better decisions get made. We exist to make that possible.",
  },
]

const industries = [
  { icon: House, label: "Households and Families" },
  { icon: Briefcase, label: "Small Businesses" },
  { icon: Heart, label: "Medical Practices" },
  { icon: Building2, label: "Owner-run offices" },
  { icon: DollarSign, label: "Financial Services" },
  { icon: Laptop, label: "Solo creators and remote workers" },
]

export default function About() {
  return (
    <>
      <SchemaScript
        schema={[
          breadcrumbSchema([
            { name: "Data Hygienics", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <Navbar surface="night" />
      <main className="min-h-screen bg-white text-[#0F172A]">
        {/* Hero */}
        <section aria-labelledby="about-title" className="bg-night text-night-ink px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto">
            <FoldRule tone="night" draw />
            <Readout tone="night" label className="mt-7">
              About Data Hygienics
            </Readout>
            <h1 id="about-title" className="mt-4 max-w-4xl font-display font-semibold text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] leading-[1.02] tracking-[-0.03em] text-balance">
              Built from the inside out
            </h1>
            <p className="mt-6 max-w-2xl text-lg sm:text-[1.1875rem] leading-relaxed text-night-ink-2">
              Data Hygienics exists because the gap between cybersecurity expertise and the people who need it most is too wide, and too costly, to ignore.
            </p>
          </div>
        </section>

        {/* AI-era mission */}
        <section aria-labelledby="mission-heading" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-3xl mx-auto border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#0F766E]" aria-hidden="true" />
              <h2 id="mission-heading" className="font-display font-semibold text-[1.5rem] sm:text-[1.75rem] tracking-[-0.015em] text-[#0F172A]">
                The mission, updated for AI
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-[#475569] text-lg leading-relaxed">
              <p>
                AI changed the job. The tools that help you draft an email also help a scammer clone a voice, polish a phishing message or fake an invoice.
              </p>
              <p>
                So Data Hygienics became the independent field guide to living and working securely alongside AI, for households and small businesses. We research first, cite every number, and tell you what to do next.
              </p>
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <FoldRule />
            <h2 className="mt-7 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-[#0F172A] mb-12">
              What we believe
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-6">
              {beliefs.map((b) => {
                const Icon = b.icon
                return (
                  <div key={b.title}>
                    <FoldRule />
                    <Icon className="mt-5 w-5 h-5 text-[#0F766E]" aria-hidden="true" />
                    <h3 className="mt-3 font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em] text-[#0F172A]">{b.title}</h3>
                    <p className="mt-2 text-[#475569] text-[0.9375rem] leading-relaxed">{b.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-[#0F172A] mb-12 max-w-3xl text-balance">
              Built for households and organizations like yours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              {industries.map((ind) => {
                const Icon = ind.icon
                return (
                  <div key={ind.label} className="flex items-center gap-3 bg-white border border-[#E2E8F0] px-5 py-4">
                    <Icon className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                    <span className="text-sm font-medium text-[#0F172A]">{ind.label}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-[#475569] text-base">
              If security landed in your lap, at home or at work, this was built for you.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section aria-labelledby="about-cta-heading" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
            <h2 id="about-cta-heading" className="font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-[#0F172A] mb-3">
              Start where you are
            </h2>
            <p className="text-[#475569] text-base">
              Pick a door. Everything we publish is free to read.
            </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/household"
                className="inline-flex items-center justify-center gap-2 bg-[#0F766E] text-white font-semibold text-[15px] px-6 h-12 hover:bg-[#115E59] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
              >
                <House className="w-4 h-4" aria-hidden="true" />
                For my home
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white font-semibold text-[15px] px-6 h-12 hover:bg-[#1E40AF] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                For my business
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
