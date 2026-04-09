import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"

export const metadata = {
  title: "Privacy Policy | Data Hygienics",
  description: "How Data Hygienics collects, uses, and protects your data. Written in plain English.",
  alternates: { canonical: "https://datahygienics.com/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#94A3B8] mb-10">Last updated: April 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">1. What We Collect</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li><strong>Account information:</strong> Name, email, and company name when you register.</li>
              <li><strong>Assessment data:</strong> Your answers to cybersecurity assessment questions.</li>
              <li><strong>Payment information:</strong> Processed by Stripe. We never see or store your card number.</li>
              <li><strong>Usage data:</strong> Pages visited, features used. No third-party ad trackers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">2. How We Use It</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>To provide and improve the platform.</li>
              <li>To generate your assessment score and reports.</li>
              <li>To send you your industry news feed if you subscribe.</li>
            </ul>
            <p className="text-[#475569] text-sm leading-relaxed mt-3 font-medium">
              We do not sell your data. We do not share it with advertisers. We do not use it to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">3. Who Sees It</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li><strong>Supabase</strong> (our database provider) stores your data on encrypted servers in the United States.</li>
              <li><strong>Stripe</strong> (our payment processor) handles payment data under PCI DSS Level 1 certification.</li>
            </ul>
            <p className="text-[#475569] text-sm leading-relaxed mt-3">
              We do not share your data with any other third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">4. Your Rights</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>You can request a copy of your data at any time.</li>
              <li>You can request deletion of your account and all associated data.</li>
              <li>Email: <a href="mailto:privacy@datahygienics.com" className="text-[#1D4ED8] underline underline-offset-2">privacy@datahygienics.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">5. Cookies</h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              We use essential cookies only: session authentication. No advertising cookies, no tracking pixels, no analytics that follow you across the web.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">6. Changes</h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              We will notify registered users by email of material changes. Continued use after notice constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">7. Contact</h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              <a href="mailto:privacy@datahygienics.com" className="text-[#1D4ED8] underline underline-offset-2">privacy@datahygienics.com</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
