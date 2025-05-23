import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getProject } from '@/utilities/get-project'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { GridCardNav } from 'src/components/grid/card/nav'

export const experimental_ppr = true
export const revalidate = 600
export const dynamicParams = true

type Args = {
  params: Promise<{
    project: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { project: projectSlug, pageNumber } = await paramsPromise

  const project = await getProject(projectSlug)
  if (!project) {
    return notFound()
  }

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) {
    return notFound()
  }

  const payload = await getPayload({ config: configPromise })

  const postsResponse = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    where: {
      project: {
        equals: project.id,
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
      <GridCardNav />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { project: projectSlug, pageNumber } = await paramsPromise

  const project = await getProject(projectSlug)
  if (!project) {
    return notFound()
  }

  const projectName = project.name || projectSlug

  return {
    title: `${projectName} Posts Page ${pageNumber} | Lyovson.com`,
    description: project.description || `Posts from ${projectName}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    limit: 1000,
  })

  const paths: { project: string; pageNumber: string }[] = []

  for (const project of projects.docs) {
    if (project.slug) {
      // Generate first page for each project
      paths.push({
        project: project.slug,
        pageNumber: '1',
      })
    }
  }

  return paths
}
