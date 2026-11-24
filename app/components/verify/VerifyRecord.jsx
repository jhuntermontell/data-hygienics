import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"
import Statement from "@/app/components/brand/Statement"
import { DaySection, NightSection } from "@/app/components/brand/Surface"
import { BASELINE_VERSION, CONTROLS, GROUPS, PROOF_TYPES, STATES } from "@/lib/verified/baseline"
import { CONTROLS as LIBRARY_CONTROLS } from "@/lib/controls"
import { getGuideBySlug } from "@/lib/guides"
import { formatDate } from "@/lib/content"
import { breadcrumbSchema } from "@/lib/schema"
import { OWN_NAME } from "@/lib/verify/record"

// The verify page (design/verified/baseline.md section 4): the night header
// states what the record is, the day surface lists the seventeen lines with
// the state, the public proof label and the date, the MFA tier reached with
// the three tiers named, what each control means, and how every proof type
// works. It says only what was checked and when. No count, no score, no
// grade, no tenant detail: the view it reads carries none.
//
// `record` is null when there is no public record yet (the view is empty
// or not there): the page then says so instead of failing.

const COLUMN = "max-w-[46rem]"
const STATE_LABEL = Object.fromEntries(STATES.map((s) => [s.id, s.label]))
const PROOF_LABEL = Object.fromEntries(PROOF_TYPES.map((p) => [p.id, p.label]))
const PROOF_WHAT = Object.fromEntries(PROOF_TYPES.map((p) => [p.id, p.what]))

const WHAT_IT_IS = "A dated history of what Data Hygienics checked and how."
const WHAT_IT_IS_NOT = "Not a certification, not a warranty, and not a statement that this business cannot be breached."
const WHO_DECIDES =
  "A line passes only when the written rule for that control holds on the facts in front of it. The AI guide that collects evidence and the person who reviews it confirm facts; neither one passes or fails a line."

const PUBLIC_STATES = [
  { id: "open", meaning: "No proof yet, or the rule does not hold." },
  { id: "expired", meaning: "The last pass is older than the proof allows." },
  { id: "drifted", meaning: "A live check now contradicts the last pass." },
]

function libraryTitle(kind, slug) {
  if (kind === "control") return LIBRARY_CONTROLS.find((c) => c.slug === slug)?.name || null
  return getGuideBySlug(slug)?.title || null
}

function readingLinks(control) {
  const out = []
  for (const slug of control.library.controls) {
    const title = libraryTitle("control", slug)
    if (title) out.push({ href: `/controls/${slug}`, title })
  }
  for (const slug of control.library.guides) {
    const title = libraryTitle("guide", slug)
    if (title) out.push({ href: `/guides/${slug}`, title })
  }
  return out
}

// The state cell: what section 4 says each state shows.
function LineState({ line }) {
  if (!line) {
    return <p className="font-display font-medium text-[1.0625rem] text-[#475569]">Not checked yet</p>
  }
  if (line.state === "passed") {
    return (
      <>
        <p className="font-display font-semibold text-[1.0625rem] text-[#0F766E]">{PROOF_LABEL[line.proofType] || "Checked"}</p>
        <Readout className="mt-1">{formatDate(line.passedAt)}</Readout>
        {line.validUntil ? <p className="mt-1 text-[0.9375rem] text-[#475569]">Stands until {formatDate(line.validUntil)} without fresh proof</p> : null}
      </>
    )
  }
  if (line.state === "not_applicable") {
    return (
      <>
        <p className="font-display font-medium text-[1.0625rem] text-[#475569]">Not applicable</p>
        {line.reason ? <p className="mt-1 text-[0.9375rem] text-[#475569]">{line.reason}</p> : null}
      </>
    )
  }
  return <p className="font-display font-semibold text-[1.0625rem] text-[#0F172A]">{STATE_LABEL[line.state] || "Not yet"}</p>
}

