import PricingPage from "./PricingPage"
import { MEMBERSHIP } from "@/lib/content/membership"
import { SITE } from "@/lib/site"

// Server wrapper so the pricing page can carry its own metadata; the page
// itself is a client component (checkout, promo codes, the join sheet).
const title = `${MEMBERSHIP.name} | ${SITE.name}`
const description = `${MEMBERSHIP.subhead} Home from $${MEMBERSHIP.prices.home.monthly} a month, business from $${MEMBERSHIP.prices.business.monthly}. Cancel any time.`

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/pricing` },
  openGraph: { title, description, url: `${SITE.url}/pricing` },
}

export default function Page() {
  return <PricingPage />
}
