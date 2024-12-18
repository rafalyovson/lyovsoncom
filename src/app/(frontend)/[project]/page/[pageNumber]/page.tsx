import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { notFound } from 'next/navigation'
import { GridCardHeader } from 'src/components/grid/card/header'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const revalidate = 600

type Args = {
  params: Promise<{
    project: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { project: projectSlug, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const projectResponse = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1,
  })

  if (!projectResponse || !projectResponse.docs || projectResponse.docs.length === 0) {
    return notFound()
  }

  const { docs } = projectResponse

  const projectId = docs[0].id

  if (!projectId) notFound()

  const postsResponse = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    where: {
      project: {
        equals: projectId,
      },
    },
    overrideAccess: false,
  })

  if (!postsResponse) {
    return notFound()
  }

  const { docs: posts, totalPages, page } = postsResponse

  return (
    <>
      <GridCardHeader />
      <CollectionArchive posts={posts} />
      <div className="container">
        {totalPages > 1 && page && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { project: projectSlug, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const projectResponse = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1,
  })

  if (!projectResponse || !projectResponse.docs || projectResponse.docs.length === 0) {
    return notFound()
  }

  const { docs } = projectResponse

  const projectName = docs[0]?.name || projectSlug

  return {
    title: `${projectName} Posts Page ${pageNumber} | Lyovson.com`,
    description: docs[0]?.description || `Posts from ${projectName}`,
  }
}
