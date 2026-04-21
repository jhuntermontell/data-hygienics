import { notFound } from "next/navigation"
import Link from "next/link"
import { VENDORS, getScoreBand } from "@/lib/vendors"
import SchemaScript from "@/app/components/SchemaScript"
import AuthorByline from "@/app/components/AuthorByline"
import TLDR from "@/app/components/TLDR"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import VendorMethodology from "@/app/components/VendorMethodology"
import { articleSchema, faqSchema } from "@/lib/schema"
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Eye,
  History,
  Building2,
  ExternalLink,
  HelpCircle,
  BookOpen,
} from "lucide-react"

export async function generateStaticParams() {
  return VENDORS.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const vendor = VENDORS.find((v) => v.slug === slug)
  if (!vendor) return {}
  return {
    title: `Is ${vendor.name} Secure for Small Business? 2026 Review | Data Hygienics`,
    description: vendor.tldr.slice(0, 160),
    alternates: { canonical: `https://datahygienics.com/vendors/${slug}` },
  }
}

const bandColors = {
  Strong: "bg-[#ECFDF5] text-[#059669] border-[#059669]/20",
  Adequate: "bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20",
  Marginal: "bg-orange-50 text-orange-700 border-orange-200",
  Caution: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20",
}

const categoryLabels = {
  encryption: { label: "Encryption", icon: Lock },
  accessControls: { label: "Access Controls", icon: Shield },
  complianceCerts: { label: "Compliance Certifications", icon: CheckCircle },
  transparency: { label: "Transparency", icon: Eye },
  breachHistory: { label: "Breach History", icon: History },
  smbFit: { label: "SMB Fit", icon: Building2 },
}

