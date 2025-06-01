import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getTopicPosts } from '@/utilities/get-topic-posts'
import { getTopic, getAllTopics } from '@/utilities/get-topic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  'use cache'
  cacheTag('topics')
  cacheLife('static') // Build-time data doesn't change often

  const topicsResponse = await getAllTopics()

  if (!topicsResponse) {
    return []
  }

  const { docs } = topicsResponse

  return docs.map(({ slug }) => ({
    slug,
  }))
}

export default async function Page({ params: paramsPromise }: PageProps) {
  'use cache'

  const { slug } = await paramsPromise

  // Add cache tags for this specific topic
  cacheTag('posts')
  cacheTag('topics')
  cacheTag(`topic-${slug}`)
  cacheLife('posts')

  // Get topic for metadata
  const topic = await getTopic(slug)

  if (!topic) {
    return notFound()
  }

  const topicName = topic.name || slug

  const response = await getTopicPosts(slug)

  if (!response) {
    return notFound()
  }

  const { docs: posts, totalPages, page } = response

  return (
    <>
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
  'use cache'

  const { slug } = await paramsPromise

  // Add cache tags for metadata
  cacheTag('topics')
  cacheTag(`topic-${slug}`)
  cacheLife('topics')

  const topic = await getTopic(slug)

  if (!topic) {
    return {
      title: 'Topic Not Found | Lyovson.com',
      description: 'The requested topic could not be found',
    }
  }

  const topicName = topic.name || slug

  return {
    title: `${topicName} | Lyovson.com`,
    description: topic.description || `Posts about ${topicName}`,
    alternates: {
      canonical: `/topics/${slug}`,
    },
  }
}
