/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer"],
  // Security headers on every route. X-Frame-Options applies site-wide:
  // nothing frames the site's own pages (policy, audit and IR PDFs download
  // as blobs, no iframe or embed). A content security policy is M2, after
  // an allowlist audit against Stripe and Supabase.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/why-data-hygienics",
        destination: "/how-it-works",
        permanent: true,
      },
      // Retired in the AI-era pivot (2026-10). Vendor scorecards gave way to
      // the Toolkit; the legal industry brief was removed.
      { source: "/vendors", destination: "/toolkit", permanent: true },
      { source: "/vendors/:slug", destination: "/toolkit", permanent: true },
      { source: "/vendor-reviews", destination: "/toolkit", permanent: true },
      { source: "/tools/vendor-scorecard", destination: "/toolkit", permanent: true },
      { source: "/tools/vendor-scorecard/:slug", destination: "/toolkit", permanent: true },
      { source: "/threats/legal", destination: "/threats", permanent: true },
      // Common guesses for the Home hub, which lives at /household so it
      // never competes with the homepage.
      { source: "/home", destination: "/household", permanent: true },
      { source: "/sovereignty", destination: "/digital-sovereignty", permanent: true },
      // One front door (2026-10): the homepage is the Clear Path entrance.
      // Exact matches only, so /path/home, /path/business and /path/save
      // keep working.
      { source: "/start", destination: "/", permanent: true },
      { source: "/path", destination: "/", permanent: true },
    ]
  },
};

export default nextConfig;
