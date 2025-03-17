import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.ouest-france.fr',
        port: '',
        pathname: '/v1/pictures/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
