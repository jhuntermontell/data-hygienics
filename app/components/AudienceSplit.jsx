import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AUDIENCES } from "@/lib/site"
import FoldRule from "./brand/FoldRule"
import Readout from "./brand/Readout"

// Three doors into the library, on a day surface. Home is teal, Business is
// cobalt, and Digital Sovereignty runs through both. Server component, no
// motion. The whole column is one link (an ::after overlay keeps the link's
// accessible name short).
const DOORS = [
  {
    key: "home",
    label: "For Home",
    title: "Home",
    href: AUDIENCES.home.href,
    description: AUDIENCES.home.description,
    items: [
      "Voice-clone and deepfake scams",
      "Family safe words and callback rules",
      "Keeping AI assistants from oversharing",
      "Tools we'd set up for our own families",
    ],
    cta: "Explore Home",
    mark: "bg-[#0F8F83]",
    link: "text-[#0F766E] group-hover:text-[#115E59]",
  },
  {
    key: "business",
    label: "For Business",
    title: "Business",
    href: AUDIENCES.business.href,
    description: AUDIENCES.business.description,
    items: [
      "Deepfake payment fraud and AI phishing",
      "A one-page AI rule for your team",
      "Verifying payments on a second channel",
      "Cyber Audit, policies and a response plan",
    ],
    cta: "Explore Business",
    mark: "bg-[#1D4ED8]",
    link: "text-[#1D4ED8] group-hover:text-[#1E40AF]",
  },
  {
    key: "sovereignty",
    label: "Digital Sovereignty",
    title: "Own your data, identity and choices",
    href: "/digital-sovereignty",
    description:
      "Own your data, your identity and your choices as AI moves into everything. For home and for work, without the politics.",
    items: [
      "Who owns your AI conversations",
      "Passkeys, portability and exit plans",
      "Avoiding lock-in before it happens",
      "Steps for a household and a small team",
    ],
    cta: "Explore Digital Sovereignty",
    mark: "bg-[#0F172A]",
    link: "text-[#0F172A] group-hover:text-[#1D4ED8]",
  },
]

const HEX = "[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"

export default function AudienceSplit() {
  return (
    <section aria-labelledby="audience-split-heading" className="bg-white text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <Readout label>The library</Readout>
          <h2 id="audience-split-heading" className="mt-3 font-display font-semibold text-[1.875rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
            Three doors into the library
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-[#475569]">
            Home and Business each get their own threats, habits and tools. Digital Sovereignty is the part about
            taking control, and it runs through both.
          </p>
        </div>

        <ul className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-6 list-none p-0 m-0">
          {DOORS.map((door) => (
            <li key={door.key} className="group relative flex flex-col">
              <FoldRule />
              <Readout label className="mt-4">
                {door.label}
              </Readout>
              <h3 className="mt-2 font-display font-semibold text-[1.5rem] leading-tight tracking-[-0.015em] text-balance">{door.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#475569]">{door.description}</p>
              <ul className="mt-5 space-y-2.5 list-none p-0 m-0 flex-1">
                {door.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-[#334155]">
                    <span aria-hidden="true" className={`mt-[0.45rem] w-2 h-2 shrink-0 ${HEX} ${door.mark}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={door.href}
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[#0F8F83] ${door.link}`}
              >
                {door.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
