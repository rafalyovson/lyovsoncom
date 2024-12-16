import type { Metadata } from 'next'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from 'src/components/grid/card/header'
import { getTopicPosts } from '@/utilities/get-topic-posts'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const topics = await payload.find({
    collection: 'topics',
    limit: 1000,
  })

  return topics.docs.map(({ slug }) => ({
    slug,
  }))
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Get topic for metadata
  const topic = await payload.find({
    collection: 'topics',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!topic.docs[0]) {
    return notFound()
  }

  const posts = await getTopicPosts(slug)

  return (
    <>
      <GridCardHeader />
      <CollectionArchive posts={posts.docs} />
      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: PageProps): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const topic = await payload.find({
    collection: 'topics',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const topicName = topic.docs[0]?.name || slug

  return {
    title: `Lyovson.com | ${topicName}`,
    description: topic.docs[0]?.description || `Posts about ${topicName}`,
  }
}
