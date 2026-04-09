import { redirect } from "next/navigation"
import { VENDORS } from "@/lib/vendors"

export async function generateStaticParams() {
  return VENDORS.map((v) => ({ slug: v.slug }))
}

// Redirect /tools/vendor-scorecard/[slug] to /vendors/[slug]
export default async function VendorScorecardSlugRedirect({ params }) {
  const { slug } = await params
  redirect(`/vendors/${slug}`)
}
