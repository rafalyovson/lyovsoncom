import type { Metadata } from 'next/types'
import React from 'react'
import { GridCardHeader } from 'src/components/grid/card/header'
import { notFound } from 'next/navigation'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { getAuthorPosts } from '@/utilities/get-author-posts'


export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const response = await getAuthorPosts('rafa')

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
      <GridCardHeader />
      <CollectionArchive posts={docs} />
      <div className="container">
        {totalPages > 1 && page && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: `Rafa's Posts | Lyovson.com`,
  description: 'Official website of Rafa and Jess Lyovsons',
}
