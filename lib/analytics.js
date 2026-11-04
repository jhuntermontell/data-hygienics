// Analytics events. Exactly seven events exist on the site (CLAUDE.md lists
// them): chip_clicked, path_completed, step_done, path_saved, the two
// membership funnel events join_viewed and join_started, and map_checked.
//
// map_checked: the home map never reaches a server, so home_map_results only counts signed-in members; without this event the intake-to-readout funnel for the free tier (most of the audience) is invisible, and that funnel decides whether the Watch's device half gets a year two. Props are bucketed so no single home is described.
//
// `track` is safe to call anywhere: it no-ops on the server and when the
// Vercel package is unavailable, and logs in development so events can be checked
// in the browser console without a dashboard.
import { track as vercelTrack } from "@vercel/analytics"

export const EVENTS = Object.freeze({
  chipClicked: "chip_clicked",
  pathCompleted: "path_completed",
  stepDone: "step_done",
  pathSaved: "path_saved",
  joinViewed: "join_viewed",
  joinStarted: "join_started",
  mapChecked: "map_checked",
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
