import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Topic } from '@/payload-types'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getTopic(slug: string): Promise<Topic | null> {
  'use cache'
  cacheTag('topics')
  cacheTag(`topic-${slug}`)
  cacheLife('topics')

  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
    collection: 'topics',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return response.docs[0] || null
}

export async function getAllTopics() {
  'use cache'
  cacheTag('topics')
  cacheLife('topics')

  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'topics',
    limit: 1000,
    sort: 'name:asc',
  })
}
