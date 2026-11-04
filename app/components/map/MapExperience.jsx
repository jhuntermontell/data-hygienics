"use client"

// The home map at /map/home: local-first, free, and nothing sent while you
// type, pick, import, walk through, read the results, save, load, print or
// delete. The only requests this page makes:
//   - GET /api/assistant/usage, once and only when signed in, to learn
//     whether AI reads (photo and screenshot) are on for this member;
//   - POST /api/map/read, only when a member sends a photo, a screenshot or
//     pasted text on purpose;
//   - the result sync (lib/map/sync.js), signed in only: counts per outcome,
//     an item count and a check date. Never the map.
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CheckCircle2, Plus } from "lucide-react"
import Readout from "@/app/components/brand/Readout"
import FoldRule from "@/app/components/brand/FoldRule"
import { useMapRecord } from "@/lib/hooks/useMapRecord"
import { assess, getCategory, readout, resultFor } from "@/lib/map"
import { saveResult } from "@/lib/map/sync"
import { loadLocal as loadPath } from "@/lib/path/storage"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { EVENTS, track } from "@/lib/analytics"
import { authHeaders } from "./authHeaders"
import Intake from "./Intake"
import WalkThrough from "./WalkThrough"
import HomePicture from "./HomePicture"
import MapReadout from "./MapReadout"
import Findings from "./Findings"
import ItemList from "./ItemList"
import ManageMap from "./ManageMap"
import { AUDIENCE, BTN_SECONDARY, needsWalkThrough } from "./helpers"

const CUSTODY = "Kept on your device, in a file you save and on paper. We keep your progress, not your house."

// The Path's "What's connected?" answers that point at map categories.
const PATH_SUGGESTIONS = [
  { value: "cameras", category: "camera-outdoor", group: "camera", phrase: "cameras", chip: "Add a camera" },
  { value: "tv", category: "tv", group: "tv", phrase: "a TV", chip: "Add a TV" },
  { value: "speakers", category: "speaker", group: "speaker", phrase: "smart speakers", chip: "Add a speaker" },
  { value: "smart-home", category: "smart-lock", group: "lock", phrase: "smart locks or plugs", chip: "Add a lock or plug" },
]

