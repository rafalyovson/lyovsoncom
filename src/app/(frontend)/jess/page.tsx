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

export default async function Page() {
  'use cache'

  // Add cache tags for Jess's posts
  cacheTag('posts')
  cacheTag('users')
  cacheTag('author-jess')
  cacheLife('authors')

  const response = await getAuthorPosts('jess')

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
      <GridCardNav />
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
  title: `Jess's Posts | Lyovson.com`,
  description: 'Posts and writings by Jess Lyovson',
  alternates: {
    canonical: '/jess',
  },
}
