// Member assistant usage: one assistant_usage row per member per calendar
// month (UTC), holding tokens, messages and today's message count.
// Migration: supabase/migrations/20261027_assistant_usage.sql.
//
// Reads go through the service-role client; writes go through the
// assistant_usage_record() function, which only the service role may call,
// so increments are atomic and members can't edit their own counts.
//
// Fail closed: any error reading usage (table missing, query failed) comes
// back as { error }, and the routes answer 503 rather than allowing
// unmetered use.
import { DAILY_MESSAGE_CAP, MONTHLY_TOKEN_CAP } from "./limits.js"

export const BREAK_MESSAGE = "The assistant is taking a break. Try again shortly."

export const monthKey = (date = new Date()) => date.toISOString().slice(0, 7)
export const dayKey = (date = new Date()) => date.toISOString().slice(0, 10)

export async function readUsage(service, userId, now = new Date()) {
  try {
    const { data, error } = await service
      .from("assistant_usage")
      .select("input_tokens, output_tokens, messages, day, day_messages, last_message_at")
      .eq("user_id", userId)
      .eq("month", monthKey(now))
      .maybeSingle()
    if (error) return { error }
    const input = Number(data?.input_tokens) || 0
    const output = Number(data?.output_tokens) || 0
    return {
      month: monthKey(now),
      input,
      output,
      monthUsed: input + output,
      monthCap: MONTHLY_TOKEN_CAP,
      messages: Number(data?.messages) || 0,
      messagesToday: data?.day === dayKey(now) ? Number(data?.day_messages) || 0 : 0,
      dailyCap: DAILY_MESSAGE_CAP,
      lastMessageAt: data?.last_message_at || null,
    }
  } catch (error) {
    return { error }
  }
}

// Adds one message and its tokens. Returns { error } on failure; the caller
// has already served the answer, so it logs rather than failing the reply.
export async function recordUsage(service, userId, { input = 0, output = 0 }, now = new Date()) {
  try {
    const { error } = await service.rpc("assistant_usage_record", {
      p_user_id: userId,
      p_month: monthKey(now),
      p_day: dayKey(now),
      p_input: Math.max(0, Math.round(input)),
      p_output: Math.max(0, Math.round(output)),
    })
    return error ? { error } : { ok: true }
  } catch (error) {
    return { error }
  }
}
