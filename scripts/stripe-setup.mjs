// Create the Stripe catalog for the membership, once per mode.
//
//   node scripts/stripe-setup.mjs          # TEST mode (the default)
//   node scripts/stripe-setup.mjs --live   # LIVE mode (real money)
//
// TEST mode reads STRIPE_SECRET_KEY from .env.local (falls back to the
// environment) and refuses to run unless it is a test key (sk_test_). It
// creates the three products and seven prices and prints a ready-to-paste
// block for PRICES in lib/stripe/prices.js. Nothing else.
//
// LIVE mode reads STRIPE_LIVE_SECRET_KEY from .env.local only (never
// STRIPE_SECRET_KEY, never the shell environment) and refuses unless it is a
// live secret key (sk_live_). It reads first, lists what it would create, and
// writes nothing until the operator types LIVE at an interactive prompt. There
// is no --yes, and piped stdin is refused. On top of the same products and
// prices it creates, each only if absent:
//   - the PACK_TO_MEMBER coupon (100% off for 12 months, Business membership
//     product only),
//   - a billing portal configuration tagged metadata.dh_key = "default",
//   - the production webhook endpoint for the events the webhook route
//     handles. Its signing secret is shown by Stripe only at creation, so it
//     is written to .stripe-live-webhook-secret (mode 600, gitignored) and
//     never printed.
// It ends with a ready-to-paste LIVE_PRICES block and the remaining manual
// steps. No key or secret is ever printed.
//
// Both modes are idempotent: products are found by metadata.dh_key and prices
// by lookup_key, and only what is missing is created, so a second run creates
// nothing and prints the same IDs. Ongoing Protection (retired from sale) and
// the legacy products are never created or touched here. Stripe prices are
// immutable, so an existing price whose amount or interval differs from the
// table below is reported, not changed: archive it in the dashboard and
// re-run. The same goes for a coupon, portal configuration or webhook
// endpoint that exists but differs: reported, not changed.
//
// Plan: design/strategy/membership-implementation.md, sections 3 and 6.

import { readFileSync, existsSync, writeFileSync, chmodSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createInterface } from "node:readline/promises"
import Stripe from "stripe"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

// ---------- Arguments: --live, nothing else ----------
const args = process.argv.slice(2)
const unknown = args.filter((arg) => arg !== "--live")
if (unknown.length) {
  console.error(
    `Unknown option: ${unknown.join(" ")}\n` +
      "Usage: node scripts/stripe-setup.mjs [--live]\n" +
      "There is no --yes: live mode always asks the operator to type LIVE."
  )
  process.exit(1)
}
const LIVE = args.includes("--live")

// Never let a key or a webhook secret reach the terminal, even inside an
// error message from Stripe (which can echo a masked key).
function redact(text) {
  return String(text).replace(/\b(?:sk|rk|pk)_(?:live|test)_[A-Za-z0-9*]+|\bwhsec_[A-Za-z0-9*]+/g, "[redacted]")
}

// ---------- Tiny .env.local reader (no dotenv) ----------
function readEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith("#")) continue
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    } else {
      // Unquoted values may carry a trailing comment.
      value = value.replace(/\s+#.*$/, "")
    }
    out[match[1]] = value
  }
  return out
}

const env = readEnvFile(resolve(ROOT, ".env.local"))

let key
if (LIVE) {
  key = env.STRIPE_LIVE_SECRET_KEY || ""
  if (!key) {
    console.error(
      "Refusing to run: STRIPE_LIVE_SECRET_KEY is not set in .env.local.\n" +
        "Live mode reads only that variable (never STRIPE_SECRET_KEY). Add the live secret key\n" +
        "(sk_live_...) to .env.local as STRIPE_LIVE_SECRET_KEY and run again. Nothing was sent to Stripe."
    )
    process.exit(1)
  }
  if (!key.startsWith("sk_live_")) {
    console.error(
      "Refusing to run: STRIPE_LIVE_SECRET_KEY in .env.local is not a live secret key (sk_live_...).\n" +
        "Nothing was sent to Stripe."
    )
    process.exit(1)
  }
} else {
  key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || ""
  if (!key.startsWith("sk_test_")) {
    console.error(
      "Refusing to run: STRIPE_SECRET_KEY (from .env.local) is missing or is not a test key (sk_test_...).\n" +
        "Without --live this script only ever creates the test-mode catalog."
    )
    process.exit(1)
  }
}

const stripe = new Stripe(key)

