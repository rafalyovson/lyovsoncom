import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { GridCardJess } from '@/components/grid/card/user'
import { getProjects } from '@/utilities/get-projects'
import { GridCardProject } from '@/components/grid/card/project'

export default async function Page() {
  'use cache'

  // Add cache tags for Jess's posts
  cacheTag('posts')
  cacheTag('users')
  cacheTag('author-jess')
  cacheLife('authors')

  const response = await getProjects()

  if (!response) {
    return notFound()
  }

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        {response.map((project) => (
          <GridCardProject key={project.id} project={project} />
        ))}
      </Suspense>
    </>
  )
}

export const metadata: Metadata = {
  title: `Projects | Lyovson.com`,
  description: 'Projects by Jess and Rafa Lyovson',
  alternates: {
    canonical: '/projects',
  },
}
