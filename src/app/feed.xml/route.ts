import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function GET(request: NextRequest) {
  'use cache'
  cacheTag('rss')
  cacheTag('posts')
  cacheLife('rss') // RSS changes when posts change

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    const posts = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      limit: 50, // Latest 50 posts
      sort: '-publishedAt',
      depth: 2,
      select: {
        title: true,
        slug: true,
        meta: true,
        publishedAt: true,
        updatedAt: true,
        content: true,
        project: true,
        populatedAuthors: true,
      },
    })

    const rssItems = posts.docs
      .filter((post) => {
        return (
          post.slug &&
          post.project &&
          typeof post.project === 'object' &&
          'slug' in post.project &&
          post.project.slug
        )
      })
      .map((post) => {
        const title = post.meta?.title || post.title
        const description = post.meta?.description || ''
        const projectSlug = (post.project as any)?.slug || ''
        const link = `${SITE_URL}/${projectSlug}/${post.slug}`
        const pubDate = new Date(post.publishedAt || post.updatedAt).toUTCString()
        const author = post.populatedAuthors?.[0]?.name || 'Lyovson Team'

        // Create clean content excerpt for RSS
        let contentText = description
        if (!contentText && post.content) {
          try {
            const contentStr =
              typeof post.content === 'string' ? post.content : JSON.stringify(post.content)
            contentText = contentStr.replace(/<[^>]*>/g, '').substring(0, 300) + '...'
          } catch {
            contentText = 'Read more on Lyovson.com'
          }
        }

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${contentText}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@lyovson.com (${author})</author>
      <category><![CDATA[${projectSlug}]]></category>
    </item>`
      })
      .join('')

    const buildDate = new Date().toUTCString()

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[Lyovson.com - Writing, Projects & Research]]></title>
    <description><![CDATA[Latest posts and articles from Rafa and Jess Lyovson covering programming, design, philosophy, and technology.]]></description>
    <link>${SITE_URL}</link>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>1440</ttl>
    <managingEditor>noreply@lyovson.com (Lyovson Team)</managingEditor>
    <webMaster>noreply@lyovson.com (Lyovson Team)</webMaster>
    <image>
      <url>${SITE_URL}/logo-black.png</url>
      <title>Lyovson.com</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>© ${new Date().getFullYear()} Lyovson.com. All rights reserved.</copyright>
    <generator>Next.js 15 + Payload CMS 3</generator>${rssItems}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // 1 hour cache, 24 hour stale
      },
    })
  } catch (error) {
    console.error('RSS Feed Error:', error)
    return new Response('RSS Feed temporarily unavailable', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
