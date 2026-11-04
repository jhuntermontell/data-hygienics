// A small in-memory, per-key sliding window: roughly 20 checks per 10 minutes
// per IP address. It lives in one server instance's memory, so it is a brake
// on scripted use, not an exact quota. It holds timestamps keyed by IP for
// the length of the window and forgets them after.

export const RATE_LIMIT = 20
export const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_KEYS = 10000

export function createRateLimiter({ limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS } = {}) {
  const hits = new Map()

  function prune(now) {
    for (const [key, times] of hits) {
      const recent = times.filter((time) => now - time < windowMs)
      if (recent.length === 0) hits.delete(key)
      else hits.set(key, recent)
    }
  }

  // Returns { allowed, retryAfterSeconds }.
  return function take(key, now = Date.now()) {
    if (hits.size > MAX_KEYS) prune(now)
    const recent = (hits.get(key) || []).filter((time) => now - time < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return { allowed: false, retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000) }
    }
    recent.push(now)
    hits.set(key, recent)
    return { allowed: true, retryAfterSeconds: 0 }
  }
}
