/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false, // ⛔️ disables double effect runs in dev
  experimental: {
    outputFileTracingRoot: undefined, // This ensures all files are included in the standalone build
  },
  // Ensure static files are properly handled
  images: {
    unoptimized: true,
  },
  // Configure asset prefix for static files
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : undefined,
}

module.exports = nextConfig
