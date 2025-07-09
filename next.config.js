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

  // 👇 Esto fuerza a Next a mirar correctamente tus archivos de páginas
  pageExtensions: ["js", "jsx"],
};
module.exports = nextConfig;
