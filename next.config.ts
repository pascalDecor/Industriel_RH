import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
        search: ""
      },
      {
        protocol: "https",
        hostname: "industriel-rh.vercel.app",
        // port: "443", // if you're using self-signed certificates
        pathname: "/**",
        search: ""
      },
      {
        protocol: "https",
        hostname: "fstfsffzkgjggvtdhvwu.supabase.co",
        // port: "443", // if you're using self-signed certificates
        pathname: "/**",
        search: ""
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
