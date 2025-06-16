/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false, // ⛔️ disables double effect runs in dev
}

module.exports = nextConfig
