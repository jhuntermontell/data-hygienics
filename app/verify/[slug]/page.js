import { notFound } from "next/navigation"
import VerifyRecord from "@/app/components/verify/VerifyRecord"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { readPublicRecord, OWN_SLUG, OWN_NAME } from "@/lib/verify/record"
import { BASELINE_VERSION } from "@/lib/verified/baseline"

// The verify page (design/verified/baseline.md section 4): one per Verified
// record whose owner turned it on, indexable, read from the view
// `verified_public` on every request. Our own record at /verify/data-hygienics
// is the first; it renders even before the tables exist, saying so.

export const dynamic = "force-dynamic"

function pageTitle(name) {
  return `${name}: a Verified record | Data Hygienics`
}

function pageDescription(name, checkedAt) {
  const when = checkedAt ? ` Checked evidence as of ${checkedAt}.` : ""
  return `What Data Hygienics checked about ${name}, line by line, across the ${BASELINE_VERSION} baseline, and how each line was proven.${when}`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { record } = await readPublicRecord(slug)
  if (!record && slug !== OWN_SLUG) return { title: "Verified record | Data Hygienics", robots: { index: false } }
  const name = record?.businessName || OWN_NAME
  return libraryMetadata({ title: pageTitle(name), description: pageDescription(name, record?.checkedAt), path: `/verify/${slug}` })
}

export default async function VerifyPage({ params }) {
  const { slug } = await params
  const { status, record } = await readPublicRecord(slug)
  if (!record && slug !== OWN_SLUG) notFound()
  return <VerifyRecord slug={slug} status={status} record={record} />
}
