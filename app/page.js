import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ValueProps from "./components/ValueProps"
import ToolsPreview from "./components/ToolsPreview"
import Footer from "./components/Footer"

export const metadata = {
  title: "Data Hygienics | Cybersecurity Tools for Business Leaders",
  description:
    "Independent cybersecurity assessment, policy templates, and plain-English security guidance for small businesses. No vendor bias. No referral fees. Just clarity.",
}

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <ValueProps />
      <ToolsPreview />
      <Footer />
    </div>
  )
}
