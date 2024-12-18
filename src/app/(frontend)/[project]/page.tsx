import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from 'src/components/grid/card/header'
import { getProjectPosts } from '@/utilities/get-project-posts'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getProject } from '@/utilities/get-project'

export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{
    project: string
  }>
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { project: projectSlug } = await paramsPromise

  const project = await getProject(projectSlug)
  if (!project) {
    return notFound()
  }

  try {
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

    const response = await getProjectPosts(projectSlug)

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
  } catch (error) {
    console.error('Error fetching project:', error)
    return notFound()
  }
}

export async function generateMetadata({ params: paramsPromise }: PageProps): Promise<Metadata> {
  const { project: projectSlug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const response = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1,
  })

  if (!response || !response.docs || response.docs.length === 0) {
    return {
      title: 'Not Found | Lyovson.com',
      description: 'The requested project could not be found',
    }
  }

  const { docs } = response
  const projectName = docs[0]?.name || projectSlug

  return {
    title: `${projectName} | Lyovson.com`,
    description: docs[0]?.description || `Posts from ${projectName}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
    collection: 'projects',
    limit: 1000,
  })

  const { docs } = response

  return docs.map(({ slug }) => ({
    project: slug,
  }))
}
