// Home map result sync: the one thing about a home map that may reach our
// servers, and only for a signed-in member. The custody rule
// (design/strategy/five-year-value-roadmap.md) keeps the map itself in the
// browser, a saved file and paper; this writes `resultFor(record, findings)`
// from lib/map.js (counts per outcome, an item count and a check date) to
// Supabase `home_map_results` (supabase/migrations/20261029_home_map_results.sql).
//
// Best effort, always: a missing table, a dropped connection or an expired
// session returns false and changes nothing on the page. Nothing is shown to
// the member when it fails, and the map keeps working.

const AUDIENCES = ["home", "business"]

const count = (n) => (Number.isInteger(n) && n >= 0 ? n : 0)

// Only the four numbers per outcome, whatever the caller passes.
function cleanCounts(counts) {
  const out = {}
  for (const [key, row] of Object.entries(counts && typeof counts === "object" ? counts : {})) {
    if (!/^[a-z-]{1,24}$/.test(key) || !row || typeof row !== "object") continue
    out[key] = { weak: count(row.weak), watch: count(row.watch), ok: count(row.ok), handled: count(row.handled) }
  }
  return out
}

// (supabase client, user id, resultFor(...)) -> true when saved, else false.
export async function saveResult(supabase, userId, result) {
  try {
    if (!supabase || !userId || !result || !AUDIENCES.includes(result.audience)) return false
    const checkedAt = typeof result.checkedAt === "string" && !Number.isNaN(Date.parse(result.checkedAt)) ? result.checkedAt : null
    const { error } = await supabase.from("home_map_results").upsert(
      {
        user_id: userId,
        audience: result.audience,
        counts: cleanCounts(result.counts),
        items: count(result.items),
        checked_at: checkedAt,
      },
      { onConflict: "user_id,audience" }
    )
    if (error) {
      if (process.env.NODE_ENV !== "production") console.debug("[home map] result not saved:", error.code || error.message)
      return false
    }
    return true
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.debug("[home map] result not saved:", err?.name || "error")
    return false
  }
}
