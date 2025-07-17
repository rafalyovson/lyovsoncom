import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path =
      doc.project && typeof doc.project === 'object'
        ? `/${doc.project.slug}/${doc.slug}`
        : `/posts/${doc.slug}`

    payload.logger.info(`Revalidating post at path: ${path}`)

    // Revalidate the specific post path
    revalidatePath(path)

    // Revalidate post-related cache tags
    revalidateTag('posts')
    revalidateTag(`post-${doc.slug}`)
    revalidateTag('homepage') // Homepage shows latest posts
    revalidateTag('sitemap')
    revalidateTag('rss') // Explicitly invalidate RSS feeds for immediate SEO indexing

    // Log cache invalidation for monitoring
    payload.logger.info(
      `✅ Cache invalidated for new post: "${doc.title}" - RSS feeds, sitemap, and homepage updated immediately`,
    )

    // If post belongs to a project, invalidate project cache
    if (doc.project && typeof doc.project === 'object') {
      revalidateTag(`project-${doc.project.slug}`)
    }
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath =
      previousDoc.project && typeof previousDoc.project === 'object'
        ? `/${previousDoc.project.slug}/${previousDoc.slug}`
        : `/posts/${previousDoc.slug}`

    payload.logger.info(`Revalidating old post at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag('posts')
    revalidateTag(`post-${previousDoc.slug}`)
    revalidateTag('homepage')
    revalidateTag('sitemap')
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc }) => {
  const path =
    doc?.project && typeof doc.project === 'object'
      ? `/${doc.project.slug}/${doc.slug}`
      : `/posts/${doc?.slug}`

  revalidatePath(path)
  revalidateTag('posts')
  revalidateTag(`post-${doc?.slug}`)
  revalidateTag('homepage') // Homepage shows latest posts
  revalidateTag('sitemap')

  // If post belonged to a project, invalidate project cache
  if (doc?.project && typeof doc.project === 'object') {
    revalidateTag(`project-${doc.project.slug}`)
  }

  return doc
}
