"use client"

import { useState } from "react"
import { ExternalLink, ThumbsUp, TriangleAlert, Coins, Lock, MonitorSmartphone, Shuffle } from "lucide-react"
import AudienceBadge from "./AudienceBadge"
import CitedText from "./CitedText"
import { AudienceChips } from "./AudienceFilter"
import { formatDate } from "@/lib/content"

const COST = {
  free: { label: "Free", className: "bg-[#ECFDF5] text-[#047857] border-[#059669]/25" },
  freemium: { label: "Free tier + paid", className: "bg-[#F0FDFA] text-[#0F766E] border-[#0F766E]/25" },
  paid: { label: "Paid", className: "bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]" },
}

function isWebUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url)
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

// Renders toolkit categories (from getToolsByCategory) with #cat-<slug> and
// #tool-<slug> anchors. Prose renders in the same order the page used to
// number citations: category why, then per tool whatItsFor, whyWeLikeIt,
// caveats, pricingNote, privacyNotes, alternatives.
export default function ToolkitList({ categories = [], number = {} }) {
  const [audience, setAudience] = useState("all")

  const allTools = categories.flatMap((c) => c.tools)
  const counts = {
    all: allTools.length,
    home: allTools.filter((t) => t.audience?.includes("home")).length,
    business: allTools.filter((t) => t.audience?.includes("business")).length,
  }
  const visible = categories
    .map((c) => ({
      ...c,
      tools: audience === "all" ? c.tools : c.tools.filter((t) => t.audience?.includes(audience)),
    }))
    .filter((c) => c.tools.length > 0)
  const shown = visible.reduce((n, c) => n + c.tools.length, 0)

  if (!categories.length) {
    return (
      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-[#475569]">
        We&apos;re still testing tools for this list. Check back soon.
      </p>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
        <AudienceChips
          value={audience}
          onChange={setAudience}
          counts={counts}
          nouns={["tool", "tools"]}
          label="Show tools for"
        />
        <nav aria-label="Toolkit categories">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {visible.map((c) => (
              <li key={c.slug}>
                <a href={`#cat-${c.slug}`} className="font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-current">
                  {c.name}
                </a>
                <span className="text-[#64748B]"> ({c.tools.length})</span>
              </li>
            ))}
          </ul>
        </nav>
        <p className="sr-only" aria-live="polite">
          {audience === "all" ? `Showing all ${shown} tools` : `Showing ${shown} tools for ${audience === "home" ? "Home" : "Business"}`}
        </p>
      </div>

      {visible.map((category) => (
        <section
          key={category.slug}
          id={`cat-${category.slug}`}
          aria-labelledby={`cat-${category.slug}-heading`}
          className="mt-14"
        >
          <h2 id={`cat-${category.slug}-heading`} className="text-2xl font-bold text-[#0F172A] tracking-tight">
            {category.name}
          </h2>
          {category.why ? (
            <p className="text-[#475569] mt-2 max-w-3xl leading-relaxed">
              <CitedText text={category.why} number={number} />
            </p>
          ) : null}
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {category.tools.map((tool) => (
              <li key={tool.slug} className="min-w-0">
                <ToolCard tool={tool} number={number} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function ToolCard({ tool, number }) {
  const cost = COST[tool.cost]
  const caveats = list(tool.caveats)
  const platforms = list(tool.platforms)
  const alternatives = list(tool.alternatives).filter((a) => a?.name)

  return (
    <article id={`tool-${tool.slug}`} className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <h3 className="text-xl font-bold text-[#0F172A] leading-snug">{tool.name}</h3>
        {cost ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cost.className}`}>
            <Coins className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Cost: </span>
            {cost.label}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {(tool.audience || []).map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
        {platforms.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-[#475569] ml-1">
            <MonitorSmartphone className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
            <span className="sr-only">Works on: </span>
            {platforms.join(", ")}
          </span>
        ) : null}
      </div>

      {tool.whatItsFor ? (
        <p className="mt-4 text-[#334155] leading-relaxed">
          <CitedText text={tool.whatItsFor} number={number} />
        </p>
      ) : null}

      <dl className="mt-4 space-y-4 text-sm">
        {tool.whyWeLikeIt ? (
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <ThumbsUp className="w-4 h-4 text-[#047857]" aria-hidden="true" />
              Why we like it
            </dt>
            <dd className="mt-1 text-[#475569] leading-relaxed">
              <CitedText text={tool.whyWeLikeIt} number={number} />
            </dd>
          </div>
        ) : null}

        {caveats.length > 0 ? (
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <TriangleAlert className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
              Watch out for
            </dt>
            <dd className="mt-1">
              <ul className="list-disc pl-5 space-y-1 text-[#475569] leading-relaxed marker:text-[#94A3B8]">
                {caveats.map((caveat, i) => (
                  <li key={i}>
                    <CitedText text={caveat} number={number} />
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        {tool.pricingNote ? (
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <Coins className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              What it costs
            </dt>
            <dd className="mt-1 text-[#475569] leading-relaxed">
              <CitedText text={tool.pricingNote} number={number} />
              {tool.pricingVerified ? (
                <span className="block text-xs text-[#64748B] mt-1">
                  Price checked <time dateTime={tool.pricingVerified}>{formatDate(tool.pricingVerified)}</time>
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}

        {tool.privacyNotes ? (
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <Lock className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              Privacy
            </dt>
            <dd className="mt-1 text-[#475569] leading-relaxed">
              <CitedText text={tool.privacyNotes} number={number} />
            </dd>
          </div>
        ) : null}

        {alternatives.length > 0 ? (
          <div>
            <dt className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <Shuffle className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
              Alternatives
            </dt>
            <dd className="mt-1">
              <ul className="space-y-1 text-[#475569] leading-relaxed">
                {alternatives.map((alt, i) => (
                  <li key={i}>
                    <span className="font-medium text-[#0F172A]">{alt.name}</span>
                    {alt.note ? (
                      <>
                        {": "}
                        <CitedText text={alt.note} number={number} />
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      {isWebUrl(tool.url) ? (
        <div className="mt-auto pt-5">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1D4ED8]/30 px-3.5 py-2 text-sm font-semibold text-[#1D4ED8] hover:bg-[#EFF6FF] motion-safe:transition-colors"
          >
            Visit {tool.name}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : null}
    </article>
  )
}
