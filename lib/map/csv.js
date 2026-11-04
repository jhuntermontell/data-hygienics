// Home map import from a network app's export (Fing and similar) or a pasted
// device list. Runs in the browser; nothing is sent anywhere. Hand-written
// parser, no dependency.
//
// What we keep per row: brand, model, a category guess and the device's
// label. What we drop at parse time and never return: MAC addresses, IP
// addresses, host names, online state and last-seen times. A label or brand
// that itself looks like an address or an email is blanked.
//
// Rows whose type we can't place get category "unknown"; it is not a real
// category, and the walk-through asks the member what the device is.
import { forbiddenIn } from "../map.js"

// RFC 4180-style: quoted fields, doubled quotes, CRLF or LF, a BOM, and a
// delimiter guessed from the header line (comma, semicolon or tab).
export function parseCsvRows(text) {
  const src = String(text || "").replace(/^﻿/, "")
  const firstLine = src.split(/\r?\n/, 1)[0] || ""
  const delimiter = [",", ";", "\t"].map((d) => [d, firstLine.split(d).length]).sort((a, b) => b[1] - a[1])[0][0]
  const rows = []
  let row = []
  let field = ""
  let quoted = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"' && field === "") quoted = true
    else if (c === delimiter) {
      row.push(field)
      field = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else field += c
  }
  if (field !== "" || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""))
}

const HEADERS = {
  brand: ["vendor", "make", "manufacturer", "brand"],
  label: ["name", "device name", "custom name", "device"],
  model: ["model", "model name"],
  type: ["type", "device type", "category"],
}

// Device types as network apps name them, mapped to our category ids.
const TYPE_MAP = [
  [/router|gateway|modem|access point|mesh|extender|repeater/, "router"],
  [/nas|network storage|storage/, "nas"],
  [/doorbell/, "doorbell"],
  [/baby/, "baby-monitor"],
  [/camera|webcam|surveillance/, "camera-indoor"],
  [/thermostat/, "thermostat"],
  [/\block\b|deadbolt/, "smart-lock"],
  [/garage/, "garage"],
  [/tablet|ipad|e-?reader/, "tablet"],
  [/phone|mobile|smartphone/, "phone"],
  [/laptop|desktop|computer|\bpc\b|notebook|workstation|mac\b/, "computer"],
  [/stream|media player|set-?top|chromecast|roku|fire ?tv|apple tv/, "streamer"],
  [/\btv\b|television/, "tv"],
  [/printer|scanner/, "printer"],
  [/speaker|voice|assistant|smart display|echo|sonos/, "speaker"],
  [/plug|bulb|light|switch|outlet|lamp/, "plug-bulb"],
]

export function categoryFromType(type) {
  const t = String(type || "").toLowerCase()
  if (!t.trim()) return "unknown"
  const hit = TYPE_MAP.find(([re]) => re.test(t))
  return hit ? hit[1] : "unknown"
}

const clean = (value, max = 80) => {
  const v = String(value || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max)
  return forbiddenIn(v) ? "" : v
}

// Fing-style CSV -> [{ brand, model, category, label, source: "csv" }].
export function parseFingCsv(text) {
  const rows = parseCsvRows(text)
  if (!rows.length) return []
  const header = rows[0].map((h) => h.trim().toLowerCase())
  const col = {}
  for (const [key, names] of Object.entries(HEADERS)) {
    const at = names.map((n) => header.indexOf(n)).find((i) => i >= 0)
    col[key] = at === undefined ? -1 : at
  }
  const cell = (row, key) => (col[key] >= 0 ? row[col[key]] : "")
  const out = []
  for (const row of rows.slice(1)) {
    const item = {
      brand: clean(cell(row, "brand")),
      model: clean(cell(row, "model")),
      category: categoryFromType(cell(row, "type")),
      label: clean(cell(row, "label")),
      source: "csv",
    }
    if (item.brand || item.model || item.label) out.push(item)
  }
  return out
}

// Brands we can recognise inside a free-text line. Lowercase; longest first
// at match time so "google nest" wins over "google".
const KNOWN_BRANDS = [
  "amazon", "apple", "arlo", "asus", "blink", "bose", "brother", "canon", "chamberlain", "d-link", "ecobee", "eero",
  "epson", "eufy", "google nest", "google", "hp", "hisense", "honeywell", "kasa", "lenovo", "lg", "linksys", "lutron",
  "microsoft", "motorola", "myq", "nest", "netgear", "nintendo", "philips hue", "philips", "ring", "roku", "samsung",
  "schlage", "sonos", "sony", "synology", "tcl", "tp-link", "ubiquiti", "vizio", "wemo", "wyze", "xbox", "yale",
]

// A pasted device list (from a router app or admin page): one device per
// line, best effort. Addresses on the line are removed first; a known brand
// becomes `brand`, the rest of the line the label.
export function parseDeviceListText(text, { source = "typed" } = {}) {
  const brands = [...KNOWN_BRANDS].sort((a, b) => b.length - a.length)
  const out = []
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw
      .replace(/\b([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g, " ")
      .replace(/\b\d{1,3}(\.\d{1,3}){3}\b/g, " ")
      .replace(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi, " ")
      .replace(/^[\s\-*•·\d.)]+/, "")
      .replace(/\s+/g, " ")
      .trim()
    if (!line || line.length < 2) continue
    const lower = line.toLowerCase()
    const brand = brands.find((b) => new RegExp(`(^|[^a-z])${b.replace(/[-]/g, "\\-")}([^a-z]|$)`).test(lower)) || ""
    const label = clean(line)
    if (!label) continue
    out.push({ brand: brand ? clean(line.slice(lower.indexOf(brand), lower.indexOf(brand) + brand.length)) : "", model: "", category: categoryFromType(line), label, source })
  }
  return out
}
