import { GridCard, GridCardSection } from '@/components/grid'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <GridCard className="glass-card-loading">
      {/* Image placeholder - takes up first two rows and columns */}
      <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-3`}>
        <Skeleton className="h-full w-full glass-badge" />
      </GridCardSection>

      {/* Title section */}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center`}
      >
        <Skeleton className="h-6 w-3/4 mx-auto glass-badge" />
      </GridCardSection>

      {/* Topics section */}
      <GridCardSection
        className={`row-start-2 row-end-3 col-start-3 col-end-4 flex flex-col gap-2 justify-center`}
      >
        <Skeleton className="h-5 w-16 glass-badge" />
        <Skeleton className="h-5 w-20 glass-badge" />
      </GridCardSection>

      {/* Author and date section */}
      <GridCardSection
        className={`row-start-1 row-end-2 col-start-3 col-end-4 flex flex-col gap-2 justify-evenly`}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full glass-badge" />
          <Skeleton className="h-4 w-20 glass-badge" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full glass-badge" />
          <Skeleton className="h-4 w-24 glass-badge" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full glass-badge" />
          <Skeleton className="h-4 w-16 glass-badge" />
        </div>
      </GridCardSection>
    </GridCard>
  )
}
