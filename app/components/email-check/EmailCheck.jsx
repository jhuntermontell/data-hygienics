"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { normalizeDomain, normalizeSelector, DOMAIN_ERRORS } from "@/lib/email-check/domain"
import { explain, formatCheckedAt, STATE_LABELS, LINKS } from "@/lib/email-check/explain"

// The free email spoofing check. The domain goes to /api/email-check in a POST
// body and the answer comes back as plain data; explain() turns it into words
// here. Nothing is saved in the browser either.

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"

export default function EmailCheck() {
  const [domain, setDomain] = useState("")
  const [selector, setSelector] = useState("")
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const inFlight = useRef(false)
  const resultsHeading = useRef(null)
  const ids = { domain: useId(), selector: useId(), error: useId(), selectorHint: useId(), results: useId() }

  // Move keyboard focus to the results once they render, so a screen reader
  // or keyboard user lands on what changed.
  useEffect(() => {
    if (status === "done" && report) resultsHeading.current?.focus()
  }, [status, report])

  async function onSubmit(event) {
    event.preventDefault()
    if (inFlight.current) return

    const checkedDomain = normalizeDomain(domain)
    if (!checkedDomain.ok) {
      setError({ field: "domain", message: DOMAIN_ERRORS[checkedDomain.reason] })
      return
    }
    const checkedSelector = normalizeSelector(selector)
    if (!checkedSelector.ok) {
      setError({ field: "selector", message: DOMAIN_ERRORS.selector })
      return
    }

    inFlight.current = true
    setError(null)
    setStatus("loading")
    try {
      const response = await fetch("/api/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: checkedDomain.domain, selector: checkedSelector.selector }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.result) {
        setError({ field: data?.error === "selector" ? "selector" : "form", message: data?.message || "The check didn't finish. Try again in a minute." })
        setStatus(report ? "done" : "idle")
        return
      }
      setReport(explain(data.result))
      setStatus("done")
    } catch {
      setError({ field: "form", message: "We couldn't reach the check. Check your connection and try again." })
      setStatus(report ? "done" : "idle")
    } finally {
      inFlight.current = false
    }
  }

  const loading = status === "loading"
  const domainError = error?.field === "domain"
  const selectorError = error?.field === "selector"

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="border border-[#E2E8F0] bg-white p-5 sm:p-7">
        <label htmlFor={ids.domain} className="block font-display font-semibold text-[1.0625rem] text-[#0F172A]">
          Your email domain
        </label>
        <p className="mt-1 text-[0.9375rem] text-[#475569]">The part after the @ in your work email address, such as yourbusiness.com.</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <input
            id={ids.domain}
            name="domain"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            aria-invalid={domainError || undefined}
            aria-describedby={error && error.field !== "selector" ? ids.error : undefined}
            placeholder="yourbusiness.com"
            className={`min-w-0 flex-1 border ${domainError ? "border-[#B91C1C]" : "border-[#CBD5E1]"} bg-white px-3.5 py-3 text-base text-[#0F172A] placeholder:text-[#94A3B8] ${FOCUS_RING}`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 bg-[#1D4ED8] px-5 py-3 text-base font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-70 ${FOCUS_RING}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />
                Checking
              </>
            ) : (
              "Check my domain"
            )}
          </button>
        </div>

        <details className="mt-4 group" open={selectorError || undefined}>
          <summary className={`cursor-pointer text-[0.9375rem] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] ${FOCUS_RING}`}>
            Know your DKIM selector? Add it
          </summary>
          <div className="mt-3">
            <label htmlFor={ids.selector} className="block text-[0.9375rem] font-semibold text-[#0F172A]">
              DKIM selector (optional)
            </label>
            <p id={ids.selectorHint} className="mt-1 text-[0.9375rem] text-[#475569]">
              The name your sending service publishes its key under, such as google or selector1. You&apos;ll find it after s= in the DKIM-Signature line of a message you sent.
            </p>
            <input
              id={ids.selector}
              name="selector"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={selector}
              onChange={(event) => setSelector(event.target.value)}
              aria-invalid={selectorError || undefined}
              aria-describedby={selectorError ? `${ids.selectorHint} ${ids.error}` : ids.selectorHint}
              className={`mt-2 w-full sm:max-w-xs border ${selectorError ? "border-[#B91C1C]" : "border-[#CBD5E1]"} bg-white px-3.5 py-2.5 text-base text-[#0F172A] ${FOCUS_RING}`}
            />
          </div>
        </details>

        {error ? (
          <p id={ids.error} role="alert" className="mt-4 text-[0.9375rem] font-medium text-[#B91C1C]">
            {error.message}
          </p>
        ) : null}

        <p className="mt-5 text-[0.875rem] text-[#64748B]">
          This reads public DNS records only. It sees nothing inside your mailbox, and we don&apos;t store the domain you check.
        </p>
      </form>

      <section aria-live="polite" aria-busy={loading} aria-labelledby={report ? ids.results : undefined} className="mt-10">
        {report ? <Report report={report} headingId={ids.results} headingRef={resultsHeading} /> : null}
      </section>
    </div>
  )
}

