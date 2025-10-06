import type { Metadata } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
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

  const _topicName = topic.name || slug;

  const response = await getTopicPosts(slug);

  if (!response) {
    return notFound();
  }

  const { docs: posts, totalPages, page } = response;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
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
      title: "Topic Not Found | Lyovson.com",
      description: "The requested topic could not be found",
    };
  }

  const topicName = topic.name || slug;

  return {
    title: `${topicName} | Lyovson.com`,
    description: topic.description || `Posts about ${topicName}`,
    alternates: {
      canonical: `/topics/${slug}`,
    },
  };
}
