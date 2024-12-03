import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from '@/components/grid/grid-card-header'
import { getAuthorPosts } from '@/utilities/get-author-posts'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const posts = await getAuthorPosts('jess')

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

export function generateMetadata(): Metadata {
  return {
    title: `Lyovson.com | Jess's Posts`,
    description: 'Official website of Rafa and Jess Lyovsons',
  }
}
