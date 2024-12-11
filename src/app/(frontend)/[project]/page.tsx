import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { GridCardHeader } from '@/components/grid/grid-card-header'
import { getProjectPosts } from '@/utilities/get-project-posts'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{
    project: string
  }>
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { project: projectSlug } = await paramsPromise
  const posts = await getProjectPosts(projectSlug)

  if (!posts.docs.length) {
    return notFound()
  }

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
  const { project: projectSlug } = await paramsPromise
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
    title: `Lyovson.com | ${projectName}`,
    description: project.docs[0]?.description || `Posts from ${projectName}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    limit: 1000,
  })

  return projects.docs.map(({ slug }) => ({
    project: slug,
  }))
}
