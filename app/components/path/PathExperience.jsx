"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, LifeBuoy } from "lucide-react"
import QuizRunner from "./QuizRunner"
import PathView, { isMemberPlan } from "./PathView"
import FirstStep from "./FirstStep"
import { usePathRecord } from "@/lib/hooks/usePathRecord"
import { AUDIENCE_PATHS, QUIZZES, buildPath, initialProgress } from "@/lib/path"
import { PATH_CONTENT } from "@/lib/content/path/long-view"
import { EVENTS, track } from "@/lib/analytics"
import { MEMBERSHIP } from "@/lib/content/membership"
import { clearSubscriptionCache, getSubscription } from "@/lib/stripe/subscription"
import FoldRule from "@/app/components/brand/FoldRule"

// Back from a membership checkout (/path/home?joined=1): a calm line, gone on
// the next click anywhere. Nothing is stored.
function JoinedBanner() {
  return (
    <div role="status" className="mb-6 border border-[#0F8F83]/30 bg-[#F0FDFA] p-5">
      <p className="flex items-center gap-2 text-base font-bold text-[#0F172A]">
        <CheckCircle2 className="w-5 h-5 shrink-0 text-[#0F766E]" aria-hidden="true" />
        {MEMBERSHIP.joined.headline}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[#134E4A]">{MEMBERSHIP.joined.body}</p>
    </div>
  )
}

// Right after checkout the webhook may not have landed: look again a few
// times, uncached, before deciding there's no membership to welcome.
const JOINED_RETRIES = 5
const JOINED_RETRY_MS = 2000

const COPY = {
  home: {
    eyebrow: "Clear Path for Home",
    intro: "A few questions, then your path. About two minutes.",
    help: { href: "/household#already-happened", label: "Dealing with something right now? Get help first" },
  },
  business: {
    eyebrow: "Clear Path for Business",
    intro: "A few questions, then your path. About three minutes.",
    help: { href: "/threats/ai-powered-phishing-and-bec#if-it-happens", label: "Money already moved, or an account taken over? Get help first" },
  },
}

// Local-first Clear Path. Before the quiz is finished nothing is stored but
// the answers so far; once finished the path, progress and answers live in
// this browser (and the signed-in account, if any). `links` resolves step
// link keys ("guide:slug") to { href, label, type } on the server.
//
// Entry points can pre-pick the first answer: /path/home?start=memories.
// With a valid start and no finished path, FirstStep shows one step to do
// now above the quiz; finishing the quiz (or "Skip the questions") replaces
// it with the real path.
export default function PathExperience({ audience, links }) {
  const params = useSearchParams()
  const { record, ready, user, sync, update, reset } = usePathRecord(audience)
  const joinedParam = params.get("joined") === "1"
  const [joinedOpen, setJoinedOpen] = useState(joinedParam)
  // The plan behind the session usePathRecord already read, looked up once
  // per signed-in user through the cached subscription. `plan` is undefined
  // until known (or when it couldn't be read), null when signed out.
  const [planState, setPlanState] = useState({ userId: null, plan: undefined })
  const plan = !ready ? undefined : !user ? null : planState.userId === user.id ? planState.plan : undefined
  const userId = user?.id || null

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    let timer = null
    let tries = 0
    // A fresh checkout makes the cached copy stale for every page.
    if (joinedParam) clearSubscriptionCache()
    const look = async () => {
      const sub = await getSubscription(userId, { skipCache: joinedParam })
      if (cancelled) return
      const found = sub.entitlementUnknown ? undefined : sub.plan
      if (joinedParam && !isMemberPlan(found) && !sub.entitlementUnknown && ++tries < JOINED_RETRIES) {
        timer = setTimeout(look, JOINED_RETRY_MS)
        return
      }
      setPlanState({ userId, plan: found })
    }
    look()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [userId, joinedParam])

  const showJoined = joinedOpen && Boolean(user) && isMemberPlan(plan)
  useEffect(() => {
    if (!showJoined) return
    const close = () => setJoinedOpen(false)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [showJoined])
  const [editing, setEditing] = useState(false)
  const [fresh, setFresh] = useState(false)
  const first = QUIZZES[audience][0]
  const startParam = params.get("start")
  const start = startParam && first.options.some((o) => o.value === startParam) ? startParam : null
  const startDraft = () => (start ? { [first.id]: first.type === "single" ? start : [start] } : {})
  const [draft, setDraft] = useState(startDraft)
  // "Make it fit" was chosen, or the quiz was touched: the first step folds
  // down so the quiz leads. It can still be shown again.
  const [fitting, setFitting] = useState(false)
  const copy = COPY[audience]
  const content = PATH_CONTENT[audience]
  const completed = Boolean(record.answers?.completedAt)
  const path = useMemo(() => {
    if (!completed) return null
    const built = buildPath(audience, record.answers)
    return { ...built, allIds: AUDIENCE_PATHS[audience].steps.map((s) => s.id) }
  }, [audience, completed, record.answers])

  // Shared by the quiz's last screen and FirstStep's "Skip the questions";
  // buildPath fills unanswered questions with the quiz defaults.
  const complete = (latest) => {
    const finalAnswers = { ...latest, completedAt: new Date().toISOString() }
    const built = buildPath(audience, finalAnswers)
    if (!completed) track(EVENTS.pathCompleted, { audience })
    update((current) => ({
      ...current,
      answers: finalAnswers,
      // Keep earlier progress when answers change (including a first step
      // marked before the quiz); add new head starts.
      progress: { ...initialProgress(built), ...(current.progress || {}) },
    }))
    setEditing(false)
    setDraft({})
    setFresh(true)
    window.scrollTo({ top: 0 })
  }

  const onMark = (id, status) =>
    update((current) => {
      // Undo is a tombstone (status: null) so it beats an older copy of the
      // mark on another device when the two merge.
      const progress = { ...(current.progress || {}), [id]: { status: status || null, at: new Date().toISOString() } }
      return { ...current, progress }
    })

  if (!ready) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center" role="status">
        <span className="w-6 h-6 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading your path</span>
      </div>
    )
  }

  if (!completed || editing) {
    const answers = editing && !Object.keys(draft).length ? record.answers : draft
    const showFirst = Boolean(start) && !completed
    return (
      <div>
        {showJoined ? (
          <div className="max-w-2xl mx-auto">
            <JoinedBanner />
          </div>
        ) : null}
        <div className="max-w-2xl mx-auto mb-8">
          <p className="readout-label text-[#0F172A]">{copy.eyebrow}</p>
          <p className="mt-2 text-[15px] text-[#475569]">
            {showFirst ? "Here's where you start. " : `${copy.intro} `}
            No account needed: your answers stay on this device unless you save your path.
          </p>
          <Link
            href={copy.help.href}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] underline decoration-[#0F8F83]/50 decoration-2 underline-offset-4 hover:decoration-[#0F8F83]"
          >
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
            {copy.help.label}
          </Link>
        </div>
        {showFirst ? (
          <div className="max-w-2xl mx-auto mb-10">
            <FirstStep
              audience={audience}
              start={start}
              progress={record.progress || {}}
              onMark={onMark}
              collapsed={fitting}
              onFit={() => {
                setFitting(true)
                requestAnimationFrame(() => {
                  const quiz = document.getElementById("path-quiz")
                  quiz?.scrollIntoView({ behavior: "smooth", block: "start" })
                  quiz?.querySelector("h2")?.focus({ preventScroll: true })
                })
              }}
              onSkip={() => complete(answers)}
            />
          </div>
        ) : null}
        <div id="path-quiz" className="scroll-mt-24">
          <QuizRunner
            questions={QUIZZES[audience]}
            answers={answers}
            accent={audience}
            onChange={(next) => {
              setDraft(next)
              setFitting(true)
            }}
            onExit={() => {
              if (editing) setEditing(false)
              else window.location.assign("/#start")
            }}
            onComplete={(latest) => complete(latest || answers)}
          />
        </div>
      </div>
    )
  }

  const onExport = () => {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clear-path-${audience}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onDelete = () => {
    if (!window.confirm("Start over? This clears your answers and progress for this path.")) return
    reset()
    // Still on a ?start= link: the first answer and first step come back.
    setDraft(startDraft())
    setFitting(false)
    setFresh(false)
  }

  const view = record.answers.style || "do"

  // Small dated flags ride in answers, like `style`, so they survive the
  // account save and sync without a new column: joinDismissedAt ("Not now"
  // on the JoinCard) and nudgedAt (the one-time member nudge).
  const onStamp = (key) =>
    update((current) => ({ ...current, answers: { ...current.answers, [key]: new Date().toISOString() } }))

  return (
    <div>
      {showJoined ? <JoinedBanner /> : null}
      <div className="mb-8">
        <FoldRule draw className="mb-6" />
        <p className="readout-label text-day-readout">{copy.eyebrow}</p>
        <h1 className="mt-3 font-display font-semibold text-[2.25rem] sm:text-[3rem] leading-[1.04] tracking-[-0.03em] text-[#0F172A] text-balance">
          {fresh ? "Here's your path" : "Your path"}
        </h1>
        {!fresh ? <p className="mt-2 text-[15px] text-[#475569]">{content.mirror(path)}</p> : null}
      </div>
      <PathView
        path={path}
        progress={record.progress || {}}
        onMark={onMark}
        content={content}
        links={links}
        fresh={fresh}
        sync={sync}
        user={user}
        view={view}
        onView={(style) => update((current) => ({ ...current, answers: { ...current.answers, style } }))}
        plan={plan}
        flags={{ joinDismissedAt: record.answers.joinDismissedAt, nudgedAt: record.answers.nudgedAt }}
        onStamp={onStamp}
        onEdit={() => {
          setDraft(record.answers)
          setEditing(true)
          window.scrollTo({ top: 0 })
        }}
        onExport={onExport}
        onDelete={onDelete}
      />
    </div>
  )
}
