"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NAV } from "@/lib/site"
import { formatDate } from "@/lib/content"
import { useSearchIndex } from "@/lib/hooks/useSearchIndex"
import FoldRule from "../brand/FoldRule"
import Readout from "../brand/Readout"
import Overlay from "./Overlay"

const START = [
  ...NAV.primary,
  NAV.library.find((l) => l.href === "/digital-sovereignty"),
  NAV.start,
].filter(Boolean)
const LIBRARY = NAV.library.filter((l) => l.href !== "/digital-sovereignty")
// The Threat Check heads the tools; NAV.door.description is its secondary line.
const TOOLS = [NAV.door, ...NAV.businessTools]
const KIND = { verdict: "Verdict", guide: "Guide", threat: "Threat", explainer: "Digital Sovereignty" }

function isCurrent(pathname, href) {
  if (!pathname || href.includes("#")) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Column({ label, children }) {
  return (
    <div>
      <FoldRule tone="night" />
      <Readout as="p" tone="night" label className="mt-3.5 mb-5">
        {label}
      </Readout>
      {children}
    </div>
  )
}

function NamedLinks({ links, pathname, onClose }) {
  return (
    <ul className="list-none m-0 p-0 grid gap-4">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onClose}
            aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
            className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]"
          >
            <span className="block font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em] group-hover:text-night-accent group-aria-[current=page]:text-night-accent">
              {link.label}
            </span>
            {link.description ? <span className="block mt-1 text-[0.9375rem] leading-snug text-night-ink-2">{link.description}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function SiteMenu({ open, onClose, pathname, ready, user, firstName, memberSlot, onSignOut }) {
  const { index } = useSearchIndex(open)
  const counts = index?.counts

  return (
    <Overlay id="site-menu" label="Menu" open={open} onClose={onClose}>
      <nav aria-label="Site" className="grid gap-10 lg:grid-cols-[1.15fr_1fr_1fr] pt-10 pb-12">
        <Column label="Start">
          <ul className="list-none m-0 p-0 grid gap-1.5">
            {START.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                  className="font-display font-semibold text-[2rem] sm:text-[2.75rem] leading-[1.12] tracking-[-0.025em] hover:text-night-accent aria-[current=page]:text-night-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>
        <Column label="Library">
          <NamedLinks links={LIBRARY} pathname={pathname} onClose={onClose} />
        </Column>
        <Column label="Tools">
          <NamedLinks links={TOOLS} pathname={pathname} onClose={onClose} />
          <Link
            href="/tools"
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4 decoration-night-line-2 hover:decoration-white rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]"
          >
            All business tools
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </Column>
      </nav>

      {index ? (
        <section aria-label="New in the library" className="grid gap-8 md:grid-cols-3 pb-12">
          {index.latest.map((entry) => (
            <div key={entry.href}>
              <FoldRule tone="night" />
              <Readout tone="night" label className="mt-3.5">
                New · {KIND[entry.kind] || "Entry"} · {formatDate(entry.published)}
              </Readout>
              <Link href={entry.href} onClick={onClose} className="mt-2 block text-[1.0625rem] leading-snug hover:text-night-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
                {entry.title}
              </Link>
            </div>
          ))}
          {counts ? (
            <div>
              <FoldRule tone="night" />
              <Readout tone="night" label className="mt-3.5">
                The library
              </Readout>
              <p className="mt-2 text-[1.0625rem] leading-snug text-night-ink-2">
                {counts.verdicts} verdicts · {counts.guides} guides · {counts.threats} threats · {counts.steps} steps. Every number sourced.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-6 mb-6 border-t border-night-line text-[0.9375rem]">
        {!ready ? null : user ? (
          <>
            <span className="text-night-ink-2">Hi, {firstName || "there"}</span>
            {memberSlot ? (
              <Link href={memberSlot.href} onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">
                {memberSlot.label}
              </Link>
            ) : null}
            <Link href="/tools/cyber-audit/dashboard" onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">Dashboard</Link>
            <Link href="/tools/cyber-audit/results" onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">My Assessments</Link>
            <Link href="/tools/policies" onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">My Policies</Link>
            <button type="button" onClick={onSignOut} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white cursor-pointer">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/tools/cyber-audit/login" onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">Sign in</Link>
            <Link href={NAV.members.href} onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">{NAV.members.label}</Link>
          </>
        )}
        <Link href="/how-it-works" onClick={onClose} className="underline underline-offset-4 decoration-night-line-2 hover:decoration-white">How we work</Link>
      </div>
    </Overlay>
  )
}
