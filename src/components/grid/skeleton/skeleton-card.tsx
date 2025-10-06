import { GridCard, GridCardSection } from "@/components/grid";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <GridCard className="glass-card-loading">
      {/* Image placeholder - takes up first two rows and columns */}
      <GridCardSection
        className={"col-start-1 col-end-3 row-start-1 row-end-3"}
      >
        <Skeleton className="glass-badge h-full w-full" />
      </GridCardSection>

      {/* Title section */}
      <GridCardSection
        className={
          "col-start-1 col-end-4 row-start-3 row-end-4 flex h-full flex-col justify-center"
        }
      >
        <Skeleton className="glass-badge mx-auto h-6 w-3/4" />
      </GridCardSection>

      {/* Topics section */}
      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col justify-center gap-2"
        }
      >
        <Skeleton className="glass-badge h-5 w-16" />
        <Skeleton className="glass-badge h-5 w-20" />
      </GridCardSection>

      {/* Author and date section */}
      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col justify-evenly gap-2"
        }
      >
        <div className="flex items-center gap-2">
          <Skeleton className="glass-badge h-5 w-5 rounded-full" />
          <Skeleton className="glass-badge h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="glass-badge h-5 w-5 rounded-full" />
          <Skeleton className="glass-badge h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="glass-badge h-5 w-5 rounded-full" />
          <Skeleton className="glass-badge h-4 w-16" />
        </div>
      </GridCardSection>
    </GridCard>
  );
}
