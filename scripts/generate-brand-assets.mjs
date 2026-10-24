import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import sharp from "sharp"

const require = createRequire(import.meta.url)
const fontkit = require("fontkit")

const projectRoot = process.cwd()
const outDir = path.join(projectRoot, "design", "brand-book", "assets")
fs.mkdirSync(outDir, { recursive: true })

const colors = {
  navy: "#0F172A",
  cobalt: "#1D4ED8",
  teal: "#0F8F83",
  white: "#FFFFFF",
}

const fontCollection = fontkit.openSync("/System/Library/Fonts/Avenir Next.ttc")
const wordmarkFont = fontCollection.fonts.find(
  (font) => font.postscriptName === "AvenirNext-DemiBold"
)

if (!wordmarkFont) throw new Error("Avenir Next Demi Bold was not found")

function roundedRingPath() {
  return [
    "M200 24",
    "L354 112",
    "Q370 121 370 140",
    "L370 260",
    "Q370 279 354 288",
    "L216 367",
    "Q200 376 184 367",
    "L46 288",
    "Q30 279 30 260",
    "L30 140",
    "Q30 121 46 112",
    "L184 33",
    "Q200 24 216 33",
    "Z",
  ].join(" ")
}

function roundedCorePath() {
  return [
    "M200 122",
    "L286 171",
    "Q300 179 300 195",
    "L300 205",
    "Q300 221 286 229",
    "L214 270",
    "Q200 278 186 270",
    "L114 229",
    "Q100 221 100 205",
    "L100 195",
    "Q100 179 114 171",
    "L186 130",
    "Q200 122 214 130",
    "Z",
  ].join(" ")
}

function signatureGapPath(micro = false) {
  return micro
    ? "M323 88 L354 106 L296 194 L264 176 Z"
    : "M328 94 L351 107 L292 190 L269 177 Z"
}

function svgShell(viewBox, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}" fill="none">\n${body}\n</svg>\n`
}

function colorMarkBody(prefix = "mark", micro = false) {
  const outer = roundedRingPath()
  const core = roundedCorePath()
  const gap = signatureGapPath(micro)
  return `  <defs>
    <mask id="${prefix}-ring-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
      <rect width="400" height="400" fill="black"/>
      <path d="${outer}" fill="white"/>
      <path d="${core}" fill="black"/>
      <path d="${gap}" fill="black"/>
    </mask>
  </defs>
  <g mask="url(#${prefix}-ring-mask)">
    <path d="M0 92 L100 150 L100 220 L200 278 L200 410 L-10 410 L-10 92 Z" fill="${colors.teal}"/>
    <path d="M400 92 L300 150 L300 220 L200 278 L200 410 L410 410 L410 92 Z" fill="${colors.cobalt}"/>
    <path d="M-10 -10 H410 V150 L300 214 V180 L200 122 L100 180 V214 L-10 150 Z" fill="${colors.navy}"/>
  </g>`
}

function monoMarkBody(fill, prefix = "mono", micro = false) {
  const outer = roundedRingPath()
  const core = roundedCorePath()
  const gap = signatureGapPath(micro)
  return `  <defs>
    <mask id="${prefix}-ring-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
      <rect width="400" height="400" fill="black"/>
      <path d="${outer}" fill="white"/>
      <path d="${core}" fill="black"/>
      <path d="${gap}" fill="black"/>
    </mask>
  </defs>
  <rect width="400" height="400" fill="${fill}" mask="url(#${prefix}-ring-mask)"/>`
}

function wordmarkPaths({ text = "Data Hygienics", x = 0, baseline = 100, size = 72, fill = colors.navy }) {
  const run = wordmarkFont.layout(text)
  const scale = size / wordmarkFont.unitsPerEm
  const tracking = -3
  let penX = 0
  const paths = []

  run.glyphs.forEach((glyph, index) => {
    const position = run.positions[index]
    const tx = x + (penX + position.xOffset) * scale
    const ty = baseline - position.yOffset * scale
    paths.push(
      `<path d="${glyph.path.toSVG()}" fill="${fill}" transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(6)} ${(-scale).toFixed(6)})"/>`
    )
    penX += position.xAdvance + tracking
  })

  return {
    body: paths.join("\n  "),
    width: penX * scale,
    height: size,
  }
}

function write(name, contents) {
  fs.writeFileSync(path.join(outDir, name), contents)
}

const markColor = svgShell("0 0 400 400", colorMarkBody("mark-color"), "Data Hygienics mark")
const markNavy = svgShell("0 0 400 400", monoMarkBody(colors.navy, "mark-navy"), "Data Hygienics mark in navy")
const markWhite = svgShell("0 0 400 400", monoMarkBody(colors.white, "mark-white"), "Data Hygienics mark in white")
const markMicroColor = svgShell("0 0 400 400", colorMarkBody("mark-micro-color", true), "Data Hygienics micro mark")

