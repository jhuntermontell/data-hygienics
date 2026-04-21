import { redirect } from "next/navigation"

// This path used to render a "Coming Q3 2026" waitlist page. The vendor
// scorecards are now live at /vendors; redirect any inbound traffic
// (including existing backlinks) there.
export default function VendorReviewsRedirect() {
  redirect("/vendors")
}