// ---------- The catalog (identical in both modes) ----------
const STATEMENT_DESCRIPTOR = "DATA HYGIENICS"

const PRODUCTS = [
  {
    dhKey: "member_home",
    name: "Data Hygienics Membership (Home)",
    prices: [
      { slot: "memberHomeMonthly", lookupKey: "dh_member_home_monthly", amount: 800, interval: "month", metadata: { door: "home", plan: "member_home" } },
      { slot: "memberHomeYearly", lookupKey: "dh_member_home_yearly", amount: 6900, interval: "year", metadata: { door: "home", plan: "member_home" } },
      { slot: "foundingHomeYearly", lookupKey: "dh_founding_home_yearly", amount: 5900, interval: "year", metadata: { door: "home", plan: "member_home", founding: "true" } },
    ],
  },
  {
    dhKey: "member_business",
    name: "Data Hygienics Membership (Business)",
    prices: [
      { slot: "memberBusinessMonthly", lookupKey: "dh_member_business_monthly", amount: 3900, interval: "month", metadata: { door: "business", plan: "member_business" } },
      { slot: "memberBusinessYearly", lookupKey: "dh_member_business_yearly", amount: 39000, interval: "year", metadata: { door: "business", plan: "member_business" } },
      { slot: "foundingBusinessYearly", lookupKey: "dh_founding_business_yearly", amount: 34900, interval: "year", metadata: { door: "business", plan: "member_business", founding: "true" } },
    ],
  },
  {
    dhKey: "docs_pack",
    name: "Documentation Pack",
    prices: [
      { slot: "docsPack", lookupKey: "dh_docs_pack", amount: 29900, interval: null, metadata: { purchase_type: "docs_pack" } },
    ],
  },
]

// Order of the printed PRICES / LIVE_PRICES block.
const SLOT_ORDER = [
  ["docsPack", "$299 one-time"],
  ["memberHomeMonthly", "$8/month"],
  ["memberHomeYearly", "$69/year"],
  ["foundingHomeYearly", "$59/year, founding rate (sold until FOUNDING_UNTIL)"],
  ["memberBusinessMonthly", "$39/month"],
  ["memberBusinessYearly", "$390/year"],
  ["foundingBusinessYearly", "$349/year, founding rate (sold until FOUNDING_UNTIL)"],
]

// ---------- Live-only extras ----------
const SITE_URL = "https://www.datahygienics.com"

const COUPON = {
  id: "PACK_TO_MEMBER",
  name: "Documentation Pack to Business membership",
  percent_off: 100,
  duration: "repeating",
  duration_in_months: 12,
  productDhKey: "member_business", // applies_to.products: this product only
}

const PORTAL_DH_KEY = "default"
const PORTAL = {
  business_profile: {
    headline: "Data Hygienics Membership",
    privacy_policy_url: `${SITE_URL}/privacy`,
    terms_of_service_url: `${SITE_URL}/terms`,
  },
  features: {
    // Cancel at period end. No cancellation_reason: Stripe leaves the reason
    // survey off by default, and this API exposes no retention offers, so the
    // customer gets no prompt between "Cancel" and confirming.
    subscription_cancel: { enabled: true, mode: "at_period_end" },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    customer_update: { enabled: true, allowed_updates: ["email", "address"] },
  },
  metadata: { dh_key: PORTAL_DH_KEY },
}

const WEBHOOK = {
  url: `${SITE_URL}/api/stripe/webhook`,
  description: "Data Hygienics production",
  // Exactly the event types app/api/stripe/webhook/route.js handles.
  // customer.subscription.created is not handled there, so it is not sent.
  enabled_events: [
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_failed",
  ],
}
const WEBHOOK_SECRET_FILE = ".stripe-live-webhook-secret"

const created = []
const warnings = []

// ---------- Products: find by metadata.dh_key, create if missing ----------
async function findProducts() {
  const byKey = {}
  for await (const product of stripe.products.list({ limit: 100 })) {
    const dhKey = product.metadata?.dh_key
    if (!dhKey) continue
    // Prefer an active product if more than one carries the key.
    if (!byKey[dhKey] || (!byKey[dhKey].active && product.active)) byKey[dhKey] = product
  }
  return byKey
}

