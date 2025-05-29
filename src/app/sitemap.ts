import { MetadataRoute } from 'next'
import type { Post, Project, Topic } from '@/payload-types'
import { getSitemapData } from '@/utilities/get-sitemap-data'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  cacheTag('sitemap')
  cacheTag('posts')
  cacheTag('projects')
  cacheTag('topics')
  cacheLife('sitemap') // Use sitemap-specific cache life

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  // Get all cached sitemap data
  const { posts, projects, topics } = await getSitemapData()

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add posts
  posts
    .filter((post): post is Post & { project: Project } =>
      Boolean(
        post?.slug && post?.project && typeof post.project === 'object' && 'slug' in post.project,
      ),
    )
    .forEach((post) => {
      routes.push({
        url: `${SITE_URL}/${post.project.slug}/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'daily',
        priority: 0.8,
      })
    })

  // Add projects
  projects
    .filter((project): project is Project => Boolean(project?.slug))
    .forEach((project) => {
      routes.push({
        url: `${SITE_URL}/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })

  // Add topics
  topics
    .filter((topic): topic is Topic => Boolean(topic?.slug))
    .forEach((topic) => {
      routes.push({
        url: `${SITE_URL}/topics/${topic.slug}`,
        lastModified: new Date(topic.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

  return routes
}
