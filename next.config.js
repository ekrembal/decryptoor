/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vanilla-extract/sprinkles', '@vanilla-extract/css', '@rainbow-me/rainbowkit'],
  // Optimize for client-side rendering
  experimental: {
    // Disable server components by default
    serverComponents: false,
  },
  // Ensure all pages are static
  output: 'export',
  // No server-side API routes needed
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
