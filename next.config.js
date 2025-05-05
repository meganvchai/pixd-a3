/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pixd-a3',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'meganvchai.github.io',
        pathname: '/pixd-a3/**',
      },
    ],
  },
  assetPrefix: '/pixd-a3/',
}

module.exports = nextConfig 