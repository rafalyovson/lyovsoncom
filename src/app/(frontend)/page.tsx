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

const HOMEPAGE_ITEMS_LIMIT = 12;

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

  const [posts, notes, activities] = await Promise.all([
    getLatestPosts(HOMEPAGE_ITEMS_LIMIT),
    getLatestNotes(HOMEPAGE_ITEMS_LIMIT),
    getLatestActivities(HOMEPAGE_ITEMS_LIMIT),
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
    const dateA = a.data.publishedAt || a.data.updatedAt || "";
    const dateB = b.data.publishedAt || b.data.updatedAt || "";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const hasMore =
    posts.totalPages > 1 || notes.totalPages > 1 || activities.totalPages > 1;

  return (
    <>
      <h1 className="sr-only">
        Lyóvson.com - Latest Posts, Notes & Activities
      </h1>

      {/* <PWAInstall /> */}

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

      {hasMore && (
        <div className="col-span-full">
          <Pagination
            page={1}
            totalPages={Math.max(
              posts.totalPages || 1,
              notes.totalPages || 1,
              activities.totalPages || 1
            )}
          />
        </div>
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
