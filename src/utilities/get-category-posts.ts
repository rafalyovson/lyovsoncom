import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getCategoryPosts(slug: string) {
  const payload = await getPayload({ config: configPromise })

  // First get the category ID
  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const categoryId = category.docs[0]?.id

  // Then query posts using the category ID
  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: {
      categories: {
        contains: categoryId,
      },
    },
    overrideAccess: false,
  })
}
