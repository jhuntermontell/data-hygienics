import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import Link from "next/link"
import { ShieldCheck, Scale, Lightbulb, Briefcase, Building2, Heart, Landmark, DollarSign, HardHat } from "lucide-react"

const beliefs = [
  {
    icon: Lightbulb,
    title: "Clarity is a right, not a luxury.",
    text: "Every business owner deserves to understand their cybersecurity posture in plain English. Not just the ones who can afford a dedicated security team.",
  },
  {
    icon: Scale,
    title: "Independence matters.",
    text: "We do not sell security products. We do not earn referral fees. We have no financial relationship with any vendor. That independence is the foundation everything else is built on.",
  },
  {
    icon: ShieldCheck,
    title: "Knowledge changes outcomes.",
    text: "When a CFO can walk into a conversation with their IT provider and ask the right questions, better decisions get made. We exist to make that possible.",
  },
]

const industries = [
  { icon: Briefcase, label: "Small Businesses" },
  { icon: Scale, label: "Law Firms" },
  { icon: Heart, label: "Medical Practices" },
  { icon: Building2, label: "Nonprofits and Churches" },
  { icon: DollarSign, label: "Financial Services" },
  { icon: Landmark, label: "Government Contractors" },
]

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[#0F172A]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Built from the inside out.
            </h1>
            <p className="mt-4 text-lg text-[#475569] max-w-2xl mx-auto">
              Data Hygienics exists because the gap between cybersecurity expertise and the people who need it most is too wide, and too costly, to ignore.
            </p>
          </div>
        </section>

        {/* Founding Story */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Pull quote */}
            <blockquote className="border-l-4 border-[#1D4ED8] pl-6 py-2 mb-12">
              <p className="text-xl sm:text-2xl font-semibold text-[#0F172A] leading-relaxed italic">
                &ldquo;I have watched capable, intelligent business leaders get talked into solutions they did not need. Not because they were not smart, but because the information gap was too wide and the incentives were pointed the wrong way.&rdquo;
              </p>
              <cite className="block mt-4 text-sm text-[#94A3B8] not-italic font-medium">
                Hunter, Founder
              </cite>
            </blockquote>

            <div className="space-y-6 text-[#475569] text-lg leading-relaxed">
              <p>
                The insight that built Data Hygienics did not come from a boardroom. It came from years of working inside organizations that had everything at stake and not enough clarity to protect it.
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
                In the private sector, working with a managed service provider, he saw it again across dozens of organizations: nonprofits, law firms, hospitals, financial firms, small businesses across nearly every industry. Leaders who wanted to do the right thing but could not get a straight answer about what the right thing was.
              </p>
              <p>
                The cybersecurity industry had built remarkable tools. It just had not built them for the people running the business.
              </p>
              <p>
                Data Hygienics is the platform Hunter wished had existed for every client he ever worked with. Independent, plain-English, and built with one purpose: to give the people running small businesses the same quality of cybersecurity clarity that large enterprises pay consultants hundreds of dollars an hour to receive.
              </p>
              <p>
                He is now a software developer with a deep belief that technology should serve people, not mystify them. This is where that belief lives.
              </p>
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="py-16 px-6 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-12">
              What we believe.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {beliefs.map((b) => {
                const Icon = b.icon
                return (
                  <div key={b.title} className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-sm">
                    <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-[#1D4ED8]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">{b.title}</h3>
                    <p className="text-[#475569] text-sm leading-relaxed">{b.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-12">
              Built for organizations like yours.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
              {industries.map((ind) => {
                const Icon = ind.icon
                return (
                  <div key={ind.label} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] px-5 py-4">
                    <Icon className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                    <span className="text-sm font-medium text-[#0F172A]">{ind.label}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-center text-[#475569] text-base">
              If cybersecurity landed in your lap, this platform was built for you.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 px-6 bg-[#1D4ED8]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to see where you stand?
            </h2>
            <p className="text-blue-100 text-base mb-8">
              Start with the free assessment. No credit card. No sales call. Results in under 20 minutes.
            </p>
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center bg-white text-[#1D4ED8] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
            >
              Start the Free Assessment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
