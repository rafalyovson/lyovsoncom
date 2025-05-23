import { SkeletonCard } from './skeleton-card'

interface SkeletonGridProps {
  count?: number
}

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </>
  )
}
