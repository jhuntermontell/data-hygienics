// Analytics events. Exactly six events exist on the site (CLAUDE.md lists
// them): chip_clicked, path_completed, step_done, path_saved, and the two
// membership funnel events join_viewed and join_started. `track` is
// safe to call anywhere: it no-ops on the server and when the Vercel
// package is unavailable, and logs in development so events can be checked
// in the browser console without a dashboard.
import { track as vercelTrack } from "@vercel/analytics"

export const EVENTS = Object.freeze({
  chipClicked: "chip_clicked",
  pathCompleted: "path_completed",
  stepDone: "step_done",
  pathSaved: "path_saved",
  joinViewed: "join_viewed",
  joinStarted: "join_started",
})

export function track(name, props = {}) {
  if (typeof window === "undefined") return
  try {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", name, props)
    vercelTrack(name, props)
  } catch {
    // Never let analytics break the page.
  }
}
