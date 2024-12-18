import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getProject(slug: string) {
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
