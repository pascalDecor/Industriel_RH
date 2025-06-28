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
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
