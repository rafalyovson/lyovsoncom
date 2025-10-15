import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid";
import { Pagination } from "@/components/Pagination";
import { getLatestPosts } from "@/utilities/get-post";

// Number of posts to display on the homepage
const HOMEPAGE_POSTS_LIMIT = 12;

export default async function Page() {
  "use cache";
  cacheTag("homepage");
  cacheTag("posts");
  cacheLife("posts");

  const posts = await getLatestPosts(HOMEPAGE_POSTS_LIMIT);

  return (
    <>
      {/* <PWAInstall /> */}

      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts.docs} />
      </Suspense>

      {posts.totalPages > 1 && posts.page && (
        <Pagination page={posts.page} totalPages={posts.totalPages} />
      )}
    </>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Lyovson.com",
    description:
      "Official website of Rafa and Jess Lyóvson — featuring writing, projects, and research on programming, design, philosophy, and technology.",
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
      title: "Lyóvson.com - Writing, Projects & Research",
      description:
        "Official website of Rafa and Jess Lyóvson featuring writing, projects, and research on programming, design, philosophy, and technology.",
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
      title: "Lyovson.com - Writing, Projects & Research",
      description:
        "Official website of Rafa and Jess Lyóvson featuring writing, projects, and research on programming, design, philosophy, and technology.",
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
