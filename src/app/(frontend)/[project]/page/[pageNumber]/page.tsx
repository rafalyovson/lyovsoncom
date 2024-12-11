import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { notFound } from 'next/navigation'
import { GridCardHeader } from '@/components/grid/grid-card-header'
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

  const project = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1,
  })

  const projectId = project.docs[0]?.id
  if (!projectId) notFound()

  const posts = await payload.find({
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { project: projectSlug, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const project = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1,
  })

  const projectName = project.docs[0]?.name || projectSlug

  return {
    title: `${projectName} Posts Page ${pageNumber}`,
    description: project.docs[0]?.description || `Posts from ${projectName}`,
  }
}
