import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['pdf-lib'],
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
};

export default withSerwist(nextConfig);