import Navbar from "./components/Navbar"
import FrontDoor from "./components/FrontDoor"
import WhyItMatters from "./components/WhyItMatters"
import OurPromise from "./components/OurPromise"
import MembershipBand from "./components/MembershipBand"
import HowThePathWorks from "./components/HowThePathWorks"
import AudienceSplit from "./components/AudienceSplit"
import Footer from "./components/Footer"
import SchemaScript from "./components/SchemaScript"
import { SITE } from "@/lib/site"

const title = `${SITE.name} | ${SITE.headline.replace(/\.$/, "")}`

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

// One front door: the homepage is the Clear Path entrance (/start and /path
// redirect here). Six calm sections: pick what matters, what changed (the
// FBI's reported losses by year, sourced), our promise, the membership band
// (the one ask, after the promise that earns it), how the path works, and the
// three doors into the rest of the site. The chips stay the first action.
export default function HomePage() {
  return (
    <>
      <SchemaScript schema={websiteSchema} />
      <Navbar />
      <main className="bg-white text-[#0F172A]">
        <FrontDoor />
        <WhyItMatters />
        <OurPromise />
        <MembershipBand />
        <HowThePathWorks />
        <AudienceSplit />
      </main>
      <Footer />
    </>
  )
}
