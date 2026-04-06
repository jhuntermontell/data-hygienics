import Link from "next/link"

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#tools", label: "Tools" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#contact", label: "Contact" },
]

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-black text-white text-lg tracking-tight">
              Data<span className="text-blue-400">Hygienics</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-zinc-600 text-sm">
            Modern tools for real businesses.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">
            &copy; 2025 Data Hygienics, LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
