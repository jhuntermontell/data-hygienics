import Link from "next/link"
import Image from "next/image"
import { FOOTER_COLUMNS, SITE } from "@/lib/site"

// Columns come from lib/site.js FOOTER_COLUMNS.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:w-72 shrink-0">
            <Link href="/" className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]">
              <Image src="/logo.svg" alt="Data Hygienics" width={160} height={32} unoptimized className="h-7 w-auto" />
            </Link>
            <p className="mt-4 text-[#0F172A] font-semibold">{SITE.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              The independent field guide to living and working securely alongside AI, for households and small
              businesses.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#475569]">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0F766E]" />
              No sponsors. No referral fees. No affiliate links.
            </p>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[#0F172A] text-xs font-semibold tracking-wider uppercase mb-4">{column.title}</p>
                <ul className="space-y-2.5 list-none p-0 m-0">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors">
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
        <div className="mt-12 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Some pages render the footer on the client, so the year can differ
              from a page prerendered in an earlier year. */}
          <p className="text-[#94A3B8] text-xs" suppressHydrationWarning>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-[#94A3B8] text-xs">
            Researched, sourced and dated.{" "}
            <Link href="/how-it-works" className="text-[#475569] hover:text-[#0F172A] underline underline-offset-2">
              See how we work
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
