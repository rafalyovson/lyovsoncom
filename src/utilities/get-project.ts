import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getProject(slug: string) {
  'use cache'
  cacheTag('projects')
  cacheTag(`project-${slug}`)
  cacheLife('static') // Projects change less frequently

  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return response.docs[0] || null
}

export async function getCachedProjectBySlug(slug: string) {
  'use cache'
  cacheTag('projects')
  cacheTag(`project-${slug}`)
  cacheLife('static') // Projects change less frequently

  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return response.docs[0] || null
}
