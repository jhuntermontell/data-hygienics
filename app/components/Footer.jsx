import Link from "next/link"

const platformLinks = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/tools/policies", label: "Policy Library" },
  { href: "/tools/ir-plan", label: "Incident Response Planner" },
  { href: "/vendors", label: "Vendor Security Scorecards" },
  { href: "/pricing", label: "Pricing" },
]

const resourceLinks = [
  { href: "/controls", label: "Controls Library" },
  { href: "/threats", label: "Threat Library" },
  { href: "/glossary", label: "Glossary" },
  { href: "/tools", label: "Tools" },
]

const companyLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Branding */}
          <div className="col-span-2 md:col-span-1 max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/logo.svg" alt="Data Hygienics" className="h-7 w-auto" />
            </div>
            <p className="text-[#475569] text-sm">
              The cybersecurity platform for small business.
            </p>
          </div>

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
            <p className="text-[#0F172A] text-xs font-semibold tracking-wider uppercase mb-4">Resources</p>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
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

          <div>
            <p className="text-[#0F172A] text-xs font-semibold tracking-wider uppercase mb-4">Legal</p>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#94A3B8] text-xs">
            &copy; 2026 Data Hygienics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
