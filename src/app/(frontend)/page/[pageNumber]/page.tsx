import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import {
  GridCardActivityFull,
  GridCardNoteFull,
  GridCardPostFull,
  SkeletonGrid,
} from "@/components/grid";
import { Pagination } from "@/components/Pagination";
import type { Activity, Note, Post } from "@/payload-types";
import { getLatestActivities } from "@/utilities/get-activity";
import { getLatestNotes } from "@/utilities/get-note";
import { getLatestPosts } from "@/utilities/get-post";
import { getServerSideURL } from "@/utilities/getURL";

const HOMEPAGE_ITEMS_LIMIT = 25;
const HOMEPAGE_FETCH_LIMIT = 50; // Fetch more to ensure we get enough items for pagination

type MixedFeedItem =
  | { type: "post"; data: Post }
  | { type: "note"; data: Note }
  | { type: "activity"; data: Activity };

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  cacheTag("homepage");
  cacheTag(`homepage-page-${pageNumber}`);
  cacheTag("posts");
  cacheTag("notes");
  cacheTag("activities");
  cacheLife("posts");
  cacheLife("notes");
  cacheLife("activities");

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    notFound();
  }

  // Fetch enough items from each collection to build a sorted mixed feed
  const [posts, notes, activities] = await Promise.all([
    getLatestPosts(HOMEPAGE_FETCH_LIMIT),
    getLatestNotes(HOMEPAGE_FETCH_LIMIT),
    getLatestActivities(HOMEPAGE_FETCH_LIMIT),
  ]);

  // Merge and sort by date
  const mixedItems: MixedFeedItem[] = [
    ...posts.docs.map((post) => ({ type: "post" as const, data: post })),
    ...notes.docs.map((note) => ({ type: "note" as const, data: note })),
    ...activities.docs.map((activity) => ({
      type: "activity" as const,
      data: activity,
    })),
  ];

  mixedItems.sort((a, b) => {
    let dateA: string;
    let dateB: string;

    if (a.type === "activity") {
      dateA = a.data.finishedAt || a.data.startedAt || a.data.publishedAt || "";
    } else if (a.type === "note") {
      // note - use publishedAt first (when it was published), fallback to createdAt
      dateA = a.data.publishedAt || a.data.createdAt || "";
    } else {
      // post - use publishedAt first (when it was published), fallback to createdAt
      dateA = a.data.publishedAt || a.data.createdAt || "";
    }

    if (b.type === "activity") {
      dateB = b.data.finishedAt || b.data.startedAt || b.data.publishedAt || "";
    } else if (b.type === "note") {
      // note - use publishedAt first (when it was published), fallback to createdAt
      dateB = b.data.publishedAt || b.data.createdAt || "";
    } else {
      // post - use publishedAt first (when it was published), fallback to createdAt
      dateB = b.data.publishedAt || b.data.createdAt || "";
    }

    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Calculate pagination for the mixed feed
  const totalItems = mixedItems.length;
  const totalPages = Math.ceil(totalItems / HOMEPAGE_ITEMS_LIMIT);
  const startIndex = (sanitizedPageNumber - 1) * HOMEPAGE_ITEMS_LIMIT;
  const endIndex = startIndex + HOMEPAGE_ITEMS_LIMIT;

  // If requested page is beyond available pages, 404
  if (sanitizedPageNumber > totalPages || sanitizedPageNumber < 1) {
    notFound();
  }

  // Get the items for this page
  const pageItems = mixedItems.slice(startIndex, endIndex);

  return (
    <>
      <h1 className="sr-only">
        Lyóvson.com - Latest Posts, Notes & Activities - Page {pageNumber}
      </h1>

      <Suspense fallback={<SkeletonGrid />}>
        {pageItems.map((item, index) => {
          if (item.type === "post") {
            return (
              <GridCardPostFull
                key={`post-${item.data.slug}`}
                post={item.data}
                {...(index === 0 && { priority: true })}
              />
            );
          }
          if (item.type === "note") {
            return (
              <GridCardNoteFull
                key={`note-${item.data.slug}`}
                note={item.data}
                {...(index === 0 && { priority: true })}
              />
            );
          }
          if (item.type === "activity") {
            return (
              <GridCardActivityFull
                activity={item.data}
                key={`activity-${item.data.id}`}
                {...(index === 0 && { priority: true })}
              />
            );
          }
          return null;
        })}
      </Suspense>

      {totalPages > 1 && (
        <Pagination
          basePath="/page"
          firstPagePath="/"
          page={sanitizedPageNumber}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const pageNum = Number(pageNumber);

  cacheTag("homepage");
  cacheLife("static");

  const isFirstPage = pageNum === 1;
  const title = isFirstPage
    ? "Lyóvson.com"
    : `Lyóvson.com - Page ${pageNumber}`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description: "Official website of Rafa and Jess Lyóvson",
    keywords: [
      "Rafa Lyóvson",
      "Jess Lyóvson",
      "programming",
      "writing",
      "design",
      "philosophy",
      "research",
      "projects",
      "technology",
      "blog",
    ],
    alternates: {
      canonical: isFirstPage ? "/" : `/page/${pageNumber}`,
      ...(pageNum > 1 && {
        prev: pageNum === 2 ? "/" : `/page/${pageNum - 1}`,
      }),
    },
    openGraph: {
      siteName: "Lyóvson.com",
      title,
      description: "Official website of Rafa and Jess Lyóvson",
      type: "website",
      url: isFirstPage ? "/" : `/page/${pageNumber}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Lyóvson.com - Writing, Projects & Research",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Official website of Rafa and Jess Lyóvson",
      creator: "@lyovson",
      site: "@lyovson",
      images: [
        {
          url: "/og-image.png",
          alt: "Lyóvson.com - Writing, Projects & Research",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
