import Link from "next/link"

const links = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/controls", label: "Controls Library" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/logo.svg" alt="Data Hygienics" className="h-7 w-auto" />
            </div>
            <p className="text-[#94A3B8] text-sm max-w-xs">
              The unbiased cybersecurity platform for small business.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#475569] hover:text-[#0F172A] text-sm transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#F1F5F9] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#94A3B8] text-xs">
            &copy; {new Date().getFullYear()} Data Hygienics, LLC.
          </p>
          <p className="text-[#94A3B8] text-xs">
            Cybersecurity clarity for every business.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#94A3B8] hover:text-[#475569] text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#94A3B8] hover:text-[#475569] text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
