import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[#0F172A]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              About Data Hygienics
            </h1>
            <p className="mt-4 text-lg text-[#475569]">
              Enterprise-grade cybersecurity guidance, built for the
              organizations that need it most.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#1D4ED8]">
              Our Mission
            </h2>
            <p className="mt-4 text-[#475569] text-lg leading-relaxed">
              We believe every business deserves to understand their cybersecurity
              posture, not because it is required, but because that knowledge is power.
              Data Hygienics exists to make that possible for every organization,
              regardless of size or budget.
            </p>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-16 px-6 border-t border-[#E2E8F0] bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#1D4ED8]">
              Why We Built This
            </h2>
            <p className="mt-4 text-[#475569] text-lg leading-relaxed">
              Because every business leader making security decisions deserves
              a resource that is honest, unbiased, and built to empower.
              Too many cybersecurity platforms gate their guidance behind product
              pitches or assume a full-time security team is reading the
              output.
            </p>
            <p className="mt-4 text-[#475569] text-lg leading-relaxed">
              In reality, security decisions are made by CFOs, office managers,
              firm partners, and operations leads. These are capable professionals
              who simply need the right information presented clearly. They
              deserve tools built for the way they actually work.
            </p>
          </div>
        </section>

        {/* Who We're Built For */}
        <section className="py-16 px-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#1D4ED8]">
              Who We're Built For
            </h2>
            <p className="mt-4 text-[#475569] text-lg leading-relaxed">
              Data Hygienics is built for the organizations that fall through
              the cracks of the traditional cybersecurity industry:
            </p>
            <ul className="mt-6 space-y-3 text-[#475569] text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#1D4ED8]" />
                Small businesses without a dedicated IT team
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#1D4ED8]" />
                Medical practices handling sensitive patient data
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#1D4ED8]" />
                Law firms with strict confidentiality obligations
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#1D4ED8]" />
                Nonprofits and churches operating on tight budgets
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#1D4ED8]" />
                The CFOs and office managers holding it all together
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-[#E2E8F0] bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Ready to find out where you stand?
            </h2>
            <p className="mt-3 text-[#475569] text-lg">
              Get a clear, actionable picture of your security posture in
              minutes. No sales pitch. No strings attached.
            </p>
            <Link
              href="/tools/cyber-audit"
              className="mt-8 inline-block rounded-lg bg-[#1D4ED8] px-8 py-3 text-lg font-semibold text-white hover:bg-[#1E40AF] transition-colors"
            >
              Start Your Free Assessment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
