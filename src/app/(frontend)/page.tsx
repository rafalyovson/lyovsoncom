import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getLatestPosts } from '@/utilities/get-post'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheTag('homepage')
  cacheTag('posts')
  cacheLife('posts')

  const posts = await getLatestPosts(12)

  return (
    <>
      <GridCardNav />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts.docs} />
      </Suspense>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto mt-4" />}>
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          </Suspense>
        )}
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lyovson.com',
    description: 'Official website of Rafa and Jess Lyovsons',
  }
}