const andList = (words) => (words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`)

const bucket = (n) => (n <= 5 ? "1-5" : n <= 10 ? "6-10" : n <= 20 ? "11-20" : "21+")
function intakeOf(items) {
  const kinds = new Set(items.map((i) => (i.source === "catalog" ? "typed" : i.source || "typed")))
  return kinds.size === 1 ? [...kinds][0] : "mixed"
}

function PathHint({ suggestions, onPick }) {
  if (!suggestions.length) return null
  return (
    <div className="border border-[#E2E8F0] bg-white p-4 print:hidden">
      <p className="text-[15px] text-[#475569]">
        Your path says you have {andList(suggestions.map((s) => s.phrase))}. Add them when you&apos;re ready
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button key={s.value} type="button" onClick={() => onPick(s.category)} className={BTN_SECONDARY}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            {s.chip}
          </button>
        ))}
      </div>
    </div>
  )
}

function LawBox({ future }) {
  if (!future?.length) return null
  return (
    <section aria-labelledby="map-law-title" className="border border-[#E2E8F0] bg-white p-5">
      <h2 id="map-law-title" className="text-base font-display font-semibold text-[#0F172A]">
        What the law now asks of makers
      </h2>
      <ul className="mt-3 space-y-4 list-none p-0 m-0">
        {future.map((f) => (
          <li key={f.id}>
            <Readout as="p" className="m-0">
              {f.dateLabel}
            </Readout>
            <p className="mt-1 text-sm font-semibold text-[#0F172A]">{f.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-[#475569]">{f.text}</p>
            {f.sources.map((s) => (
              <p key={s.id} className="mt-1 text-xs text-[#64748B]">
                Source:{" "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]">
                  {s.label}
                </a>
              </p>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function MapExperience({ steps, future }) {
  const { record, ready, user, update, reset, importRecord } = useMapRecord(AUDIENCE)
  const items = useMemo(() => record.items || [], [record.items])
  const findings = useMemo(() => assess(record), [record])
  const rows = useMemo(() => readout(findings), [findings])
  const [aiState, setAiState] = useState("loading")
  const [synced, setSynced] = useState(false)
  const [walkId, setWalkId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [preset, setPreset] = useState({ category: "router", n: 0 })
  const [pathDevices, setPathDevices] = useState([])
  const checkedFired = useRef(false)
  const lastSynced = useRef(null)
  const intakeRef = useRef(null)

  // Whether AI reads are on: one look at the assistant meter, signed in only.
  // Signed out we already know the answer, so nothing is sent.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const headers = await authHeaders()
      if (cancelled) return
      if (!headers.Authorization) return setAiState("signed-out")
      try {
        const res = await fetch("/api/assistant/usage", { headers, cache: "no-store" })
        if (cancelled) return
        if (res.status === 401) return setAiState("signed-out")
        if (res.status === 403) return setAiState("not-member")
        setAiState(res.ok ? "member" : "unavailable")
      } catch {
        if (!cancelled) setAiState("unavailable")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // The Path's device answers, read from this browser once.
  useEffect(() => {
    const devices = loadPath(AUDIENCE)?.answers?.devices
    // A one-time read of browser storage after mount.
    if (Array.isArray(devices)) setPathDevices(devices)
  }, [])

  // Path answers whose kind of device isn't on the map yet.
  const suggestions = useMemo(
    () => PATH_SUGGESTIONS.filter((s) => pathDevices.includes(s.value) && !items.some((i) => getCategory(i.category)?.group === s.group)),
    [pathDevices, items]
  )

  // map_checked: once per page load, the first time a readout renders with
  // at least one item. Bucketed so no single home is described.
  useEffect(() => {
    if (!ready || checkedFired.current || !items.length) return
    checkedFired.current = true
    track(EVENTS.mapChecked, { audience: AUDIENCE, intake: intakeOf(items), items: bucket(items.length) })
  }, [ready, items])

  // Result sync: counts, an item count and a date, signed in only, a second
  // after the findings settle. Failures change nothing on the page.
  useEffect(() => {
    if (!ready || !user || !items.length) return
    const result = resultFor(record, findings)
    const key = JSON.stringify(result)
    if (key === lastSynced.current) return
    const timer = setTimeout(async () => {
      const ok = await saveResult(getSupabaseBrowserClient(), user.id, result)
      if (ok) lastSynced.current = key
      setSynced(ok)
    }, 1000)
    return () => clearTimeout(timer)
  }, [ready, user, record, findings, items.length])

  const addItems = useCallback((newItems) => update((r) => ({ ...r, items: [...(r.items || []), ...newItems] })), [update])

  const patchItem = useCallback(
    (id, fn) => update((r) => ({ ...r, items: (r.items || []).map((it) => (it.id === id ? fn(it) : it)) })),
    [update]
  )

  const saveItem = useCallback(
    (id, patch) =>
      update((r) => ({
        ...r,
        items: (r.items || []).map((it) => {
          if (it.id === id) return { ...it, ...patch }
          // An item that stopped being an account no longer controls anything.
          if (patch.kind === "device" && it.controlledBy === id) return { ...it, controlledBy: null }
          return it
        }),
      })),
    [update]
  )

  const removeItem = useCallback(
    (id) => {
      if (walkId === id) setWalkId(null)
      update((r) => {
        const handled = Object.fromEntries(Object.entries(r.handled || {}).filter(([key]) => !key.endsWith(`:${id}`)))
        const rest = (r.items || []).filter((it) => it.id !== id).map((it) => (it.controlledBy === id ? { ...it, controlledBy: null } : it))
        return { ...r, items: rest, handled }
      })
    },
    [update, walkId]
  )

  const markFinding = useCallback(
    (key, done) =>
      update((r) => {
        const handled = { ...(r.handled || {}) }
        if (done) handled[key] = new Date().toISOString()
        else delete handled[key]
        return { ...r, handled }
      }),
    [update]
  )

  const openIntake = (category) => {
    setPreset((p) => ({ category, n: p.n + 1 }))
    setAdding(true)
    requestAnimationFrame(() => intakeRef.current?.scrollIntoView({ block: "start" }))
  }

  const walkItem = items.find((i) => i.id === walkId) || null
  const accounts = items.filter((i) => i.kind === "account")
  const nextToWalk = walkItem ? items.find((i) => i.id !== walkItem.id && needsWalkThrough(i)) : null

  if (!ready) {
    return (
      <div aria-busy="true" className="min-h-[50vh]">
        <Readout label className="text-[#0F766E]">
          Home map
        </Readout>
      </div>
    )
  }

  const walkPanel = walkItem ? (
    <WalkThrough
      item={walkItem}
      accounts={accounts}
      onPatch={patchItem}
      onAddItems={addItems}
      hasNext={Boolean(nextToWalk)}
      onNext={() => setWalkId(nextToWalk?.id || null)}
      onClose={() => setWalkId(null)}
    />
  ) : null

  return (
    <div className="max-w-4xl">
      <header>
        <Readout label className="text-[#0F766E]">
          Home map
        </Readout>
        <h1 className="mt-3 font-display font-semibold text-[2.25rem] sm:text-[3rem] leading-[1.05] tracking-[-0.03em] text-[#0F172A] text-balance">
          Your home, drawn as who controls what
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">{CUSTODY}</p>
        {user && synced ? (
          <p role="status" className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#475569]">
            <CheckCircle2 className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            Progress saved to your account; the map stayed here
          </p>
        ) : null}
        <FoldRule className="mt-6" />
      </header>

      {!items.length ? (
        <div className="mt-8 space-y-6">
          <Intake
            key={`start-${preset.n}`}
            aiState={aiState}
            onAdd={(list) => {
              addItems(list)
              // The first thing on the map: ask about it straight away.
              if (list[0]) setWalkId(list[0].id)
            }}
            onWalk={setWalkId}
            initialCategory={preset.category}
            title="Start with your Wi-Fi"
            intro="Add your router first: everything else in the house connects through it. Pick it from our catalog or type what's on the label, then add the rest any way you like."
          />
          <PathHint suggestions={suggestions} onPick={(category) => setPreset((p) => ({ category, n: p.n + 1 }))} />
          <ManageMap record={record} update={update} importRecord={importRecord} reset={reset} />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {walkPanel}
          <HomePicture items={items} findings={findings} />
          <MapReadout rows={rows} checkedAt={record.checkedAt} />
          <Findings findings={findings} items={items} steps={steps} onMark={markFinding} />
          <ItemList items={items} findings={findings} onWalk={setWalkId} onSave={saveItem} onRemove={removeItem} />

          <div ref={intakeRef} className="scroll-mt-24 space-y-4 print:hidden">
            <PathHint suggestions={suggestions} onPick={openIntake} />
            {adding ? (
              <Intake
                key={`more-${preset.n}`}
                aiState={aiState}
                onAdd={addItems}
                onWalk={setWalkId}
                initialCategory={preset.category}
                title="Add more"
              />
            ) : (
              <button
                type="button"
                onClick={() => openIntake(items.some((i) => getCategory(i.category)?.group === "network") ? "computer" : "router")}
                className={BTN_SECONDARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add more
              </button>
            )}
          </div>

          <LawBox future={future} />
          <ManageMap record={record} update={update} importRecord={importRecord} reset={reset} />
        </div>
      )}
    </div>
  )
}
