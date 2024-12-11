import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getProjectPosts(slug: string) {
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

  const projectId = project.docs[0]?.id

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
  })
}
