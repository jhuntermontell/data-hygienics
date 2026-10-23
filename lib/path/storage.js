// Where a Path lives. Local-first: answers and progress are kept in this
// browser (no account needed, nothing leaves the device). When someone signs
// in, the same record is saved to Supabase `path_profiles` (see
// supabase/migrations/20261023_path_profiles.sql) and merged across devices.
//
// Record shape: { audience, answers, progress, updatedAt, resetAt, userId }
//   answers:  quiz answers keyed by question id (lib/content/path/quiz.js)
//   progress: { [stepId]: { status, at: ISO date } }. Undo writes
//             status: null (a tombstone) rather than deleting, so the
//             removal wins the merge against an older copy that still has
//             the mark.
//   resetAt:  set by "Start over"; marks older than it are dropped on merge.
//   userId:   the account this browser copy was synced with, if any. A copy
//             tied to one account is never shown to, or merged into, another.

const VERSION = 1
const PREFIX = `dh.path.v${VERSION}.`
const keyFor = (audience) => `${PREFIX}${audience}`

export function emptyRecord(audience) {
  return { audience, answers: {}, progress: {}, updatedAt: null }
}

// Storage can be unavailable (private windows, blocked site data), so every
// access is wrapped and the Path still works for the current visit.
export function loadLocal(audience) {
  try {
    const raw = window.localStorage.getItem(keyFor(audience))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.audience === audience ? parsed : null
  } catch {
    return null
  }
}

export function saveLocal(record) {
  try {
    window.localStorage.setItem(keyFor(record.audience), JSON.stringify(record))
    return true
  } catch {
    return false
  }
}

export function clearLocal(audience) {
  try {
    window.localStorage.removeItem(keyFor(audience))
  } catch {
    // Nothing to clear.
  }
}

// On sign-out, forget every path that belongs to an account: it's saved
// there, and the next person on this browser shouldn't see it. Device-only
// paths (never synced) stay.
export function clearAccountPaths() {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (!key.startsWith(PREFIX)) continue
      const record = JSON.parse(window.localStorage.getItem(key) || "null")
      if (record?.userId) window.localStorage.removeItem(key)
    }
  } catch {
    // Storage blocked: nothing was kept.
  }
}

// Most recent answers win; progress merges step by step, newest mark
// (including an Undo tombstone) wins; marks older than the latest reset go.
export function mergeRecords(a, b) {
  if (!a) return b
  if (!b) return a
  const newer = (a.updatedAt || "") >= (b.updatedAt || "") ? a : b
  const resetAt = [a.resetAt, b.resetAt].filter(Boolean).sort().pop() || ""
  const progress = {}
  for (const source of [b.progress || {}, a.progress || {}]) {
    for (const [id, mark] of Object.entries(source)) {
      if ((mark?.at || "") < resetAt) continue
      if (!progress[id] || (mark.at || "") >= (progress[id].at || "")) progress[id] = mark
    }
  }
  return { ...newer, progress, ...(resetAt ? { resetAt } : {}) }
}

// `error` is set when the account copy couldn't be read (missing table,
// network); callers must not overwrite the account in that case. A missing
// row is not an error: { record: null, error: null }.
export async function loadRemote(supabase, userId, audience) {
  try {
    const { data, error } = await supabase
      .from("path_profiles")
      .select("answers, progress, updated_at")
      .eq("user_id", userId)
      .eq("audience", audience)
      .maybeSingle()
    if (error) return { record: null, error }
    if (!data) return { record: null, error: null }
    const { __resetAt, ...progress } = data.progress || {}
    return {
      record: {
        audience,
        answers: data.answers || {},
        progress,
        updatedAt: data.updated_at,
        ...(__resetAt?.at ? { resetAt: __resetAt.at } : {}),
        userId,
      },
      error: null,
    }
  } catch (error) {
    return { record: null, error }
  }
}

// resetAt rides inside the progress JSON so the table needs no extra column.
export async function saveRemote(supabase, userId, record) {
  const progress = { ...(record.progress || {}) }
  if (record.resetAt) progress.__resetAt = { status: null, at: record.resetAt }
  const { error } = await supabase.from("path_profiles").upsert(
    {
      user_id: userId,
      audience: record.audience,
      answers: record.answers,
      progress,
    },
    { onConflict: "user_id,audience" }
  )
  return !error
}
