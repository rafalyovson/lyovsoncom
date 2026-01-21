import { cacheLife, cacheTag } from "next/cache";
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

const HOMEPAGE_ITEMS_LIMIT = 25;
const HOMEPAGE_FETCH_LIMIT = 50; // Fetch more to ensure we get the latest 25 overall

type MixedFeedItem =
  | { type: "post"; data: Post }
  | { type: "note"; data: Note }
  | { type: "activity"; data: Activity };

export default async function Page() {
  "use cache";
  cacheTag("homepage");
  cacheTag("posts");
  cacheTag("notes");
  cacheTag("activities");
  cacheLife("posts");
  cacheLife("notes");
  cacheLife("activities");

  // Fetch more items from each collection to ensure we get the latest 25 overall
  const [posts, notes, activities] = await Promise.all([
    getLatestPosts(HOMEPAGE_FETCH_LIMIT),
    getLatestNotes(HOMEPAGE_FETCH_LIMIT),
    getLatestActivities(HOMEPAGE_FETCH_LIMIT),
  ]);

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

  // Take only the latest 25 items
  const latestItems = mixedItems.slice(0, HOMEPAGE_ITEMS_LIMIT);

  // Calculate total pages for the mixed feed
  const totalItems = mixedItems.length;
  const totalPages = Math.ceil(totalItems / HOMEPAGE_ITEMS_LIMIT);
  const hasMore = totalPages > 1;

  return (
    <>
      <h1 className="sr-only">
        Lyóvson.com - Latest Posts, Notes & Activities
      </h1>

      {/* <PWAInstall /> */}

      <Suspense fallback={<SkeletonGrid />}>
        {latestItems.map((item, index) => {
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

      {hasMore && (
        <Pagination
          basePath="/page"
          firstPagePath="/"
          page={1}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Lyóvson.com",
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
      canonical: "/",
    },
    openGraph: {
      siteName: "Lyóvson.com",
      title: "Lyóvson.com",
      description: "Official website of Rafa and Jess Lyóvson",
      type: "website",
      url: "/",
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
      title: "Lyóvson.com",
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
    other: {
      "article:author": "Rafa Lyóvson, Jess Lyóvson",
      "application-name": "Lyóvson.com",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "Lyóvson.com",
      "msapplication-TileColor": "#000000",
      "msapplication-config": "/browserconfig.xml",
      "theme-color": "#000000",
    },
  };
}
