import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
// import withSerwistInit from '@serwist/next'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'https' | 'http',
        }
      }),
      {
        hostname: 'img.youtube.com',
        protocol: 'https',
      },
      {
        hostname: 'dev.lyovson.com',
        protocol: 'https',
      },
    ],
    // Add quality configuration to fix Next.js 16 warnings
    qualities: [25, 50, 75, 80, 90, 100],
  },
  reactStrictMode: true,
  redirects,
  experimental: {
    reactCompiler: true,

    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,

    // Enable new caching and pre-rendering behavior
    useCache: true, // will be renamed to cacheComponents in Next.js 16

    // Activate new client-side router improvements
    clientSegmentCache: true,

    // Explore route composition and segment overrides via DevTools
    devtoolSegmentExplorer: true,

    // Enable support for `global-not-found`, which allows you to more easily define a global 404 page.
    globalNotFound: true,

    // Enable persistent caching for the turbopack dev server and build.
    turbopackPersistentCaching: true,
    cacheLife: {
      static: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14400, // 4 hours revalidate (was 1 hour)
        expire: 86400, // 24 hours max
      },
      posts: {
        stale: 1800, // 30 minutes stale (was 5 minutes)
        revalidate: 3600, // 1 hour revalidate (was 10 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      'grid-cards': {
        stale: 1800, // 30 minutes stale (was 10 minutes)
        revalidate: 3600, // 1 hour revalidate (was 20 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      'user-session': {
        stale: 60, // 1 minute stale
        revalidate: 300, // 5 minutes revalidate
        expire: 1800, // 30 minutes max
      },
      projects: {
        stale: 14400, // 4 hours stale (was 1 hour)
        revalidate: 28800, // 8 hours revalidate (was 2 hours)
        expire: 86400, // 24 hours max
      },
      topics: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14400, // 4 hours revalidate (was 1 hour)
        expire: 86400, // 24 hours max (was 12 hours)
      },
      authors: {
        stale: 7200, // 2 hours stale (was 30 minutes)
        revalidate: 14400, // 4 hours revalidate (was 1 hour)
        expire: 86400, // 24 hours max
      },
      sitemap: {
        stale: 14400, // 4 hours stale (was 1 hour)
        revalidate: 28800, // 8 hours revalidate (was 2 hours)
        expire: 172800, // 48 hours max (was 24 hours)
      },
      search: {
        stale: 1800, // 30 minutes stale (was 10 minutes)
        revalidate: 3600, // 1 hour revalidate (was 20 minutes)
        expire: 7200, // 2 hours max (was 1 hour)
      },
      rss: {
        stale: 14400, // 4 hours stale (was 1 hour)
        revalidate: 28800, // 8 hours revalidate (was 2 hours)
        expire: 172800, // 48 hours max (was 24 hours)
      },
    },
  },
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        tailwind: {
          test: /[\\/]node_modules[\\/]tailwindcss[\\/]/,
          name: 'tailwind',
          chunks: 'all',
          priority: 30,
        },
        motion: {
          test: /[\\/]node_modules[\\/]motion[\\/]/,
          name: 'motion',
          chunks: 'all',
          priority: 25,
        },
      }
    }
    return config
  },
}

// Temporarily disabled Serwist due to compatibility issues with Next.js 15 canary
// const withSerwist = withSerwistInit({
//   swSrc: 'src/app/sw.ts',
//   swDest: 'public/sw.js',
//   cacheOnNavigation: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV === 'development',
// })

export default withPayload(nextConfig)
