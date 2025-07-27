/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@vanilla-extract/sprinkles',
    '@vanilla-extract/css',
    '@rainbow-me/rainbowkit'
  ]
};

module.exports = nextConfig;
