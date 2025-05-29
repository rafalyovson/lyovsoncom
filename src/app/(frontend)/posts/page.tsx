import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getLatestPosts } from '@/utilities/get-post'

export default async function Page() {
  'use cache'

  // Add cache tags for posts page
  cacheTag('posts')
  cacheTag('posts-page')
  cacheLife('posts')

  const response = await getLatestPosts(12)

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
  title: `Posts | Lyovson.com`,
  description: 'All posts and articles from Lyovson.com',
  alternates: {
    canonical: '/posts',
  },
}
