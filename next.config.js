/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sosappfiles.s3.amazonaws.com"], // Agrega tu host aquí
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
