/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ⭐ CRITICAL
  },
  eslint: {
    ignoreDuringBuilds: true,  // ⭐ CRITICAL
  },
}

module.exports = nextConfig