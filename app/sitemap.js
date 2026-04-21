import { CONTROLS } from "@/lib/controls"
import { VENDORS } from "@/lib/vendors"
import { threats } from "@/lib/threats"

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
  const staticReview = reviewDate("2026-04")

  const staticPages = [
    { url: baseUrl, lastModified: staticReview, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: staticReview, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: staticReview, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/tools`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/cyber-audit`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools/policies`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/ir-plan`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/controls`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/vendors`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/threats`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: staticReview, changeFrequency: "monthly", priority: 0.7 },
  ]

  const controlPages = CONTROLS.map((control) => ({
    url: `${baseUrl}/controls/${control.slug}`,
    lastModified: reviewDate(control.lastReviewed || "2026-04"),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const vendorPages = VENDORS.map((vendor) => ({
    url: `${baseUrl}/vendors/${vendor.slug}`,
    lastModified: reviewDate(vendor.lastReviewed || "2026-04"),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const threatPages = threats.map((threat) => ({
    url: `${baseUrl}/threats/${threat.slug}`,
    lastModified: reviewDate(threat.lastReviewed || "2026-04"),
    changeFrequency: "monthly",
    priority: 0.9,
  }))

  return [...staticPages, ...controlPages, ...vendorPages, ...threatPages]
}
