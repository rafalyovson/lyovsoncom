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
import { getPaginatedActivities } from "@/utilities/get-activity";
import { getPaginatedNotes } from "@/utilities/get-note";
import { getPaginatedPosts } from "@/utilities/get-post";

const HOMEPAGE_ITEMS_LIMIT = 12;

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

  // Fetch paginated items from each collection
  const [posts, notes, activities] = await Promise.all([
    getPaginatedPosts(sanitizedPageNumber, HOMEPAGE_ITEMS_LIMIT),
    getPaginatedNotes(sanitizedPageNumber, HOMEPAGE_ITEMS_LIMIT),
    getPaginatedActivities(sanitizedPageNumber, HOMEPAGE_ITEMS_LIMIT),
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
    const dateA = a.data.publishedAt || a.data.updatedAt || "";
    const dateB = b.data.publishedAt || b.data.updatedAt || "";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const maxTotalPages = Math.max(
    posts.totalPages || 1,
    notes.totalPages || 1,
    activities.totalPages || 1
  );

  // If requested page is beyond available pages, 404
  if (sanitizedPageNumber > maxTotalPages) {
    notFound();
  }

  return (
    <>
      <h1 className="sr-only">
        Lyóvson.com - Latest Posts, Notes & Activities - Page {pageNumber}
      </h1>

      <Suspense fallback={<SkeletonGrid />}>
        {mixedItems.map((item, index) => {
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
                key={`activity-${item.data.slug}`}
                {...(index === 0 && { priority: true })}
              />
            );
          }
          return null;
        })}
      </Suspense>

      {maxTotalPages > 1 && (
        <Pagination
          basePath="/page"
          firstPagePath="/"
          page={sanitizedPageNumber}
          totalPages={maxTotalPages}
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
