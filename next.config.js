/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["sosappfiles.s3.amazonaws.com", "lh3.googleusercontent.com"], // Agrega tu host aquí
    unoptimized: true,
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  },
  // eslint: { ignoreDuringBuilds: true },
};
//comentario

module.exports = nextConfig;
