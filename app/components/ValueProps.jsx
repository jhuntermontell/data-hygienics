"use client"
import { motion, useReducedMotion } from "framer-motion"
import { BookOpenCheck, Scale, UsersRound } from "lucide-react"

// The three promises behind everything we publish.
const PROMISES = [
  {
    icon: Scale,
    title: "Independent",
    text: "We sell only our own business tools, and we label them wherever they appear. We take no referral fees, use no affiliate links and accept no sponsors.",
    iconWrap: "bg-[#EFF6FF] text-[#1D4ED8]",
  },
  {
    icon: BookOpenCheck,
    title: "Researched and cited",
    text: "Every number links to a named source with a date. We favor government and standards bodies, use the more conservative figure when sources disagree, and say so when we don't know yet.",
    iconWrap: "bg-gradient-to-br from-[#EFF6FF] to-[#F0FDFA] text-[#0F172A]",
  },
  {
    icon: UsersRound,
    title: "For home and business",
    text: "One library, two front doors. Households get habits the whole family can keep. Small businesses get rules and plans a five-person team can run.",
    iconWrap: "bg-[#F0FDFA] text-[#0F766E]",
  },
]

export default function ValueProps({ headingLevel = "h3" }) {
  const reduce = useReducedMotion()
  const Heading = headingLevel

  return (
    <ul className="grid gap-5 md:grid-cols-3 list-none p-0">
      {PROMISES.map((promise, i) => {
        const Icon = promise.icon
        // Same initial state on server and client; reduced motion is instant.
        const motionProps = {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
        }
        return (
          <motion.li
            key={promise.title}
            {...motionProps}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm"
          >
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${promise.iconWrap}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <Heading className="mt-5 text-lg font-bold text-[#0F172A]">{promise.title}</Heading>
            <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{promise.text}</p>
          </motion.li>
        )
      })}
    </ul>
  )
}
