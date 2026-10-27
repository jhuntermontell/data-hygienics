// Generates the Data Hygienics icon set and social image from the Continuous
// Fold brand masters (design/brand-book/assets, see its README).
// Run: node scripts/generate-icons.mjs
//
// Brand rules applied here: the micro mark below 40 px, the full-color master
// at 40 px and above, the one-color white mark on navy tiles (app tile and
// social avatar), and the supplied outlined wordmark, never retyped.
import sharp from "sharp"
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const fontkit = require("fontkit")

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const assetsDir = path.join(root, "design", "brand-book", "assets")
const publicDir = path.join(root, "public")
const brandDir = path.join(publicDir, "brand")
const appDir = path.join(root, "app")

const NAVY = "#0F172A"

// Masters copied to /public/brand so pages and emails can link them.
const PUBLISHED = [
  "mark-color.svg",
  "mark-micro-color.svg",
  "mark-navy.svg",
  "mark-white.svg",
  "logo-horizontal-color.svg",
  // PNG for email clients that do not render SVG (supabase/templates).
  "logo-horizontal-color.png",
  "logo-horizontal-navy.svg",
  "logo-horizontal-white.svg",
  "logo-stacked-color.svg",
  "wordmark-navy.svg",
  "wordmark-white.svg",
]

const read = (name) => fs.readFile(path.join(assetsDir, name), "utf8")

// Inner markup of an SVG master, with ids prefixed so two masters can share
// one canvas without their masks colliding.
function innerSvg(svg, prefix) {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/id="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
}

function viewBoxOf(svg) {
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  return { w, h }
}

async function renderMark(source, size, outPath, { background, scale = 1 } = {}) {
  const svg = await read(source)
  const inner = size * scale
  const offset = (size - inner) / 2
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : ""}
  <g transform="translate(${offset} ${offset}) scale(${inner / 400})">${innerSvg(svg, "m")}</g>
</svg>`
  const buf = await sharp(Buffer.from(canvas)).png({ compressionLevel: 9 }).toBuffer()
  if (outPath) {
    await fs.writeFile(outPath, buf)
    console.log("wrote", path.relative(root, outPath), `(${size}x${size})`)
  }
  return buf
}

// --- ICO encoder -----------------------------------------------------------
// ICO can embed PNGs directly. Spec: 6-byte ICONDIR header, then one
// ICONDIRENTRY per image (16 bytes), then the image payloads.
async function buildIco(sizes, outPath) {
  const pngs = await Promise.all(
    sizes.map(async (s) => ({
      size: s,
      buf: await renderMark(s < 40 ? "mark-micro-color.svg" : "mark-color.svg", s, null),
    }))
  )

  const headerSize = 6
  const entrySize = 16
  const dirSize = headerSize + entrySize * pngs.length

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)            // reserved
  header.writeUInt16LE(1, 2)            // type 1 = ICO
  header.writeUInt16LE(pngs.length, 4)  // image count

  const entries = []
  let offset = dirSize
  for (const { size, buf } of pngs) {
    const entry = Buffer.alloc(entrySize)
    entry.writeUInt8(size === 256 ? 0 : size, 0) // width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2)                       // colors in palette
    entry.writeUInt8(0, 3)                       // reserved
    entry.writeUInt16LE(1, 4)                    // color planes
    entry.writeUInt16LE(32, 6)                   // bits per pixel
    entry.writeUInt32LE(buf.length, 8)           // image size
    entry.writeUInt32LE(offset, 12)              // image offset
    entries.push(entry)
    offset += buf.length
  }

  const out = Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)])
  await fs.writeFile(outPath, out)
  console.log("wrote", path.relative(root, outPath), `(ICO ${sizes.join("+")})`)
}

// Outlined text, so the social image renders the same on any machine. Avenir
// Next is the wordmark's foundation (macOS system font).
function outlinedText(text, { x, baseline, size, fill, weight = "AvenirNext-Medium" }) {
  const collection = fontkit.openSync("/System/Library/Fonts/Avenir Next.ttc")
  const font = collection.fonts.find((f) => f.postscriptName === weight)
  if (!font) throw new Error(`${weight} was not found`)
  const run = font.layout(text)
  const scale = size / font.unitsPerEm
  let penX = 0
  const paths = run.glyphs.map((glyph, i) => {
    const pos = run.positions[i]
    const tx = x + (penX + pos.xOffset) * scale
    penX += pos.xAdvance
    return `<path d="${glyph.path.toSVG()}" fill="${fill}" transform="translate(${tx.toFixed(2)} ${baseline}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})"/>`
  })
  return paths.join("")
}

// --- OG image (1200x630): mirrors the brand book cover. Navy field, the
// color mark on a white tile, the white wordmark and the tagline.
async function buildOgImage(outPath) {
  const W = 1200
  const H = 630
  const wordmark = await read("wordmark-white.svg")
  const mark = await read("mark-color.svg")
  const word = viewBoxOf(wordmark)
  const tile = 264
  const tileX = 96
  const tileY = (H - tile) / 2
  const wordW = 640
  const wordH = (word.h / word.w) * wordW
  const textX = tileX + tile + 64

  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <circle cx="${W + 40}" cy="-60" r="330" fill="#1E293B"/>
  <rect x="${tileX}" y="${tileY}" width="${tile}" height="${tile}" rx="44" fill="#FFFFFF"/>
  <g transform="translate(${tileX + 32} ${tileY + 32}) scale(${(tile - 64) / 400})">${innerSvg(mark, "og-mark")}</g>
  <g transform="translate(${textX - 12} ${H / 2 - wordH + 8}) scale(${wordW / word.w})">${innerSvg(wordmark, "og-word")}</g>
  ${outlinedText("Live securely alongside AI.", { x: textX, baseline: H / 2 + 62, size: 38, fill: "#CBD5E1" })}
  <rect x="${textX}" y="${H / 2 + 104}" width="56" height="6" rx="3" fill="#0F8F83"/>
</svg>`

  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(outPath)
  console.log("wrote", path.relative(root, outPath), `(${W}x${H})`)
}

