import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getProjects() {
  'use cache'
  cacheTag('projects')
  cacheLife('projects')

  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: 'createdAt:desc',
  })

  if (!projects || !projects.docs || !projects.docs[0]) {
    return null
  }

  return projects.docs
}
