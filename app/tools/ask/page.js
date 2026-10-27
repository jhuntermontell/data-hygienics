import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import AskChat from "@/app/components/assistant/AskChat"

export const metadata = {
  title: "Ask Data Hygienics | Data Hygienics",
  description:
    "Answers for members from our published research on securing your home and small business, with a link to every page an answer draws on.",
  alternates: { canonical: "https://datahygienics.com/tools/ask" },
  robots: { index: false, follow: false },
}

export default function AskPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
        <header className="mb-8">
          <p className="readout-label text-[#1D4ED8] mb-3">For members</p>
          <h1 className="font-display font-semibold text-[2.5rem] md:text-[3.5rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance mb-4">
            Ask Data Hygienics
          </h1>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed">
            Questions about keeping your home or small business secure, answered from our own research. Every answer
            links to the page it came from, and when our research doesn&apos;t cover something, it says we don&apos;t
            know yet.
          </p>
        </header>
        <AskChat />
      </main>
      <Footer />
    </div>
  )
}
