import { BeforeSync } from '@payloadcms/plugin-search/types'
import type { Post } from '@/payload-types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const post = originalDoc as Post

  return {
    ...searchDoc,
    // Let the search plugin handle the doc relationship automatically
    // Add searchable fields directly to the search doc
    title: post.title,
    image: typeof post.featuredImage === 'object' ? post.featuredImage?.id : post.featuredImage,
    description: post.description,
    slug: post.slug,
  }
}
