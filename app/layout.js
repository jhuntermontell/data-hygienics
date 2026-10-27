import { IBM_Plex_Mono, Inter, Inter_Tight } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import SchemaScript from "./components/SchemaScript"
import { organizationSchema } from "@/lib/schema"
import { SITE } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

// Display face for headlines and the readout face for metadata
// (design/brand-book/personality.md, section 7). Google Fonts only.
const interTight = Inter_Tight({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  variable: "--font-readout-face",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
})

const siteTitle = `${SITE.name} | ${SITE.tagline.replace(/\.$/, "")}`
// The site card from app/opengraph-image.js (lib/og.js). The file-based
// image already wins for og:image; this keeps twitter:image on the same card.
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Data Hygienics: live securely alongside AI" }
const socialDescription =
  "The independent field guide to living and working securely alongside AI, for households and small businesses."

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: siteTitle,
  description: SITE.description,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    siteName: SITE.name,
    title: siteTitle,
    description: socialDescription,
    url: SITE.url,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: socialDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable} ${plexMono.variable} antialiased`}>
        <SchemaScript schema={organizationSchema()} />
        <Providers>{children}</Providers>
        {/* Sends nothing until Web Analytics is switched on in the Vercel dashboard. */}
        <Analytics />
      </body>
    </html>
  )
}
