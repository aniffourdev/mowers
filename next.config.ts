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
    domains: ['gvr.ltm.temporary.site', 'www.gvr.ltm.temporary.site'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  compress: true,
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module: any) {
                const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                if (!match) return 'vendor';
                
                const packageName = match[1].replace('@', '');
                return `vendor.${packageName}`;
              },
              priority: 20,
            },
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
              priority: 20,
            },
          },
        },
        usedExports: true,
        concatenateModules: true,
      };
    }
    return config;
  },
};

export default withPlaiceholder(nextConfig);
