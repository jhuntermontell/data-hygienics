import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import PathBand from "./components/PathBand"
import WhatChanged from "./components/WhatChanged"
import StartThisWeek from "./components/StartThisWeek"
import AudienceSplit from "./components/AudienceSplit"
import LatestResearch from "./components/LatestResearch"
import ToolkitTeaser from "./components/ToolkitTeaser"
import HowWeWork from "./components/HowWeWork"
import BusinessToolsStrip from "./components/BusinessToolsStrip"
import GlossaryTeaser from "./components/GlossaryTeaser"
import Footer from "./components/Footer"
import SchemaScript from "./components/SchemaScript"
import { toSpotlightItem } from "./components/ThreatSpotlight"
import { getFeaturedThreats, getThreatBySlug } from "@/lib/threats"
import { SITE } from "@/lib/site"

const title = `${SITE.name} | ${SITE.tagline.replace(/\.$/, "")}`

export const metadata = {
  title,
  description: SITE.description,
  alternates: { canonical: SITE.url },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en-US",
  publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
}

// Hand-picked so the spotlight covers the biggest household loss (romance
// and investment scams) alongside voice cloning and payment fraud. Slugs
// resolve through getThreatBySlug, so a draft drops out and featured
// threats fill the gap.
const SPOTLIGHT_SLUGS = [
  "voice-cloning-and-deepfake-scams",
  "ai-scaled-romance-and-investment-scams",
  "ai-powered-phishing-and-bec",
]
const SPOTLIGHT_LIMIT = 3

function getSpotlightThreats() {
  const picked = SPOTLIGHT_SLUGS.map(getThreatBySlug).filter((t) => t?.kind === "threat")
  const fill = getFeaturedThreats(SPOTLIGHT_LIMIT + picked.length).filter((t) => !picked.includes(t))
  return [...picked, ...fill].slice(0, SPOTLIGHT_LIMIT)
}

export default function HomePage() {
  const spotlight = getSpotlightThreats().map(toSpotlightItem)

  return (
    <>
      <SchemaScript schema={websiteSchema} />
      <Navbar />
      <main className="bg-white text-[#0F172A]">
        <Hero threats={spotlight} />
        <PathBand />
        <WhatChanged />
        <StartThisWeek />
        <AudienceSplit />
        <LatestResearch />
        <ToolkitTeaser />
        <HowWeWork />
        <BusinessToolsStrip />
        <GlossaryTeaser />
      </main>
      <Footer />
    </>
  )
}
