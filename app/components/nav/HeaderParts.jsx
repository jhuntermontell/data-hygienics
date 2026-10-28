"use client"
import Link from "next/link"
import { NAV } from "@/lib/site"

// The Threat Check door: the one outlined action in the header, on every
// page, signed in or not. A small teal hexagon marks it.
export function DoorLink({ tone = "day", onClick, current = false, label = NAV.door.label }) {
  const colors =
    tone === "night"
      ? "border-white text-white hover:bg-night-raised"
      : "border-[#0F172A] text-[#0F172A] hover:bg-[#F8FAFC]"
  return (
    <Link
      href={NAV.door.href}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={`inline-flex items-center gap-2 h-10 px-2.5 sm:px-4 border text-[0.8125rem] sm:text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83] ${colors}`}
    >
      <span aria-hidden="true" className="w-[7px] h-[7px] bg-[#0F8F83] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
      {/* Below 360px only the mark shows; the label stays for screen readers. */}
      <span className="max-[359px]:sr-only">{label}</span>
    </Link>
  )
}

// A 40px square icon button with a 1px border; pairs sit flush together.
export function SquareButton({ tone = "day", label, onClick, expanded, controls, buttonRef, className = "", children }) {
  const colors =
    tone === "night"
      ? "border-night-line-2 text-white hover:bg-night-raised"
      : "border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-haspopup="dialog"
      className={`w-10 h-10 grid place-items-center border cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83] ${colors} ${className}`}
    >
      {children}
    </button>
  )
}
