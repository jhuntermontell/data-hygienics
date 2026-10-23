import { Suspense } from "react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SavePath from "@/app/components/path/SavePath"
import { SITE } from "@/lib/site"

export const metadata = {
  title: "Save Your Path | Data Hygienics",
  description: "Save your Clear Path with just your email. We send you a sign-in link, so there's no password to make up.",
  alternates: { canonical: `${SITE.url}/path/save` },
  robots: { index: false, follow: false },
}

// Shell for the passwordless save; the form reads ?for=home|business and the
// device's saved path in the browser.
export default function SavePathPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
          <Suspense fallback={null}>
            <SavePath />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
