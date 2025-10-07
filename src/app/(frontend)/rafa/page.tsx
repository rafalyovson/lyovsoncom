import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { GridCardRafa } from "@/components/grid/card/user";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthorPosts } from "@/utilities/get-author-posts";

export default async function Page() {
  "use cache";

  // Add cache tags for Rafa's posts
  cacheTag("posts");
  cacheTag("users");
  cacheTag("author-rafa");
  cacheLife("authors");

  const response = await getAuthorPosts("rafa");

  if (!response) {
    return notFound();
  }

  const { posts, user } = response;
  const { docs, totalPages, page } = posts;

  return (
    <>
      <GridCardRafa user={user} />
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
  title: "Rafa Lyovson - Posts & Programming | Lyovson.com",
  description:
    "Posts, articles, and programming insights by Rafa Lyovson. Explore thoughts on technology, software development, and research projects.",
  keywords: [
    "Rafa Lyovson",
    "programming",
    "software development",
    "technology",
    "research",
    "articles",
    "blog posts",
    "coding",
  ],
  alternates: {
    canonical: "/rafa",
  },
  openGraph: {
    title: "Rafa Lyovson - Posts & Programming",
    description:
      "Posts, articles, and programming insights by Rafa Lyovson on technology, software development, and research.",
    type: "profile",
    url: "/rafa",
    // Profile information for structured data
    firstName: "Rafa",
    lastName: "Lyovson",
    username: "rafa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafa Lyovson - Posts & Programming",
    description:
      "Posts, articles, and programming insights by Rafa Lyovson on technology and software development.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    // Hint for Person structured data
    "profile:first_name": "Rafa",
    "profile:last_name": "Lyovson",
    "profile:username": "rafa",
    "article:author": "Rafa Lyovson",
  },
};
