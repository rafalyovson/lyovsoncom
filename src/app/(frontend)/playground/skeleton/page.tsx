import { GridCardNav } from '@/components/grid'
import { SkeletonCard, SkeletonGrid } from '@/components/grid/skeleton'
import type { Metadata } from 'next'

export default function SkeletonPlayground() {
  return (
    <>
      <GridCardNav />

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
}
