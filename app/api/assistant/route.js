// Ask Data Hygienics: the member assistant.
//
// POST { messages: [{ role: "user" | "assistant", content: string }] }
// The last message is the member's question; up to HISTORY_TURNS earlier
// messages travel with it as plain text.
//
// Errors before the answer starts are plain JSON { error } with a status:
//   400 bad request or question too long, 401 signed out, 403 not a member
//   (with { pricing: "/pricing" }), 429 daily or monthly cap reached,
//   503 the assistant or its usage table is unavailable (fail closed).
//
// A 200 response streams newline-delimited JSON (application/x-ndjson), one
// event per line, readable incrementally with a ReadableStream reader:
//   {"type":"text","text":"..."}     answer text, in order; append each
//   {"type":"refusal","message":"..."}  the model declined: replace any text
//                                       shown so far with this message
//   {"type":"error","message":"..."}    something failed mid-answer
//   {"type":"done","sources":[{title,url}],"nearest":bool,
//    "usage":{input,output,monthUsed,monthCap}}   always the last line
// `sources` are the pages the answer linked to; when it linked none,
// `nearest` is true and they are the closest pages we retrieved.
//
// Usage is recorded after the stream finishes (cache reads and writes count
// as input), so a member's last question of the month can overshoot the cap
// by one answer; the next one is refused.
import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"
import { resolveMember } from "@/lib/assistant/auth"
import { readUsage, recordUsage, BREAK_MESSAGE } from "@/lib/assistant/usage"
import { prepare, requestParams, sumUsage, billedInput, citedSources } from "@/lib/assistant/pipeline"
import { DAILY_MESSAGE_CAP, MAX_QUESTION_CHARS, MONTHLY_TOKEN_CAP } from "@/lib/assistant/limits"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const REFUSAL_MESSAGE =
  "We can't help with that one here. If something just happened, start with [Is this real?](/check): it walks you through the next two minutes and who to call."

const BUSY_MESSAGE = "The assistant is busy right now. Try again in a minute."

let client = null
function anthropic() {
  if (!client) client = new Anthropic()
  return client
}

function errorMessage(err) {
  if (err instanceof Anthropic.RateLimitError) return BUSY_MESSAGE
  if (err instanceof Anthropic.APIError) {
    console.error(`Assistant API error ${err.status ?? ""}:`, err.message)
    return BREAK_MESSAGE
  }
  console.error("Assistant stream error:", err?.message || err)
  return BREAK_MESSAGE
}

export async function POST(request) {
  try {
    const member = await resolveMember(request)
    if (member.error) {
      return NextResponse.json(
        member.pricing ? { error: member.error, pricing: member.pricing } : { error: member.error },
        { status: member.status }
      )
    }
    const { userId, service } = member

    const body = await request.json().catch(() => null)
    const messages = Array.isArray(body?.messages) ? body.messages : null
    const last = messages?.[messages.length - 1]
    if (!last || last.role !== "user" || typeof last.content !== "string") {
      return NextResponse.json({ error: "Send your question as the last message." }, { status: 400 })
    }
    const question = last.content.trim()
    if (!question) {
      return NextResponse.json({ error: "Type a question first." }, { status: 400 })
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return NextResponse.json(
        { error: `Questions can be up to ${MAX_QUESTION_CHARS.toLocaleString("en-US")} characters. Try a shorter version.` },
        { status: 400 }
      )
    }

    const before = await readUsage(service, userId)
    if (before.error) {
      console.error("Assistant usage lookup failed:", JSON.stringify(before.error))
      return NextResponse.json({ error: BREAK_MESSAGE }, { status: 503 })
    }
    if (before.messagesToday >= DAILY_MESSAGE_CAP) {
      return NextResponse.json(
        { error: `You've asked ${DAILY_MESSAGE_CAP} questions today, the daily limit. It resets at midnight UTC.` },
        { status: 429 }
      )
    }
    if (before.monthUsed >= MONTHLY_TOKEN_CAP) {
      return NextResponse.json(
        { error: "You've used this month's assistant allowance. It resets on the 1st (UTC)." },
        { status: 429 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Assistant: ANTHROPIC_API_KEY is not set")
      return NextResponse.json({ error: BREAK_MESSAGE }, { status: 503 })
    }

    const { messages: modelMessages, sources } = prepare({ history: messages.slice(0, -1), question })
    const params = requestParams(modelMessages)

    const encoder = new TextEncoder()
    let stream = null
    let closed = false

    const responseBody = new ReadableStream({
      async start(controller) {
        const send = (event) => {
          if (closed) return
          try {
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
          } catch {
            closed = true
          }
        }

        let text = ""
        let tracked = {}
        let usage = null
        let refused = false

        try {
          stream = anthropic().beta.messages.stream(params)
          for await (const event of stream) {
            if (event.type === "message_start") {
              tracked = { ...tracked, ...event.message?.usage }
            } else if (event.type === "message_delta") {
              tracked = { ...tracked, ...event.usage }
            } else if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
              text += event.delta.text
              send({ type: "text", text: event.delta.text })
            }
          }
          const message = await stream.finalMessage()
          usage = sumUsage(message.usage)
          if (message.stop_reason === "refusal") {
            refused = true
            send({ type: "refusal", message: REFUSAL_MESSAGE })
          } else if (message.stop_reason === "max_tokens") {
            send({ type: "text", text: "\n\n(That answer ran long and was cut short. Ask a narrower question for the rest.)" })
          }
        } catch (err) {
          if (!closed) send({ type: "error", message: errorMessage(err) })
          usage = sumUsage(tracked)
        }

        const input = billedInput(usage)
        const output = usage.output_tokens
        let monthUsed = before.monthUsed
        if (input + output > 0) {
          const recorded = await recordUsage(service, userId, { input, output })
          if (recorded.error) {
            console.error("CRITICAL: assistant usage not recorded:", JSON.stringify(recorded.error), { userId, input, output })
          }
          monthUsed += input + output
        }

        const cited = refused ? { sources: [], nearest: false } : citedSources(text, sources)
        send({
          type: "done",
          sources: cited.sources,
          nearest: cited.nearest,
          usage: { input, output, monthUsed, monthCap: MONTHLY_TOKEN_CAP },
        })
        if (!closed) {
          closed = true
          controller.close()
        }
      },
      cancel() {
        // The member closed the page: stop generating. Whatever was used so
        // far is still recorded by start() once the aborted stream settles.
        closed = true
        stream?.abort()
      },
    })

    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (err) {
    console.error("Assistant route error:", err?.message || err)
    return NextResponse.json({ error: BREAK_MESSAGE }, { status: 500 })
  }
}
