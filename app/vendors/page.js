import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import AuthorByline from "@/app/components/AuthorByline"
import { articleSchema } from "@/lib/schema"
import { VENDORS, getScoreBand } from "@/lib/vendors"
import { Shield, ArrowRight, ExternalLink } from "lucide-react"

export const metadata = {
  title: "Vendor Security Scorecards for Small Business | Data Hygienics",
  description: "Independent security reviews of the software small businesses actually use. Scored on encryption, access controls, compliance certifications, transparency, breach history, and SMB fit.",
  alternates: { canonical: "https://datahygienics.com/vendors" },
}

const bandColors = {
  Strong: "bg-[#ECFDF5] text-[#059669] border-[#059669]/20",
  Adequate: "bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20",
  Marginal: "bg-orange-50 text-orange-700 border-orange-200",
  Caution: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20",
}

export default function VendorsIndexPage() {
  return (
    <>
      <SchemaScript schema={articleSchema({
        title: "Vendor Security Scorecards for Small Business",
        description: "Independent security reviews of the software small businesses actually use.",
        slug: "/vendors",
        lastReviewed: "2026-04-08",
        datePublished: "2026-04-08",
      })} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Vendor Security Scorecards
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight mb-4">
            Vendor Security Scorecards
          </h1>
          <p className="text-[#475569] text-base max-w-xl mb-2">
            Independent security reviews of the software small businesses actually use. Scored on six categories, grounded in NIST CSF 2.0 and CIS Controls v8.
          </p>
          <AuthorByline showFull={true} lastReviewed="April 2026" />

          <div className="rounded-2xl border border-[#059669]/20 bg-[#ECFDF5] p-5 mb-10">
            <p className="text-[#059669] text-sm font-medium text-center">
              These scorecards are independent. Data Hygienics has no affiliate, referral, or financial relationship with any vendor listed here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {VENDORS.map((vendor) => {
              // Derive the band from the numeric score so it cannot drift
              // from the category breakdown when a score is updated.
              const band = getScoreBand(vendor.score)
              return (
              <Link
                key={vendor.slug}
                href={`/vendors/${vendor.slug}`}
                className="block rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                    {vendor.name}
                  </h2>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8] transition-colors shrink-0 mt-1" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-[#0F172A]">{vendor.score}</span>
                  <span className="text-xs text-[#94A3B8]">/ 100</span>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${bandColors[band]}`}>
                    {band}
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">{vendor.tldr}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F1F5F9]">
                  {vendor.hipaa_baa ? (
                    <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">HIPAA BAA</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">No HIPAA BAA</span>
                  )}
                  <span className="text-[10px] text-[#94A3B8]">
                    Encryption: {vendor.categories.encryption.score}/{vendor.categories.encryption.max}
                  </span>
                </div>
              </Link>
              )
            })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
