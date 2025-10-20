import type { Metadata } from "next";
import {
  cacheLife,
  cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { getAllTopics, getTopic } from "@/utilities/get-topic";
import { getTopicPosts } from "@/utilities/get-topic-posts";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  "use cache";
  cacheTag("topics");
  cacheLife("static"); // Build-time data doesn't change often

  const topicsResponse = await getAllTopics();

  if (!topicsResponse) {
    return [];
  }

  const { docs } = topicsResponse;

  return docs.map(({ slug }) => ({
    slug,
  }));
}

export default async function Page({ params: paramsPromise }: PageProps) {
  "use cache";

  const { slug } = await paramsPromise;

  // Add cache tags for this specific topic
  cacheTag("posts");
  cacheTag("topics");
  cacheTag(`topic-${slug}`);
  cacheLife("posts");

  // Get topic for metadata
  const topic = await getTopic(slug);

  if (!topic) {
    return notFound();
  }

  const topicName = topic.name || slug;

  const response = await getTopicPosts(slug);

  if (!response) {
    return notFound();
  }

  const { docs: posts, totalPages, page } = response;

  return (
    <>
      <h1 className="sr-only">{topicName}</h1>

      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
      </Suspense>
      {totalPages > 1 && page && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: PageProps): Promise<Metadata> {
  "use cache";

  const { slug } = await paramsPromise;

  // Add cache tags for metadata
  cacheTag("topics");
  cacheTag(`topic-${slug}`);
  cacheLife("topics");

  const topic = await getTopic(slug);

  if (!topic) {
    return {
      title: "Topic Not Found | Lyóvson.com",
      description: "The requested topic could not be found",
    };
  }

  const topicName = topic.name || slug;
  const topicDescription = topic.description || `Posts about ${topicName}`;

  return {
    title: `${topicName} | Lyóvson.com`,
    description: topicDescription,
    alternates: {
      canonical: `/topics/${slug}`,
    },
    openGraph: {
      siteName: "Lyóvson.com",
      title: `${topicName} | Lyóvson.com`,
      description: topicDescription,
      type: "website",
      url: `/topics/${slug}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${topicName} | Lyóvson.com`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topicName} | Lyóvson.com`,
      description: topicDescription,
      creator: "@lyovson",
      site: "@lyovson",
      images: [
        {
          url: "/og-image.png",
          alt: `${topicName} | Lyóvson.com`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