async function ensureProduct(spec, existing) {
  const found = existing[spec.dhKey]
  if (found) {
    if (!found.active) {
      warnings.push(`Product "${found.name}" (${found.id}) is archived; reactivating it.`)
      return stripe.products.update(found.id, { active: true })
    }
    return found
  }
  const product = await stripe.products.create({
    name: spec.name,
    statement_descriptor: STATEMENT_DESCRIPTOR,
    metadata: { dh_key: spec.dhKey },
  })
  created.push(`product ${product.id} (${spec.name})`)
  return product
}

// ---------- Prices: find by lookup_key, create if missing ----------
async function findPrices(lookupKeys) {
  const byKey = {}
  for await (const price of stripe.prices.list({ lookup_keys: lookupKeys, limit: 100 })) {
    if (price.lookup_key) byKey[price.lookup_key] = price
  }
  return byKey
}

function checkPrice(price, spec, product) {
  const productId = typeof price.product === "string" ? price.product : price.product?.id
  const interval = price.recurring?.interval || null
  const problems = []
  if (price.unit_amount !== spec.amount) problems.push(`amount ${price.unit_amount} (expected ${spec.amount})`)
  if (price.currency !== "usd") problems.push(`currency ${price.currency} (expected usd)`)
  if (interval !== spec.interval) problems.push(`interval ${interval} (expected ${spec.interval})`)
  if (productId !== product.id) problems.push(`product ${productId} (expected ${product.id})`)
  if (problems.length) {
    warnings.push(`Price ${spec.lookupKey} (${price.id}) does not match the plan: ${problems.join(", ")}.`)
  }
}

async function ensurePrice(spec, product, existing) {
  const found = existing[spec.lookupKey]
  if (found) {
    checkPrice(found, spec, product)
    if (!found.active) {
      warnings.push(`Price ${spec.lookupKey} (${found.id}) was archived; reactivating it.`)
      return stripe.prices.update(found.id, { active: true })
    }
    return found
  }
  const params = {
    product: product.id,
    currency: "usd",
    unit_amount: spec.amount,
    lookup_key: spec.lookupKey,
    nickname: spec.lookupKey,
    metadata: spec.metadata,
  }
  if (spec.interval) params.recurring = { interval: spec.interval }
  const price = await stripe.prices.create(params)
  created.push(`price ${price.id} (${spec.lookupKey})`)
  return price
}

// ---------- Coupon: find by id, create if missing (live only) ----------
async function findCoupon() {
  try {
    return await stripe.coupons.retrieve(COUPON.id, { expand: ["applies_to"] })
  } catch (err) {
    if (err?.statusCode === 404 || err?.code === "resource_missing") return null
    throw err
  }
}

function checkCoupon(coupon, businessProductId) {
  const problems = []
  if (coupon.percent_off !== COUPON.percent_off) problems.push(`percent_off ${coupon.percent_off} (expected ${COUPON.percent_off})`)
  if (coupon.duration !== COUPON.duration) problems.push(`duration ${coupon.duration} (expected ${COUPON.duration})`)
  if (coupon.duration_in_months !== COUPON.duration_in_months) {
    problems.push(`duration_in_months ${coupon.duration_in_months} (expected ${COUPON.duration_in_months})`)
  }
  const products = coupon.applies_to?.products || []
  if (products.length !== 1 || products[0] !== businessProductId) {
    problems.push(`applies_to.products [${products.join(", ") || "all products"}] (expected [${businessProductId}])`)
  }
  if (!coupon.valid) problems.push("coupon is no longer valid")
  if (problems.length) {
    warnings.push(
      `Coupon ${coupon.id} does not match the plan: ${problems.join(", ")}. Coupons are immutable: ` +
        "delete it in the dashboard and re-run."
    )
  }
}

async function ensureCoupon(existing, businessProduct) {
  if (existing) {
    checkCoupon(existing, businessProduct.id)
    return existing
  }
  const coupon = await stripe.coupons.create({
    id: COUPON.id,
    name: COUPON.name,
    percent_off: COUPON.percent_off,
    duration: COUPON.duration,
    duration_in_months: COUPON.duration_in_months,
    applies_to: { products: [businessProduct.id] },
  })
  created.push(`coupon ${coupon.id} (${COUPON.name})`)
  return coupon
}

// ---------- Billing portal: find by metadata.dh_key, create if missing (live only) ----------
async function findPortalConfigs() {
  let ours = null
  let accountDefault = null
  for await (const config of stripe.billingPortal.configurations.list({ limit: 100 })) {
    if (config.metadata?.dh_key === PORTAL_DH_KEY && (!ours || (!ours.active && config.active))) ours = config
    if (config.is_default) accountDefault = config
  }
  return { ours, accountDefault }
}

