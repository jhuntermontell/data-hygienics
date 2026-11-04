import { Suspense } from "react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import MapExperience from "@/app/components/map/MapExperience"
import { RULES, futureFor } from "@/lib/map"
import { getStepById, stepHref } from "@/lib/steps"
import { getSource } from "@/lib/sources"
import { formatDate } from "@/lib/content"
import { SITE } from "@/lib/site"

// The home map lives in the visitor's browser, so this page is a shell: the
// map renders client-side. Free, no account needed, and kept out of search
// results; /map is the indexable entry.
export const metadata = {
  title: `Home map: Your Devices and the Accounts That Control Them | ${SITE.name}`,
  description:
    "Draw your home as the accounts and the devices that hang off them. We mark the weak points and point at the step that fixes each. Kept on your device.",
  alternates: { canonical: `${SITE.url}/map/home` },
  robots: { index: false, follow: true },
}

// Every step a finding can point at, resolved here so the client gets
// titles and links without the whole Path.
function resolveSteps() {
  const ids = new Set()
  for (const rule of RULES) {
    if (rule.stepId) ids.add(rule.stepId)
    for (const id of Object.values(rule.stepIdByCategory || {})) ids.add(id)
  }
  const out = {}
  for (const id of ids) {
    const step = getStepById(id)
    if (step) out[id] = { title: step.title, href: stepHref(step) }
  }
  return out
}

function resolveFuture() {
  return futureFor("home").map((f) => ({
    id: f.id,
    date: f.date,
    dateLabel: formatDate(f.date),
    title: f.title,
    text: f.text,
    sources: (f.sourceIds || [])
      .map((id) => getSource(id))
      .filter(Boolean)
      .map((s) => ({ id: s.id, label: s.label, url: s.url })),
  }))
}

export default function HomeMapPage() {
  const steps = resolveSteps()
  const future = resolveFuture()
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
          <Suspense fallback={null}>
            <MapExperience steps={steps} future={future} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
