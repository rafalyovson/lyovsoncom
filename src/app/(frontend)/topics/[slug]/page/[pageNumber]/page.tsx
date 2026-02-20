import { cacheLife, cacheTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getTopic } from "@/utilities/get-topic";
import { getPaginatedTopicPosts } from "@/utilities/get-topic-posts";
import { getServerSideURL } from "@/utilities/getURL";

const POSTS_PER_PAGE = 25;
const MAX_INDEXED_PAGE = 3;

interface Args {
  params: Promise<{
    slug: string;
    pageNumber: string;
  }>;
}

export const dynamicParams = true;

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { slug, pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  cacheTag("posts");
  cacheTag("topics");
  cacheTag(`topic-${slug}`);
  cacheTag(`topic-${slug}-page-${pageNumber}`);
  cacheLife("posts");

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    return notFound();
  }
  if (sanitizedPageNumber === 1) {
    redirect(`/topics/${slug}`);
  }

  const topic = await getTopic(slug);
  if (!topic) {
    return notFound();
  }

  const response = await getPaginatedTopicPosts(
    slug,
    sanitizedPageNumber,
    POSTS_PER_PAGE
  );

  if (!response) {
    return notFound();
  }

  const { docs: posts, totalPages, page } = response;
  const topicName = topic.name || slug;
  const collectionPageSchema = generateCollectionPageSchema({
    name: `${topicName} - Page ${sanitizedPageNumber}`,
    description:
      topic.description ||
      `Archive of posts about ${topicName} on page ${sanitizedPageNumber}.`,
    url: `${getServerSideURL()}/topics/${slug}/page/${sanitizedPageNumber}`,
    itemCount: response.totalDocs,
    items: posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${getServerSideURL()}/posts/${post.slug}`,
      })),
  });

  return (
    <>
      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
      </Suspense>
      {totalPages > 1 && page && (
        <Pagination
          basePath={`/topics/${slug}/page`}
          firstPagePath={`/topics/${slug}`}
          page={page}
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

  const { slug, pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  cacheTag("topics");
  cacheTag(`topic-${slug}`);
  cacheTag(`topic-${slug}-page-${pageNumber}`);
  cacheLife("topics");

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyovson.com",
      description: "The requested page could not be found",
    };
  }

  const topic = await getTopic(slug);
  if (!topic) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Topic Not Found | Lyovson.com",
      description: "The requested topic could not be found",
    };
  }

  const topicName = topic.name || slug;
  const description =
    topic.description || `Posts about ${topicName} - page ${sanitizedPageNumber}`;
  const title = `${topicName} - Page ${sanitizedPageNumber} | Lyóvson.com`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: `/topics/${slug}/page/${sanitizedPageNumber}`,
      ...(sanitizedPageNumber > 1 && {
        prev:
          sanitizedPageNumber === 2
            ? `/topics/${slug}`
            : `/topics/${slug}/page/${sanitizedPageNumber - 1}`,
      }),
    },
    openGraph: {
      siteName: "Lyóvson.com",
      title,
      description,
      type: "website",
      url: `/topics/${slug}/page/${sanitizedPageNumber}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@lyovson",
    },
    robots: {
      index: sanitizedPageNumber <= MAX_INDEXED_PAGE,
      follow: true,
      noarchive: sanitizedPageNumber > 1,
    },
  };
}
