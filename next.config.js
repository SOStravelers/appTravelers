/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sosappfiles.s3.amazonaws.com", "lh3.googleusercontent.com"], // Agrega tu host aquí
    unoptimized: true,
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  },
};

module.exports = nextConfig;
