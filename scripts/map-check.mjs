#!/usr/bin/env node
// Harness for the home map logic (lib/map.js and lib/map/*).
//
//   node scripts/map-check.mjs                 fixture -> findings, readout, summary; sample CSV
//   node scripts/map-check.mjs --read <image>  (lands with lib/map/read.js)
//
// Plain Node, no network, no API calls. Exits non-zero when any assertion
// fails, so it can sit beside `npm run validate`.
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href)

const args = process.argv.slice(2)
const readAt = args.indexOf("--read")
if (readAt >= 0) {
  // The read harness calls the model through buildReadRequest (lib/map/read.js,
  // owned by the server wave) with ANTHROPIC_API_KEY from .env.local.
  console.log("read harness lands with lib/map/read.js")
  process.exit(0)
}

const map = await load("lib/map.js")
const { parseFingCsv } = await load("lib/map/csv.js")
const { summarize } = await load("lib/map/summary.js")
const { serialize, parseImport } = await load("lib/map/storage.js")

let failures = 0
const check = (ok, message) => {
  if (ok) console.log(`  ok    ${message}`)
  else {
    failures++
    console.log(`  FAIL  ${message}`)
  }
}

// ── Fixture ─────────────────────────────────────────────────────────────
const google = map.newItem({ kind: "account", category: "google", label: "Sam's Google", answers: { twoStep: "no", recovery: "yes", others: "me" } })
const photos = map.newItem({ kind: "account", category: "photo-cloud", label: "Family photos", answers: { twoStep: "app", secondCopy: "no", others: "household" } })
const fresh = map.matchCatalog({ brand: "Netgear", model: "RAX50" })
const old = map.matchCatalog({ brand: "Netgear", model: "R7000 v2" })
const record = {
  ...map.emptyMap("home"),
  items: [
    map.newItem({ kind: "device", category: "router", label: "Upstairs router", brand: "Netgear", model: "RAX50", catalogId: fresh?.entry.id, answers: { autoUpdates: "on", guestNetwork: "no", others: "household" }, source: "catalog" }),
    map.newItem({ kind: "device", category: "router", label: "Old router in the garage", brand: "Netgear", model: "R7000 v2", catalogId: old?.entry.id, answers: { autoUpdates: "off", guestNetwork: "no" } }),
    map.newItem({ kind: "device", category: "camera-indoor", label: "Nursery camera", brand: "Wyze", answers: { autoUpdates: "unsure", others: "household" } }),
    map.newItem({ kind: "device", category: "tv", label: "Living room TV", brand: "Samsung", answers: { autoUpdates: "on" } }),
    map.newItem({ kind: "device", category: "plug-bulb", label: "Porch plug", brand: "Kasa", answers: { autoUpdates: "on" } }),
    map.newItem({ kind: "device", category: "plug-bulb", label: "Lamp bulb", brand: "Wiz" }),
    google,
    photos,
  ],
}
const labels = record.items.map((i) => i.label)

console.log("\nCatalog matches")
check(fresh?.entry.id === "netgear-rax50" && fresh.confidence === "high", `RAX50 -> ${fresh?.entry.id} (${fresh?.confidence})`)
check(old?.entry.id === "netgear-r7000", `R7000 v2 -> ${old?.entry.id} (${old?.confidence})`)
check(map.hardwareVersionOf("R7000 v2") === "2", "hardware version kept separately")
check(map.matchCatalog({ model: "R7000P" }) === null, "R7000P does not match the R7000")

const findings = map.assess(record)
console.log("\nFindings")
for (const f of findings) {
  const item = record.items.find((i) => i.id === f.itemId)
  console.log(`  ${f.severity.padEnd(5)} ${f.outcome.padEnd(8)} ${f.ruleId.padEnd(22)} ${item ? item.category.padEnd(13) : "(whole map)  "} -> /steps/${f.stepId}  ${f.title}`)
}
const fired = (ruleId, itemId) => findings.some((f) => f.ruleId === ruleId && (itemId === undefined || f.itemId === itemId))
const [router, oldRouter, camera] = record.items
check(fired("router-fine", router.id), "supported router with updates on is fine")
check(fired("router-ended", oldRouter.id), "ended router is weak")
check(!fired("router-exploited", oldRouter.id), "ended wins over exploited (one router-status finding per item)")
check(findings.filter((f) => f.itemId === oldRouter.id && ["router-ended", "router-exploited", "router-isp", "router-fine", "router-unknown"].includes(f.ruleId)).length === 1, "exactly one router-status finding for the old router")
check(fired("updates-off", oldRouter.id), "updates off on the old router")
check(fired("camera-account", camera.id), "camera with no account")
check(fired("camera-indoors", camera.id), "indoor camera privacy")
check(fired("iot-network"), "gadgets share the network")
check(findings.some((f) => f.ruleId === "account-password-only" && f.itemId === google.id && f.stepId === "sign-in-cleanup"), "Google account password only -> sign-in-cleanup")
check(fired("photos-one-copy", photos.id), "photos in one place")
check(fired("inventory-unsaved"), "map never saved")
const emailRoot = map.assess({ ...map.emptyMap("home"), items: [map.newItem({ kind: "account", category: "email-root", answers: { twoStep: "unsure" } })] })
check(emailRoot.some((f) => f.ruleId === "account-password-only" && f.stepId === "f-email-key"), "email root password only -> f-email-key")
const isp = map.assess({ ...map.emptyMap("home"), items: [map.newItem({ category: "isp-gateway", catalogId: "xfinity-xfi-gateway", answers: { autoUpdates: "unsure" } })] })
check(isp.some((f) => f.ruleId === "router-isp") && !isp.some((f) => f.ruleId === "updates-off"), "provider gateway: provider patches, no updates nag")

