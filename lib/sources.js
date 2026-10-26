// Source registry. Each research group keeps its own file under
// lib/content/sources/; this merges them so a cited id resolves anywhere.
// Groups share canonical ids (e.g. fbi-ic3-2025) for common reports; the
// first definition wins and scripts/validate-content.mjs flags any
// duplicate whose URL disagrees.
import { SOURCES as terms } from "./content/sources/terms.js"
import { SOURCES as voiceScams } from "./content/sources/voice-scams.js"
import { SOURCES as fraud } from "./content/sources/fraud.js"
import { SOURCES as aiData } from "./content/sources/ai-data.js"
import { SOURCES as toolkit } from "./content/sources/toolkit.js"
import { SOURCES as landscape } from "./content/sources/landscape.js"
import { SOURCES as sovereignty } from "./content/sources/sovereignty.js"
import { SOURCES as horizon } from "./content/sources/horizon.js"
import { SOURCES as verdicts } from "./content/sources/verdicts.js"

export const SOURCE_GROUPS = { landscape, fraud, voiceScams, aiData, sovereignty, terms, toolkit, horizon, verdicts }

export const SOURCES = Object.values(SOURCE_GROUPS).reduce((all, group) => {
  for (const [id, source] of Object.entries(group)) {
    if (!all[id]) all[id] = source
  }
  return all
}, {})

export function getSource(id) {
  return SOURCES[id]
}
