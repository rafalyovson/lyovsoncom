import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { Search } from '@/search/Component'
import { Pagination } from '@/components/Pagination'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { Post } from '@/payload-types'
import { GridCardNav } from 'src/components/grid/card/nav'
import { SkeletonCard } from '@/components/grid'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function SuspendedSearchPage({ searchParams: searchParamsPromise }: Args) {
  return (
    <>
      <Suspense fallback={<SkeletonCard />}>
        <SearchPage searchParams={searchParamsPromise} />
      </Suspense>
    </>
  )
}

async function SearchPage({ searchParams: searchParamsPromise }: Args) {
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
      <CollectionArchive posts={docs as unknown as Post[]} search />
      <div className="container">
        {totalPages > 1 && page && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </>
  )
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { q: query } = await searchParamsPromise

  const title = query ? `Search results for "${query}" | Lyovson.com` : 'Search | Lyovson.com'

  const description = query
    ? `Find posts, articles, and content related to "${query}" on Lyovson.com`
    : 'Search for posts, articles, and content on Lyovson.com'

  return {
    title,
    description,
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: !query, // Don't index search result pages, only the main search page
      follow: true,
    },
  }
}
