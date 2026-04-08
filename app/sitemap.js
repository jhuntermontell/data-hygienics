import { CONTROLS } from "@/lib/controls"

export default function sitemap() {
  const baseUrl = "https://datahygienics.com"
  const now = new Date().toISOString()

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/why-data-hygienics`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/tools/cyber-audit`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/controls`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ]

  const controlPages = CONTROLS.map((control) => ({
    url: `${baseUrl}/controls/${control.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticPages, ...controlPages]
}