function Report({ report, headingId, headingRef }) {
  const checkedOn = formatCheckedAt(report.checkedAt)
  return (
    <div>
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="font-display font-semibold text-[1.75rem] sm:text-[2rem] leading-tight tracking-[-0.02em] text-[#0F172A] break-words focus:outline-none"
      >
        What {report.domain} publishes
      </h2>
      {checkedOn ? <p className="mt-2 readout text-day-readout">{checkedOn}</p> : null}
      <p className="mt-4 text-[1.0625rem] leading-relaxed text-[#334155]">{report.mail}</p>

      {report.records.length > 0 ? (
        <ol className="mt-8 space-y-6">
          {report.records.map((record) => (
            <li key={record.key}>
              <RecordReadout record={record} checkedOn={checkedOn} />
            </li>
          ))}
        </ol>
      ) : null}

      {report.records.length > 0 ? (
        <div className="mt-8 border-t border-[#E2E8F0] pt-6">
          <p className="text-[0.9375rem] leading-relaxed text-[#475569]">
            Someone else runs your email? The step page has a short message you can send them, asking for each of these records.
          </p>
          <Link
            href={LINKS.step.href}
            className={`mt-2 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] ${FOCUS_RING}`}
          >
            {LINKS.step.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function RecordReadout({ record, checkedOn }) {
  const headingId = `record-${record.key}`
  return (
    <article aria-labelledby={headingId} className="border border-[#E2E8F0] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 id={headingId} className="font-display font-semibold text-[1.3125rem] leading-tight text-[#0F172A]">
          {record.name}
          <span className="ml-2 font-sans font-normal text-[0.9375rem] text-[#64748B]">{record.fullName}</span>
        </h3>
        <p className="readout-label text-[#334155] border border-[#CBD5E1] px-2 py-1">{STATE_LABELS[record.state]}</p>
      </div>

      {record.raw.length > 0 ? (
        <div className="mt-4 space-y-3">
          {record.raw.map(({ name, value }, index) => (
            <figure key={`${name}-${index}`}>
              <figcaption className="readout-label text-day-readout normal-case tracking-normal break-all">{name}</figcaption>
              <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-all bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-3 font-readout text-[0.8125rem] leading-relaxed text-[#0F172A]">
                {value}
              </pre>
            </figure>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-[1rem] leading-relaxed text-[#334155]">{record.meaning}</p>
      {record.details.length > 0 ? (
        <ul className="mt-3 space-y-1.5 list-disc pl-5 text-[0.9375rem] leading-relaxed text-[#475569]">
          {record.details.map((detail) => (
            <li key={detail} className="break-words">{detail}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 border-t border-[#E2E8F0] pt-4">
        <p className="readout-label text-day-readout">What to do next</p>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[#334155]">{record.next.text}</p>
        {record.next.link ? (
          <Link
            href={record.next.link.href}
            className={`mt-2 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] ${FOCUS_RING}`}
          >
            {record.next.link.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {checkedOn ? <p className="mt-4 readout text-day-readout">{checkedOn}</p> : null}
    </article>
  )
}
