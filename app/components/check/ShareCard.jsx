"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Send, Link2, Printer, Check } from "lucide-react"
import BrandMark from "@/app/components/BrandMark"
import { track, EVENTS } from "@/lib/analytics"

// The verdict's share card: the message type, the verdict's if-then line,
// the mark and the short URL. It is a gift, so the main control reads "Send
// this to someone you look out for" and carries a calm, pre-written message
// rather than a bare share icon. Native share where the browser has it,
// otherwise the message and link are copied. Printing a verdict page prints
// only this card, as a half page (app/globals.css, .share-card).

const TONES = {
  home: {
    face: "border-[#E2E8F0]",
    eyebrow: "text-[#0F766E]",
    button: "bg-[#0F766E] hover:bg-[#115E59] focus-visible:outline-[#0F766E]",
  },
  business: {
    face: "border-[#E2E8F0]",
    eyebrow: "text-[#1D4ED8]",
    button: "bg-[#1D4ED8] hover:bg-[#1E40AF] focus-visible:outline-[#1D4ED8]",
  },
}

function shareMessage({ sayThis, tone }) {
  return tone === "business"
    ? `Worth two minutes. This is the rule I'd like us to use: "${sayThis}"`
    : `Saw this and thought of you. It's the rule I'm using: "${sayThis}"`
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function ShareCard({ title, chip, sayThis, url, tone = "home" }) {
  const styles = TONES[tone] || TONES.home
  const message = shareMessage({ sayThis, tone })
  const shortUrl = url.replace(/^https?:\/\/(www\.)?/, "")
  // navigator.share only exists in the browser; decide after mount so the
  // server and client render the same markup first.
  const [canShare, setCanShare] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
  }, [])

  useEffect(() => {
    if (!status) return
    const t = setTimeout(() => setStatus(""), 4000)
    return () => clearTimeout(t)
  }, [status])

  const send = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text: message, url })
        return
      } catch (error) {
        // The person closed the share sheet: nothing to do.
        if (error?.name === "AbortError") return
      }
    }
    const ok = await copyText(`${message}\n${url}`)
    setStatus(ok ? "Message copied. Paste it into a text or email." : "Couldn't copy. Select the message below and copy it.")
  }

  const copyLink = async () => {
    const ok = await copyText(url)
    setStatus(ok ? "Link copied." : "Couldn't copy. The link is on the card above.")
  }

  return (
    <section aria-labelledby="share-heading" className="share-card mt-12">
      <h2 id="share-heading" className="share-controls text-xl sm:text-2xl font-display font-semibold text-[#0F172A] tracking-[-0.02em] mb-1.5">
        Pass it on
      </h2>
      <p className="share-controls text-[#475569] text-[15px] mb-5">
        The person most likely to get this message may not be you. Send the card, or print it for the fridge.
      </p>

      <div className={`share-card-face border bg-[#F8FAFC] shadow-[0_24px_48px_-32px_rgba(15,23,42,0.35)] ${styles.face} p-6 sm:p-8`}>
        <p className={`readout-label mb-3 ${styles.eyebrow}`}>Threat Check</p>
        <p className="font-display text-[1.625rem] sm:text-[2rem] font-semibold text-[#0F172A] leading-tight tracking-[-0.02em] text-balance">{chip}?</p>
        <p className="mt-4 text-lg sm:text-xl leading-snug text-[#334155]">{sayThis}</p>
        <div className="mt-6 flex items-center gap-3">
          <BrandMark className="w-8 h-8 shrink-0" />
          <span className="text-sm font-semibold text-[#0F172A]">Data Hygienics</span>
          <span className="readout text-day-readout break-all">{shortUrl}</span>
        </div>
      </div>

      <div className="share-controls mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <button
          type="button"
          onClick={send}
          className={`inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-3 motion-safe:transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.button}`}
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Send this to someone you look out for
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center justify-center gap-2 border border-[#E2E8F0] bg-white text-[#334155] text-sm font-semibold px-4 py-3 hover:bg-[#F8FAFC] motion-safe:transition-colors cursor-pointer"
        >
          <Link2 className="w-4 h-4" aria-hidden="true" />
          Copy link
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 border border-[#E2E8F0] bg-white text-[#334155] text-sm font-semibold px-4 py-3 hover:bg-[#F8FAFC] motion-safe:transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print the card
        </button>
      </div>

      <p role="status" aria-live="polite" className="share-controls mt-3 min-h-5 text-sm text-[#0F766E] flex items-center gap-1.5">
        {status ? (
          <>
            <Check className="w-4 h-4" aria-hidden="true" />
            {status}
          </>
        ) : null}
      </p>

      <div className="share-controls mt-2 border border-dashed border-[#CBD5E1] bg-white px-4 py-3">
        <p className="text-xs font-semibold text-[#64748B] mb-1">The message we&apos;ll send with the link</p>
        <p className="text-sm text-[#334155] select-all">{message}</p>
      </div>
    </section>
  )
}

// The one chip into the Path at the end of a verdict. It is a Path chip, so
// it reports chip_clicked like the front door's chips do.
export function PathChipLink({ href, audience, value, from, className, children }) {
  return (
    <Link href={href} onClick={() => track(EVENTS.chipClicked, { audience, value, from })} className={className}>
      {children}
    </Link>
  )
}
