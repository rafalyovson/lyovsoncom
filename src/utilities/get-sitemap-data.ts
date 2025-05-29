import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getSitemapData() {
  'use cache'
  cacheTag('sitemap')
  cacheTag('posts')
  cacheTag('projects')
  cacheTag('topics')
  cacheLife('static') // Sitemap changes less frequently

  const payload = await getPayload({ config: configPromise })

  // Fetch all content with specific fields to optimize query
  const [posts, projects, topics] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      depth: 1,
      select: {
        slug: true,
        updatedAt: true,
        project: true,
      },
    }),
    payload.find({
      collection: 'projects',
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: 'topics',
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ])

  return {
    posts: posts.docs,
    projects: projects.docs,
    topics: topics.docs,
  }
}
