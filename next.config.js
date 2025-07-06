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

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://vercel.live https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://accounts.google.com https://js.stripe.com;
              img-src 'self' data: https://lh3.googleusercontent.com;
              frame-src https://accounts.google.com https://js.stripe.com https://hooks.stripe.com;
              connect-src 'self' http://localhost:9000 https://accounts.google.com https://oauth2.googleapis.com https://www.google-analytics.com https://vercel.live https://api.stripe.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
