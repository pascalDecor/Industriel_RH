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
    ]
  },
  experimental: {
    optimizeCss: true
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
