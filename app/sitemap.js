import { CONTROLS } from "@/lib/controls"
import { threats } from "@/lib/threats"
import { guides } from "@/lib/guides"
import { explainers } from "@/lib/sovereignty"
import { hrefFor } from "@/lib/content"

// Expand a YYYY-MM review month to an ISO Date pinned to day 01 of that
// month so sitemap lastModified values are stable across rebuilds. Without
// this, using new Date() would churn every entry on every deploy and tell
// crawlers everything changed — even when it didn't.
function reviewDate(yyyymm) {
  return new Date(`${yyyymm}-01T00:00:00.000Z`)
}

export default function sitemap() {
  const baseUrl = "https://datahygienics.com"

  // Static pages share one stable lastModified: the current month rollup.
  // Update this string (format YYYY-MM) whenever you intentionally want
  // crawlers to re-fetch the non-content pages.
  const staticReview = reviewDate("2026-10")

  const staticPages = [
    { url: baseUrl, lastModified: staticReview, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/start`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/household`, lastModified: staticReview, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/business`, lastModified: staticReview, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/digital-sovereignty`, lastModified: staticReview, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/threats`, lastModified: staticReview, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: staticReview, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toolkit`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/controls`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/how-it-works`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/cyber-audit`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: staticReview, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: staticReview, changeFrequency: "yearly", priority: 0.3 },
  ]

  // sitemap.js runs at build time, so only published entries appear here
  // (the aggregators filter out drafts).
  const contentPages = [...threats, ...guides, ...explainers].map((entry) => ({
    url: `${baseUrl}${hrefFor(entry)}`,
    lastModified: reviewDate(entry.lastReviewed || "2026-10"),
    changeFrequency: "monthly",
    priority: entry.kind === "industry-brief" ? 0.7 : 0.8,
  }))

  const controlPages = CONTROLS.map((control) => ({
    url: `${baseUrl}/controls/${control.slug}`,
    lastModified: reviewDate(control.lastReviewed || "2026-04"),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticPages, ...contentPages, ...controlPages]
}
