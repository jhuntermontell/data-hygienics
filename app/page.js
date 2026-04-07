import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ValueProps from "./components/ValueProps"
import ToolsPreview from "./components/ToolsPreview"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <ValueProps />
      <ToolsPreview />
      <Footer />
    </div>
  )
}