function Tiers({ control, line }) {
  const reached = line?.tier ?? 0
  return (
    <div className="mt-4 border-l-2 border-[#E2E8F0] pl-4">
      <Readout label>{reached > 0 ? `Tier ${reached} of ${control.tiers.length} reached` : "No tier reached yet"}</Readout>
      <ol className="mt-2 space-y-2 list-none p-0 m-0">
        {control.tiers.map((t) => (
          <li key={t.tier} className="text-[0.9375rem] leading-relaxed text-[#475569]">
            <span className={`font-display font-semibold ${t.tier <= reached ? "text-[#0F766E]" : "text-[#0F172A]"}`}>{t.name}</span>
            <span className="text-[#0F172A]">{t.tier <= reached ? " · reached" : ""}</span>
            <span className="block">{t.text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Line({ control, index, line }) {
  const reading = readingLinks(control)
  return (
    <li id={control.id} className="py-6 border-b border-[#E2E8F0] scroll-mt-20 grid gap-4 sm:grid-cols-12 sm:gap-6">
      <div className="sm:col-span-8">
        <Readout label>
          {index}. NIST CSF 2.0 {control.refs.nist.join(" · ")}
        </Readout>
        <h3 className="mt-2 font-display font-semibold text-[1.1875rem] leading-snug tracking-[-0.01em] text-[#0F172A]">{control.name}</h3>
        <p className="mt-1.5 text-[1rem] leading-relaxed text-[#475569]">{control.promise}</p>
        {control.tiers ? <Tiers control={control} line={line} /> : null}
        {reading.length ? (
          <p className="mt-3 text-[0.9375rem] text-[#475569]">
            Read:{" "}
            {reading.map((r, i) => (
              <span key={r.href}>
                {i ? ", " : ""}
                <Link href={r.href} className="text-[#1D4ED8] underline underline-offset-2 hover:text-[#0F172A]">
                  {r.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
      <div className="sm:col-span-4 sm:text-right">
        <LineState line={line} />
      </div>
    </li>
  )
}

export default function VerifyRecord({ slug, status, record }) {
  const name = record?.businessName || OWN_NAME
  const domain = record?.primaryDomain || null
  const checkedAt = record?.checkedAt || null
  const version = record?.baselineVersion || BASELINE_VERSION
  const lines = record?.lines || {}
  const useStatement = name.trim().split(/\s+/).length <= 6 && name.length <= 40
  let number = 0

  return (
    <>
      <SchemaScript
        schema={breadcrumbSchema([
          { name: "Data Hygienics", path: "/" },
          { name: "Business", path: "/business" },
          { name: `${name}: Verified record`, path: `/verify/${slug}` },
        ])}
      />
      <Navbar surface="night" />
      <main className="bg-white text-[#0F172A]">
        <NightSection aria-labelledby="verify-title" className="pt-28 sm:pt-36 pb-16 sm:pb-24">
          <FoldRule tone="night" draw />
          <Readout tone="night" label className="mt-7">
            Data Hygienics Verified · Baseline {version}
          </Readout>
          {useStatement ? (
            <Statement id="verify-title" className="mt-5">
              {name}
            </Statement>
          ) : (
            <h1 id="verify-title" className="mt-5 font-display font-semibold text-[2.5rem] sm:text-[4rem] leading-[1.0] tracking-[-0.03em] text-balance">
              {name}
            </h1>
          )}
          <Readout tone="night" className="mt-6">
            {domain ? `${domain} · ` : ""}
            {checkedAt ? `Checked evidence as of ${formatDate(checkedAt)}` : "No checked record yet"}
          </Readout>
          <div className={`${COLUMN} mt-8 space-y-4`}>
            {record ? (
              <p className="text-lg sm:text-[1.3125rem] leading-normal text-night-ink-2 text-pretty">{WHAT_IT_IS}</p>
            ) : (
              <p className="text-lg sm:text-[1.3125rem] leading-normal text-night-ink-2 text-pretty">
                {status === "empty"
                  ? `${name} has no public Verified record yet. When one is checked, this page shows what was checked and when, line by line.`
                  : `The Verified record for ${name} is not published yet. When it is, this page shows what was checked and when, line by line.`}
              </p>
            )}
            <p className="text-[1.0625rem] leading-relaxed text-night-ink-2">{WHAT_IT_IS_NOT}</p>
            <p className="text-[1.0625rem] leading-relaxed text-night-ink-2">
              Every line below carries how it was proven. The proof types are explained in{" "}
              <a href="#how-proven" className="text-white underline underline-offset-2">
                how a line is proven
              </a>
              .
            </p>
          </div>
        </NightSection>

        <DaySection as="section" aria-labelledby="lines-title" className="py-14 sm:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-9">
              <FoldRule />
              <Readout label className="mt-6">
                The baseline · seventeen controls in nine groups
              </Readout>
              <h2 id="lines-title" className="mt-3 font-display font-semibold text-[2rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
                What was checked, line by line
              </h2>
              <p className={`${COLUMN} mt-4 text-[1.0625rem] leading-relaxed text-[#475569]`}>{WHO_DECIDES}</p>

              {GROUPS.map((group) => {
                const controls = CONTROLS.filter((c) => c.group === group.id)
                if (!controls.length) return null
                return (
                  <section key={group.id} aria-labelledby={`group-${group.id}`} className="mt-12">
                    <h3 id={`group-${group.id}`} className="font-display font-semibold text-[1.375rem] tracking-[-0.01em] text-[#0F172A]">
                      {group.name}
                    </h3>
                    <ol className="mt-2 list-none p-0 m-0 border-t border-[#E2E8F0]">
                      {controls.map((control) => {
                        number += 1
                        return <Line key={control.id} control={control} index={number} line={lines[control.id] || null} />
                      })}
                    </ol>
                  </section>
                )
              })}
            </div>
          </div>
        </DaySection>

        <DaySection as="section" field id="how-proven" aria-labelledby="proven-title" className="py-14 sm:py-20 scroll-mt-16">
          <FoldRule />
          <Readout label className="mt-6">
            The method
          </Readout>
          <h2 id="proven-title" className="mt-3 font-display font-semibold text-[2rem] sm:text-[2.5rem] leading-[1.08] tracking-[-0.02em]">
            How a line is proven
          </h2>
          <p className={`${COLUMN} mt-4 text-[1.0625rem] leading-relaxed text-[#475569]`}>
            Five kinds of proof, strongest first. When a stronger kind is available to a business, a weaker one is not accepted for that
            line. A line that rests on more than one kind carries the label of the weakest, so the page never claims more than was checked.
          </p>
          <dl className={`${COLUMN} mt-8 border-t border-[#E2E8F0]`}>
            {PROOF_TYPES.map((p) => (
              <div key={p.id} className="py-5 border-b border-[#E2E8F0]">
                <dt className="font-display font-semibold text-[1.125rem] text-[#0F172A]">{p.label}</dt>
                <dd className="mt-1 text-[1rem] leading-relaxed text-[#475569]">{capitalize(PROOF_WHAT[p.id])}.</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-12 font-display font-semibold text-[1.375rem] tracking-[-0.01em] text-[#0F172A]">When a line is not passed</h3>
          <dl className={`${COLUMN} mt-4 border-t border-[#E2E8F0]`}>
            {PUBLIC_STATES.map((s) => (
              <div key={s.id} className="py-4 border-b border-[#E2E8F0] sm:grid sm:grid-cols-12 sm:gap-6">
                <dt className="sm:col-span-4 font-display font-semibold text-[1.0625rem] text-[#0F172A]">{STATE_LABEL[s.id]}</dt>
                <dd className="sm:col-span-8 mt-1 sm:mt-0 text-[1rem] leading-relaxed text-[#475569]">{s.meaning}</dd>
              </div>
            ))}
            <div className="py-4 border-b border-[#E2E8F0] sm:grid sm:grid-cols-12 sm:gap-6">
              <dt className="sm:col-span-4 font-display font-semibold text-[1.0625rem] text-[#0F172A]">Not applicable</dt>
              <dd className="sm:col-span-8 mt-1 sm:mt-0 text-[1rem] leading-relaxed text-[#475569]">
                Allowed only where the control says so, and the line states the reason.
              </dd>
            </div>
          </dl>

          <p className={`${COLUMN} mt-10 text-[1rem] leading-relaxed text-[#475569]`}>
            Nothing from a connected tenant reaches this page: no tenant names, user or device counts, admin names, lists of apps, addresses or
            evidence. What is shown here is what the record holds for the public, and nothing else. Read{" "}
            <Link href="/how-it-works" className="text-[#1D4ED8] underline underline-offset-2 hover:text-[#0F172A]">
              how we work
            </Link>
            .
          </p>
        </DaySection>
      </main>
      <Footer />
    </>
  )
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""
}
