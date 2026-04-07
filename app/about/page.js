import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              About Data Hygienics
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Enterprise-grade cybersecurity guidance, built for the
              organizations that need it most.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-400">
              Our Mission
            </h2>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Make enterprise-grade cybersecurity guidance accessible to every
              small business, nonprofit, and organization that cannot afford a
              CISO. The same frameworks that protect Fortune 500 companies should
              not be locked behind six-figure retainers. Data Hygienics
              exists to close that gap.
            </p>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-400">
              Why We Built This
            </h2>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Because the reluctant tech leader deserves a fair, unbiased
              resource that is not trying to sell them something. Too many
              cybersecurity platforms gate their guidance behind product
              pitches or assume a full-time security team is reading the
              output.
            </p>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              The reality looks different. It is the CFO who got handed IT
              responsibilities on top of everything else. The office manager
              who became the tech person because they were the first to
              figure out the printer. The law firm partner who does not know
              what MFA stands for but knows the firm needs it. These are the
              people making real security decisions every day, and they
              deserve tools that meet them where they are.
            </p>
          </div>
        </section>

        {/* Who We're Built For */}
        <section className="py-16 px-6 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-400">
              Who We're Built For
            </h2>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Data Hygienics is built for the organizations that fall through
              the cracks of the traditional cybersecurity industry:
            </p>
            <ul className="mt-6 space-y-3 text-zinc-400 text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                Small businesses without a dedicated IT team
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                Medical practices handling sensitive patient data
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                Law firms with strict confidentiality obligations
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                Nonprofits and churches operating on tight budgets
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                The CFOs and office managers holding it all together
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">
              Ready to find out where you stand?
            </h2>
            <p className="mt-3 text-zinc-400 text-lg">
              Get a clear, actionable picture of your security posture in
              minutes. No sales pitch. No strings attached.
            </p>
            <Link
              href="/tools/cyber-audit"
              className="mt-8 inline-block rounded-lg bg-blue-500 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-400 transition-colors"
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