// Wordmark glyph outlines as data, for renderers that can't load an SVG file
// (the @react-pdf documents). Written to lib/brand/wordmark.js.
async function buildWordmarkModule(outPath) {
  const svg = await read("wordmark-navy.svg")
  const glyphs = [...svg.matchAll(/<path d="([^"]+)"[^>]*transform="translate\(([\d.-]+) ([\d.-]+)\) scale\(([\d.-]+) [\d.-]+\)"/g)].map(
    ([, d, x, y, scale]) => ({ d, x: Number(x), y: Number(y), scale: Number(scale) })
  )
  const { w, h } = viewBoxOf(svg)
  const body = `// Generated by scripts/generate-icons.mjs from design/brand-book/assets/wordmark-navy.svg.
// The outlined Data Hygienics wordmark. Never retype it; draw these glyphs.
// Each glyph is drawn with transform="translate(x y) scale(scale -scale)".
export const WORDMARK = ${JSON.stringify({ width: w, height: h, glyphs }, null, 2)}
`
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, body)
  console.log("wrote", path.relative(root, outPath), `(${glyphs.length} glyphs)`)
}

async function main() {
  await buildWordmarkModule(path.join(root, "lib", "brand", "wordmark.js"))
  await fs.mkdir(brandDir, { recursive: true })
  for (const name of PUBLISHED) {
    await fs.copyFile(path.join(assetsDir, name), path.join(brandDir, name))
  }
  console.log("copied", PUBLISHED.length, "masters to public/brand")

  // Navbar and footer lockups.
  await fs.copyFile(path.join(assetsDir, "logo-horizontal-color.svg"), path.join(publicDir, "logo.svg"))
  await fs.copyFile(path.join(assetsDir, "mark-color.svg"), path.join(publicDir, "logo-mark.svg"))

  // Browser favicons use the micro mark; the app tile is the white mark on navy.
  await renderMark("mark-micro-color.svg", 16, path.join(publicDir, "favicon-16x16.png"))
  await renderMark("mark-micro-color.svg", 32, path.join(publicDir, "favicon-32x32.png"))
  await renderMark("mark-white.svg", 180, path.join(publicDir, "apple-touch-icon.png"), { background: NAVY, scale: 0.62 })
  // Maskable icons keep the mark inside the central safe zone.
  await renderMark("mark-white.svg", 192, path.join(publicDir, "icon-192.png"), { background: NAVY, scale: 0.56 })
  await renderMark("mark-white.svg", 512, path.join(publicDir, "icon-512.png"), { background: NAVY, scale: 0.56 })

  // favicon.ico (App Router serves app/favicon.ico at /favicon.ico).
  await buildIco([16, 32, 48], path.join(appDir, "favicon.ico"))

  await buildOgImage(path.join(publicDir, "og-image.png"))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
