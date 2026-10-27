"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react"
import { getActivePrices, isConfiguredPriceId, foundingOpen } from "@/lib/stripe/prices"
import { createClient } from "@/lib/supabase/client"
import {
  getSubscription,
  clearSubscriptionCache,
} from "@/lib/stripe/subscription"
import { isSubscriptionPaid } from "@/lib/stripe/entitlement"
import { isLegacyPlan } from "@/lib/stripe/access"
import { useRouter } from "next/navigation"
import PromoCodeInput from "@/app/components/PromoCodeInput"
import JoinSheet from "@/app/components/membership/JoinSheet"
import JoinViewed from "@/app/components/membership/JoinViewed"
import { MEMBERSHIP } from "@/lib/content/membership"
import { EVENTS, track } from "@/lib/analytics"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"

// One membership, two doors (Home and Business), the Documentation Pack
// beneath, then what stays free and the questions people ask. All copy and
// prices come from lib/content/membership.js; price IDs come from
// lib/stripe/prices.js. A button whose price slot is still a placeholder is
// disabled and reads "Checkout opens soon", so the page renders before the
// Stripe catalog exists. No motion on this page.
//
// Query parameters: ?door=home|business rings and scrolls to that card;
// ?checkout=1 (the magic-link return from JoinSheet) starts checkout for the
// door's monthly price once the session is known; ?canceled=1 (Stripe's
// cancel URL) shows "No charge was made".

const PRICES = getActivePrices()
const SURFACE = "pricing"
const DOORS = ["home", "business"]

const usd = (n) => `$${n.toLocaleString("en-US")}`

// The founding annual rate replaces the list annual price while it is open.
// Guarded so the page still renders if prices.js is mid-edit.
function isFoundingOpen() {
  try {
    return typeof foundingOpen === "function" && foundingOpen() === true
  } catch {
    return false
  }
}

const DOOR_PRICE_IDS = {
  home: {
    monthly: PRICES.memberHomeMonthly,
    yearly: PRICES.memberHomeYearly,
    founding: PRICES.foundingHomeYearly,
  },
  business: {
    monthly: PRICES.memberBusinessMonthly,
    yearly: PRICES.memberBusinessYearly,
    founding: PRICES.foundingBusinessYearly,
  },
}

const DOOR_ACCENTS = {
  home: {
    button: "bg-[#0F766E] hover:bg-[#115E59] focus-visible:outline-[#0F766E]",
    text: "text-[#0F766E] hover:text-[#115E59]",
    check: "text-[#0F8F83]",
    ring: "ring-2 ring-[#0F8F83] border-[#0F8F83]",
    badge: "bg-[#F0FDFA] text-[#0F766E]",
  },
  business: {
    button: "bg-[#1D4ED8] hover:bg-[#1E40AF] focus-visible:outline-[#1D4ED8]",
    text: "text-[#1D4ED8] hover:text-[#1E40AF]",
    check: "text-[#1D4ED8]",
    ring: "ring-2 ring-[#1D4ED8] border-[#1D4ED8]",
    badge: "bg-[#EFF6FF] text-[#1D4ED8]",
  },
}

// Display names for grandfathered plans in the current-plan banner. These
// plans are still honored but never sold.
const LEGACY_PLAN_LABELS = {
  starter: "Starter",
  professional: "Professional",
  msp: "IT Provider / Advisor (Legacy)",
  agency: "Agency Plan (Legacy)",
}

const SOON = "Checkout opens soon"

