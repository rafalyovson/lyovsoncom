import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { GridCardJess } from "@/components/grid/card/user";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthorPosts } from "@/utilities/get-author-posts";

export default async function Page() {
  "use cache";

  // Add cache tags for Jess's posts
  cacheTag("posts");
  cacheTag("users");
  cacheTag("author-jess");
  cacheLife("authors");

  const response = await getAuthorPosts("jess");

  if (!response) {
    return notFound();
  }

  const { posts, user } = response;
  const { docs, totalPages, page } = posts;

  return (
    <>
      <GridCardJess user={user} />
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
  title: "Jess Lyovson - Posts & Writing | Lyovson.com",
  description:
    "Posts, articles, and writing by Jess Lyovson. Explore thoughts on design, philosophy, technology, and creative projects.",
  keywords: [
    "Jess Lyovson",
    "writing",
    "design",
    "philosophy",
    "creativity",
    "articles",
    "blog posts",
  ],
  alternates: {
    canonical: "/jess",
  },
  openGraph: {
    title: "Jess Lyovson - Posts & Writing",
    description:
      "Posts, articles, and writing by Jess Lyovson on design, philosophy, technology, and creative projects.",
    type: "profile",
    url: "/jess",
    // Profile information for structured data
    firstName: "Jess",
    lastName: "Lyovson",
    username: "jess",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jess Lyovson - Posts & Writing",
    description:
      "Posts, articles, and writing by Jess Lyovson on design, philosophy, and technology.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    // Hint for Person structured data
    "profile:first_name": "Jess",
    "profile:last_name": "Lyovson",
    "profile:username": "jess",
    "article:author": "Jess Lyovson",
  },
};
