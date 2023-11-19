/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sosappfiles.s3.amazonaws.com", "lh3.googleusercontent.com"], // Agrega tu host aquí
    disableStaticImages: true,
  },
};

module.exports = nextConfig;
