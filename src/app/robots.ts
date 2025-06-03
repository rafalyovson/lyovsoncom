import { MetadataRoute } from 'next'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export default async function robots(): Promise<MetadataRoute.Robots> {
  'use cache'
  cacheTag('robots')
  cacheLife('static') // Robots.txt changes very rarely

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/next/*',
          '*.json',
          '/private/*',
          '/temp/*',
          '/drafts/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      // AI and research bots - explicitly welcome with full access
      {
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'CCBot',
          'ChatGPT-User',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'YouBot',
          'Applebot-Extended',
        ],
        allow: ['/', '/api/docs', '/api/graphql', '/feed.xml', '/feed.json', '/atom.xml'],
        disallow: ['/admin/*', '/private/*', '/temp/*', '/drafts/*'],
      },
      // Social media crawlers
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'],
        allow: ['/', '/api/media/*'],
        crawlDelay: 2,
      },
      // Research and academic crawlers
      {
        userAgent: ['archive.org_bot', 'ia_archiver', 'Wayback'],
        allow: '/',
        crawlDelay: 10,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
