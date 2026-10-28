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
// redirect here). Night and day alternate: the navy front door (the headline,
// the card by the phone and the first Path question), how the Path works and
// the tools as one system, the FBI's reported losses (navy, sourced), our
// promise, the membership band (navy; the one ask, after the promise that
// earns it), and the three doors. The chips stay the first action.
export default function HomePage() {
  return (
    <>
      <SchemaScript schema={websiteSchema} />
      <Navbar surface="night" />
      <main className="bg-white text-[#0F172A]">
        <FrontDoor />
        <HowThePathWorks />
        <WhyItMatters />
        <OurPromise />
        <MembershipBand />
        <AudienceSplit />
      </main>
      <Footer />
    </>
  )
}
