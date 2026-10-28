"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Mail, MailCheck } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { loadLocal } from "@/lib/path/storage"
import { EVENTS, track } from "@/lib/analytics"

const ACCENTS = {
  home: { button: "bg-[#0F766E] hover:bg-[#115E59]", link: "text-[#0F766E]", icon: "text-[#0F8F83]", field: "focus:border-[#0F766E] focus:ring-[#0F766E]/25" },
  business: { button: "bg-[#1D4ED8] hover:bg-[#1E40AF]", link: "text-[#1D4ED8]", icon: "text-[#1D4ED8]", field: "focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/25" },
}

const ERRORS = {
  link: "That link didn't work. Sign-in links expire, work once, and only open in the browser that asked for them. Send yourself a new one below.",
  soon: "We can't send another link just yet. Wait a minute, then send a new one.",
  send: "We couldn't send the link just now. Check the address and try again.",
}

// Supabase allows one email per address per minute (its default). A refused
// send also clears the sign-in code this browser is holding, which breaks the
// link already in the inbox, so "Send it again" waits out the minute.
const RESEND_AFTER_MS = 60_000

// Passwordless save for a Clear Path: an email address and a Supabase magic
// link, nothing else. The link lands on /auth/callback, which signs the
// person in and returns them to /path/<audience>; usePathRecord then pushes
// the copy saved in this browser up to the account. That only works if the
// link is opened in this browser, which is also where the sign-in started.
// Reached from the path's SaveCard, so never before the path reveal.
export default function SavePath() {
  const params = useSearchParams()
  const audience = params.get("for") === "business" ? "business" : "home"
  const back = `/path/${audience}`
  const styles = ACCENTS[audience]
  const [checking, setChecking] = useState(true)
  // No finished path here: someone opening a path saved on another device.
  const [hasPath, setHasPath] = useState(true)
  const [email, setEmail] = useState("")
  const [sentTo, setSentTo] = useState("")
  const [error, setError] = useState(params.get("error") === "link" ? ERRORS.link : "")
  const [sending, setSending] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const inFlight = useRef(false)
  const resendTimer = useRef(null)
  const heading = useRef(null)

  useEffect(() => () => clearTimeout(resendTimer.current), [])

  function holdResend() {
    setCanResend(false)
    clearTimeout(resendTimer.current)
    resendTimer.current = setTimeout(() => setCanResend(true), RESEND_AFTER_MS)
  }

  useEffect(() => {
    let cancelled = false
    setHasPath(Boolean(loadLocal(audience)?.answers?.completedAt))
    getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return
        // Already signed in: the path page saves to the account on its own.
        if (session) window.location.replace(back)
        else setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [audience, back])

  // Keep keyboard and screen reader users in step when the screen changes.
  useEffect(() => {
    if (!checking) heading.current?.focus()
  }, [checking, sentTo])

  async function send(address) {
    if (inFlight.current) return
    inFlight.current = true
    setSending(true)
    setError("")
    try {
      const { error: otpError } = await getSupabaseBrowserClient().auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(back)}` },
      })
      if (otpError?.status === 429) {
        setError(ERRORS.soon)
        holdResend()
      } else if (otpError) {
        setError(ERRORS.send)
      } else {
        // A save, not someone opening a path saved elsewhere. Resends count
        // once: the first link is the decision to save.
        if (hasPath && !sentTo) track(EVENTS.pathSaved, { audience })
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

  if (checking) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center" role="status">
        <span className="w-6 h-6 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  const backLink = (
    <Link
      href={back}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A]"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      {hasPath ? "Back to your path" : "Back to Clear Path"}
    </Link>
  )

  const errorNote = error ? (
    <p role="alert" className="mt-4 border border-[#B91C1C]/20 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
      {error}
    </p>
  ) : null

  if (sentTo) {
    return (
      <div>
        {backLink}
        <section className="mt-6 border border-[#E2E8F0] bg-white p-6 sm:p-8">
          <MailCheck className={`w-8 h-8 ${styles.icon}`} aria-hidden="true" />
          <h1 ref={heading} tabIndex={-1} className="mt-4 text-2xl sm:text-3xl font-display font-semibold tracking-[-0.02em] text-[#0F172A] outline-none">
            Check your email
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">
            We sent a link to <strong className="font-semibold text-[#0F172A] break-all">{sentTo}</strong>. Open it in this
            browser {hasPath ? "to finish saving your path." : "to see your path here."}
          </p>
          <p className="mt-2 text-sm text-[#475569]">
            It can take a minute to arrive. Not there? Check your spam or junk folder.
          </p>
          {errorNote}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => send(sentTo)}
              disabled={sending || !canResend}
              className={`inline-flex items-center px-3.5 py-2 text-sm font-semibold ${styles.link} hover:bg-[#F1F5F9] disabled:opacity-60 disabled:hover:bg-transparent`}
            >
              {sending ? "Sending..." : canResend ? "Send it again" : "Send it again in a minute"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSentTo("")
                setError("")
              }}
              className="inline-flex items-center px-3.5 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            >
              Use a different email
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      {backLink}
      <section className="mt-6 border border-[#E2E8F0] bg-white p-6 sm:p-8">
        <p className="readout-label text-[#0F172A]">Clear Path</p>
        <h1 ref={heading} tabIndex={-1} className="mt-2 text-2xl sm:text-3xl font-display font-semibold tracking-[-0.02em] text-[#0F172A] outline-none">
          {hasPath ? "Save your path" : "Open your saved path"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#334155]">
          {hasPath
            ? "Enter your email and we'll send you a link. Open it in this browser and your path is saved to a free account, ready on your phone or any other device. No password to make up."
            : "Saved your path on another device? Enter the same email and we'll send you a link. Open it in this browser and your path appears here. No password needed."}
        </p>
        {errorNote}
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault()
            send(email.trim())
          }}
        >
          <label htmlFor="save-email" className="block text-sm font-semibold text-[#0F172A]">
            Email address
          </label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
            <input
              id="save-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full border border-[#CBD5E1] bg-white py-3 pl-10 pr-4 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 ${styles.field}`}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-60 ${styles.button}`}
          >
            {sending ? "Sending..." : "Email me a link"}
            {sending ? null : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
          </button>
        </form>
        <p className="mt-5 text-sm leading-relaxed text-[#475569]">
          We save your answers and which steps you&apos;ve done, nothing else. Your email is only for signing you in: we
          don&apos;t sell it or share it with advertisers.{" "}
          <Link href="/privacy" className={`font-semibold underline underline-offset-2 ${styles.link}`}>
            Privacy policy
          </Link>
        </p>
      </section>
      <p className="mt-4 text-sm text-[#475569]">
        Signed up with a password before?{" "}
        <Link
          href={`/tools/cyber-audit/login?next=${encodeURIComponent(back)}`}
          className={`font-semibold underline underline-offset-2 ${styles.link}`}
        >
          Sign in with it
        </Link>
      </p>
    </div>
  )
}
