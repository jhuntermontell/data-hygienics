// Day arithmetic for the rules engine. Every date is a calendar day in UTC,
// written "YYYY-MM-DD". Facts may carry full ISO timestamps; only the day
// counts.

const DAY_MS = 86400000

// "YYYY-MM-DD" for a Date, an ISO string or a day string; null otherwise.
export function toDay(value) {
  if (value == null || value === "") return null
  const d = value instanceof Date ? value : new Date(String(value).length === 10 ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function ms(day) {
  return Date.parse(`${day}T00:00:00Z`)
}

export function addDays(value, days) {
  const day = toDay(value)
  if (!day) return null
  return new Date(ms(day) + days * DAY_MS).toISOString().slice(0, 10)
}

// Whole days from a to b (positive when b is later).
export function daysBetween(a, b) {
  const da = toDay(a)
  const db = toDay(b)
  if (!da || !db) return null
  return Math.round((ms(db) - ms(da)) / DAY_MS)
}

export function earliest(days) {
  const list = days.map(toDay).filter(Boolean).sort()
  return list[0] || null
}

export function latest(days) {
  const list = days.map(toDay).filter(Boolean).sort()
  return list[list.length - 1] || null
}
