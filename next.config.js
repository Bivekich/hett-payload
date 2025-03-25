/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.hettautomotive.ru',
        pathname: '/api/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
