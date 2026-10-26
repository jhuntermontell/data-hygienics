// Create the membership catalog in Stripe TEST mode, once.
//
//   node scripts/stripe-setup-test.mjs
//
// Reads STRIPE_SECRET_KEY from .env.local (falls back to the environment) and
// refuses to run unless it is a test key (sk_test_). Idempotent: products are
// found by metadata.dh_key and prices by lookup_key, and only what is missing
// is created, so a second run creates nothing and prints the same IDs.
//
// Prints a ready-to-paste block for PRICES in lib/stripe/prices.js. Ongoing
// Protection (retired from sale) and the legacy test products are never
// created or touched here. Stripe prices are immutable, so an existing price
// whose amount or interval differs from the table below is reported, not
// changed: archive it in the dashboard and re-run.
//
// Plan: design/strategy/membership-implementation.md, section 3.

import { readFileSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import Stripe from "stripe"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

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
const key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || ""

if (!key.startsWith("sk_test_")) {
  console.error(
    "Refusing to run: STRIPE_SECRET_KEY (from .env.local) is missing or is not a test key (sk_test_...).\n" +
      "This script only ever creates the test-mode catalog."
  )
  process.exit(1)
}

const stripe = new Stripe(key)

// ---------- The catalog ----------
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

// Order of the printed PRICES block.
const SLOT_ORDER = [
  ["docsPack", "$299 one-time"],
  ["memberHomeMonthly", "$8/month"],
  ["memberHomeYearly", "$69/year"],
  ["foundingHomeYearly", "$59/year, founding rate (sold until FOUNDING_UNTIL)"],
  ["memberBusinessMonthly", "$39/month"],
  ["memberBusinessYearly", "$390/year"],
  ["foundingBusinessYearly", "$349/year, founding rate (sold until FOUNDING_UNTIL)"],
]

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

async function main() {
  const lookupKeys = PRODUCTS.flatMap((p) => p.prices.map((x) => x.lookupKey))
  const [existingProducts, existingPrices] = await Promise.all([findProducts(), findPrices(lookupKeys)])

  const ids = {}
  for (const spec of PRODUCTS) {
    const product = await ensureProduct(spec, existingProducts)
    for (const priceSpec of spec.prices) {
      const price = await ensurePrice(priceSpec, product, existingPrices)
      ids[priceSpec.slot] = price.id
    }
  }

  console.log(created.length ? `Created ${created.length}:\n  ${created.join("\n  ")}` : "Nothing to create: the catalog already exists.")
  if (warnings.length) console.log(`\nCheck these:\n  ${warnings.join("\n  ")}`)

  const width = Math.max(...SLOT_ORDER.map(([slot]) => slot.length))
  console.log("\nPaste into PRICES in lib/stripe/prices.js (keep protectionMonthly and protectionYearly):\n")
  for (const [slot, note] of SLOT_ORDER) {
    console.log(`  ${(slot + ":").padEnd(width + 1)} '${ids[slot]}', // ${note}`)
  }
}

main().catch((err) => {
  console.error("Stripe setup failed:", err.message)
  process.exit(1)
})
