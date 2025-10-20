import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
// import withSerwistInit from '@serwist/next'

import redirects from "./redirects.js";

// Webpack optimization regexes
const TAILWIND_REGEX = /[\\/]node_modules[\\/]tailwindcss[\\/]/;
const MOTION_REGEX = /[\\/]node_modules[\\/]motion[\\/]/;

// Image quality presets for Next.js Image Optimization
/* biome-ignore lint/style/noMagicNumbers: Image optimization requires explicit quality breakpoints */
const IMAGE_QUALITIES: number[] = [25, 50, 75, 80, 90, 100];

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", "") as "https" | "http",
        };
      }),
      {
        hostname: "img.youtube.com",
        protocol: "https",
      },
      {
        hostname: "dev.lyovson.com",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
    // Add quality configuration to fix Next.js 16 warnings
    qualities: IMAGE_QUALITIES,
    // Optimize image sizes for 400px grid system
    // Includes 400px (1x), 800px (2x retina), 1200px (3x high-DPI)
    // This ensures Next.js serves appropriately-sized images for our grid cards
    // instead of defaulting to 640px (smallest deviceSize)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 400, 800, 1200],
  },
  reactStrictMode: true,
  redirects,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Removed platform.twitter.com - replaced by react-tweet (no external scripts)
              // Removed *.tenor.com from script-src - replaced by direct video URLs
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com *.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com data:",
              // Added cdn.syndication.twimg.com, pbs.twimg.com, abs.twimg.com for react-tweet
              // Kept media.tenor.com for video sources (GIF optimization)
              "img-src 'self' data: blob: *.vercel-insights.com *.google-analytics.com *.googletagmanager.com pbs.twimg.com abs.twimg.com *.twimg.com media.tenor.com",
              // Kept media.tenor.com for MP4/WebM videos (GIF optimization)
              "media-src 'self' blob: video.twimg.com media.tenor.com",
              // Added cdn.syndication.twimg.com for react-tweet API
              "connect-src 'self' *.vercel-insights.com *.google-analytics.com *.googletagmanager.com cdn.syndication.twimg.com vitals.vercel-insights.com",
              // Removed platform.twitter.com and tenor.com - no longer needed (eliminated iframes)
              "frame-src 'self' www.youtube.com youtube.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  reactCompiler: true,
  experimental: {
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,

    // Enable new caching and pre-rendering behavior
    useCache: true, // will be renamed to cacheComponents in Next.js 16

    // Activate new client-side router improvements
    clientSegmentCache: true,

    // Enable persistent caching for the turbopack dev server and build.
    cacheLife: {
      static: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14_400, // 4 hours revalidate (was 1 hour)
        expire: 86_400, // 24 hours max
      },
      homepage: {
        stale: 1800, // 30 minutes stale
        revalidate: 3600, // 1 hour revalidate
        expire: 7200, // 2 hours max
      },
      posts: {
        stale: 1800, // 30 minutes stale (was 5 minutes)
        revalidate: 3600, // 1 hour revalidate (was 10 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      "grid-cards": {
        stale: 1800, // 30 minutes stale (was 10 minutes)
        revalidate: 3600, // 1 hour revalidate (was 20 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      "user-session": {
        stale: 60, // 1 minute stale
        revalidate: 300, // 5 minutes revalidate
        expire: 1800, // 30 minutes max
      },
      projects: {
        stale: 14_400, // 4 hours stale (was 1 hour)
        revalidate: 28_800, // 8 hours revalidate (was 2 hours)
        expire: 86_400, // 24 hours max
      },
      topics: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14_400, // 4 hours revalidate (was 1 hour)
        expire: 86_400, // 24 hours max (was 12 hours)
      },
      authors: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14_400, // 4 hours revalidate (was 1 hour)
        expire: 86_400, // 24 hours max
      },
      sitemap: {
        stale: 14_400, // 4 hours stale (was 1 hour)
        revalidate: 28_800, // 8 hours revalidate (was 2 hours)
        expire: 172_800, // 48 hours max (was 24 hours)
      },
      search: {
        stale: 1800, // 30 minutes stale (was 10 minutes)
        revalidate: 3600, // 1 hour revalidate (was 20 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      rss: {
        stale: 14_400, // 4 hours stale (was 1 hour)
        revalidate: 28_800, // 8 hours revalidate (was 2 hours)
        expire: 172_800, // 48 hours max (was 24 hours)
      },
      redirects: {
        stale: 14_400, // 4 hours stale
        revalidate: 28_800, // 8 hours revalidate
        expire: 172_800, // 48 hours max
      },
    },
  },
  turbopack: {
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        tailwind: {
          test: TAILWIND_REGEX,
          name: "tailwind",
          chunks: "all",
          priority: 30,
        },
        motion: {
          test: MOTION_REGEX,
          name: "motion",
          chunks: "all",
          priority: 25,
        },
      };
    }
    return config;
  },
};

export default withPayload(nextConfig);
