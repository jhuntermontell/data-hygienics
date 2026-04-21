import { Inter } from "next/font/google"
import { Providers } from "./providers"
import SchemaScript from "./components/SchemaScript"
import { organizationSchema } from "@/lib/schema"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  metadataBase: new URL("https://datahygienics.com"),
  title: "Data Hygienics - The Cybersecurity Platform for Small Business",
  description:
    "Data Hygienics gives small businesses and their leaders the same cybersecurity clarity that Fortune 500 companies pay millions for.",
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
    siteName: "Data Hygienics",
    title: "Data Hygienics - The Cybersecurity Platform for Small Business",
    description:
      "Cybersecurity tools for business leaders. The same clarity Fortune 500 companies pay millions for.",
    url: "https://datahygienics.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Data Hygienics Cybersecurity Tools for Business Leaders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Hygienics - The Cybersecurity Platform for Small Business",
    description:
      "Cybersecurity tools for business leaders. The same clarity Fortune 500 companies pay millions for.",
    images: ["/og-image.png"],
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
      <body className={`${inter.variable} antialiased`}>
        <SchemaScript schema={organizationSchema()} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
