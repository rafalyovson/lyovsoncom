import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getTopicPosts } from '@/utilities/get-topic-posts'

export const experimental_ppr = true
export const dynamicParams = true
export const revalidate = 600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const topicsResponse = await payload.find({
    collection: 'topics',
    limit: 1000,
  })

  if (!topicsResponse) {
    return []
  }

  const { docs } = topicsResponse

  return docs.map(({ slug }) => ({
    slug,
  }))
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Get topic for metadata
  const topicResponse = await payload.find({
    collection: 'topics',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!topicResponse) {
    return notFound()
  }

  const { docs } = topicResponse

  const topicName = docs[0]?.name || slug

  const response = await getTopicPosts(slug)

  if (!response) {
    return notFound()
  }

  const { docs: posts, totalPages, page } = response

  return (
    <>
      <GridCardNav />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
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

export async function generateMetadata({ params: paramsPromise }: PageProps): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const response = await payload.find({
    collection: 'topics',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!response) {
    return notFound()
  }

  const { docs } = response

  const topicName = docs[0]?.name || slug

  return {
    title: `${topicName} | Lyovson.com`,
    description: docs[0]?.description || `Posts about ${topicName}`,
  }
}
