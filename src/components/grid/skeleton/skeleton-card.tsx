import { GridCard, GridCardSection } from '@/components/grid'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <GridCard>
      {/* Image placeholder - takes up first two rows and columns */}
      <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-3`}>
        <Skeleton className="h-full w-full" />
      </GridCardSection>

      {/* Title section */}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center`}
      >
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </GridCardSection>

      {/* Topics section */}
      <GridCardSection
        className={`row-start-2 row-end-3 col-start-3 col-end-4 flex flex-col gap-2 justify-center`}
      >
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </GridCardSection>

      {/* Author and date section */}
      <GridCardSection
        className={`row-start-1 row-end-2 col-start-3 col-end-4 flex flex-col gap-2 justify-evenly`}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </GridCardSection>
    </GridCard>
  )
}
