import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getTagPosts(slug: string) {
  const payload = await getPayload({ config: configPromise })

  // First get the tag ID
  const tag = await payload.find({
    collection: 'tags',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const tagId = tag.docs[0]?.id

  // Then query posts using the tag ID
  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: {
      tags: {
        contains: tagId,
      },
    },
    overrideAccess: false,
  })
}
