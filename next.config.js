// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["sosappfiles.s3.amazonaws.com", "lh3.googleusercontent.com"],
    unoptimized: true,
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  },
  eslint: { ignoreDuringBuilds: true },
  pageExtensions: ["js", "jsx"],

  // 👇 Desactiva la caché para todo el sitio
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, max-age=0, must-revalidate",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
