import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: 'anonymous',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:3000/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
