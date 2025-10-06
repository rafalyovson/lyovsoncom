import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestPosts } from "@/utilities/get-post";

export default async function Page() {
  "use cache";

  // Add cache tags for posts page
  cacheTag("posts");
  cacheTag("posts-page");
  cacheLife("posts");

  const response = await getLatestPosts(12);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page } = response;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={docs} />
      </Suspense>

      <div className="container">
        {totalPages > 1 && page && (
          <Suspense fallback={<Skeleton className="mx-auto mt-4 h-10 w-64" />}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        )}
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "All Posts & Articles | Lyovson.com",
  description:
    "Browse all posts and articles from Lyovson.com covering programming, design, philosophy, technology, and creative projects by Rafa and Jess Lyovson.",
  keywords: [
    "blog posts",
    "articles",
    "programming",
    "design",
    "philosophy",
    "technology",
    "Rafa Lyovson",
    "Jess Lyovson",
  ],
  alternates: {
    canonical: "/posts",
  },
  openGraph: {
    title: "All Posts & Articles - Lyovson.com",
    description:
      "Browse all posts and articles covering programming, design, philosophy, technology, and creative projects.",
    type: "website",
    url: "/posts",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Posts & Articles - Lyovson.com",
    description:
      "Browse all posts and articles covering programming, design, philosophy, and technology.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    "article:section": "Blog",
    "article:author": "Rafa Lyovson, Jess Lyovson",
  },
};
