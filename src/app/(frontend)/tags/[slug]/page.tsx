import type { Metadata } from 'next'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from '@/components/grid/grid-card-header'
import { getTagPosts } from '@/utilities/get-tag-posts'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-static'
export const revalidate = 600

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
  })

  return tags.docs.map(({ slug }) => ({
    slug,
  }))
}

export default async function Page({ params: { slug } }: Props) {
  const payload = await getPayload({ config: configPromise })

  // Get tag for metadata
  const tag = await payload.find({
    collection: 'tags',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!tag.docs[0]) {
    return notFound()
  }

  const posts = await getTagPosts(slug)

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

export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const tag = await payload.find({
    collection: 'tags',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const tagName = tag.docs[0]?.name || slug

  return {
    title: `Lyovson.com | Posts Tagged ${tagName}`,
    description: `Posts tagged with ${tagName} on Lyovson.com`,
  }
}
