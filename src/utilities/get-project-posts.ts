import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getProjectPosts(slug: string) {
  'use cache'
  cacheTag('posts')
  cacheTag('projects')
  cacheTag(`project-${slug}`)
  cacheLife('posts')

  const payload = await getPayload({ config: configPromise })

  const project = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    sort: 'createdAt:desc',
  })

  if (!project || !project.docs || !project.docs[0]) {
    return null
  }

  const projectId = project.docs[0].id

  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: {
      project: {
        equals: projectId,
      },
    },
    overrideAccess: false,
    sort: 'createdAt:desc',
  })
}

export async function getPaginatedProjectPosts(
  slug: string,
  pageNumber: number,
  limit: number = 12,
) {
  'use cache'
  cacheTag('posts')
  cacheTag('projects')
  cacheTag(`project-${slug}`)
  cacheTag(`project-${slug}-page-${pageNumber}`)
  cacheLife('posts')

  const payload = await getPayload({ config: configPromise })

  const project = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!project || !project.docs || !project.docs[0]) {
    return null
  }

  const projectId = project.docs[0].id

  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    page: pageNumber,
    where: {
      project: {
        equals: projectId,
      },
    },
    overrideAccess: false,
    sort: 'createdAt:desc',
  })
}
