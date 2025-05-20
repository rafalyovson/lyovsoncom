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
}

export default withPayload(nextConfig)
