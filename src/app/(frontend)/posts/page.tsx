import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLatestPosts } from "@/utilities/get-post";
import { getServerSideURL } from "@/utilities/getURL";

const POSTS_PER_PAGE = 12;

export default async function Page() {
  "use cache";

  // Add cache tags for posts page
  cacheTag("posts");
  cacheTag("posts-page");
  cacheLife("posts");

  const response = await getLatestPosts(POSTS_PER_PAGE);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page, totalDocs } = response;

  // Generate CollectionPage schema
  const collectionPageSchema = generateCollectionPageSchema({
    name: "Posts & Articles",
    description:
      "Browse all posts and articles covering programming, design, philosophy, technology, and creative projects.",
    url: `${getServerSideURL()}/posts`,
    itemCount: totalDocs,
    items: docs.map((post) => ({
      url: `${getServerSideURL()}/posts/${post.slug}`,
    })),
  });

  return (
    <>
      <h1 className="sr-only">All Posts & Articles</h1>

      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination
          basePath="/posts/page"
          firstPagePath="/posts"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export const metadata: Metadata = {
  title: "All Posts & Articles | Lyóvson.com",
  description:
    "Browse all posts and articles from Lyóvson.com covering programming, design, philosophy, technology, and creative projects by Rafa and Jess Lyóvson.",
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
    siteName: "Lyóvson.com",
    title: "All Posts & Articles - Lyóvson.com",
    description:
      "Browse all posts and articles covering programming, design, philosophy, technology, and creative projects.",
    type: "website",
    url: "/posts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "All Posts & Articles - Lyóvson.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Posts & Articles - Lyóvson.com",
    description:
      "Browse all posts and articles covering programming, design, philosophy, and technology.",
    creator: "@lyovson",
    site: "@lyovson",
    images: [
      {
        url: "/og-image.png",
        alt: "All Posts & Articles - Lyóvson.com",
        width: 1200,
        height: 630,
      },
    ],
  },
  other: {
    "article:section": "Blog",
    "article:author": "Rafa Lyóvson, Jess Lyóvson",
  },
};
