import { redirect } from "next/navigation"

// TODO: The /why-data-hygienics URL was referenced in an early draft of the
// marketing copy and indexed by search engines before the content page was
// ever built. Rather than serve a 404, we redirect to /about which covers
// the same positioning material. If a dedicated "why us" page is ever
// written, replace this file with the real content and drop the redirect.
export default function WhyDataHygienicsPage() {
  redirect("/about")
}
