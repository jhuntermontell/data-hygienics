import { buildSearchIndex } from "@/lib/search/build"

// Built once at build time from published entries. The browser fetches this
// file and searches it locally; no query is ever sent anywhere.
export const dynamic = "force-static"

export function GET() {
  return Response.json(buildSearchIndex())
}
