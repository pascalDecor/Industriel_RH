import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.5.178:3000",
    "http://industriellerh.com"
  ],
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
        protocol: "http",
        hostname: "127.0.0.1",
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
        hostname: "industriellerh.com",
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
      },
      {
        protocol: "https",
        hostname: "google.com",
        // port: "443", // if you're using self-signed certificates
        pathname: "/**",
        search: ""
      }
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    // optimizeCss: true,
    // optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons'],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  },
  reactStrictMode: true,
  // eslint: {
  //   // ignoreDuringBuilds: true
  // },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
};

export default nextConfig;
