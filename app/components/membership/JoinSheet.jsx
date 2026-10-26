"use client"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Mail, MailCheck, X } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const ACCENTS = {
  home: { button: "bg-[#0F766E] hover:bg-[#115E59]", link: "text-[#0F766E]", icon: "text-[#0F8F83]", field: "focus:border-[#0F766E] focus:ring-[#0F766E]/25" },
  business: { button: "bg-[#1D4ED8] hover:bg-[#1E40AF]", link: "text-[#1D4ED8]", icon: "text-[#1D4ED8]", field: "focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/25" },
}

const ERRORS = {
  soon: "We can't send another link just yet. Wait a minute, then send a new one.",
  send: "We couldn't send the link just now. Check the address and try again.",
}

// Supabase allows one email per address per minute; see SavePath.
const RESEND_AFTER_MS = 60_000

// Inline sign-in for a signed-out visitor who pressed Join on the pricing
// page: an email address and the same Supabase magic link the Path's save
// uses (signInWithOtp through /auth/callback). The link comes back to
// /pricing?door=<door>&checkout=1, where the page starts checkout for that
// door's monthly price. An inline panel, not a modal.
export default function JoinSheet({ door = "home", onClose }) {
  const styles = ACCENTS[door] || ACCENTS.home
  const [email, setEmail] = useState("")
  const [sentTo, setSentTo] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const inFlight = useRef(false)
  const resendTimer = useRef(null)
  const heading = useRef(null)
  const field = useRef(null)
  const fieldId = `join-email-${door}`

  useEffect(() => () => clearTimeout(resendTimer.current), [])

  // Focus the field when the sheet opens, and the heading once a link is sent.
  useEffect(() => {
    if (sentTo) heading.current?.focus()
    else field.current?.focus()
  }, [sentTo])

  function holdResend() {
    setCanResend(false)
    clearTimeout(resendTimer.current)
    resendTimer.current = setTimeout(() => setCanResend(true), RESEND_AFTER_MS)
  }

  async function send(address) {
    if (inFlight.current || !address) return
    inFlight.current = true
    setSending(true)
    setError("")
    const next = `/pricing?door=${door}&checkout=1`
    try {
      const { error: otpError } = await getSupabaseBrowserClient().auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      })
      if (otpError?.status === 429) {
        setError(ERRORS.soon)
        holdResend()
      } else if (otpError) {
        setError(ERRORS.send)
      } else {
        setSentTo(address)
        holdResend()
      }
    } catch {
      setError(ERRORS.send)
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  const errorNote = error ? (
    <p role="alert" className="mt-3 rounded-xl border border-[#B91C1C]/20 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
      {error}
    </p>
  ) : null

  return (
    <div className="relative mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-left">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}

      {sentTo ? (
        <div aria-live="polite">
          <MailCheck className={`w-6 h-6 ${styles.icon}`} aria-hidden="true" />
          <h3 ref={heading} tabIndex={-1} className="mt-2 text-base font-semibold text-[#0F172A] outline-none">
            Check your email
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#334155]">
            We sent a link to <strong className="font-semibold text-[#0F172A] break-all">{sentTo}</strong>. Open it in this
            browser and checkout opens on its own.
          </p>
          {errorNote}
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => send(sentTo)}
              disabled={sending || !canResend}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${styles.link} hover:bg-[#F1F5F9] disabled:opacity-60 disabled:hover:bg-transparent`}
            >
              {sending ? "Sending…" : canResend ? "Send it again" : "Send it again in a minute"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSentTo("")
                setError("")
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            >
              Use a different email
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(email.trim())
          }}
        >
          <label htmlFor={fieldId} className="block pr-8 text-sm font-semibold text-[#0F172A]">
            Your email
          </label>
          <p className="mt-1 text-sm text-[#475569]">
            One email, no password. We use it to sign you in, then take you to checkout.
          </p>
          <div className="relative mt-3">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
            <input
              ref={field}
              id={fieldId}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-xl border border-[#CBD5E1] bg-white py-3 pl-10 pr-4 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 ${styles.field}`}
            />
          </div>
          {errorNote}
          <button
            type="submit"
            disabled={sending}
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-60 ${styles.button}`}
          >
            {sending ? "Sending…" : "Email me a link"}
            {sending ? null : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
          </button>
        </form>
      )}
    </div>
  )
}
