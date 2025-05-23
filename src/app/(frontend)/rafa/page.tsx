import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthorPosts } from '@/utilities/get-author-posts'
import { GridCardNav } from 'src/components/grid/card/nav'

export const experimental_ppr = true
export const revalidate = 600

export default async function Page() {
  const response = await getAuthorPosts('rafa')

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
  title: `Rafa's Posts | Lyovson.com`,
  description: 'Official website of Rafa and Jess Lyovsons',
}
