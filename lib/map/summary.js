// Home map summary for Ask: a short, plain-text picture of the home that a
// member chooses to send with one question (the "Use my home map" chip).
//
// What it holds: how many items of each kind and group; brand and model for
// routers, mesh systems, provider gateways and storage drives only (the
// models that carry support dates); which answers were given; open finding
// titles with their severity. What it never holds: labels or device names,
// people, serial numbers, addresses or emails. Brand and model text is
// capped and dropped if it looks like an address or an email.
//
// The server caps the context it accepts at MAX_CONTEXT_CHARS in
// lib/assistant/limits.js; pass that as `maxChars` (we don't import it here so
// this file stays loadable on its own). The default matches it.
import { getCategory, forbiddenIn, hardwareVersionOf } from "../map.js"

const MODEL_CATEGORIES = new Set(["router", "mesh", "isp-gateway", "nas"])

// Short names for answers: "router: updates on, guest network no".
const QUESTION_WORDS = {
  autoUpdates: "updates",
  guestNetwork: "guest network",
  others: "others",
  screenLock: "screen lock",
  backup: "backup",
  twoStep: "two-step",
  recovery: "recovery",
  secondCopy: "second copy",
}

const safe = (text, max = 40) => {
  const v = String(text || "").replace(/[<>\r\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, max)
  return v && !forbiddenIn(v) ? v : ""
}
const tally = (list) => {
  const counts = {}
  for (const key of list) counts[key] = (counts[key] || 0) + 1
  return Object.entries(counts)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ")
}

export function summarize(record, findings = [], { maxChars = 3000 } = {}) {
  const items = record?.items || []
  const devices = items.filter((i) => i.kind === "device")
  const accounts = items.filter((i) => i.kind === "account")
  const lines = []
  lines.push(`Home map: ${items.length} items (${devices.length} devices, ${accounts.length} accounts).`)
  if (devices.length) lines.push(`Devices by group: ${tally(devices.map((i) => getCategory(i.category)?.group || "unknown"))}.`)
  if (accounts.length) lines.push(`Accounts: ${tally(accounts.map((i) => i.category))}.`)

  const models = devices
    .filter((i) => MODEL_CATEGORIES.has(i.category))
    .map((i) => {
      const name = [safe(i.brand), safe(i.model)].filter(Boolean).join(" ")
      const hw = safe(i.hardwareVersion, 12)
      const showHw = hw && hardwareVersionOf(i.model) !== hw
      return name ? `${i.category}: ${name}${showHw ? ` (hardware v${hw})` : ""}` : null
    })
    .filter(Boolean)
  if (models.length) lines.push("Models:", ...models.map((m) => `- ${m}`))

  const byId = Object.fromEntries(items.map((i) => [i.id, i]))
  const answerLines = items
    .map((i) => {
      const parts = Object.entries(i.answers || {})
        .filter(([q, v]) => QUESTION_WORDS[q] && typeof v === "string")
        .map(([q, v]) => `${QUESTION_WORDS[q]} ${safe(v, 12)}`)
      if (i.kind === "device" && getCategory(i.category)?.group === "camera") {
        const owner = i.controlledBy && byId[i.controlledBy]
        parts.push(`account ${owner ? owner.category : "none"}`)
      }
      return parts.length ? `- ${i.category}: ${parts.join(", ")}` : null
    })
    .filter(Boolean)
  if (answerLines.length) lines.push("Answers:", ...answerLines)

  const open = findings.filter((f) => !f.handledAt)
  const handled = findings.length - open.length
  if (open.length) lines.push("Open findings:", ...open.map((f) => `- ${f.severity === "ok" ? "fine" : f.severity}: ${f.title}`))
  if (handled) lines.push(`Findings marked done: ${handled}.`)
  if (record?.checkedAt) lines.push(`Checked: ${String(record.checkedAt).slice(0, 10)}.`)

  // Hard cap on a line boundary.
  let out = ""
  for (const line of lines) {
    const next = out ? `${out}\n${line}` : line
    if (next.length > maxChars) break
    out = next
  }
  return out
}
