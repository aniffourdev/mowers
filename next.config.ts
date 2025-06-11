import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "themes.pixelwars.org",
      },
      {
        protocol: "https",
        hostname: "www.gvr.ltm.temporary.site",
      },
      {
        protocol: "https",
        hostname: "gvr.ltm.temporary.site",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: "/_next/image",
    loader: "default",
  },
  experimental: {
    turbo: {
      rules: {
        // Configure your Turbopack rules here
      },
    },
  },
};

export default withPlaiceholder(nextConfig);
