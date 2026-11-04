import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import SchemaScript from "@/app/components/SchemaScript"
import FoldRule from "@/app/components/brand/FoldRule"
import Readout from "@/app/components/brand/Readout"
import EmailCheck from "@/app/components/email-check/EmailCheck"
import { libraryMetadata } from "@/app/components/libraryHelpers"
import { breadcrumbSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import { LINKS } from "@/lib/email-check/explain"

// The free email spoofing check: public, no login, nothing stored. It lives
// outside /tools/* so proxy.js never asks for a session.

const PATH = "/email-check"
const TITLE = "Email Spoofing Check: read your SPF, DKIM and DMARC records | Data Hygienics"
const DESCRIPTION =
  "Free, no login. Type your business email domain and read, in plain English, what your SPF, DMARC and DKIM records tell other mail servers about email sent in your name."

export const metadata = libraryMetadata({ title: TITLE, description: DESCRIPTION, path: PATH })

const RECORDS = [
  {
    name: "SPF",
    body: "A list of the servers allowed to send mail for your domain. Receivers compare it with the server a message actually came from.",
  },
  {
    name: "DKIM",
    body: "A signature your sending service adds to each message, checked against a key you publish in DNS. Each service publishes its key under its own name, called a selector.",
  },
  {
    name: "DMARC",
    body: "Your instruction to receivers for mail that uses your domain in the From line but fails SPF and DKIM: deliver it, send it to spam, or refuse it. It also asks them to send you reports.",
  },
]

const LIMITS = [
  "It reads public DNS records only. It can't see inside your mailbox, your account settings or the messages you send.",
  "It checks the exact domain you type. A lookalike domain, such as one letter changed, needs its own records and isn't covered.",
  "DKIM keys sit under names that each sending service chooses. We try the common ones, and you can type yours, but we can't list every key a domain has.",
  "A record can be correct while a service you use still sends mail that fails the checks. DMARC reports are how you find those.",
]

export default function EmailCheckPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Email Spoofing Check",
      description: DESCRIPTION,
      url: `${SITE.url}${PATH}`,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Business", path: "/business" },
      { name: "Email Spoofing Check", path: PATH },
    ]),
  ]

  return (
    <>
      <SchemaScript schema={schemas} />
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
          <header className="mb-8">
            <FoldRule draw />
            <Readout label className="mt-6">
              Free · No login
            </Readout>
            <h1 className="mt-3 font-display font-semibold text-[2.5rem] sm:text-[3.25rem] text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-balance">
              Email Spoofing Check
            </h1>
            <p className="mt-5 text-[#334155] text-lg sm:text-xl font-semibold leading-snug">
              Can someone send email that looks like it came from your business?
            </p>
            <p className="mt-2 text-[#475569] text-base sm:text-lg leading-relaxed">
              Your domain publishes records that tell other mail servers what to do with mail that claims to be from you.
              Type your domain and we&apos;ll read them to you in plain English, with what to do next.
            </p>
          </header>

          <EmailCheck />

          <section aria-labelledby="what-it-reads" className="mt-16">
            <h2 id="what-it-reads" className="font-display font-semibold text-[1.5rem] text-[#0F172A] tracking-[-0.01em]">
              What the check reads
            </h2>
            <dl className="mt-5 space-y-5">
              {RECORDS.map((record) => (
                <div key={record.name}>
                  <dt className="font-display font-semibold text-[1.0625rem] text-[#0F172A]">{record.name}</dt>
                  <dd className="mt-1 text-[1rem] leading-relaxed text-[#475569]">{record.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="what-it-cant" className="mt-12">
            <h2 id="what-it-cant" className="font-display font-semibold text-[1.5rem] text-[#0F172A] tracking-[-0.01em]">
              What the check can&apos;t see
            </h2>
            <ul className="mt-4 space-y-3 list-disc pl-5 text-[1rem] leading-relaxed text-[#475569]">
              {LIMITS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="what-we-keep" className="mt-12 border border-[#E2E8F0] bg-white p-5 sm:p-7">
            <h2 id="what-we-keep" className="font-display font-semibold text-[1.25rem] text-[#0F172A]">
              What we keep
            </h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-[#475569]">
              Nothing. We don&apos;t store the domain you check or the answer, and you don&apos;t need an account. To
              slow down scripts, the check allows about twenty checks from one network every ten minutes.
            </p>
          </section>

          <section aria-labelledby="go-further" className="mt-12">
            <h2 id="go-further" className="font-display font-semibold text-[1.5rem] text-[#0F172A] tracking-[-0.01em]">
              Go further
            </h2>
            <ul className="mt-4 space-y-3">
              {[LINKS.step, LINKS.control].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
