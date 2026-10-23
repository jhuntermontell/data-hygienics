// Continuous Fold mark geometry, from scripts/generate-brand-assets.mjs (the
// source of design/brand-book/assets). 400x400 viewBox. Three faces clipped
// to a rounded hexagonal ring, with a clear center and the signature clean
// cut at the upper right. Do not redraw or recolor; see the brand book.

export const BRAND_COLORS = {
  navy: "#0F172A", // Judgment
  cobalt: "#1D4ED8", // Clarity
  teal: "#0F8F83", // Action
  field: "#F8FAFC",
}

export const MARK = {
  viewBox: "0 0 400 400",
  ring: "M200 24 L354 112 Q370 121 370 140 L370 260 Q370 279 354 288 L216 367 Q200 376 184 367 L46 288 Q30 279 30 260 L30 140 Q30 121 46 112 L184 33 Q200 24 216 33 Z",
  core: "M200 122 L286 171 Q300 179 300 195 L300 205 Q300 221 286 229 L214 270 Q200 278 186 270 L114 229 Q100 221 100 205 L100 195 Q100 179 114 171 L186 130 Q200 122 214 130 Z",
  cut: "M328 94 L351 107 L292 190 L269 177 Z",
  // Purpose-drawn wider cut for 16-24 px use.
  microCut: "M323 88 L354 106 L296 194 L264 176 Z",
  faces: {
    teal: "M0 92 L100 150 L100 220 L200 278 L200 410 L-10 410 L-10 92 Z",
    cobalt: "M400 92 L300 150 L300 220 L200 278 L200 410 L410 410 L410 92 Z",
    navy: "M-10 -10 H410 V150 L300 214 V180 L200 122 L100 180 V214 L-10 150 Z",
  },
}
