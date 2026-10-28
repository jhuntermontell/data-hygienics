import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import Link from "next/link"
import { ShieldCheck, Scale, Lightbulb, Briefcase, Building2, Heart, Laptop, DollarSign, Award, ExternalLink, House, Sparkles } from "lucide-react"
import { breadcrumbSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"

export const metadata = {
  title: "About Data Hygienics | Hunter Montell, CompTIA Security+",
  description: "Data Hygienics was built by Hunter Montell, a CompTIA Security+ certified practitioner, to help households and small businesses live securely alongside AI.",
  alternates: { canonical: `${SITE.url}/about` },
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hunter Montell",
  url: "https://datahygienics.com/about",
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Data Hygienics" },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "CompTIA Security+",
      url: "https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url",
    },
    { "@type": "EducationalOccupationalCredential", name: "CompTIA A+" },
    { "@type": "EducationalOccupationalCredential", name: "CompTIA Network+" },
  ],
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

const credentials = [
  {
    name: "CompTIA Security+",
    detail: "Industry-standard cybersecurity certification",
    href: "https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url",
  },
  {
    name: "NIST Cybersecurity Framework 2.0",
    detail: "Direct implementation experience via SAIC (US government contractor)",
    href: "https://www.nist.gov/cyberframework",
  },
  {
    name: "CIS Controls v8",
    detail: "Framework deployment experience via Element Technologies, LLC (managed IT provider)",
    href: "https://www.cisecurity.org/controls",
  },
  {
    name: "CompTIA A+",
    detail: "IT fundamentals and troubleshooting (TestOut certified)",
    href: null,
  },
  {
    name: "CompTIA Network+",
    detail: "Networking infrastructure and operations (TestOut certified)",
    href: null,
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
          personSchema,
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

        {/* Founding Story */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <blockquote className="border-l-[3px] border-[#0F8F83] pl-6 py-2 mb-12">
              <p className="font-display font-medium text-[1.375rem] sm:text-[1.625rem] text-[#0F172A] leading-[1.35] tracking-[-0.01em]">
                &ldquo;I have watched capable, intelligent business leaders get talked into solutions they did not need. Not because they were not smart, but because the information gap was too wide and the incentives were pointed the wrong way.&rdquo;
              </p>
              <cite className="readout block mt-4 text-day-readout not-italic">
                Hunter, Founder
              </cite>
            </blockquote>

            <div className="space-y-6 text-[#475569] text-lg leading-relaxed">
              <p>
                Hunter built Data Hygienics to solve a problem that every non-technical business owner runs into sooner or later: cybersecurity guidance that actually makes sense. He has direct experience implementing NIST Cybersecurity Framework 2.0 controls for US government contractors at SAIC, and he led CIS Controls v8 deployments at Element Technologies, LLC, a managed IT provider. That background means he has seen both sides of the security gap firsthand.
              </p>
              <p>
                Early in his career, Hunter worked as an incident response analyst for a Native American tribal nation, responsible for securing federal government infrastructure, casinos, museums, and hospitals. These were communities depending on systems most people never think about. Getting it wrong had real consequences for real people.
              </p>
              <p>
                That work led to a role with the United States federal government, where Hunter worked alongside dozens of department heads to assess and strengthen their security environments. What he kept seeing was the same dynamic: decision-makers who were smart, capable, and completely without the language or the tools to advocate for themselves in technical conversations.
              </p>
              <p>
                The expertise was always on one side of the table. The authority and the accountability were on the other. That gap is where bad decisions get made.
              </p>
              <p>
                In the private sector, working with a managed IT provider, he saw it again across dozens of organizations: nonprofits, professional services firms, hospitals, financial firms, small businesses across nearly every industry. Leaders who wanted to do the right thing but could not get a straight answer about what the right thing was.
              </p>
              <p>
                The cybersecurity industry had built remarkable tools. It just had not built them for the people running the business.
              </p>
              <p>
                The CompTIA Security+ credential, alongside A+ and Network+ certifications, grounds this work in verified, standards-aligned practice. Data Hygienics is the resource Hunter wished existed when he was working with small business clients who had real risk and no clear path forward.
              </p>
              <p>
                He is now a software developer with a deep belief that technology should serve people, not mystify them. This is where that belief lives.
              </p>
            </div>
          </div>
        </section>

        {/* AI-era mission */}
        <section aria-labelledby="mission-heading" className="pb-16 sm:pb-24 px-4 sm:px-6 bg-white">
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

        {/* Credentials */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-[#1D4ED8]" />
              <h2 className="font-display font-semibold text-[1.75rem] tracking-[-0.02em] text-[#0F172A]">Credentials</h2>
            </div>
            <div className="space-y-4">
              {credentials.map((cred) => (
                <div key={cred.name} className="flex items-start gap-4 bg-white border border-[#E2E8F0] p-5">
                  <ShieldCheck className="w-5 h-5 text-[#1D4ED8] mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-[1.0625rem] text-[#0F172A]">{cred.name}</h3>
                      {cred.href && (
                        <Link href={cred.href} target="_blank" rel="noopener noreferrer"
                          className="text-[#1D4ED8] hover:text-[#1E40AF]">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-[#475569] mt-0.5">{cred.detail}</p>
                  </div>
                </div>
              ))}
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