async function ensurePortal(existing) {
  if (existing) {
    if (!existing.active) {
      warnings.push(`Billing portal configuration ${existing.id} is inactive; reactivating it.`)
      return stripe.billingPortal.configurations.update(existing.id, { active: true })
    }
    return existing
  }
  // Stripe's API has no is_default parameter on create or update (it is
  // read-only), so this cannot be made the account default from here.
  const config = await stripe.billingPortal.configurations.create(PORTAL)
  created.push(`billing portal configuration ${config.id}`)
  return config
}

// ---------- Webhook endpoint: find by URL, create if missing (live only) ----------
async function findWebhook() {
  for await (const endpoint of stripe.webhookEndpoints.list({ limit: 100 })) {
    if (endpoint.url === WEBHOOK.url) return endpoint
  }
  return null
}

function writeSecretFile(secret) {
  const path = resolve(ROOT, WEBHOOK_SECRET_FILE)
  // Tighten an existing file before writing into it; mode applies on create.
  if (existsSync(path)) chmodSync(path, 0o600)
  writeFileSync(path, `${secret}\n`, { mode: 0o600 })
  chmodSync(path, 0o600)
}

async function ensureWebhook(existing) {
  if (existing) {
    const events = existing.enabled_events || []
    const missing = events.includes("*") ? [] : WEBHOOK.enabled_events.filter((e) => !events.includes(e))
    if (missing.length) warnings.push(`Webhook endpoint ${existing.id} is missing events: ${missing.join(", ")}. Add them in the dashboard.`)
    if (existing.status !== "enabled") warnings.push(`Webhook endpoint ${existing.id} is ${existing.status}; enable it in the dashboard.`)
    return { endpoint: existing, secretWritten: false }
  }
  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK.url,
    enabled_events: WEBHOOK.enabled_events,
    description: WEBHOOK.description,
  })
  created.push(`webhook endpoint ${endpoint.id} (${WEBHOOK.url})`)
  if (endpoint.secret) {
    writeSecretFile(endpoint.secret)
    return { endpoint, secretWritten: true }
  }
  warnings.push(`Stripe did not return a signing secret for ${endpoint.id}; reveal it in the dashboard.`)
  return { endpoint, secretWritten: false }
}

