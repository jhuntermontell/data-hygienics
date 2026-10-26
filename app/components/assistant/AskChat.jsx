"use client"

// Ask Data Hygienics: the member chat on /tools/ask.
//
// Reads the meter from GET /api/assistant/usage (which also tells us whether
// the reader is a member), then streams answers from POST /api/assistant as
// newline-delimited JSON events (see the header of app/api/assistant/route.js).
// The conversation lives only in this component's state: nothing is saved,
// and it clears when the page closes.
//
// Answers render through a small safe renderer: paragraphs, numbered and
// bulleted lists, **bold**, and markdown links to site paths or https URLs.
// Everything else stays plain text. No HTML from the model reaches the DOM.
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, LifeBuoy, Lock, Send, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { DAILY_MESSAGE_CAP, MAX_QUESTION_CHARS, MONTHLY_TOKEN_CAP } from "@/lib/assistant/limits"

const STARTERS = [
  "Someone says they're from my bank's fraud team. What do I do?",
  "How do I help my parents spot a cloned-voice call?",
  "Do we need a written rule for how staff use AI tools?",
]

const fmt = (n) => Number(n || 0).toLocaleString("en-US")

async function authHeaders() {
  try {
    const {
      data: { session },
    } = await createClient().auth.getSession()
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  } catch {
    return {}
  }
}

// ── Safe markdown subset ────────────────────────────────────────────────

const INLINE = /\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*/g

