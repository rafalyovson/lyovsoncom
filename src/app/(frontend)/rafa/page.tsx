import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthorPosts } from '@/utilities/get-author-posts'
import { GridCardNav } from 'src/components/grid/card/nav'
import { GridCardRafa } from '@/components/grid/card/user'

export default async function Page() {
  'use cache'

  // Add cache tags for Rafa's posts
  cacheTag('posts')
  cacheTag('users')
  cacheTag('author-rafa')
  cacheLife('authors')

  const response = await getAuthorPosts('rafa')

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
      <GridCardRafa />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={docs} />
      </Suspense>
      <div className="container">
        {totalPages > 1 && page && (
          <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto mt-4" />}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        )}
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: `Rafa Lyovson - Posts & Programming | Lyovson.com`,
  description:
    'Posts, articles, and programming insights by Rafa Lyovson. Explore thoughts on technology, software development, and research projects.',
  keywords: [
    'Rafa Lyovson',
    'programming',
    'software development',
    'technology',
    'research',
    'articles',
    'blog posts',
    'coding',
  ],
  alternates: {
    canonical: '/rafa',
  },
  openGraph: {
    title: 'Rafa Lyovson - Posts & Programming',
    description:
      'Posts, articles, and programming insights by Rafa Lyovson on technology, software development, and research.',
    type: 'profile',
    url: '/rafa',
    // Profile information for structured data
    firstName: 'Rafa',
    lastName: 'Lyovson',
    username: 'rafa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafa Lyovson - Posts & Programming',
    description:
      'Posts, articles, and programming insights by Rafa Lyovson on technology and software development.',
    creator: '@lyovson',
    site: '@lyovson',
  },
  other: {
    // Hint for Person structured data
    'profile:first_name': 'Rafa',
    'profile:last_name': 'Lyovson',
    'profile:username': 'rafa',
    'article:author': 'Rafa Lyovson',
  },
}