write("mark-color.svg", markColor)
write("mark-navy.svg", markNavy)
write("mark-white.svg", markWhite)
write("mark-micro-color.svg", markMicroColor)

const horizontalWord = wordmarkPaths({ x: 300, baseline: 148, size: 86, fill: colors.navy })
const horizontalWidth = Math.ceil(300 + horizontalWord.width + 24)
const horizontalColor = svgShell(
  `0 0 ${horizontalWidth} 220`,
  `  <g transform="translate(18 10) scale(.5)">\n${colorMarkBody("horizontal-color")}\n  </g>\n  ${horizontalWord.body}`,
  "Data Hygienics logo"
)
write("logo-horizontal-color.svg", horizontalColor)

const horizontalNavy = svgShell(
  `0 0 ${horizontalWidth} 220`,
  `  <g transform="translate(18 10) scale(.5)">\n${monoMarkBody(colors.navy, "horizontal-navy")}\n  </g>\n  ${horizontalWord.body}`,
  "Data Hygienics logo in navy"
)
write("logo-horizontal-navy.svg", horizontalNavy)

const horizontalWhiteWord = wordmarkPaths({ x: 300, baseline: 148, size: 86, fill: colors.white })
const horizontalWhite = svgShell(
  `0 0 ${horizontalWidth} 220`,
  `  <g transform="translate(18 10) scale(.5)">\n${monoMarkBody(colors.white, "horizontal-white")}\n  </g>\n  ${horizontalWhiteWord.body}`,
  "Data Hygienics reversed logo"
)
write("logo-horizontal-white.svg", horizontalWhite)

const stackedWord = wordmarkPaths({ x: 0, baseline: 88, size: 78, fill: colors.navy })
const stackedWidth = Math.ceil(Math.max(420, stackedWord.width + 60))
const stackedWordX = (stackedWidth - stackedWord.width) / 2
const stackedWordCentered = wordmarkPaths({ x: stackedWordX, baseline: 422, size: 78, fill: colors.navy })
const stackedColor = svgShell(
  `0 0 ${stackedWidth} 470`,
  `  <g transform="translate(${(stackedWidth - 300) / 2} 8) scale(.75)">\n${colorMarkBody("stacked-color")}\n  </g>\n  ${stackedWordCentered.body}`,
  "Stacked Data Hygienics logo"
)
write("logo-stacked-color.svg", stackedColor)

const wordmarkOnly = wordmarkPaths({ x: 12, baseline: 102, size: 92, fill: colors.navy })
const wordmarkSvg = svgShell(
  `0 0 ${Math.ceil(wordmarkOnly.width + 24)} 128`,
  `  ${wordmarkOnly.body}`,
  "Data Hygienics wordmark"
)
write("wordmark-navy.svg", wordmarkSvg)

const wordmarkWhiteOnly = wordmarkPaths({ x: 12, baseline: 102, size: 92, fill: colors.white })
const wordmarkWhiteSvg = svgShell(
  `0 0 ${Math.ceil(wordmarkWhiteOnly.width + 24)} 128`,
  `  ${wordmarkWhiteOnly.body}`,
  "Data Hygienics wordmark in white"
)
write("wordmark-white.svg", wordmarkWhiteSvg)

const renders = [
  ["mark-color.svg", "mark-color-1024.png", { width: 1024, height: 1024 }],
  ["mark-color.svg", "mark-color-512.png", { width: 512, height: 512 }],
  ["mark-color.svg", "mark-color-192.png", { width: 192, height: 192 }],
  ["mark-color.svg", "mark-color-32.png", { width: 32, height: 32 }],
  ["mark-micro-color.svg", "mark-micro-24.png", { width: 24, height: 24 }],
  ["mark-micro-color.svg", "mark-micro-16.png", { width: 16, height: 16 }],
  ["mark-navy.svg", "mark-navy-1024.png", { width: 1024, height: 1024 }],
  ["mark-white.svg", "mark-white-1024.png", { width: 1024, height: 1024 }],
  ["logo-horizontal-color.svg", "logo-horizontal-color.png", { width: 2400 }],
  ["logo-horizontal-navy.svg", "logo-horizontal-navy.png", { width: 2400 }],
  ["logo-horizontal-white.svg", "logo-horizontal-white.png", { width: 2400 }],
  ["logo-stacked-color.svg", "logo-stacked-color.png", { width: 1400 }],
  ["wordmark-navy.svg", "wordmark-navy.png", { width: 1800 }],
  ["wordmark-white.svg", "wordmark-white.png", { width: 1800 }],
]

for (const [source, target, options] of renders) {
  await sharp(path.join(outDir, source), { density: 240 })
    .resize(options)
    .png()
    .toFile(path.join(outDir, target))
}

console.log(`Generated ${renders.length + 8} brand assets in ${outDir}`)
