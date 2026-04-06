import { notFound } from "next/navigation"
import { CONTROLS } from "@/lib/controls"
import ControlDetailClient from "./ControlDetailClient"

export async function generateStaticParams() {
  return CONTROLS.map((control) => ({
    slug: control.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const control = CONTROLS.find((c) => c.slug === slug)
  if (!control) return {}

  return {
    title: `${control.name} — Security Controls | Data Hygienics`,
    description: `Learn about ${control.name}: what it means, why insurers care, and how to implement it. Mapped to ${control.nistCategory} and CIS Control ${control.cisControl}.`,
  }
}

export default async function ControlDetailPage({ params }) {
  const { slug } = await params
  const control = CONTROLS.find((c) => c.slug === slug)

  if (!control) {
    notFound()
  }

  return <ControlDetailClient control={control} />
}
