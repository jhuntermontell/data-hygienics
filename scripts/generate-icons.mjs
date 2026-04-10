// Generates the full Data Hygienics icon set from the rounded logo mark.
// Run: node scripts/generate-icons.mjs
import sharp from "sharp"
import fs from "node:fs/promises"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const publicDir = path.join(root, "public")
const appDir = path.join(root, "app")

// The rounded logo mark — same shapes as public/logo-mark.svg, but rendered
// at higher fidelity onto a transparent square canvas with extra inner padding
// so the icon reads cleanly at small sizes.
function logoSvg(size, { background = "transparent", padding = 0.12 } = {}) {
  const pad = Math.round(size * padding)
  const inner = size - pad * 2
  // Source viewBox is 0..32 — scale to inner box
  const scale = inner / 32
  const tx = pad
  const ty = pad
  const bgRect =
    background === "transparent"
      ? ""
      : `<rect width="${size}" height="${size}" fill="${background}" />`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bgRect}
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <rect x="2"  y="4"  width="16" height="16" rx="4.5" fill="#1D4ED8" opacity="0.2"/>
    <rect x="10" y="12" width="16" height="16" rx="4.5" fill="#1D4ED8" opacity="0.45"/>
    <rect x="6"  y="8"  width="16" height="16" rx="4.5" fill="none" stroke="#1D4ED8" stroke-width="1.8"/>
  </g>
</svg>`
}

async function renderPng(size, outPath, opts) {
  const svg = logoSvg(size, opts)
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPath)
  console.log("wrote", path.relative(root, outPath), `(${size}x${size})`)
}

// --- ICO encoder -----------------------------------------------------------
// ICO can embed PNGs directly. Spec: 6-byte ICONDIR header, then one
// ICONDIRENTRY per image (16 bytes), then the image payloads.
async function buildIco(sizes, outPath) {
  const pngs = await Promise.all(
    sizes.map(async (s) => {
      const svg = logoSvg(s, { padding: s <= 32 ? 0.06 : 0.12 })
      const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
      return { size: s, buf }
    })
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

// --- OG image (1200x630, white background, centered logo + text) -----------
async function buildOgImage(outPath) {
  const W = 1200
  const H = 630
  const logoSize = 220

  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <!-- subtle bottom rule -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#1D4ED8"/>

  <!-- Logo mark, centered horizontally, upper area -->
  <g transform="translate(${(W - logoSize) / 2}, 130)">
    <g transform="scale(${logoSize / 32})">
      <rect x="2"  y="4"  width="16" height="16" rx="4.5" fill="#1D4ED8" opacity="0.2"/>
      <rect x="10" y="12" width="16" height="16" rx="4.5" fill="#1D4ED8" opacity="0.45"/>
      <rect x="6"  y="8"  width="16" height="16" rx="4.5" fill="none" stroke="#1D4ED8" stroke-width="1.8"/>
    </g>
  </g>

  <!-- Brand name -->
  <text x="${W / 2}" y="430"
        text-anchor="middle"
        font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="76"
        font-weight="800"
        fill="#0F172A"
        letter-spacing="-2">Data Hygienics</text>

  <!-- Subtitle -->
  <text x="${W / 2}" y="490"
        text-anchor="middle"
        font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="30"
        font-weight="500"
        fill="#475569"
        letter-spacing="-0.5">Cybersecurity Tools for Business Leaders</text>
</svg>`

  await sharp(Buffer.from(og))
    .png({ compressionLevel: 9 })
    .toFile(outPath)
  console.log("wrote", path.relative(root, outPath), `(${W}x${H})`)
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })
  await fs.mkdir(appDir, { recursive: true })

  // PNG icons (in /public so they're served at root)
  await renderPng(16,  path.join(publicDir, "favicon-16x16.png"), { padding: 0.06 })
  await renderPng(32,  path.join(publicDir, "favicon-32x32.png"), { padding: 0.06 })
  await renderPng(180, path.join(publicDir, "apple-touch-icon.png"))
  await renderPng(192, path.join(publicDir, "icon-192.png"))
  await renderPng(512, path.join(publicDir, "icon-512.png"))

  // favicon.ico — replaces the default Next.js triangle favicon at /app/favicon.ico
  // (App Router convention: app/favicon.ico is auto-served at /favicon.ico and
  // takes precedence over /public/favicon.ico)
  await buildIco([16, 32, 48], path.join(appDir, "favicon.ico"))

  // OG image
  await buildOgImage(path.join(publicDir, "og-image.png"))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