// Handling a finding moves it from open to handled.
const handledRecord = { ...record, handled: { [findings[0].key]: new Date().toISOString() } }
const handledFindings = map.assess(handledRecord)
check(handledFindings.find((f) => f.key === findings[0].key)?.handledAt, "handled mark is read back")

console.log("\nReadout (counts per outcome, no total)")
const rows = map.readout(findings)
for (const r of rows) console.log(`  ${r.label.padEnd(20)} ${r.weak} weak · ${r.watch} to watch · ${r.ok} fine · ${r.handled} done`)
check(rows.length === map.OUTCOME_ORDER.length, "one row per outcome")
check(rows.every((r) => !("total" in r) && !("score" in r) && !("percent" in r)), "no total, score or percent")
const handledRows = map.readout(handledFindings)
check(handledRows.reduce((s, r) => s + r.handled, 0) === 1, "handled counted apart")

const result = map.resultFor(record, findings)
console.log("\nResult (the only shape that may sync)")
console.log(" ", JSON.stringify(result))
check(Object.keys(result).sort().join() === "audience,checkedAt,counts,items", "result keys are audience, counts, items, checkedAt")
check(!labels.some((l) => JSON.stringify(result).includes(l)), "result carries no labels")

console.log("\nSummary for Ask")
const summary = summarize(record, findings)
console.log(summary.split("\n").map((l) => `  | ${l}`).join("\n"))
check(summary.length <= 3000, `summary is ${summary.length} chars (cap 3000)`)
check(!labels.some((l) => summary.includes(l)), "summary carries no labels")
check(summary.includes("Netgear RAX50") && !summary.includes("Samsung"), "brand and model for routers only")
check(summarize(record, findings, { maxChars: 120 }).length <= 120, "summary respects maxChars")

console.log("\nSaved file round trip")
const file = serialize(record)
const back = parseImport(file)
check(!back.error && back.record.items.length === record.items.length, "serialize -> parseImport keeps every item")
check(JSON.parse(file).exportedFrom === "datahygienics.com", "file says where it came from")
const bad = JSON.parse(file)
bad.items[0].label = "Router at 192.168.1.1"
check(Boolean(parseImport(JSON.stringify(bad)).error), "an IP address in a file is refused")
bad.items[0].label = "aa:bb:cc:dd:ee:ff"
check(Boolean(parseImport(JSON.stringify(bad)).error), "a MAC address in a file is refused")
bad.items[0].label = "sam@example.com"
check(Boolean(parseImport(JSON.stringify(bad)).error), "an email address in a file is refused")
bad.items[0].label = "Router"
bad.items[0].serial = "SN123456789"
check(!("serial" in parseImport(JSON.stringify(bad)).record.items[0]), "unknown item keys are dropped")

console.log("\nSample CSV (public/samples/home-map-fing-sample.csv)")
const csvPath = path.join(root, "public/samples/home-map-fing-sample.csv")
check(existsSync(csvPath), "sample file exists")
const csvText = readFileSync(csvPath, "utf8")
const csvRows = parseFingCsv(csvText)
for (const r of csvRows) console.log(`  ${r.category.padEnd(13)} ${(r.brand || "-").padEnd(9)} ${(r.model || "-").padEnd(18)} ${r.label}`)
check(csvRows.length >= 8, `${csvRows.length} rows parsed`)
const keys = new Set(csvRows.flatMap((r) => Object.keys(r).map((k) => k.toLowerCase())))
check(!["mac", "mac address", "ip", "hostname", "state", "last seen"].some((k) => keys.has(k)), "no mac, ip, hostname, state or last-seen keys")
check(csvRows.every((r) => Object.values(r).every((v) => !map.forbiddenIn(v))), "no value looks like a MAC, IP or email")
check(csvRows.some((r) => r.label === 'Box "Pro" 4K'), "quoted fields with doubled quotes parse")

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
