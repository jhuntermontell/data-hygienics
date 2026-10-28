import Link from "next/link"
import FoldRule from "./FoldRule"
import Readout from "./Readout"

// A name, then an imperative: how every tool and service is introduced.
// The imperative is a title, so it carries no trailing period unless it is
// two sentences. On night, the imperative is #5EEAD4 (12.07:1 on navy); on
// day, it is the Home teal #0F766E (5.47:1 on white).
const TONE = {
  night: { name: "text-night-ink", imperative: "text-night-accent", body: "text-night-ink-2", hover: "group-hover:text-night-accent" },
  day: { name: "text-[#0F172A]", imperative: "text-[#0F766E]", body: "text-[#475569]", hover: "group-hover:text-[#1D4ED8]" },
}

export default function NamedCard({ name, imperative, href, readout, tone = "night", headingLevel = 3, onClick, children }) {
  const t = TONE[tone] || TONE.night
  const Heading = `h${headingLevel}`
  const body = (
    <>
      <FoldRule tone={tone} />
      <Heading className={`mt-4 font-display font-semibold text-[1.3125rem] leading-tight tracking-[-0.01em] ${t.name} ${href ? t.hover : ""} transition-colors`}>
        {name}
      </Heading>
      {imperative ? <p className={`mt-1 font-display font-medium text-[1.0625rem] ${t.imperative}`}>{imperative}</p> : null}
      {children ? <p className={`mt-2 text-[0.9375rem] leading-relaxed ${t.body}`}>{children}</p> : null}
      {readout ? <Readout tone={tone} className="mt-3">{readout}</Readout> : null}
    </>
  )
  if (!href) return <div>{body}</div>
  return (
    <Link href={href} onClick={onClick} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8F83]">
      {body}
    </Link>
  )
}
