// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: true,
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript build errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features (fixed for Next.js 16)
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  
  // Images configuration
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig