import Link from "next/link"

const links = [
  { href: "/tools/cyber-audit", label: "Cyber Audit" },
  { href: "/controls", label: "Controls Library" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/logo.svg" alt="Data Hygienics" className="h-8 w-auto" />
            </div>
            <p className="text-zinc-600 text-sm max-w-xs">
              The unbiased cybersecurity platform for small business.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">
            &copy; {new Date().getFullYear()} Data Hygienics, LLC. All rights reserved.
          </p>
          <p className="text-zinc-700 text-xs italic">
            Built for the reluctant tech leader.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
