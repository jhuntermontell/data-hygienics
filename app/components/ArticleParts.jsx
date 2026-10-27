import CitedText from "./CitedText"
import { stripCitations } from "@/lib/content"
import FoldRule from "./brand/FoldRule"

// Building blocks shared by ThreatArticle, GuideArticle and ExplainerArticle.

// Content fields are a string or an array of paragraph strings.
export function asParagraphs(value) {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim())
  return typeof value === "string" && value.trim() ? [value] : []
}

export function Paragraphs({ value, number, className = "text-[#334155] text-base sm:text-[17px] leading-relaxed mb-4 last:mb-0" }) {
  return asParagraphs(value).map((paragraph, i) => (
    <p key={i} className={className}>
      <CitedText text={paragraph} number={number} />
    </p>
  ))
}

// TL;DR with citations (the shared TLDR component takes plain text only).
export function TldrBlock({ text, number }) {
  const paragraphs = asParagraphs(text)
  if (!paragraphs.length) return null
  return (
    <div className="tldr-block" role="note" aria-label="Summary">
      <span className="tldr-label">TL;DR</span>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>
          <CitedText text={paragraph} number={number} />
        </p>
      ))}
    </div>
  )
}

export function SectionHeading({ id, icon: Icon, iconClassName = "text-[#64748B]", description, children }) {
  return (
    <div className="mb-6">
      <FoldRule className="mb-5" />
      <h2 id={id} className="flex items-center gap-2.5 font-display font-semibold text-[1.5rem] sm:text-[1.75rem] text-[#0F172A] tracking-[-0.02em] leading-[1.15]">
        {Icon ? <Icon className={`w-5 h-5 shrink-0 ${iconClassName}`} aria-hidden="true" /> : null}
        <span>{children}</span>
      </h2>
      {description ? <p className="text-[#475569] text-[0.9375rem] mt-2">{description}</p> : null}
    </div>
  )
}

// Small label chip for metadata (time to complete, difficulty, and so on).
// `srLabel` is read before the visible text so the chip makes sense alone.
export function MetaChip({ icon: Icon, srLabel, children }) {
  return (
    <span className="readout-label inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#CBD5E1] bg-white text-[#334155]">
      {Icon ? <Icon className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" /> : null}
      {srLabel ? <span className="sr-only">{srLabel}: </span> : null}
      {children}
    </span>
  )
}

// FAQs are plain text by contract; strip any stray markers anyway.
export function FaqSection({ faqs, title = "Common questions" }) {
  const list = (faqs || []).filter((faq) => faq?.question && faq?.answer)
  if (!list.length) return null
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <SectionHeading id="faq-heading">{title}</SectionHeading>
      <div className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {list.map((faq, i) => (
          <div key={i} className="py-5">
            <h3 className="font-display font-semibold text-[1.125rem] tracking-[-0.01em] text-[#0F172A] leading-snug mb-2">{stripCitations(faq.question)}</h3>
            <p className="text-[#475569] text-[15px] leading-relaxed">{stripCitations(faq.answer)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
