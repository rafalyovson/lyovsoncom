import { SkeletonCard } from "./skeleton-card";

type SkeletonGridProps = {
  count?: number;
};

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  const slots = Array.from({ length: count }, (_, slotIndex) => slotIndex + 1);

  return (
    <>
      {slots.map((slot) => (
        <SkeletonCard key={slot} />
      ))}
    </>
  );
}
