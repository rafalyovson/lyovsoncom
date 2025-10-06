import type { Metadata } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { SkeletonCard, SkeletonGrid } from "@/components/grid/skeleton";

export default async function SkeletonPlayground() {
  "use cache";
  cacheTag("playground");
  cacheTag("skeleton-playground");
  cacheLife("static"); // Static testing page

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
  );
}

export const metadata: Metadata = {
  title: "Skeleton Loading Demo | Lyovson.com",
  description:
    "Interactive demo showcasing skeleton loading components and animations used throughout Lyovson.com. See loading states in action.",
  keywords: [
    "skeleton loading",
    "loading animations",
    "UI components",
    "demo",
    "web development",
  ],
  alternates: {
    canonical: "/playground/skeleton",
  },
  openGraph: {
    title: "Skeleton Loading Demo",
    description:
      "Interactive demo showcasing skeleton loading components and animations.",
    type: "website",
    url: "/playground/skeleton",
  },
  twitter: {
    card: "summary",
    title: "Skeleton Loading Demo",
    description: "Interactive demo of skeleton loading components.",
    site: "@lyovson",
  },
  robots: {
    index: false, // Don't index demo/test pages
    follow: true,
    noarchive: true,
  },
};
