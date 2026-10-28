"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { NAV } from "@/lib/site"
import { DoorLink } from "./HeaderParts"

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

// A full-screen navy sheet for the menu and the search. It keeps its own
// header row (wordmark, the Threat Check door, Close), traps focus while
// open, closes on Escape, locks page scroll, and returns focus to whatever
// opened it. `initialFocus` is a ref to focus on open (the search field).
export default function Overlay({ id, label, open, onClose, initialFocus, children }) {
  const panelRef = useRef(null)
  const openerRef = useRef(null)
  // Held in a ref so a new onClose each render never re-runs the open effect
  // (which would move focus back to the first field on every keystroke).
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = "hidden"
    const focusFirst = () => {
      const target = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE)
      target?.focus()
    }
    const frame = requestAnimationFrame(focusFirst)

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== "Tab" || !panelRef.current) return
      const list = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("keydown", onKey)
      root.style.overflow = previous
      const opener = openerRef.current
      if (opener && typeof opener.focus === "function" && document.contains(opener)) opener.focus()
    }
  }, [open, initialFocus])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-night text-night-ink motion-safe:animate-[overlay-in_180ms_ease-out]"
    >
      <div className="border-b border-night-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" onClick={onClose} className="flex items-center shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
            <Image src="/brand/logo-horizontal-white.svg" alt="Data Hygienics" width={919} height={220} unoptimized className="h-7 sm:h-9 w-auto" />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <DoorLink tone="night" onClick={onClose} label={NAV.door.label} />
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${label.toLowerCase()}`}
              className="w-10 h-10 grid place-items-center border border-night-line-2 text-night-ink hover:bg-night-raised cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8F83]"
            >
              <X className="w-[18px] h-[18px]" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
    </div>
  )
}
