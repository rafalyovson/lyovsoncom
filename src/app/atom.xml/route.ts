import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { Feed } from 'feed'

export async function GET(request: NextRequest) {
  'use cache'
  cacheTag('rss')
  cacheTag('posts')
  cacheLife('rss')

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    const posts = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      limit: 50,
      sort: '-publishedAt',
      depth: 2,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        updatedAt: true,
        meta: true,
        populatedAuthors: true,
        project: true,
        content: true,
      },
    })

    const feed = new Feed({
      title: 'Lyovson.com - Writing, Projects & Research',
      description:
        'Latest posts and articles from Rafa and Jess Lyovson covering programming, design, philosophy, and technology.',
      id: SITE_URL,
      link: SITE_URL,
      language: 'en-US',
      image: `${SITE_URL}/og-image.png`,
      favicon: `${SITE_URL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Lyovson.com`,
      updated: new Date(),
      generator: 'Next.js Atom Feed for Lyovson.com',
      feedLinks: {
        rss2: `${SITE_URL}/feed.xml`,
        json: `${SITE_URL}/feed.json`,
        atom: `${SITE_URL}/atom.xml`,
      },
      author: {
        name: 'Rafa & Jess Lyovson',
        email: 'hello@lyovson.com',
        link: SITE_URL,
      },
    })

    // Add posts to feed (same logic as RSS)
    posts.docs
      .filter((post) => {
        return (
          post.slug &&
          post.project &&
          typeof post.project === 'object' &&
          'slug' in post.project &&
          post.project.slug
        )
      })
      .forEach((post) => {
        const title = post.meta?.title || post.title
        const description = post.meta?.description || ''
        const projectSlug = (post.project as any)?.slug || ''
        const link = `${SITE_URL}/${projectSlug}/${post.slug}`
        const author = post.populatedAuthors?.[0]?.name || 'Lyovson Team'

        let contentText = description
        if (!contentText && post.content) {
          const textContent = extractTextFromContent(post.content)
          contentText = textContent.substring(0, 300) + (textContent.length > 300 ? '...' : '')
        }

        feed.addItem({
          title,
          id: link,
          link,
          description: contentText,
          content: contentText,
          author: [
            {
              name: author,
              email: 'hello@lyovson.com',
              link: `${SITE_URL}/${author.toLowerCase().replace(' ', '')}`,
            },
          ],
          date: new Date(post.publishedAt || post.updatedAt),
          category: [
            {
              name: projectSlug,
              domain: `${SITE_URL}/projects`,
            },
          ],
        })
      })

    return new Response(feed.atom1(), {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating Atom feed:', error)

    const fallbackAtom = `<?xml version="1.0" encoding="UTF-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Lyovson.com</title>
  <link href="${SITE_URL}" />
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <id>${SITE_URL}</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Rafa &amp; Jess Lyovson</name>
  </author>
  <entry>
    <title>Feed Temporarily Unavailable</title>
    <link href="${SITE_URL}" />
    <id>${SITE_URL}/feed-error-${Date.now()}</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>The Atom feed is temporarily unavailable. Please visit the website directly.</summary>
  </entry>
</feed>`

    return new Response(fallbackAtom, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  }
}

function extractTextFromContent(content: any): string {
  if (!content) return ''

  if (typeof content === 'string') return content

  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join(' ')
  }

  if (typeof content === 'object') {
    if (content.text) return content.text
    if (content.children) return extractTextFromContent(content.children)
    if (content.content) return extractTextFromContent(content.content)
  }

  return ''
}
