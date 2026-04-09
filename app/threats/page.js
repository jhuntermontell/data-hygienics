import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import AuthorByline from "@/app/components/AuthorByline"
import { articleSchema, organizationSchema } from "@/lib/schema"
import { threats } from "@/lib/threats"
import { AlertTriangle, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Cybersecurity Threats by Industry | Data Hygienics",
  description:
    "Industry-specific cybersecurity threat guides for healthcare, legal, and financial services. Grounded in FBI and Verizon DBIR data, written for non-technical business leaders.",
  alternates: { canonical: "https://datahygienics.com/threats" },
}

const industryAccent = {
  Healthcare: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20",
  Legal: "bg-[#EFF6FF] text-[#1D4ED8] border-blue-200",
  "Financial Services": "bg-[#ECFDF5] text-[#059669] border-[#059669]/20",
}

export default function ThreatsIndexPage() {
  const schemas = [
    articleSchema({
      title: "Cybersecurity Threats by Industry",
      description:
        "Industry-specific cybersecurity threat guides for healthcare, legal, and financial services.",
      slug: "/threats",
      lastReviewed: "2026-04-08",
      datePublished: "2026-04-08",
    }),
    organizationSchema(),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            <span className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase">
              Threat Library
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            Cybersecurity Threats
            <br />
            by Industry
          </h1>
          <p className="text-[#475569] text-base max-w-2xl mb-2">
            Every industry faces cybersecurity threats, but the attacks that
            hit a medical practice look different from the ones targeting a
            law firm or an accounting office. These pages break down the
            specific threats facing your industry, grounded in data from the
            FBI and the Verizon Data Breach Investigations Report, and written
            for the people actually running the business.
          </p>
          <AuthorByline showFull={true} lastReviewed="April 2026" />

          <div className="rounded-2xl border border-[#059669]/20 bg-[#ECFDF5] p-5 mb-10">
            <p className="text-[#059669] text-sm font-medium text-center">
              Free to read. No account, no email gate. Just the information
              small business owners need to make informed security decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {threats.map((threat) => (
              <Link
                key={threat.slug}
                href={`/threats/${threat.slug}`}
                className="block rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      industryAccent[threat.industry] ||
                      "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"
                    }`}
                  >
                    {threat.industry}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8] transition-colors shrink-0 mt-0.5" />
                </div>
                <h2 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors mb-2">
                  {threat.industry}
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {threat.industryDescription}
                </p>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <span className="text-[11px] font-semibold text-[#1D4ED8] inline-flex items-center gap-1">
                    Read the guide
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
