"use client"

// Four ways to add things to the home map. Pick or type and the Fing import
// run entirely in this browser. The photo and screenshot reads are the only
// part of the map that sends anything, and only when a member chooses a photo,
// a screenshot or pasted text and sends it: POST /api/map/read with the
// shrunk image (or the text) and nothing else.
import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Camera, Check, FileSpreadsheet, Keyboard, Loader2, MonitorSmartphone, Plus } from "lucide-react"
import Readout from "@/app/components/brand/Readout"
import { catalogFor, getCategory, newItem } from "@/lib/map"
import { parseFingCsv } from "@/lib/map/csv"
import { downscale, fileToText } from "@/lib/map/image"
import { READ_MAX_TEXT_CHARS } from "@/lib/assistant/limits"
import { authHeaders } from "./authHeaders"
import CategorySelect from "./CategorySelect"
import {
  AUDIENCE,
  BTN_PRIMARY,
  BTN_QUIET,
  BTN_SECONDARY,
  FIELD,
  LABEL,
  NETWORK_CATEGORIES,
  displayName,
  forbiddenMessage,
  matchFor,
} from "./helpers"

const WAYS = [
  { id: "pick", label: "Pick or type", icon: Keyboard },
  { id: "photo", label: "Photo of a label", icon: Camera },
  { id: "list", label: "Screenshot of a list", icon: MonitorSmartphone },
  { id: "csv", label: "Fing export", icon: FileSpreadsheet },
]

const LOGIN_HREF = `/tools/cyber-audit/login?next=${encodeURIComponent("/map/home")}`
const PRICING_HREF = "/pricing?door=home"
const READ_FAILED = "We couldn't read that just now. Try again, or type it instead."

const PHOTO_NOTE =
  "This photo goes to our AI provider to read the brand and model. It's shrunk first, sent with nothing about you, and not kept by us. Serial numbers and passwords on the label are never returned."
const LIST_NOTE =
  "This screenshot of your Wi-Fi app's device list goes to our AI provider to read the brands and models. It's shrunk first, sent with nothing about you, and not kept by us. Addresses, device names and passwords are never returned."
const PASTE_NOTE = "Pasted text goes the same way: to our AI provider, with nothing about you, and not kept by us. Addresses are taken out before it's sent."

const CATALOG = catalogFor(AUDIENCE)

