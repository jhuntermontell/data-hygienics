import Link from "next/link"
import Image from "next/image"
import { FOOTER_COLUMNS, SITE } from "@/lib/site"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"

// The footer is a night surface (design/brand-book/personality.md): the
// white lockup, the independence rule as a readout, and the link columns from
// lib/site.js FOOTER_COLUMNS under mono labels.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-night text-night-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20">
        <FoldRule tone="night" />
        <div className="mt-10 flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:w-80 shrink-0">
            <Link href="/" className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
              <Image src="/brand/logo-horizontal-white.svg" alt="Data Hygienics" width={919} height={220} unoptimized className="h-10 w-auto" />
            </Link>
            <p className="mt-6 font-display font-semibold text-[1.375rem] leading-tight tracking-[-0.01em]">{SITE.tagline.replace(/\.$/, "")}</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-night-ink-2">
              The independent field guide to living and working securely alongside AI, for households and small
              businesses.
            </p>
            <Readout tone="night" className="mt-5">
              No sponsors · No referral fees · No affiliate links
            </Readout>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <Readout as="p" tone="night" label className="mb-4">
                  {column.title}
                </Readout>
                <ul className="space-y-2.5 list-none p-0 m-0">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-night-ink-2 hover:text-white hover:underline underline-offset-4 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-night-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Some pages render the footer on the client, so the year can differ
              from a page prerendered in an earlier year. */}
          <Readout tone="night" suppressHydrationWarning>
            &copy; {year} {SITE.name} · All rights reserved
          </Readout>
          <p className="text-sm text-night-ink-2">
            Researched, sourced and dated.{" "}
            <Link href="/how-it-works" className="text-white underline underline-offset-4 decoration-night-line-2 hover:decoration-white">
              See how we work
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
