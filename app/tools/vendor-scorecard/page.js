import { redirect } from "next/navigation"

// Redirect /tools/vendor-scorecard to /vendors
export default function VendorScorecardRedirect() {
  redirect("/vendors")
}
