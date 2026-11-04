// Browser-only helpers for the home map's AI reads. Plain module, safe to
// import from a "use client" component; nothing here runs during SSR.
//
// downscale() shrinks a photo before it leaves the device: at most 1600 px on
// the long side, re-encoded as JPEG. Re-encoding through a canvas also drops
// the photo's metadata (location, camera, time), so only pixels are sent.
import { READ_MAX_IMAGE_CHARS } from "../assistant/limits.js"

const MAX_TEXT_BYTES = 2 * 1024 * 1024

const TOO_BIG = "That photo is still too large after shrinking it. Try a closer, simpler shot of the label."
const UNREADABLE = "We couldn't open that image. Try a JPEG or PNG photo or screenshot."

// A decoded image plus its size, with a release() for whatever backs it.
async function decode(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close?.() }
    } catch {
      // Fall through to <img>, which handles some formats createImageBitmap doesn't.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = "async"
    img.src = url
    await (img.decode
      ? img.decode()
      : new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        }))
    // Browsers apply EXIF orientation to <img> by default.
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch {
    URL.revokeObjectURL(url)
    throw new Error(UNREADABLE)
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || "")
      resolve(result.slice(result.indexOf(",") + 1))
    }
    reader.onerror = () => reject(new Error(UNREADABLE))
    reader.readAsDataURL(blob)
  })
}

// File -> { data (base64, no prefix), mediaType: "image/jpeg", bytes, width, height }.
// Rejects with a plain message the page can show.
export async function downscale(file, { max = 1600, quality = 0.8 } = {}) {
  if (!file || (file.type && !file.type.startsWith("image/"))) throw new Error(UNREADABLE)

  const decoded = await decode(file)
  try {
    if (!decoded.width || !decoded.height) throw new Error(UNREADABLE)
    const scale = Math.min(1, max / Math.max(decoded.width, decoded.height))
    const width = Math.max(1, Math.round(decoded.width * scale))
    const height = Math.max(1, Math.round(decoded.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error(UNREADABLE)
    // JPEG has no transparency: paint white first so a PNG screenshot's
    // transparent areas don't turn black.
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(decoded.source, 0, 0, width, height)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality))
    if (!blob) throw new Error(UNREADABLE)
    const data = await blobToBase64(blob)
    if (data.length > READ_MAX_IMAGE_CHARS) throw new Error(TOO_BIG)
    return { data, mediaType: "image/jpeg", bytes: blob.size, width, height }
  } finally {
    decoded.release()
  }
}

// A CSV export (Fing and similar) -> its text, read locally. 2 MB cap.
export async function fileToText(file) {
  if (!file) throw new Error("Choose a file first.")
  if (file.size > MAX_TEXT_BYTES) throw new Error("That file is larger than 2 MB. Export just the device list and try again.")
  return file.text()
}
