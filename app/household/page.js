import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import HubPage, { AlreadyHappened } from "@/app/components/hub/HubPage"
import { HUBS, hubMetadata } from "@/lib/hubs"
import { getHubContent } from "@/lib/library"

const hub = HUBS.home

export const metadata = hubMetadata(hub)

export default function HouseholdHubPage() {
  const content = getHubContent(hub.audience, { featuredTools: hub.featuredTools })

  return (
    <>
      <Navbar surface="night" />
      <HubPage hub={hub} content={content}>
        <AlreadyHappened box={hub.alreadyHappened} />
      </HubPage>
      <Footer />
    </>
  )
}
