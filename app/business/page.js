import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import HubPage from "@/app/components/hub/HubPage"
import BusinessToolsStrip from "@/app/components/BusinessToolsStrip"
import { HUBS, hubMetadata } from "@/lib/hubs"
import { getHubContent } from "@/lib/library"
import { getIndustryBriefs } from "@/lib/threats"

const hub = HUBS.business

export const metadata = hubMetadata(hub)

export default function BusinessHubPage() {
  const content = {
    ...getHubContent(hub.audience, { featuredTools: hub.featuredTools }),
    briefs: getIndustryBriefs(),
  }

  return (
    <>
      <Navbar />
      <HubPage hub={hub} content={content}>
        <BusinessToolsStrip withGauge className="bg-white border-t border-[#E2E8F0]" />
      </HubPage>
      <Footer />
    </>
  )
}
