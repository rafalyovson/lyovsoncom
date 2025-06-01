import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getPaginatedPosts, getPostCount } from '@/utilities/get-post'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  'use cache'

  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  // Add cache tags for this specific posts page
  cacheTag('posts')
  cacheTag(`posts-page-${pageNumber}`)
  cacheLife('posts')

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const response = await getPaginatedPosts(sanitizedPageNumber, 12)

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  'use cache'

  const { pageNumber } = await paramsPromise

  // Add cache tags for metadata
  cacheTag('posts')
  cacheLife('static')

  return {
    title: `Posts Page ${pageNumber || ''} | Lyovson.com`,
    description: `Posts and articles from Lyovson.com - Page ${pageNumber}`,
    alternates: {
      canonical: `/posts/page/${pageNumber}`,
    },
  }
}

export async function generateStaticParams() {
  'use cache'
  cacheTag('posts')
  cacheLife('static') // Build-time data doesn't change often

  const { totalDocs } = await getPostCount()
  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
