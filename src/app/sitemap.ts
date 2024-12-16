import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post, Project, Topic } from '@/payload-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

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

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add posts
  posts.docs
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
  projects.docs
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
  topics.docs
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
