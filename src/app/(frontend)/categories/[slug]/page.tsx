import type { Metadata } from 'next'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from '@/components/grid/grid-card-header'
import { getCategoryPosts } from '@/utilities/get-category-posts'
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
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
  })

  return categories.docs.map(({ slug }) => ({
    slug,
  }))
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Get category for metadata
  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!category.docs[0]) {
    return notFound()
  }

  const posts = await getCategoryPosts(slug)

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
  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const categoryName = category.docs[0]?.name || slug

  return {
    title: `Lyovson.com | ${categoryName} Posts`,
    description: `Posts in the ${categoryName} category on Lyovson.com`,
  }
}