// Strip anything that looks like a hardware or network address or an email
// before pasted text leaves the page. The server drops them too.
const redact = (text) =>
  String(text || "")
    .replace(/\b([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g, " ")
    .replace(/\b\d{1,3}(\.\d{1,3}){3}\b/g, " ")
    .replace(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi, " ")

async function readWithAi(body) {
  try {
    const res = await fetch("/api/map/read", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) return { items: Array.isArray(data.items) ? data.items : [] }
    return { status: res.status, error: typeof data.error === "string" && data.error ? data.error : READ_FAILED }
  } catch {
    return { status: 0, error: READ_FAILED }
  }
}

function Added({ added, onWalk }) {
  if (!added?.length) return null
  const first = added[0]
  return (
    <div role="status" className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border border-[#99F6E4] bg-[#F0FDFA] px-4 py-3 text-sm text-[#134E4A]">
      <Check className="w-4 h-4 shrink-0 text-[#0F766E]" aria-hidden="true" />
      <span className="font-semibold">{added.length === 1 ? `Added ${displayName(first)}` : `Added ${added.length} items`}</span>
      {onWalk ? (
        <button type="button" onClick={() => onWalk(first.id)} className="min-h-11 font-semibold text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]">
          Answer a few questions about {added.length === 1 ? "it" : "them"}
        </button>
      ) : null}
    </div>
  )
}

// ── Pick or type ─────────────────────────────────────────────────────────

function PickOrType({ initialCategory, onAdd, onWalk }) {
  const [category, setCategory] = useState(initialCategory || "router")
  const [brand, setBrand] = useState("")
  const [otherBrand, setOtherBrand] = useState(false)
  const [model, setModel] = useState("")
  const [label, setLabel] = useState("")
  const [picked, setPicked] = useState(null)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(null)
  const cat = getCategory(category)
  const isAccount = cat?.kind === "account"
  const network = NETWORK_CATEGORIES.includes(category)
  const brands = useMemo(() => [...new Set(CATALOG.filter((e) => e.category === category).map((e) => e.brand))].sort(), [category])

  const suggestions = useMemo(() => {
    if (!network || picked) return []
    const words = model.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length && !brand) return []
    return CATALOG.filter((e) => e.category === category)
      .filter((e) => !brand || otherBrand || e.brand === brand)
      .filter((e) => {
        const hay = `${e.brand} ${e.model} ${(e.aliases || []).join(" ")}`.toLowerCase()
        return words.every((w) => hay.includes(w))
      })
      .slice(0, 8)
  }, [network, picked, model, brand, otherBrand, category])

  const typedMatch = useMemo(() => (picked ? null : matchFor(category, brand, model)), [picked, category, brand, model])

  const changeCategory = (value) => {
    setCategory(value)
    setPicked(null)
    setBrand("")
    setOtherBrand(false)
    setError(null)
  }

  const pick = (entry) => {
    setPicked(entry)
    setBrand(entry.brand)
    setOtherBrand(false)
    setModel(entry.model)
    setError(null)
  }

  const submit = (event) => {
    event.preventDefault()
    const m = isAccount ? "" : model.trim()
    // A model that matches our catalog exactly brings its maker's name along.
    const b = isAccount ? "" : brand.trim() || (typedMatch?.confidence === "high" ? typedMatch.entry.brand : "")
    const l = label.trim()
    const problem = forbiddenMessage(l, b, m)
    if (problem) return setError(problem)
    if (!isAccount && !b && !m && !l) return setError("Add a brand, a model or a name so you can tell it apart.")
    const item = newItem({
      kind: cat?.kind,
      category,
      brand: b,
      model: m,
      label: l,
      catalogId: picked?.id || typedMatch?.entry.id || null,
      source: picked ? "catalog" : "typed",
    })
    onAdd([item])
    setAdded([item])
    setPicked(null)
    setModel("")
    setLabel("")
    setError(null)
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="map-category" className={LABEL}>
          What is it?
        </label>
        <CategorySelect id="map-category" value={category} onChange={changeCategory} />
        {cat?.hint ? <p className="mt-1.5 text-sm text-[#64748B]">{cat.hint}</p> : null}
      </div>

      {!isAccount ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="map-brand" className={LABEL}>
              Brand
            </label>
            {network && brands.length && !otherBrand ? (
              <select
                id="map-brand"
                value={brand}
                onChange={(e) => {
                  setPicked(null)
                  if (e.target.value === "__other") {
                    setOtherBrand(true)
                    setBrand("")
                  } else setBrand(e.target.value)
                }}
                className={FIELD}
              >
                <option value="">Choose a brand</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="__other">Another brand</option>
              </select>
            ) : (
              <input
                id="map-brand"
                type="text"
                value={brand}
                maxLength={60}
                autoComplete="off"
                onChange={(e) => {
                  setPicked(null)
                  setBrand(e.target.value)
                }}
                placeholder="For example, Netgear"
                className={FIELD}
              />
            )}
          </div>
          <div>
            <label htmlFor="map-model" className={LABEL}>
              Model
            </label>
            <input
              id="map-model"
              type="text"
              value={model}
              maxLength={80}
              autoComplete="off"
              aria-describedby={suggestions.length ? "map-model-matches" : undefined}
              onChange={(e) => {
                setPicked(null)
                setModel(e.target.value)
              }}
              placeholder={network ? "Type a few letters, for example R7000" : "As printed on the label"}
              className={FIELD}
            />
          </div>
        </div>
      ) : null}

      {suggestions.length ? (
        <div id="map-model-matches">
          <p className="text-sm font-semibold text-[#0F172A]">From our catalog</p>
          <ul className="mt-1.5 grid gap-1.5 sm:grid-cols-2 list-none p-0 m-0">
            {suggestions.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => pick(e)}
                  className="w-full min-h-11 border border-[#E2E8F0] bg-white px-3 py-2 text-left text-sm text-[#0F172A] hover:border-[#0F766E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
                >
                  <span className="font-semibold">{e.brand}</span> {e.model}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {picked || typedMatch ? (
        <p className="inline-flex items-center gap-1.5 border border-[#99F6E4] bg-[#F0FDFA] px-2.5 py-1 text-xs font-semibold text-[#0F766E]">
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Matched to our catalog: {(picked || typedMatch.entry).brand} {(picked || typedMatch.entry).model}
          {typedMatch?.confidence === "medium" ? " (close match)" : ""}
        </p>
      ) : null}

      <div>
        <label htmlFor="map-label" className={LABEL}>
          Name it <span className="font-normal text-[#64748B]">(optional)</span>
        </label>
        <input
          id="map-label"
          type="text"
          value={label}
          maxLength={60}
          autoComplete="off"
          onChange={(e) => setLabel(e.target.value)}
          placeholder={isAccount ? "For example, Family Google account" : "For example, Living room router"}
          className={FIELD}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button type="submit" className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add to the map
        </button>
        <Readout as="p" className="m-0">
          Typed here, kept here. Nothing leaves this page
        </Readout>
      </div>
      <Added added={added} onWalk={onWalk} />
    </form>
  )
}

// ── Proposals (AI reads and the CSV import) ─────────────────────────────

const toProposal = (raw, i) => ({
  key: `p${i}`,
  include: true,
  category: getCategory(raw.category)?.kind === "device" ? raw.category : "unknown",
  brand: raw.brand || "",
  model: raw.model || "",
  hardwareVersion: raw.hardwareVersion || "",
  label: raw.label || "",
  confidence: raw.confidence || null,
})

function Proposals({ proposals, setProposals, tickable, source, onAdd, onWalk, showLabel = false }) {
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(null)
  const set = (key, patch) => setProposals((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)))
  const chosen = proposals.filter((p) => !tickable || p.include)

  const add = () => {
    for (const p of chosen) {
      const problem = forbiddenMessage(p.label, p.brand, p.model)
      if (problem) return setError(problem)
    }
    const items = chosen.map((p) =>
      newItem({
        kind: "device",
        category: p.category,
        brand: p.brand,
        model: p.model,
        hardwareVersion: p.hardwareVersion,
        label: p.label,
        catalogId: matchFor(p.category, p.brand, p.model)?.entry.id || null,
        source,
      })
    )
    if (!items.length) return setError("Tick at least one to add.")
    onAdd(items)
    setAdded(items)
    setProposals([])
    setError(null)
  }

  if (!proposals.length) return <Added added={added} onWalk={onWalk} />

  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-[#0F172A]">
        {tickable ? "Here's what we found. Untick anything you don't want, and fix what's wrong." : "Here's what we read. Fix anything that's wrong."}
      </p>
      <ul className="mt-3 space-y-3 list-none p-0 m-0">
        {proposals.map((p, i) => (
          <li key={p.key} className={`border bg-white p-3 ${tickable && !p.include ? "border-[#E2E8F0] opacity-60" : "border-[#CBD5E1]"}`}>
            {tickable ? (
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={p.include}
                  onChange={(e) => set(p.key, { include: e.target.checked })}
                  className="h-5 w-5 accent-[#0F766E]"
                />
                Add this one
                {p.confidence === "low" ? <span className="font-normal text-[#92400E]">· We weren&apos;t sure about this one</span> : null}
              </label>
            ) : p.confidence === "low" ? (
              <p className="mb-2 text-sm text-[#92400E]">We weren&apos;t sure about this one. Check it against the label.</p>
            ) : null}
            <div className={`grid gap-3 ${showLabel ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              <div>
                <label htmlFor={`prop-cat-${i}`} className="block text-xs font-semibold text-[#475569] mb-1">
                  What it is
                </label>
                <CategorySelect id={`prop-cat-${i}`} kind="device" allowUnknown value={p.category} onChange={(v) => set(p.key, { category: v })} />
              </div>
              <div>
                <label htmlFor={`prop-brand-${i}`} className="block text-xs font-semibold text-[#475569] mb-1">
                  Brand
                </label>
                <input id={`prop-brand-${i}`} type="text" value={p.brand} maxLength={60} onChange={(e) => set(p.key, { brand: e.target.value })} className={FIELD} />
              </div>
              <div>
                <label htmlFor={`prop-model-${i}`} className="block text-xs font-semibold text-[#475569] mb-1">
                  Model
                </label>
                <input id={`prop-model-${i}`} type="text" value={p.model} maxLength={80} onChange={(e) => set(p.key, { model: e.target.value })} className={FIELD} />
              </div>
              {showLabel ? (
                <div>
                  <label htmlFor={`prop-label-${i}`} className="block text-xs font-semibold text-[#475569] mb-1">
                    Name
                  </label>
                  <input id={`prop-label-${i}`} type="text" value={p.label} maxLength={60} onChange={(e) => set(p.key, { label: e.target.value })} className={FIELD} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={add} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          {tickable ? `Add all (${chosen.length})` : "Add"}
        </button>
        <button type="button" onClick={() => setProposals([])} className={BTN_QUIET}>
          Clear
        </button>
      </div>
    </div>
  )
}

// ── AI reads (members) ──────────────────────────────────────────────────

function Gate({ aiState, onTypeInstead }) {
  let line
  if (aiState === "loading") line = <>Checking whether AI reads are on for you…</>
  else if (aiState === "signed-out")
    line = (
      <>
        Members can have AI read it.{" "}
        <Link href={LOGIN_HREF} className="font-semibold text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]">
          Sign in
        </Link>{" "}
        if you&apos;re a member.
      </>
    )
  else if (aiState === "not-member")
    line = (
      <>
        Members can have AI read it.{" "}
        <Link href={PRICING_HREF} className="font-semibold text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]">
          See membership
        </Link>
      </>
    )
  else line = <>AI reads aren&apos;t available right now. Try again later.</>
  return (
    <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm leading-relaxed text-[#475569]">
      <p aria-live="polite">{line}</p>
      <button type="button" onClick={onTypeInstead} className={`${BTN_SECONDARY} mt-3`}>
        <Keyboard className="w-4 h-4" aria-hidden="true" />
        Type it instead
      </button>
    </div>
  )
}

function ReadError({ failure, onTypeInstead }) {
  if (!failure) return null
  const link =
    failure.status === 401 ? (
      <Link href={LOGIN_HREF} className="font-semibold text-[#0F766E] underline underline-offset-2">
        Sign in
      </Link>
    ) : failure.status === 403 ? (
      <Link href={PRICING_HREF} className="font-semibold text-[#0F766E] underline underline-offset-2">
        See membership
      </Link>
    ) : null
  return (
    <div role="alert" className="mt-4 border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm leading-relaxed text-[#78350F]">
      <p>
        {failure.error} {link}
      </p>
      {failure.status === 422 || failure.status === 0 ? (
        <button type="button" onClick={onTypeInstead} className={`${BTN_SECONDARY} mt-3`}>
          <Keyboard className="w-4 h-4" aria-hidden="true" />
          Type it instead
        </button>
      ) : null}
    </div>
  )
}

function AiRead({ kind, aiState, onAdd, onWalk, onTypeInstead }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState(null)
  const [proposals, setProposals] = useState([])
  const [text, setText] = useState("")
  const isList = kind === "list"
  const source = isList ? "screenshot" : "photo"

  const run = async (body) => {
    setBusy(true)
    setFailure(null)
    setProposals([])
    const result = await readWithAi(body)
    setBusy(false)
    if (result.error) return setFailure(result)
    setProposals(result.items.map(toProposal))
  }

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    let image
    try {
      setBusy(true)
      image = await downscale(file)
    } catch (err) {
      setBusy(false)
      return setFailure({ status: 0, error: err?.message || READ_FAILED })
    }
    await run({ kind, image: { mediaType: image.mediaType, data: image.data } })
  }

  const sendText = async () => {
    const clean = redact(text).trim()
    if (!clean) return setFailure({ status: 400, error: "Paste the list first." })
    await run({ kind: "list", text: clean.slice(0, READ_MAX_TEXT_CHARS) })
  }

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-[#475569]">{isList ? LIST_NOTE : PHOTO_NOTE}</p>
      <div className="mt-4">
        {aiState !== "member" ? (
          <Gate aiState={aiState} onTypeInstead={onTypeInstead} />
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture={isList ? undefined : "environment"}
              onChange={onFile}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={`${BTN_PRIMARY} w-full sm:w-auto min-h-14 text-base px-6`}>
              {isList ? <MonitorSmartphone className="w-5 h-5" aria-hidden="true" /> : <Camera className="w-5 h-5" aria-hidden="true" />}
              {isList ? "Choose a screenshot of the list" : "Take a photo of the label"}
            </button>
            {isList ? (
              <div className="mt-5">
                <label htmlFor="map-paste" className={LABEL}>
                  Paste the list as text
                </label>
                <textarea
                  id="map-paste"
                  rows={5}
                  value={text}
                  maxLength={READ_MAX_TEXT_CHARS}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="One device per line, copied from your Wi-Fi app or router page"
                  className={`${FIELD} min-h-32`}
                />
                <p className="mt-1.5 text-sm text-[#64748B]">{PASTE_NOTE}</p>
                <button type="button" onClick={sendText} disabled={busy || !text.trim()} className={`${BTN_SECONDARY} mt-3`}>
                  Read the pasted list
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
      {busy ? (
        <p role="status" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]">
          <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Reading…
        </p>
      ) : null}
      <ReadError failure={failure} onTypeInstead={onTypeInstead} />
      <Proposals proposals={proposals} setProposals={setProposals} tickable={isList} source={source} onAdd={onAdd} onWalk={onWalk} />
    </div>
  )
}

// ── Fing export ─────────────────────────────────────────────────────────

function CsvImport({ onAdd, onWalk }) {
  const fileRef = useRef(null)
  const [error, setError] = useState(null)
  const [proposals, setProposals] = useState([])

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setError(null)
    try {
      const rows = parseFingCsv(await fileToText(file))
      if (!rows.length) return setError("We didn't find any devices in that file. Check it's the device list export.")
      setProposals(rows.map(toProposal))
    } catch (err) {
      setError(err?.message || "We couldn't read that file. Choose the CSV file you exported.")
    }
  }

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-[#475569]">
        If you use the Fing app, export its device list as a CSV file and choose it here. We keep the brand, the model, a
        guess at what each device is and its name; we drop addresses and host names as the file is read.{" "}
        <a href="/samples/home-map-fing-sample.csv" download className="font-semibold text-[#0F766E] underline underline-offset-2 hover:text-[#115E59]">
          See a sample file
        </a>
      </p>
      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button type="button" onClick={() => fileRef.current?.click()} className={BTN_PRIMARY}>
          <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
          Choose the CSV file
        </button>
        <Readout as="p" className="m-0">
          Read in your browser. The file and its addresses never leave this page
        </Readout>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      <Proposals proposals={proposals} setProposals={setProposals} tickable source="csv" onAdd={onAdd} onWalk={onWalk} showLabel />
    </div>
  )
}

// ── Intake ──────────────────────────────────────────────────────────────

export default function Intake({ aiState, onAdd, onWalk, initialCategory, initialWay = "pick", title, intro, headingLevel = 2 }) {
  const [way, setWay] = useState(initialWay)
  const Heading = `h${headingLevel}`
  return (
    <section aria-labelledby="map-intake-title" className="border border-[#E2E8F0] bg-white p-4 sm:p-6 print:hidden">
      <Heading id="map-intake-title" className="text-xl font-display font-semibold tracking-[-0.01em] text-[#0F172A]">
        {title || "Add to your map"}
      </Heading>
      {intro ? <p className="mt-1.5 text-[15px] leading-relaxed text-[#475569]">{intro}</p> : null}
      <div role="group" aria-label="How to add it" className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {WAYS.map((w) => {
          const on = w.id === way
          const Icon = w.icon
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              onClick={() => setWay(w.id)}
              className={`flex min-h-12 items-center gap-2 border px-3 py-2 text-left text-sm font-semibold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
                on ? "border-[#0F766E] bg-[#F0FDFA] text-[#0F172A]" : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0F766E] hover:text-[#0F172A]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${on ? "text-[#0F766E]" : ""}`} aria-hidden="true" />
              {w.label}
            </button>
          )
        })}
      </div>
      <div className="mt-5">
        {way === "pick" ? <PickOrType initialCategory={initialCategory} onAdd={onAdd} onWalk={onWalk} /> : null}
        {way === "photo" ? <AiRead kind="label" aiState={aiState} onAdd={onAdd} onWalk={onWalk} onTypeInstead={() => setWay("pick")} /> : null}
        {way === "list" ? <AiRead kind="list" aiState={aiState} onAdd={onAdd} onWalk={onWalk} onTypeInstead={() => setWay("pick")} /> : null}
        {way === "csv" ? <CsvImport onAdd={onAdd} onWalk={onWalk} /> : null}
      </div>
    </section>
  )
}
