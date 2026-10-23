// Where a Path lives. Local-first: answers and progress are kept in this
// browser (no account needed, nothing leaves the device). When someone signs
// in, the same record is saved to Supabase `path_profiles` (see
// supabase/migrations/20261023_path_profiles.sql) and merged across devices.
//
// Record shape: { audience, answers, progress, updatedAt }
//   answers:  quiz answers keyed by question id (lib/content/path/quiz.js)
//   progress: { [stepId]: { status: "done" | "skipped", at: ISO date } }

const VERSION = 1
const keyFor = (audience) => `dh.path.v${VERSION}.${audience}`

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

// Most recent answers win; progress merges step by step, newest mark wins.
export function mergeRecords(a, b) {
  if (!a) return b
  if (!b) return a
  const newer = (a.updatedAt || "") >= (b.updatedAt || "") ? a : b
  const progress = { ...b.progress }
  for (const [id, mark] of Object.entries(a.progress || {})) {
    if (!progress[id] || (mark.at || "") >= (progress[id].at || "")) progress[id] = mark
  }
  return { ...newer, progress }
}

// A missing table (migration not applied yet) or a network error must never
// break the Path; callers get null and keep working locally.
export async function loadRemote(supabase, userId, audience) {
  const { data, error } = await supabase
    .from("path_profiles")
    .select("answers, progress, updated_at")
    .eq("user_id", userId)
    .eq("audience", audience)
    .maybeSingle()
  if (error || !data) return null
  return { audience, answers: data.answers || {}, progress: data.progress || {}, updatedAt: data.updated_at }
}

export async function saveRemote(supabase, userId, record) {
  const { error } = await supabase.from("path_profiles").upsert(
    {
      user_id: userId,
      audience: record.audience,
      answers: record.answers,
      progress: record.progress,
    },
    { onConflict: "user_id,audience" }
  )
  return !error
}
