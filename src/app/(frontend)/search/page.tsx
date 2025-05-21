import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

import { Search } from '@/search/Component'
import { Pagination } from '@/components/Pagination'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { Post } from '@/payload-types'
import { GridCardNav } from 'src/components/grid/card/nav'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const response = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,

    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
      <GridCardNav />
      <Search />
      <CollectionArchive posts={docs as unknown as Post[]} />
      <div className="container">
        {totalPages > 1 && page && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: `Search |Lyovson.com`,
  description: 'Search for posts on Lyovson.com',
}
