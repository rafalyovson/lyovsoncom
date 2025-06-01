import { GridCardNav } from '@/components/grid'
import { SkeletonCard, SkeletonGrid } from '@/components/grid/skeleton'
import type { Metadata } from 'next'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export default async function SkeletonPlayground() {
  'use cache'
  cacheTag('playground')
  cacheTag('skeleton-playground')
  cacheLife('static') // Static testing page

  return (
    <>
      {/* Single Skeleton Card */}
      <SkeletonCard />

      {/* Skeleton Grid with different counts */}
      <SkeletonGrid count={3} />

      {/* More skeleton cards to fill the grid */}
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />

      {/* Additional skeleton grid */}
      <SkeletonGrid count={6} />

      {/* More individual cards */}
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Skeleton Playground | Lyovson.com',
  description: 'Test page for skeleton loading components',
  alternates: {
    canonical: '/playground/skeleton',
  },
}
