// Home map AI read: brand, model and hardware version from a photo of a
// device label or a screenshot (or pasted text) of a Wi-Fi app's device list.
// Members only; shares Ask's auth, entitlement and caps (one read counts as
// one message, its tokens against the month; see lib/assistant/limits.js).
//
// POST { kind: "label" | "list", image?: { mediaType, data }, text?: string }
// Exactly one of image (base64, at most READ_MAX_IMAGE_CHARS) or text (at
// most READ_MAX_TEXT_CHARS).
//
// 200 { kind, items: [{ kind, category, brand, model, hardwareVersion, confidence }],
//       usage: { input, output, monthUsed, monthCap } }
// 400 bad body, 401 signed out, 403 not a member (with { pricing }),
// 422 nothing readable, 429 daily or monthly cap or the model is busy,
// 503 unavailable (fail closed), 500 anything else.
//
// Custody rule: the image or text goes to the model provider with nothing
// about the member and is not stored. This route logs nothing from the
// request body, never the image, the text or the items read from them.
import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"
import { resolveMember } from "@/lib/assistant/auth"
import { readUsage, recordUsage, BREAK_MESSAGE } from "@/lib/assistant/usage"
import { sumUsage, billedInput, answerText } from "@/lib/assistant/pipeline"
import {
  DAILY_MESSAGE_CAP,
  MONTHLY_TOKEN_CAP,
  READ_MAX_IMAGE_CHARS,
  READ_MAX_TEXT_CHARS,
} from "@/lib/assistant/limits"
import { MEDIA_TYPES, READ_KINDS, buildReadRequest, extractJsonObject, scrubRead } from "@/lib/map/read"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const BUSY_MESSAGE = "The assistant is busy right now. Try again in a minute."
const NOTHING_READ = "We couldn't read a brand or model from that. Try closer, with the label flat and lit."
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/

const NO_STORE = { "Cache-Control": "no-store" }
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: NO_STORE })

let client = null
function anthropic() {
  if (!client) client = new Anthropic()
  return client
}

// Auth messages from resolveMember are written for Ask; say what this is.
function memberError(member) {
  if (member.status === 401) return reply({ error: "Sign in to read a label with AI." }, 401)
  if (member.status === 403) {
    return reply({ error: "Reading labels and screenshots is for members.", pricing: "/pricing" }, 403)
  }
  return reply({ error: BREAK_MESSAGE }, member.status || 503)
}

// Body -> { kind, image } | { kind, text } | { error }.
function parseBody(body) {
  if (!body || typeof body !== "object") return { error: "Send a photo or a device list to read." }
  const { kind, image, text } = body
  if (!READ_KINDS.includes(kind)) return { error: "Say whether this is a label or a device list." }
  const hasImage = image !== undefined && image !== null
  const hasText = text !== undefined && text !== null
  if (hasImage === hasText) return { error: "Send either a photo or text, not both." }

  if (hasImage) {
    if (typeof image !== "object" || !MEDIA_TYPES.includes(image.mediaType)) {
      return { error: "Send the photo as a JPEG, PNG or WebP image." }
    }
    if (typeof image.data !== "string" || !image.data) return { error: "The photo was empty." }
    if (image.data.length > READ_MAX_IMAGE_CHARS) {
      return { error: "That photo is too large. Try a closer, simpler shot of the label." }
    }
    if (!BASE64.test(image.data)) return { error: "The photo didn't arrive in a form we can read." }
    return { kind, image: { mediaType: image.mediaType, data: image.data } }
  }

  if (typeof text !== "string" || !text.trim()) return { error: "The device list was empty." }
  if (text.length > READ_MAX_TEXT_CHARS) {
    return { error: `Device lists can be up to ${READ_MAX_TEXT_CHARS.toLocaleString("en-US")} characters. Try a shorter one.` }
  }
  return { kind, text: text.trim() }
}

export async function POST(request) {
  try {
    const member = await resolveMember(request)
    if (member.error) return memberError(member)
    const { userId, service } = member

    const parsed = parseBody(await request.json().catch(() => null))
    if (parsed.error) return reply({ error: parsed.error }, 400)

    const before = await readUsage(service, userId)
    if (before.error) {
      console.error("Map read usage lookup failed:", JSON.stringify(before.error))
      return reply({ error: BREAK_MESSAGE }, 503)
    }
    if (before.messagesToday >= DAILY_MESSAGE_CAP) {
      return reply(
        { error: `You've asked ${DAILY_MESSAGE_CAP} questions today, the daily limit. It resets at midnight UTC.` },
        429
      )
    }
    if (before.monthUsed >= MONTHLY_TOKEN_CAP) {
      return reply({ error: "You've used this month's assistant allowance. It resets on the 1st (UTC)." }, 429)
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Map read: ANTHROPIC_API_KEY is not set")
      return reply({ error: BREAK_MESSAGE }, 503)
    }

    let message
    try {
      message = await anthropic().messages.create(buildReadRequest(parsed), { timeout: 25_000, maxRetries: 1 })
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) return reply({ error: BUSY_MESSAGE }, 429)
      // Status and error type only: an API error message can describe the input.
      console.error(`Map read API error ${err?.status ?? ""}:`, err?.error?.error?.type || err?.name || "unknown")
      return reply({ error: BREAK_MESSAGE }, 503)
    }

    const usage = sumUsage(message.usage)
    const input = billedInput(usage)
    const output = usage.output_tokens
    if (input + output > 0) {
      const recorded = await recordUsage(service, userId, { input, output })
      if (recorded.error) {
        console.error("CRITICAL: map read usage not recorded:", JSON.stringify(recorded.error), { userId, input, output })
      }
    }

    let items = []
    if (message.stop_reason !== "refusal") {
      try {
        items = scrubRead(extractJsonObject(answerText(message))).items
      } catch {
        items = []
      }
    }
    if (items.length === 0) return reply({ error: NOTHING_READ }, 422)

    return reply({
      kind: parsed.kind,
      items,
      usage: { input, output, monthUsed: before.monthUsed + input + output, monthCap: MONTHLY_TOKEN_CAP },
    })
  } catch (err) {
    console.error("Map read route error:", err?.name || "unknown")
    return reply({ error: BREAK_MESSAGE }, 500)
  }
}
