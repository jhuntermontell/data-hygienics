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
  icons: {
    icon: "/logo-mark.svg",
    shortcut: "/logo-mark.svg",
    apple: "/logo-mark.svg",
  },
  openGraph: {
    siteName: "Data Hygienics",
    type: "website",
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