// ---------- The LIVE gate ----------
async function confirmLive(pending, account) {
  console.log(`LIVE MODE. Stripe account: ${account.id}${account.name ? ` (${account.name})` : ""}`)
  console.log(`\nThis run will make ${pending.length} change(s) with real-money effect:\n  ${pending.join("\n  ")}\n`)
  if (!process.stdin.isTTY) {
    console.error("Refusing to continue: the LIVE confirmation must be typed at an interactive terminal (stdin is not a TTY).")
    process.exit(1)
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  let answer = ""
  try {
    answer = await rl.question("Type LIVE to continue, anything else to abort: ")
  } finally {
    rl.close()
  }
  if (answer.trim() !== "LIVE") {
    console.log("Aborted. Nothing was written to Stripe.")
    process.exit(1)
  }
  console.log("")
}

function printBlock(target, ids, keepNote) {
  const width = Math.max(...SLOT_ORDER.map(([slot]) => slot.length))
  console.log(`\nPaste into ${target} in lib/stripe/prices.js (${keepNote}):\n`)
  for (const [slot, note] of SLOT_ORDER) {
    console.log(`  ${(slot + ":").padEnd(width + 1)} '${ids[slot]}', // ${note}`)
  }
}

async function main() {
  const lookupKeys = PRODUCTS.flatMap((p) => p.prices.map((x) => x.lookupKey))
  const [existingProducts, existingPrices] = await Promise.all([findProducts(), findPrices(lookupKeys)])

  // Live: read everything else, then show the plan and ask before any write.
  let live = null
  if (LIVE) {
    const [account, coupon, portal, webhook] = await Promise.all([
      stripe.accounts.retrieveCurrent(),
      findCoupon(),
      findPortalConfigs(),
      findWebhook(),
    ])
    live = { account, coupon, portal, webhook }

    const pending = []
    for (const spec of PRODUCTS) {
      const product = existingProducts[spec.dhKey]
      if (!product) pending.push(`create product "${spec.name}"`)
      else if (!product.active) pending.push(`reactivate product "${product.name}" (${product.id})`)
      for (const priceSpec of spec.prices) {
        const price = existingPrices[priceSpec.lookupKey]
        if (!price) pending.push(`create price ${priceSpec.lookupKey}`)
        else if (!price.active) pending.push(`reactivate price ${priceSpec.lookupKey} (${price.id})`)
      }
    }
    if (!coupon) pending.push(`create coupon ${COUPON.id} (100% off for 12 months, Business membership only)`)
    if (!portal.ours) pending.push("create billing portal configuration (dh_key default)")
    else if (!portal.ours.active) pending.push(`reactivate billing portal configuration ${portal.ours.id}`)
    if (!webhook) pending.push(`create webhook endpoint ${WEBHOOK.url}`)

    if (pending.length) await confirmLive(pending, account)
    else console.log(`LIVE MODE. Stripe account: ${account.id}${account.name ? ` (${account.name})` : ""}\n`)
  }

  const ids = {}
  const products = {}
  for (const spec of PRODUCTS) {
    const product = await ensureProduct(spec, existingProducts)
    products[spec.dhKey] = product
    for (const priceSpec of spec.prices) {
      const price = await ensurePrice(priceSpec, product, existingPrices)
      ids[priceSpec.slot] = price.id
    }
  }

  let extras = null
  if (LIVE) {
    const coupon = await ensureCoupon(live.coupon, products[COUPON.productDhKey])
    const portal = await ensurePortal(live.portal.ours)
    const webhook = await ensureWebhook(live.webhook)
    extras = { coupon, portal, webhook, accountDefault: live.portal.accountDefault }
  }

  console.log(created.length ? `Created ${created.length}:\n  ${created.join("\n  ")}` : "Nothing to create: the catalog already exists.")
  if (warnings.length) console.log(`\nCheck these:\n  ${warnings.join("\n  ")}`)

  if (!LIVE) {
    printBlock("PRICES", ids, "keep protectionMonthly and protectionYearly")
    return
  }

  printBlock("LIVE_PRICES", ids, "keep protectionMonthly and protectionYearly as placeholders")

  const { coupon, portal, webhook, accountDefault } = extras
  const portalIsDefault = portal.is_default || accountDefault?.id === portal.id
  console.log("\nAlso in Stripe live mode:")
  console.log(`  Coupon:         ${coupon.id}`)
  console.log(`  Billing portal: ${portal.id}${portalIsDefault ? " (account default)" : " (not the account default)"}`)
  console.log(`  Webhook:        ${webhook.endpoint.id} -> ${WEBHOOK.url}`)
  console.log(`                  events: ${WEBHOOK.enabled_events.join(", ")}`)
  if (webhook.secretWritten) {
    console.log(`  Signing secret written to ${WEBHOOK_SECRET_FILE} (mode 600, gitignored). It is not shown here.`)
  } else {
    console.log("  The endpoint already existed. Stripe returns its signing secret only at creation, so read it")
    console.log("  from the dashboard: Developers > Webhooks > this endpoint > Signing secret > Reveal.")
  }

  const secretSource = webhook.secretWritten ? `the contents of ${WEBHOOK_SECRET_FILE}` : "the signing secret from the dashboard"
  const steps = [
    "Paste the LIVE_PRICES block above into lib/stripe/prices.js and set FOUNDING_UNTIL to launch day plus 90 days.",
    "In Vercel, for Production only, set STRIPE_SECRET_KEY to the live secret key (sk_live_...).",
    "In Vercel Production, set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to the live publishable key (pk_live_..., Developers > API keys).",
    `In Vercel Production, set STRIPE_WEBHOOK_SECRET to ${secretSource}.`,
    "Then, and only then, set STRIPE_MODE=live in Vercel Production.",
    "Redeploy Production so the new variables and LIVE_PRICES take effect.",
  ]
  if (!portalIsDefault) {
    steps.push(
      "Stripe's API cannot mark a portal configuration as the default, and the app's portal sessions use the account default. " +
        "In the dashboard (Settings > Billing > Customer portal), save the same settings (cancel at period end, invoice history, " +
        "payment method update, email and address updates, headline, privacy and terms links) so the default matches."
    )
  }
  if (webhook.secretWritten) steps.push(`Once the secret is in Vercel, delete ${WEBHOOK_SECRET_FILE}.`)
  console.log("\nStill to do by hand:")
  steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`))
}

main().catch((err) => {
  console.error("Stripe setup failed:", redact(err?.message ?? err))
  process.exit(1)
})
