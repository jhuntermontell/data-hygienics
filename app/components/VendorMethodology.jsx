"use client"

import { useState } from "react"
import { ChevronDown, Scale } from "lucide-react"

/**
 * Collapsible "How we score this" disclosure block rendered at the bottom
 * of every vendor scorecard. Covers the four items the scorecard review
 * needs to surface to remain defensible:
 *
 *   1. How scores are calculated (rubric weights + banding thresholds)
 *   2. What sources are used (primary vendor docs + public disclosures)
 *   3. How often scorecards are reviewed (monthly rollup, per-vendor
 *      lastReviewed field drives the displayed date on each page)
 *   4. Data Hygienics independence statement (no affiliate / referral /
 *      financial relationship with any vendor scored)
 *
 * Kept as a client component so the open/closed state lives in the DOM.
 * The default state is collapsed so the rest of the page is not pushed
 * down by a wall of process text.
 */
export default function VendorMethodology() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="vendor-methodology-body"
        className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 text-[#1D4ED8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              How we score this
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Rubric, sources, review cadence, independence disclosure
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#475569] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id="vendor-methodology-body"
          className="px-6 pb-6 pt-2 border-t border-[#F1F5F9]"
        >
          <div className="space-y-5 text-sm text-[#475569] leading-relaxed">
            <section>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                How the score is calculated
              </h4>
              <p>
                Every vendor is scored out of 100 points across six
                weighted categories: Encryption (20), Access Controls
                (20), Compliance Certifications (20), Transparency (15),
                Breach History (15), and SMB Fit (10). The total maps to
                a band: Strong (85-100), Adequate (70-84), Marginal
                (60-69), Caution (below 60). The band is derived from the
                numeric score at render time so the two cannot drift.
              </p>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                What sources we use
              </h4>
              <p className="mb-2">
                Factual claims in each scorecard are sourced from a mix of:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  The vendor's own trust center, security page, and
                  compliance portal (linked in the Sources section above).
                </li>
                <li>
                  Vendor-published incident disclosures and security
                  advisories, where applicable.
                </li>
                <li>
                  Public records: the NVD CVE database, published SOC 3
                  reports, FedRAMP Marketplace listings, and the HHS OCR
                  breach portal when a healthcare incident is referenced.
                </li>
                <li>
                  Our own review grounded in NIST CSF 2.0 and CIS Controls
                  v8, which shapes the rubric weights above.
                </li>
              </ul>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Each scorecard's Sources block lists the specific URLs used
                for that vendor. Claims we cannot verify through a primary
                source are not included in the review.
              </p>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                How often scorecards are reviewed
              </h4>
              <p>
                Each vendor carries an independent <em>Last reviewed</em>
                {" "}date, shown in the byline at the top of the page. We
                re-verify vendor content at least quarterly, and
                immediately when we become aware of a material change: a
                new breach disclosure, a new CVE that affects small-
                business deployments, a change in HIPAA BAA availability,
                or a change in a vendor's compliance certification status.
                If a scorecard's review date is older than three months,
                treat the content as a snapshot rather than a live assessment.
              </p>
            </section>

            <section>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                Our independence
              </h4>
              <p>
                Data Hygienics has no affiliate, referral, reseller, or
                financial relationship with any vendor scored on these
                pages. We do not receive payment, product discounts,
                advertising revenue, or any other consideration from the
                vendors we review. Scorecards reflect our independent
                assessment of the security posture each vendor offers to
                small and mid-sized businesses. If a vendor disputes a
                factual claim in a scorecard, we will review the source
                and publish a correction if warranted.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
