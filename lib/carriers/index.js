// Re-exports so UI code can `import { ... } from "@/lib/carriers"` without
// having to know which file in the module hosts which symbol.

export {
  generateCarrierReadiness,
  generateProofPackData,
  getSupportedCarrierIds,
  getCarrierProfile,
} from "./engine"

export { COALITION_PROFILE, COALITION_QUESTIONS } from "./coalition"
export { COWBELL_PROFILE, COWBELL_QUESTIONS } from "./cowbell"
export { TRAVELERS_PROFILE, TRAVELERS_QUESTIONS } from "./travelers"
export { BEAZLEY_PROFILE, BEAZLEY_QUESTIONS } from "./beazley"
export { EVIDENCE_CATALOG, getEvidenceById, getEvidenceForCategory } from "./evidence"

// All four carriers are live as of Phase 2. The UI selector renders them
// with the same active behavior; there are no "Coming Soon" tabs any more.
// `accentColor` is kept for future visual differentiation but currently
// every carrier uses the same teal accent (#0F766E) to match the
// Insurance Readiness section styling.
export const CARRIER_REGISTRY = [
  {
    id: "coalition",
    name: "Coalition",
    status: "active",
    accentColor: "#0F766E",
  },
  {
    id: "cowbell",
    name: "Cowbell",
    status: "active",
    accentColor: "#0F766E",
  },
  {
    id: "travelers",
    name: "Travelers",
    status: "active",
    accentColor: "#0F766E",
  },
  {
    id: "beazley",
    name: "Beazley",
    status: "active",
    accentColor: "#0F766E",
  },
]