function safeHref(href) {
  if (/^\/(?!\/)/.test(href)) return { href, internal: true }
  if (/^https:\/\/datahygienics\.com(\/|$)/i.test(href)) {
    return { href: href.replace(/^https:\/\/datahygienics\.com/i, "") || "/", internal: true }
  }
  if (/^https:\/\/[^\s"'<>]+$/i.test(href)) return { href, internal: false }
  return null
}

function renderInline(text, keyPrefix) {
  const out = []
  let last = 0
  let i = 0
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `${keyPrefix}-${i++}`
    if (match[1]) {
      const link = safeHref(match[2])
      if (!link) {
        out.push(match[1])
      } else if (link.internal) {
        out.push(
          <Link key={key} href={link.href} className="text-[#1D4ED8] font-medium underline underline-offset-2 hover:text-[#1E40AF]">
            {match[1]}
          </Link>
        )
      } else {
        out.push(
          <a key={key} href={link.href} target="_blank" rel="noopener noreferrer nofollow" className="text-[#1D4ED8] font-medium underline underline-offset-2 hover:text-[#1E40AF]">
            {match[1]}
          </a>
        )
      }
    } else if (match[3]) {
      out.push(<strong key={key} className="font-semibold text-[#0F172A]">{match[3]}</strong>)
    }
    last = match.index + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function AnswerText({ text }) {
  const blocks = []
  let list = null
  const flush = () => {
    if (list) blocks.push(list)
    list = null
  }
  text.split("\n").forEach((raw) => {
    const line = raw.trim()
    const ordered = line.match(/^(\d+)[.)]\s+(.*)$/)
    const bullet = line.match(/^[-*•]\s+(.*)$/)
    if (ordered || bullet) {
      const type = ordered ? "ol" : "ul"
      if (!list || list.type !== type) {
        flush()
        list = { type, items: [], start: ordered ? Number(ordered[1]) : 1 }
      }
      list.items.push(ordered ? ordered[2] : bullet[1])
      return
    }
    flush()
    if (!line) return
    const heading = line.match(/^#{1,4}\s+(.*)$/)
    blocks.push({ type: heading ? "h" : "p", text: heading ? heading[1] : line })
  })
  flush()

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-[#334155]">
      {blocks.map((block, b) => {
        if (block.type === "ol" || block.type === "ul") {
          const Tag = block.type
          return (
            <Tag
              key={b}
              start={block.type === "ol" && block.start !== 1 ? block.start : undefined}
              className={`${block.type === "ol" ? "list-decimal" : "list-disc"} pl-5 space-y-1.5 marker:text-[#94A3B8]`}
            >
              {block.items.map((item, i) => (
                <li key={i}>{renderInline(item, `${b}-${i}`)}</li>
              ))}
            </Tag>
          )
        }
        if (block.type === "h") {
          return <p key={b} className="font-semibold text-[#0F172A]">{renderInline(block.text, `${b}`)}</p>
        }
        return <p key={b}>{renderInline(block.text, `${b}`)}</p>
      })}
    </div>
  )
}

// ── States ──────────────────────────────────────────────────────────────

function UsageMeter({ usage }) {
  if (!usage) return null
  const share = Math.min(100, Math.round((usage.monthUsed / (usage.monthCap || MONTHLY_TOKEN_CAP)) * 100))
  return (
    <div className="text-xs text-[#475569]">
      <p>
        {fmt(usage.messagesToday)} of {fmt(usage.dailyCap || DAILY_MESSAGE_CAP)} messages today
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        {fmt(usage.monthUsed)} of {fmt(usage.monthCap || MONTHLY_TOKEN_CAP)} tokens this month
      </p>
      <div className="mt-1.5 h-1 w-full max-w-xs rounded-full bg-[#E2E8F0] overflow-hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-[#1D4ED8]" style={{ width: `${share}%` }} />
      </div>
    </div>
  )
}

function NotMember() {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
          <Lock className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-[#0F172A]">For members</h2>
      </div>
      <p className="text-[#475569] text-[15px] leading-relaxed mb-3">
        Ask Data Hygienics is included with Ongoing Protection and the Documentation Pack. It answers questions about
        securing your home or small business using only our published research, links to the page each answer comes
        from, and tells you plainly when we don&apos;t know yet.
      </p>
      <p className="text-[#475569] text-[15px] leading-relaxed mb-6">
        Everything it draws on is free to read: the guides, threats, glossary and toolkit are open to everyone.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 bg-[#1D4ED8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors"
        >
          See plans <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
        >
          Read the guides
        </Link>
      </div>
    </section>
  )
}

function Notice({ children }) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-[#475569] text-[15px] leading-relaxed">
      {children}
    </section>
  )
}

function Sources({ sources, nearest }) {
  if (!sources?.length) return null
  return (
    <div className="mt-4 border-t border-[#E2E8F0] pt-3">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-1.5">
        {nearest ? "Nearest pages" : "Sources"}
      </p>
      <ul className="space-y-1 list-none p-0">
        {sources.map((s) => (
          <li key={s.url}>
            <Link href={s.url} className="text-sm text-[#1D4ED8] hover:text-[#1E40AF] underline-offset-2 hover:underline">
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Chat ────────────────────────────────────────────────────────────────

export default function AskChat() {
  const [state, setState] = useState("loading") // loading | member | not-member | signed-out | unavailable
  const [usage, setUsage] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/assistant/usage", { headers: await authHeaders(), cache: "no-store" })
        if (cancelled) return
        if (res.status === 401) return setState("signed-out")
        if (res.status === 403) return setState("not-member")
        if (!res.ok) return setState("unavailable")
        setUsage(await res.json())
        setState("member")
      } catch {
        if (!cancelled) setState("unavailable")
      }
    })()
    return () => {
      cancelled = true
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  const updateLast = useCallback((patch) => {
    setMessages((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      next[next.length - 1] = { ...last, ...(typeof patch === "function" ? patch(last) : patch) }
      return next
    })
  }, [])

  const ask = useCallback(
    async (questionText) => {
      const question = questionText.trim()
      if (!question || sending || question.length > MAX_QUESTION_CHARS) return

      // History: completed exchanges only, as plain text.
      const history = messages
        .filter((m) => m.role === "user" || (m.role === "assistant" && m.done && !m.error && !m.refused))
        .map((m) => ({ role: m.role, content: m.content }))

      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "", done: false },
      ])
      setInput("")
      setSending(true)

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(await authHeaders()) },
          body: JSON.stringify({ messages: [...history, { role: "user", content: question }] }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}))
          if (res.status === 403) setState("not-member")
          updateLast({
            content: body.error || "The assistant is taking a break. Try again shortly.",
            error: true,
            done: true,
          })
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        const handle = (line) => {
          if (!line.trim()) return
          let event
          try {
            event = JSON.parse(line)
          } catch {
            return
          }
          if (event.type === "text") {
            updateLast((m) => ({ content: m.content + event.text }))
          } else if (event.type === "refusal") {
            updateLast({ content: event.message, refused: true })
          } else if (event.type === "error") {
            updateLast((m) => ({
              content: m.content ? `${m.content}\n\n${event.message}` : event.message,
              error: true,
            }))
          } else if (event.type === "done") {
            updateLast({ sources: event.sources || [], nearest: !!event.nearest, done: true })
            const spent = (event.usage?.input || 0) + (event.usage?.output || 0)
            setUsage((u) =>
              u
                ? {
                    ...u,
                    messagesToday: spent > 0 ? u.messagesToday + 1 : u.messagesToday,
                    monthUsed: event.usage?.monthUsed ?? u.monthUsed,
                  }
                : u
            )
          }
        }
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop()
          lines.forEach(handle)
        }
        handle(buffer)
        updateLast({ done: true })
      } catch (err) {
        if (err?.name !== "AbortError") {
          updateLast({ content: "The connection dropped before the answer finished. Try again.", error: true, done: true })
        }
      } finally {
        setSending(false)
        abortRef.current = null
      }
    },
    [messages, sending, updateLast]
  )

  const onSubmit = (e) => {
    e.preventDefault()
    ask(input)
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      ask(input)
    }
  }

  const checkLink = (
    <Link
      href="/check"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#115E59]"
    >
      <LifeBuoy className="w-4 h-4" aria-hidden="true" />
      Something just happened? Start with Is this real?
    </Link>
  )

  if (state === "loading") {
    return <Notice>Checking your membership...</Notice>
  }
  if (state === "not-member") {
    return (
      <div className="space-y-6">
        <NotMember />
        {checkLink}
      </div>
    )
  }
  if (state === "signed-out") {
    return (
      <Notice>
        <p className="mb-3">Sign in to use the assistant.</p>
        <Link href="/tools/cyber-audit/login?next=%2Ftools%2Fask" className="text-[#1D4ED8] font-semibold hover:text-[#1E40AF]">
          Sign in
        </Link>
      </Notice>
    )
  }
  if (state === "unavailable") {
    return (
      <div className="space-y-6">
        <Notice>The assistant is taking a break. Try again shortly.</Notice>
        {checkLink}
      </div>
    )
  }

  const overLength = input.length > MAX_QUESTION_CHARS
  const atDailyCap = usage && usage.messagesToday >= (usage.dailyCap || DAILY_MESSAGE_CAP)
  const atMonthlyCap = usage && usage.monthUsed >= (usage.monthCap || MONTHLY_TOKEN_CAP)
  const blocked = atDailyCap || atMonthlyCap

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {checkLink}
        <UsageMeter usage={usage} />
      </div>

      <section
        aria-label="Conversation"
        role="log"
        aria-live="polite"
        aria-busy={sending}
        className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 min-h-[16rem]"
      >
        {messages.length === 0 ? (
          <div>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-4">
              Ask about securing your home or small business. Answers come from our published research, with a link
              to each page they draw on.
            </p>
            <ul className="flex flex-col gap-2 list-none p-0">
              {STARTERS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => ask(q)}
                    disabled={blocked}
                    className="w-full text-left text-sm text-[#0F172A] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 hover:border-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="space-y-5 list-none p-0">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <li key={i} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#EFF6FF] px-4 py-2.5 text-[15px] text-[#0F172A]">
                    <span className="sr-only">You asked: </span>
                    {m.content}
                  </p>
                </li>
              ) : (
                <li key={i} className={`rounded-2xl border px-4 py-3.5 ${m.error ? "border-[#FDE68A] bg-[#FFFBEB]" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>
                  <span className="sr-only">Answer: </span>
                  {m.content ? (
                    <AnswerText text={m.content} />
                  ) : (
                    <p className="text-sm text-[#94A3B8]">Reading our research...</p>
                  )}
                  {m.done && !m.error && <Sources sources={m.sources} nearest={m.nearest} />}
                </li>
              )
            )}
          </ol>
        )}
        <div ref={endRef} />
      </section>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          disabled={blocked}
          placeholder={blocked ? "You've reached the limit for now." : "Ask a question about your home or business security"}
          aria-describedby="ask-count ask-note"
          className="w-full resize-y rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 disabled:bg-[#F8FAFC]"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p id="ask-count" className={`text-xs ${overLength ? "text-[#DC2626] font-semibold" : "text-[#94A3B8]"}`}>
            {fmt(input.length)} / {fmt(MAX_QUESTION_CHARS)}
          </p>
          <button
            type="submit"
            disabled={sending || blocked || overLength || !input.trim()}
            className="inline-flex items-center gap-1.5 bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Answering..." : "Ask"} <Send className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        {blocked && (
          <p className="mt-2 text-xs text-[#B45309]">
            {atDailyCap
              ? `That's today's ${DAILY_MESSAGE_CAP} questions. The count resets at midnight UTC.`
              : "That's this month's allowance. It resets on the 1st (UTC)."}
          </p>
        )}
      </form>

      <p id="ask-note" className="flex items-start gap-2 text-xs text-[#475569] leading-relaxed">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
        <span>
          Answers come only from our published research. We never ask for passwords, codes or account numbers;
          don&apos;t paste them here. This chat isn&apos;t saved: it clears when you leave the page.
        </span>
      </p>
    </div>
  )
}
