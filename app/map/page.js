import { Camera, Keyboard, MonitorSmartphone } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"
import NamedCard from "@/app/components/brand/NamedCard"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { SITE } from "@/lib/site"

const TITLE = `Home map | ${SITE.name}`
const DESCRIPTION =
  "Draw your home as the accounts and the devices that hang off them. We mark the weak points and point at the step that fixes each. Free, and kept on your device."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: "/map" })

const WAYS = [
  { icon: Keyboard, text: "Type it, or pick your router from our catalog" },
  { icon: Camera, text: "Photograph the label on the back" },
  { icon: MonitorSmartphone, text: "Screenshot your Wi-Fi app's device list" },
]

export default function MapLandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
        <header>
          <Readout label className="text-[#0F766E]">
            For Home
          </Readout>
          <h1 className="mt-3 font-display font-semibold text-[2.5rem] sm:text-[3.25rem] leading-[1.04] tracking-[-0.03em] text-balance">
            Map the accounts that run your home
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#475569]">
            Draw your home as the accounts and the devices that hang off them: the router, the cameras, the TV, and the
            Google, Apple or Amazon account each one signs in with. We mark the weak points and point at the step that
            fixes each one.
          </p>
          <Readout className="mt-5">Kept on your device, in a file you save and on paper. We keep your progress, not your house.</Readout>
        </header>

        <div className="mt-10">
          <NamedCard name="Home map" imperative="Draw it, then fix the weak points" href="/map/home" tone="day" headingLevel={2}>
            Free, no account needed. Start with your Wi-Fi and add the rest as you go.
          </NamedCard>
        </div>

        <section aria-labelledby="map-ways-title" className="mt-12">
          <FoldRule />
          <h2 id="map-ways-title" className="mt-6 text-xl font-display font-semibold tracking-[-0.01em]">
            How you add things
          </h2>
          <ul className="mt-4 space-y-3 list-none p-0 m-0">
            {WAYS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#475569]">
                <Icon className="mt-0.5 w-5 h-5 shrink-0 text-[#0F8F83]" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
            Members can have AI read the photo. Typing, picking and importing a file all happen in your browser.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
