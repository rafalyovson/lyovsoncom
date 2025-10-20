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
      <h1 className="sr-only">Lyóvson.com - Latest Posts & Articles</h1>

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
    title: "Lyóvson.com",
    description:
      "Official website of Rafa and Jess Lyóvson",
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
      description:
        "Official website of Rafa and Jess Lyóvson",
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
      description:
        "Official website of Rafa and Jess Lyóvson",
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
