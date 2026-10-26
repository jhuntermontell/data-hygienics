"use client"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Briefcase, House, KeyRound } from "lucide-react"
import { AUDIENCES } from "@/lib/site"

// Three doors: Home and Business are the branches, Digital Sovereignty runs
// through both (so it takes the blue-to-teal blend of the two).
const DOORS = [
  {
    key: "home",
    icon: House,
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
    frame: "border border-[#E2E8F0] hover:border-[#0F766E]/40",
    iconWrap: "bg-[#F0FDFA] text-[#0F766E]",
    bar: "bg-[#0F766E]",
    bullet: "bg-[#0F766E]",
    link: "text-[#0F766E] group-hover:text-[#115E59]",
  },
  {
    key: "business",
    icon: Briefcase,
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
    frame: "border border-[#E2E8F0] hover:border-[#1D4ED8]/40",
    iconWrap: "bg-[#EFF6FF] text-[#1D4ED8]",
    bar: "bg-[#1D4ED8]",
    bullet: "bg-[#1D4ED8]",
    link: "text-[#1D4ED8] group-hover:text-[#1E40AF]",
  },
  {
    key: "sovereignty",
    icon: KeyRound,
    title: "Take control of your digital life",
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
    frame: "border border-[#E2E8F0] hover:border-[#0F766E]/40",
    iconWrap: "bg-gradient-to-br from-[#EFF6FF] to-[#F0FDFA] text-[#0F172A]",
    bar: "bg-gradient-to-r from-[#1D4ED8] to-[#0F8F83]",
    bullet: "bg-gradient-to-br from-[#1D4ED8] to-[#0F8F83]",
    link: "text-[#0F172A] group-hover:text-[#1D4ED8]",
  },
]

export default function AudienceSplit() {
  const reduce = useReducedMotion()
  // Same initial state on server and client; reduced motion just makes the
  // reveal instant (returning no props would leave the SSR opacity in place).
  const reveal = (i) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section aria-labelledby="audience-split-heading" className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#1D4ED8]">Rather browse?</p>
          <h2 id="audience-split-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Three doors into the library
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[#475569]">
            Home and Business each get their own threats, habits and tools. Digital Sovereignty is the part about
            taking control, and it runs through both.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3 list-none p-0">
          {DOORS.map((door, i) => {
            const Icon = door.icon
            return (
              <motion.li key={door.key} {...reveal(i)} className="h-full">
                <div
                  className={`group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all ${door.frame}`}
                >
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${door.bar}`} />
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${door.iconWrap}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#0F172A]">{door.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{door.description}</p>
                  <ul className="mt-5 space-y-2.5 list-none p-0 flex-1">
                    {door.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#334155]">
                        <span aria-hidden="true" className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${door.bullet}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* The ::after overlay makes the whole card clickable while
                      keeping the link's accessible name short. */}
                  <Link
                    href={door.href}
                    className={`mt-7 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[#1D4ED8] ${door.link}`}
                  >
                    {door.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
