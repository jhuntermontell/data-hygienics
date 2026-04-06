import { createClient } from "@supabase/supabase-js"

const INDUSTRIES = [
  "Healthcare",
  "Legal",
  "Financial Services",
  "Retail / E-commerce",
  "Government / Defense Contractor",
  "Nonprofit / Church / Parish",
]

function buildPrompt(industry) {
  return `You are a cybersecurity news analyst. Generate exactly 5 current, realistic cybersecurity news items relevant to the ${industry} sector. For each item, provide a JSON object with these fields:
- "title": a concise headline (under 100 characters)
- "summary": a 2-3 sentence summary of the news item and its implications for ${industry} organizations

Return ONLY a valid JSON array of 5 objects. No markdown, no code fences, no explanation.`
}

async function fetchNewsForIndustry(industry) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set")

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildPrompt(industry) }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || "[]"
  return JSON.parse(text)
}

export async function GET(request) {
  // Simple auth check via secret header or query param
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const results = {}
  const errors = {}

  for (const industry of INDUSTRIES) {
    try {
      const items = await fetchNewsForIndustry(industry)

      // Delete old cache for this industry
      await supabase.from("news_cache").delete().eq("industry", industry)

      // Insert new items
      const rows = items.map((item) => ({
        industry,
        title: item.title,
        summary: item.summary,
        url: item.url || null,
      }))

      const { error } = await supabase.from("news_cache").insert(rows)
      if (error) throw error

      results[industry] = items.length
    } catch (err) {
      errors[industry] = err.message
    }
  }

  return Response.json({
    ok: true,
    refreshed: results,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  })
}
