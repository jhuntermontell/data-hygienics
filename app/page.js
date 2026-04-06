import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import WhatIDo from "./components/WhatIDo"
import ToolsPreview from "./components/ToolsPreview"
import Portfolio from "./components/Portfolio"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <WhatIDo />
      <ToolsPreview />
      <Portfolio />
      <ContactSection />
      <Footer />
    </div>
  )
}
