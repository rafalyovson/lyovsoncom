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
import { getPaginatedPosts, getPostCount } from "@/utilities/get-post";

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  // Add cache tags for this specific posts page
  cacheTag("posts");
  cacheTag(`posts-page-${pageNumber}`);
  cacheLife("posts");

  if (!Number.isInteger(sanitizedPageNumber)) {
    notFound();
  }

  const response = await getPaginatedPosts(sanitizedPageNumber, 12);

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

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const pageNum = Number(pageNumber);

  // Add cache tags for metadata
  cacheTag("posts");
  cacheLife("static");

  const isFirstPage = pageNum === 1;
  const title = isFirstPage
    ? "All Posts & Articles | Lyovson.com"
    : `Posts Page ${pageNumber} | Lyovson.com`;

  const description = isFirstPage
    ? "Browse all posts and articles from Lyovson.com covering programming, design, philosophy, and technology."
    : `Posts and articles from Lyovson.com - Page ${pageNumber}. Continue browsing our content on programming, design, and technology.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/posts/page/${pageNumber}`,
      ...(pageNum > 1 && {
        prev: pageNum === 2 ? "/posts" : `/posts/page/${pageNum - 1}`,
      }),
      // Note: We'd need to know total pages to set 'next', but this is handled by Pagination component
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/posts/page/${pageNumber}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@lyovson",
    },
    robots: {
      index: pageNum <= 3, // Only index first 3 pages to avoid duplicate content issues
      follow: true,
      noarchive: pageNum > 1, // Don't archive pagination pages
    },
  };
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("posts");
  cacheLife("static"); // Build-time data doesn't change often

  const { totalDocs } = await getPostCount();
  const totalPages = Math.ceil(totalDocs / 12);

  const pages: { pageNumber: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