export default function PricingPage() {
  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(null)
  const [session, setSession] = useState(null)
  const [currentPlan, setCurrentPlan] = useState(null)
  // True once the session and (when signed in) the plan have been read, so
  // the magic-link auto-start never races the billing-portal check.
  const [accountReady, setAccountReady] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  // Which card the last checkout attempt came from, so its error renders
  // inline under that card's button.
  const [errorKey, setErrorKey] = useState(null)
  // The door whose inline magic-link sheet is open (signed-out visitors).
  const [sheetDoor, setSheetDoor] = useState(null)
  const [focusDoor, setFocusDoor] = useState(null)
  const [canceled, setCanceled] = useState(false)
  // Computed on first render so the founding line never flashes in late.
  const [founding] = useState(isFoundingOpen)
  // Synchronous in-flight guard. Shared across every checkout path so a
  // user cannot double-submit by rapidly clicking two different tiers.
  const checkoutInFlightRef = useRef(false)
  const autoStartRef = useRef(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        const sub = await getSubscription(s.user.id)
        if (isSubscriptionPaid(sub.subscription) || sub.isPromo) {
          setCurrentPlan(sub.plan)
        }
      }
      setAccountReady(true)
    })
  }, [])

  // Read the query once on the client. The page is a client component with
  // no Suspense boundary, so window.location stands in for useSearchParams.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const door = DOORS.includes(params.get("door")) ? params.get("door") : null
    setCanceled(params.get("canceled") === "1")
    setFocusDoor(door)
    if (door && params.get("checkout") === "1") autoStartRef.current = door
    if (door) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      document.getElementById(door)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
    }
  }, [])

  async function handleCheckout({ priceId, mode, key, door }) {
    if (!session) {
      // Membership: the inline magic-link sheet, which returns here with
      // checkout=1. The Documentation Pack keeps the account sign-up.
      if (door) {
        setSheetDoor(door)
        return
      }
      router.push("/tools/cyber-audit/register")
      return
    }
    if (!isConfiguredPriceId(priceId)) return
    if (checkoutInFlightRef.current) return
    checkoutInFlightRef.current = true
    setCheckoutError("")
    setErrorKey(door || key)
    setCheckingOut(key)

    // Existing subscribers (legacy or member) go to the billing portal to
    // change or manage their subscription rather than starting a second one.
    const isStartingSubscription = mode === "subscription"
    const hasActiveSubscription =
      currentPlan &&
      currentPlan !== "free" &&
      isStartingSubscription

    let willRedirect = false
    try {
      if (hasActiveSubscription) {
        const res = await fetch("/api/stripe/create-portal-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json()
        if (data.url) {
          willRedirect = true
          window.location.href = data.url
          return
        }
        setCheckoutError(
          data.error || "Could not open the billing portal. Try again, or email us."
        )
        return
      }

      const payload = { priceId }

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.url) {
        clearSubscriptionCache()
        willRedirect = true
        window.location.href = data.url
        return
      }
      setCheckoutError(
        data.error || "Could not start checkout. Try again, or email us."
      )
    } catch (err) {
      console.error("Checkout error:", err)
      setCheckoutError(
        "Could not reach Stripe. Check your connection and try again."
      )
    } finally {
      if (!willRedirect) {
        checkoutInFlightRef.current = false
        setCheckingOut(null)
      }
    }
  }

  function join({ door, cadence }) {
    const ids = DOOR_PRICE_IDS[door]
    const priceId = cadence === "yearly" ? (founding ? ids.founding : ids.yearly) : ids.monthly
    track(EVENTS.joinStarted, { surface: SURFACE, door })
    handleCheckout({ priceId, mode: "subscription", key: `${door}-${cadence}`, door })
  }

  // Back from the magic link signed in: start checkout for the door's
  // monthly price, once. The flag is cleared from the URL first so a back
  // button or reload never starts a second checkout.
  useEffect(() => {
    const door = autoStartRef.current
    if (!door || !accountReady) return
    autoStartRef.current = null
    const url = new URL(window.location.href)
    url.searchParams.delete("checkout")
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash)
    if (!session || !isConfiguredPriceId(DOOR_PRICE_IDS[door].monthly)) return
    handleCheckout({ priceId: DOOR_PRICE_IDS[door].monthly, mode: "subscription", key: `${door}-monthly`, door })
    // handleCheckout reads the session and plan this effect waits for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountReady, session])

  const onLegacyPlan = currentPlan && isLegacyPlan(currentPlan)
  const { pricing } = MEMBERSHIP
  const packConfigured = isConfiguredPriceId(PRICES.docsPack)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar surface="night" />

      <main className="pb-24">
        {/* Header: a night surface the two doors overlap */}
        <section aria-labelledby="pricing-heading" className="bg-night text-night-ink px-4 sm:px-6 pt-28 sm:pt-36 pb-40 sm:pb-44">
          <div className="max-w-5xl mx-auto">
            <FoldRule tone="night" draw />
            <Readout tone="night" label className="mt-7">
              {MEMBERSHIP.name}
            </Readout>
            <h1
              id="pricing-heading"
              className="mt-4 max-w-[18ch] font-display font-semibold text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] leading-[1.02] tracking-[-0.03em] text-balance"
            >
              {pricing.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg sm:text-[1.1875rem] leading-relaxed text-night-ink-2">{pricing.line}</p>
            <Readout tone="night" className="mt-5">
              No sponsors · No referral fees · Cancel in two clicks
            </Readout>

            {canceled && (
              <p role="status" className="mt-8 max-w-2xl border border-night-line-2 px-5 py-3 text-sm text-white">
                No charge was made
              </p>
            )}

            {/* Grandfathered-plan banner */}
            {onLegacyPlan && (
              <div className="mt-8 max-w-2xl border border-night-line-2 px-5 py-4">
                <p className="text-sm text-night-ink-2">
                  <span className="font-semibold text-white">
                    You are on a legacy plan:{" "}
                    {LEGACY_PLAN_LABELS[currentPlan] || currentPlan}.
                  </span>{" "}
                  Keep using it for as long as you like — nothing below affects
                  your existing subscription or billing.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="px-4 sm:px-6">
        <div className="relative max-w-5xl mx-auto -mt-28 sm:-mt-32">
          {/* ---- The two doors ---- */}
          <div>
            <JoinViewed surface={SURFACE} />
            <div className="grid gap-6 md:grid-cols-2 items-stretch">
              {DOORS.map((door) => (
                <DoorCard
                  key={door}
                  door={door}
                  copy={pricing[door]}
                  prices={MEMBERSHIP.prices[door]}
                  priceIds={DOOR_PRICE_IDS[door]}
                  founding={founding}
                  focused={focusDoor === door}
                  checkingOut={checkingOut}
                  error={errorKey === door ? checkoutError : ""}
                  sheetOpen={sheetDoor === door && !session}
                  onCloseSheet={() => setSheetDoor(null)}
                  onJoin={join}
                />
              ))}
            </div>
          </div>

          {/* Guarantee and exit */}
          <p className="mt-8 text-center text-[15px] text-[#0F172A]">
            <span className="font-semibold">{MEMBERSHIP.guarantee}</span>{" "}
            <span className="text-[#475569]">{MEMBERSHIP.exit}</span>
          </p>

          {/* ---- Documentation Pack ---- */}
          <section
            aria-labelledby="pack-heading"
            className="mt-16 border border-[#E2E8F0] bg-white p-6 sm:p-8 grid gap-8 md:grid-cols-[1.2fr_1fr]"
          >
            <div className="min-w-0">
              <h2 id="pack-heading" className="font-display font-semibold text-[1.75rem] leading-tight tracking-[-0.02em] text-[#0F172A]">
                {pricing.pack.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{pricing.pack.line}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold tracking-[-0.03em] tabular-nums text-[#0F172A]">{usd(MEMBERSHIP.prices.pack)}</span>
                <span className="text-base text-[#64748B]">{pricing.pack.priceLabel}</span>
              </p>
              <button
                type="button"
                onClick={() =>
                  handleCheckout({ priceId: PRICES.docsPack, mode: "payment", key: "docs_pack" })
                }
                disabled={!!checkingOut || !packConfigured}
                className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#0F172A] px-6 h-12 text-[15px] font-semibold text-white hover:bg-[#1E293B] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] disabled:opacity-60"
              >
                {checkingOut === "docs_pack" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Opening checkout…
                  </>
                ) : packConfigured ? (
                  <>
                    {pricing.pack.cta}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                ) : (
                  SOON
                )}
              </button>
              {errorKey === "docs_pack" && checkoutError ? <ErrorNote message={checkoutError} /> : null}
              <p className="mt-4 text-sm text-[#475569]">
                {pricing.pack.conversion}{" "}
                <Link href="/contact" className="font-semibold text-[#1D4ED8] underline underline-offset-2 hover:text-[#1E40AF]">
                  Contact us
                </Link>
              </p>
            </div>
            <ul className="space-y-3 list-none p-0 md:pt-1">
              {pricing.pack.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#0F172A]">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ---- What's free, always ---- */}
          <section
            id="free"
            aria-labelledby="free-heading"
            className="mt-16 scroll-mt-24 border-t border-[#E2E8F0] pt-10"
          >
            <h2 id="free-heading" className="font-display font-semibold text-[1.75rem] leading-tight tracking-[-0.02em] text-[#0F172A]">
              {pricing.freeAlways.title}
            </h2>
            <p className="mt-2 text-[15px] text-[#334155]">{pricing.freeAlways.intro}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 list-none p-0">
              {pricing.freeAlways.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#0F172A]">
                  <Check className="w-4 h-4 mt-1 shrink-0 text-[#0F8F83]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/#start"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#115E59]"
            >
              {MEMBERSHIP.secondary}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          {/* ---- FAQ ---- */}
          <section aria-labelledby="faq-heading" className="mt-16">
            <h2 id="faq-heading" className="font-display font-semibold text-[1.75rem] leading-tight tracking-[-0.02em] text-[#0F172A]">
              Questions people ask
            </h2>
            <div className="mt-5 divide-y divide-[#E2E8F0] border border-[#E2E8F0] bg-white">
              {pricing.faq.map(({ q, a }) => (
                <details key={q} className="group px-5 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-[#0F172A] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown className="w-4 h-4 shrink-0 text-[#475569] transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 text-[15px] leading-relaxed text-[#334155]">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Promo code */}
          <div className="mt-12 max-w-md mx-auto">
            <PromoCodeInput isAuthenticated={!!session} />
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ---------------------------------------------------------------------------
// One door: Home or Business
// ---------------------------------------------------------------------------
function DoorCard({ door, copy, prices, priceIds, founding, focused, checkingOut, error, sheetOpen, onCloseSheet, onJoin }) {
  const accent = DOOR_ACCENTS[door]
  const monthlyReady = isConfiguredPriceId(priceIds.monthly)
  const yearlyId = founding ? priceIds.founding : priceIds.yearly
  const yearlyReady = isConfiguredPriceId(yearlyId)
  const yearlyPrice = founding ? prices.founding : prices.yearly
  const busy = !!checkingOut
  const headingId = `${door}-heading`

  return (
    <section
      id={door}
      aria-labelledby={headingId}
      className={`scroll-mt-24 flex min-w-0 flex-col border bg-white p-6 sm:p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)] ${
        focused ? accent.ring : "border-[#E2E8F0]"
      }`}
    >
      <Readout label>{door === "home" ? "For your home" : "For your business"}</Readout>
      <h2 id={headingId} className="mt-2 font-display font-semibold text-[2rem] leading-tight tracking-[-0.02em] text-[#0F172A]">
        {copy.title}
      </h2>
      <p className="mt-1.5 text-[15px] text-[#475569]">{copy.who}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl sm:text-[3.5rem] font-semibold tracking-[-0.035em] tabular-nums text-[#0F172A]">{usd(prices.monthly)}</span>
        <span className="text-base text-[#64748B]">a month</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#334155]">
        <span>
          or <span className="font-semibold tabular-nums">{usd(yearlyPrice)}</span> a year
        </span>
        <button
          type="button"
          onClick={() => onJoin({ door, cadence: "yearly" })}
          disabled={busy || !yearlyReady}
          className={`inline-flex items-center gap-1 rounded font-semibold underline underline-offset-2 disabled:no-underline disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 ${accent.text}`}
        >
          {checkingOut === `${door}-yearly` ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Opening checkout…
            </>
          ) : yearlyReady ? (
            "Join yearly"
          ) : (
            SOON
          )}
        </button>
      </div>
      {founding ? (
        <p className="mt-2 text-xs text-[#475569]">
          <span className={`mr-1.5 inline-block px-2 py-0.5 font-semibold ${accent.badge}`}>
            {MEMBERSHIP.pricing.founding.label}
          </span>
          {MEMBERSHIP.pricing.founding.note}
        </p>
      ) : null}

      <ul className="mt-6 mb-8 flex-1 space-y-3 list-none p-0">
        {copy.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#334155]">
            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${accent.check}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onJoin({ door, cadence: "monthly" })}
        disabled={busy || !monthlyReady}
        className={`inline-flex w-full items-center justify-center gap-2 px-5 h-12 text-[15px] font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${accent.button}`}
      >
        {checkingOut === `${door}-monthly` ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Opening checkout…
          </>
        ) : monthlyReady ? (
          <>
            {copy.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        ) : (
          SOON
        )}
      </button>
      {error ? <ErrorNote message={error} /> : null}
      {sheetOpen ? <JoinSheet door={door} onClose={onCloseSheet} /> : null}
    </section>
  )
}

function ErrorNote({ message }) {
  return (
    <p
      role="alert"
      className="mt-3 border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]"
    >
      {message}
    </p>
  )
}
