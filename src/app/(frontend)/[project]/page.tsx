import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import { Suspense } from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getProject } from '@/utilities/get-project'
import { getProjectPosts } from '@/utilities/get-project-posts'
import { GridCardNav } from 'src/components/grid/card/nav'

export const experimental_ppr = true
export const dynamicParams = true
export const revalidate = 600

interface PageProps {
  params: Promise<{
    project: string
  }>
}

export default async function Page({ params: paramsPromise }: PageProps) {
  const { project: projectSlug } = await paramsPromise

  const response = await getProjectPosts(projectSlug)

  if (!response) {
    return notFound()
  }

  const { docs, totalPages, page } = response

  return (
    <>
      <GridCardNav />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={docs} />
      </Suspense>
      <div className="container">
        {totalPages > 1 && page && (
          <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto mt-4" />}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: PageProps): Promise<Metadata> {
  const { project: projectSlug } = await paramsPromise

  const project = await getProject(projectSlug)
  if (!project) {
    return {
      title: 'Not Found | Lyovson.com',
      description: 'The requested project could not be found',
    }
  }
  const projectName = project.name || projectSlug

  return {
    title: `${projectName} | Lyovson.com`,
    description: project.description || `Posts from ${projectName}`,
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
