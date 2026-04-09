import { CONTROLS } from "@/lib/controls"
import { VENDORS } from "@/lib/vendors"
import { threats } from "@/lib/threats"

export default function sitemap() {
  const baseUrl = "https://datahygienics.com"
  const now = new Date().toISOString()

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/why-data-hygienics`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/cyber-audit`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/controls`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/vendors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/threats`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ]

  const controlPages = CONTROLS.map((control) => ({
    url: `${baseUrl}/controls/${control.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const vendorPages = VENDORS.map((vendor) => ({
    url: `${baseUrl}/vendors/${vendor.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const threatPages = threats.map((threat) => ({
    url: `${baseUrl}/threats/${threat.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }))

  return [...staticPages, ...controlPages, ...vendorPages, ...threatPages]
}
