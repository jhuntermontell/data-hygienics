import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"

export const metadata = {
  title: "Terms of Service | Data Hygienics",
  description: "Terms of Service for the Data Hygienics cybersecurity platform. Written in plain English.",
  alternates: { canonical: "https://datahygienics.com/terms" },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Terms of Service</h1>
        <p className="text-sm text-[#94A3B8] mb-10">Last updated: April 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">1. What Data Hygienics Is</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>An independent cybersecurity assessment and policy platform.</li>
              <li>We provide tools, reports, and educational content.</li>
              <li>We are not a law firm, accounting firm, or licensed security consultant. Our tools do not constitute legal or professional advice.</li>
              <li>Results are informational. You are responsible for your own security decisions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">2. Your Account</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>You must provide accurate information when registering.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>One account per person or organization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">3. Payments and Refunds</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>Subscriptions bill monthly and renew automatically.</li>
              <li>You can cancel at any time through your billing portal.</li>
              <li>We offer a 7-day refund on first-time subscriptions if you are not satisfied. Contact <a href="mailto:support@datahygienics.com" className="text-[#1D4ED8] underline underline-offset-2">support@datahygienics.com</a>.</li>
              <li>One-time purchases are non-refundable after report download.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">4. Acceptable Use</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>Use the platform for legitimate business security purposes.</li>
              <li>Do not attempt to scrape, reverse-engineer, or resell our content.</li>
              <li>Do not submit false information to manipulate assessment results.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">5. Our Content</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>Assessment questions, controls library, and policy templates are proprietary to Data Hygienics.</li>
              <li>Your generated reports and policies belong to you.</li>
              <li>We retain the right to use anonymized, aggregated data to improve the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">6. Limitation of Liability</h2>
            <ul className="space-y-2 text-[#475569] text-sm leading-relaxed">
              <li>Data Hygienics is not liable for security incidents that occur after using our platform.</li>
              <li>Our liability is limited to the amount you paid us in the prior 12 months.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">7. Changes to Terms</h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              We will notify users of material changes by email. Continued use after notice constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0F172A] mb-3">8. Contact</h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              <a href="mailto:support@datahygienics.com" className="text-[#1D4ED8] underline underline-offset-2">support@datahygienics.com</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