function ScoreBar({ score, max }) {
  const pct = (score / max) * 100
  let color = "bg-[#059669]"
  if (pct < 55) color = "bg-[#DC2626]"
  else if (pct < 70) color = "bg-orange-500"
  else if (pct < 85) color = "bg-[#D97706]"
  return (
    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default async function VendorPage({ params }) {
  const { slug } = await params
  const vendor = VENDORS.find((v) => v.slug === slug)
  if (!vendor) notFound()

  // Per-vendor review date. Stored on the vendor row in YYYY-MM format so
  // each vendor can be updated independently. We expand to an ISO date
  // for the article schema (day = 01 of the review month) and format a
  // display string for the author byline.
  const reviewMonth = vendor.lastReviewed || "2026-04"
  const reviewDate = `${reviewMonth}-01`
  const reviewDisplay = new Date(reviewDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  const visibleFaqs = vendor.faqs || []

  // Derive the band from the numeric score. Single source of truth lives
  // in lib/vendors.js — see getScoreBand.
  const band = getScoreBand(vendor.score)

  const schemas = [
    articleSchema({
      title: `Is ${vendor.name} Secure for Small Business? 2026 Review`,
      description: vendor.tldr,
      slug: `/vendors/${slug}`,
      lastReviewed: reviewDate,
      datePublished: "2026-04-08",
    }),
  ]
  if (visibleFaqs.length > 0) {
    schemas.push(faqSchema(visibleFaqs))
  }

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          {/* Back */}
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All Vendor Scorecards
          </Link>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#1D4ED8]" />
            <span className="text-[#1D4ED8] text-xs font-semibold tracking-widest uppercase">
              Vendor Scorecard
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] leading-tight tracking-tight mb-2">
            Is {vendor.name} Secure for Small Business?
          </h1>
          <p className="text-sm text-[#94A3B8] mb-2">2026 Independent Security Review</p>

          <AuthorByline showFull={true} lastReviewed={reviewDisplay} />
          <TLDR summary={vendor.tldr} />

          {/* Score badge */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-5xl font-black text-[#0F172A]">{vendor.score}</p>
                <p className="text-xs text-[#94A3B8] mt-1">out of 100</p>
              </div>
              <div>
                <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border ${bandColors[band]}`}>
                  {band}
                </span>
                <div className="flex items-center gap-3 mt-3">
                  {vendor.hipaa_baa ? (
                    <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-full">HIPAA BAA Available</span>
                  ) : (
                    <span className="text-xs font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2.5 py-1 rounded-full">No HIPAA BAA</span>
                  )}
                </div>
              </div>
            </div>

            {/* Rubric table */}
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(vendor.categories).map(([key, cat]) => {
                const meta = categoryLabels[key]
                const Icon = meta.icon
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#475569]" />
                        <span className="text-sm font-medium text-[#0F172A]">{meta.label}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]">{cat.score}/{cat.max}</span>
                    </div>
                    <ScoreBar score={cat.score} max={cat.max} />
                    <p className="text-xs text-[#94A3B8] mt-1">{cat.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rubric explanation */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">How We Score</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-[#475569]">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-2 pr-4 font-semibold text-[#0F172A]">Category</th>
                    <th className="text-right py-2 font-semibold text-[#0F172A]">Max Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#F1F5F9]"><td className="py-1.5">Encryption</td><td className="text-right">20</td></tr>
                  <tr className="border-b border-[#F1F5F9]"><td className="py-1.5">Access Controls</td><td className="text-right">20</td></tr>
                  <tr className="border-b border-[#F1F5F9]"><td className="py-1.5">Compliance Certifications</td><td className="text-right">20</td></tr>
                  <tr className="border-b border-[#F1F5F9]"><td className="py-1.5">Transparency</td><td className="text-right">15</td></tr>
                  <tr className="border-b border-[#F1F5F9]"><td className="py-1.5">Breach History</td><td className="text-right">15</td></tr>
                  <tr><td className="py-1.5">SMB Fit</td><td className="text-right">10</td></tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">85-100: Strong</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706]">70-84: Adequate</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">55-69: Marginal</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626]">Below 55: Caution</span>
            </div>
          </div>

          {/* Key Finding */}
          <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A] mb-3">Key Finding</h2>
            <p className="text-[#475569] text-sm leading-relaxed">{vendor.keyFinding}</p>
          </div>

          {/* Verdict */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A] mb-3">Bottom Line</h2>
            <p className="text-[#475569] text-sm leading-relaxed">{vendor.verdict}</p>
          </div>

          {/* Industry Notes */}
          {Object.keys(vendor.industryNotes).length > 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#475569]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Industry Verdicts</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(vendor.industryNotes).map(([industry, note]) => (
                  <div key={industry}>
                    <h3 className="text-xs font-semibold text-[#0F172A] mb-1">{industry}</h3>
                    <p className="text-[#475569] text-sm leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What To Do */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">What You Should Do</h2>
            <div className="space-y-3">
              {vendor.whatToDo.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EFF6FF] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust / Security links */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">Official Resources</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={vendor.trustUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1"
              >
                {vendor.name} Trust Center <ExternalLink className="w-3 h-3" />
              </Link>
              {vendor.securityUrl && vendor.securityUrl !== vendor.trustUrl && (
                <Link
                  href={vendor.securityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1"
                >
                  Security Details <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* FAQ */}
          {visibleFaqs.length > 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-[#475569]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-6">
                {visibleFaqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{faq.question}</h3>
                    <p className="text-[#475569] text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources — primary authoritative references for the factual
              claims on this page. Rendered as a numbered list so readers
              and auditors can cross-check every assertion against the
              vendor's own documentation or a public record. */}
          {Array.isArray(vendor.sources) && vendor.sources.length > 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#475569]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Sources</h2>
              </div>
              <p className="text-xs text-[#94A3B8] mb-5">
                Every factual claim in this scorecard is sourced from the
                following primary references: the vendor's own trust and
                security documentation, vendor-authored incident
                disclosures, and public records such as NVD CVE entries
                and FedRAMP Marketplace listings. Last verified{" "}
                {reviewDisplay}.
              </p>
              <ol className="space-y-3 list-decimal list-outside pl-5">
                {vendor.sources.map((source, i) => (
                  <li
                    key={i}
                    className="text-sm text-[#475569] leading-relaxed"
                  >
                    <Link
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D4ED8] hover:text-[#1E40AF] font-medium inline-flex items-center gap-1"
                    >
                      {source.label}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    {source.claim && (
                      <span className="block text-xs text-[#94A3B8] mt-0.5">
                        {source.claim}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Methodology accordion — how we score, sources used, review
              cadence, and independence disclosure. Collapsible by default
              so the rest of the page is not pushed down by process text. */}
          <VendorMethodology />

          {/* CTA */}
          <div className="text-center pt-6">
            <p className="text-[#475569] text-sm mb-4">
              Want to assess your full security posture, not just one vendor?
            </p>
            <Link
              href="/tools/cyber-audit"
              className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1E40AF] transition-colors"
            >
              Take the free assessment
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
