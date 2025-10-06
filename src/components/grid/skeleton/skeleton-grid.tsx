import { SkeletonCard } from "./skeleton-card";

type SkeletonGridProps = {
  count?: number;
};

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <>
      {new Array(count).fill(0).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}
