/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer"],
  async redirects() {
    return [
      {
        source: "/why-data-hygienics",
        destination: "/how-it-works",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
