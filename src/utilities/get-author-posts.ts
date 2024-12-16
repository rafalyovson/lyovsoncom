import { getPayload } from 'payload'
import type { Payload } from 'payload'
import configPromise from '@payload-config'

export async function getAuthorPosts(username: string) {
  const payload = await getPayload({ config: configPromise })

  // First get the user ID
  const user = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
  })

  if (!user || !user.docs || !user.docs[0]) {
    return null
  }

  const authorId = user.docs[0]?.id

  // Then query posts using the author ID
  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: {
      authors: {
        contains: authorId,
      },
    },
    overrideAccess: false,
  })
}
