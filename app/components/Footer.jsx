import Link from "next/link"

const platformLinks = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/tools/policies", label: "Policy Library" },
  { href: "/vendors", label: "Vendor Scorecards" },
  { href: "/controls", label: "Controls Library" },
  { href: "/threats", label: "Threat Library" },
  { href: "/pricing", label: "Pricing" },
]

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Left: branding */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/logo.svg" alt="Data Hygienics" className="h-7 w-auto" />
            </div>
            <p className="text-[#475569] text-sm mb-3">
              The cybersecurity platform for small business.
            </p>
          </div>

          {/* Right: sitemap columns */}
          <div className="flex gap-16">
            <div>
              <p className="text-[#0F172A] text-xs font-semibold tracking-wider uppercase mb-4">Platform</p>
              <ul className="space-y-2.5">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[#0F172A] text-xs font-semibold tracking-wider uppercase mb-4">Company</p>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#94A3B8] text-xs">
            &copy; 2026 Data Hygienics. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[#94A3B8] text-xs">
            <Link href="/privacy" className="hover:text-[#475569] transition-colors">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-[#475569] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
