import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function getAuthorPosts(username: string) {
  'use cache'
  cacheTag('posts')
  cacheTag('users')
  cacheTag(`author-${username}`)
  cacheLife('posts')

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
    sort: 'createdAt:desc',
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
    sort: 'createdAt:desc',
  })
}
