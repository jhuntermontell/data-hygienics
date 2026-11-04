// Where a home map lives: this browser only. No Supabase, no sync, no user
// id. Kept apart from lib/path/storage.js on purpose: signing out
// (clearAccountPaths) must never touch the map, and the map is never tied to
// an account. The only thing that may leave the device is `resultFor` in
// lib/map.js (counts and a date), and that is not this module's job.
//
// A member keeps their own copy as a file (serialize / parseImport) and on
// paper. Every localStorage access is wrapped: storage can be unavailable in
// private windows or with blocked site data, and the map still works for the
// current visit.
import { ITEM_KEYS, ITEM_SOURCES, forbiddenIn, categoriesFor } from "../map.js"

export const VERSION = 1
const PREFIX = `dh.map.v${VERSION}.`
export const keyFor = (audience) => `${PREFIX}${audience}`
const AUDIENCES = ["home"]

export function loadLocal(audience) {
  try {
    const raw = window.localStorage.getItem(keyFor(audience))
    if (!raw) return null
    const { record } = parseImport(raw)
    return record && record.audience === audience ? record : null
  } catch {
    return null
  }
}

export function saveLocal(record) {
  try {
    const { userId, exportedFrom, ...clean } = record || {}
    window.localStorage.setItem(keyFor(clean.audience), JSON.stringify(clean))
    return true
  } catch {
    return false
  }
}

export function clearLocal(audience) {
  try {
    window.localStorage.removeItem(keyFor(audience))
  } catch {
    // Storage blocked: nothing was kept.
  }
}

// The saved-file form: pretty JSON with a plain header field saying where it
// came from. Stamping exportedAt is the caller's job (it changes findings).
export function serialize(record) {
  const { userId, exportedFrom, ...clean } = record || {}
  return JSON.stringify({ exportedFrom: "datahygienics.com", ...clean }, null, 2)
}

const isoOrNull = (v) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : null)
const plain = (v, max = 120) => (typeof v === "string" ? v.slice(0, max) : "")

function walkStrings(value, fn) {
  if (typeof value === "string") return fn(value)
  if (Array.isArray(value)) return value.some((v) => walkStrings(v, fn))
  if (value && typeof value === "object") return Object.values(value).some((v) => walkStrings(v, fn))
  return false
}

// Reads a saved file (or the browser copy) back into a record.
// -> { record, error }. Unknown keys are dropped; anything that looks like a
// network address or an email address is refused, so it never gets stored.
export function parseImport(text) {
  let data
  try {
    data = typeof text === "string" ? JSON.parse(text) : text
  } catch {
    return { record: null, error: "This file isn't a home map we can read. Choose the file you saved from the home map." }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return { record: null, error: "This file isn't a home map we can read." }
  if (data.version !== VERSION) return { record: null, error: "This file is from a different version of the home map." }
  if (!AUDIENCES.includes(data.audience)) return { record: null, error: "This file isn't a home map." }
  if (!Array.isArray(data.items)) return { record: null, error: "This file has no list of devices and accounts." }

  let found = null
  walkStrings(data, (s) => {
    found = forbiddenIn(s)
    return Boolean(found)
  })
  if (found) return { record: null, error: `This file has something that looks like ${found}. Remove it (often from a device name) and try again.` }

  const categoryIds = new Set(categoriesFor(data.audience).map((c) => c.id))
  const items = []
  for (const raw of data.items) {
    if (!raw || typeof raw !== "object") continue
    const item = {}
    for (const key of ITEM_KEYS) if (raw[key] !== undefined) item[key] = raw[key]
    if (typeof item.id !== "string" || !item.id) continue
    item.kind = item.kind === "account" ? "account" : "device"
    item.category = typeof item.category === "string" && (categoryIds.has(item.category) || item.category === "unknown") ? item.category : "unknown"
    for (const key of ["label", "brand", "model", "hardwareVersion"]) item[key] = plain(item[key])
    item.catalogId = typeof item.catalogId === "string" ? item.catalogId : null
    item.controlledBy = typeof item.controlledBy === "string" ? item.controlledBy : null
    item.source = ITEM_SOURCES.includes(item.source) ? item.source : "typed"
    item.addedAt = isoOrNull(item.addedAt)
    const answers = {}
    for (const [k, v] of Object.entries(item.answers && typeof item.answers === "object" ? item.answers : {})) {
      if (typeof v === "string" && /^[a-zA-Z]{1,24}$/.test(k)) answers[k] = v.slice(0, 24)
    }
    item.answers = answers
    items.push(item)
  }
  const ids = new Set(items.map((i) => i.id))
  for (const item of items) if (item.controlledBy && !ids.has(item.controlledBy)) item.controlledBy = null

  const handled = {}
  for (const [key, at] of Object.entries(data.handled && typeof data.handled === "object" ? data.handled : {})) {
    if (/^[a-z0-9-]+:[A-Za-z0-9_-]+$/.test(key) && isoOrNull(at)) handled[key] = at
  }

  return {
    record: {
      version: VERSION,
      audience: data.audience,
      items,
      handled,
      checkedAt: isoOrNull(data.checkedAt),
      exportedAt: isoOrNull(data.exportedAt),
      createdAt: isoOrNull(data.createdAt),
      updatedAt: isoOrNull(data.updatedAt),
    },
    error: null,
  }
}
