import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

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
  },
  reactStrictMode: true,
  redirects,
  experimental: {
    reactCompiler: true,
    dynamicIO: true,
    cacheLife: {
      static: {
        stale: 1800, // 30 minutes stale
        revalidate: 3600, // 1 hour revalidate
        expire: 86400, // 24 hours max
      },
      posts: {
        stale: 300, // 5 minutes stale
        revalidate: 600, // 10 minutes revalidate
        expire: 3600, // 1 hour max
      },
      'grid-cards': {
        stale: 600, // 10 minutes stale
        revalidate: 1200, // 20 minutes revalidate
        expire: 3600, // 1 hour max
      },
      'user-session': {
        stale: 60, // 1 minute stale
        revalidate: 300, // 5 minutes revalidate
        expire: 1800, // 30 minutes max
      },
      projects: {
        stale: 3600, // 1 hour stale (projects change less)
        revalidate: 7200, // 2 hours revalidate
        expire: 86400, // 24 hours max
      },
      topics: {
        stale: 1800, // 30 minutes stale
        revalidate: 3600, // 1 hour revalidate
        expire: 43200, // 12 hours max
      },
      authors: {
        stale: 1800, // 30 minutes stale
        revalidate: 3600, // 1 hour revalidate
        expire: 86400, // 24 hours max
      },
      sitemap: {
        stale: 3600, // 1 hour stale
        revalidate: 7200, // 2 hours revalidate
        expire: 86400, // 24 hours max
      },
      search: {
        stale: 600, // 10 minutes stale (search results can change frequently)
        revalidate: 1200, // 20 minutes revalidate
        expire: 3600, // 1 hour max
      },
      rss: {
        stale: 3600, // 1 hour stale
        revalidate: 7200, // 2 hours revalidate
        expire: 86400, // 24 hours max
      },
    },
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

export default withPayload(nextConfig)
