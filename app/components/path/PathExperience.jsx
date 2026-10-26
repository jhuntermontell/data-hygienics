"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { LifeBuoy } from "lucide-react"
import QuizRunner from "./QuizRunner"
import PathView from "./PathView"
import { usePathRecord } from "@/lib/hooks/usePathRecord"
import { AUDIENCE_PATHS, QUIZZES, buildPath, initialProgress } from "@/lib/path"
import { PATH_CONTENT } from "@/lib/content/path/long-view"

const COPY = {
  home: {
    eyebrow: "Clear Path for Home",
    intro: "A few questions, then your path. About two minutes.",
    help: { href: "/household#already-happened", label: "Dealing with something right now? Get help first." },
  },
  business: {
    eyebrow: "Clear Path for Business",
    intro: "A few questions, then your path. About three minutes.",
    help: { href: "/threats/ai-powered-phishing-and-bec#if-it-happens", label: "Money already moved, or an account taken over? Get help first." },
  },
}

// Local-first Clear Path. Before the quiz is finished nothing is stored but
// the answers so far; once finished the path, progress and answers live in
// this browser (and the signed-in account, if any). `links` resolves step
// link keys ("guide:slug") to { href, label, type } on the server.
export default function PathExperience({ audience, links }) {
  const params = useSearchParams()
  const { record, ready, user, sync, update, reset } = usePathRecord(audience)
  const [editing, setEditing] = useState(false)
  const [fresh, setFresh] = useState(false)
  const [draft, setDraft] = useState(() => {
    // Entry points can pre-pick the first answer: /path/home?start=memories
    const start = params.get("start")
    const first = QUIZZES[audience][0]
    if (start && first.options.some((o) => o.value === start)) {
      return { [first.id]: first.type === "single" ? start : [start] }
    }
    return {}
  })
  const copy = COPY[audience]
  const content = PATH_CONTENT[audience]
  const completed = Boolean(record.answers?.completedAt)
  const path = useMemo(() => {
    if (!completed) return null
    const built = buildPath(audience, record.answers)
    return { ...built, allIds: AUDIENCE_PATHS[audience].steps.map((s) => s.id) }
  }, [audience, completed, record.answers])

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
    return (
      <div>
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#0F172A]">{copy.eyebrow}</p>
          <p className="mt-2 text-[15px] text-[#475569]">
            {copy.intro} No account needed: your answers stay on this device unless you save your path.
          </p>
          <Link
            href={copy.help.href}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] underline decoration-[#0F8F83]/50 decoration-2 underline-offset-4 hover:decoration-[#0F8F83]"
          >
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
            {copy.help.label}
          </Link>
        </div>
        <QuizRunner
          questions={QUIZZES[audience]}
          answers={answers}
          accent={audience}
          onChange={setDraft}
          onExit={() => {
            if (editing) setEditing(false)
            else window.location.assign("/#start")
          }}
          onComplete={(latest) => {
            const finalAnswers = { ...(latest || answers), completedAt: new Date().toISOString() }
            const built = buildPath(audience, finalAnswers)
            update((current) => ({
              ...current,
              answers: finalAnswers,
              // Keep earlier progress when answers change; add new head starts.
              progress: { ...initialProgress(built), ...(current.progress || {}) },
            }))
            setEditing(false)
            setDraft({})
            setFresh(true)
            window.scrollTo({ top: 0 })
          }}
        />
      </div>
    )
  }

  const onMark = (id, status) =>
    update((current) => {
      // Undo is a tombstone (status: null) so it beats an older copy of the
      // mark on another device when the two merge.
      const progress = { ...(current.progress || {}), [id]: { status: status || null, at: new Date().toISOString() } }
      return { ...current, progress }
    })

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
    setDraft({})
    setFresh(false)
  }

  const view = record.answers.style || "do"

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#0F172A]">{copy.eyebrow}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] text-balance">
          {fresh ? "Here's your path." : "Your path"}
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
