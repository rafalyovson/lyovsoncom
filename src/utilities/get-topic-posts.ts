import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

export async function getTopicPosts(
  slug: string
): Promise<PaginatedDocs<Post> | null> {
  return getPaginatedTopicPosts(slug, 1, 25);
}

export async function getPaginatedTopicPosts(
  slug: string,
  pageNumber: number,
  limit = 25
): Promise<PaginatedDocs<Post> | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("topics");
  cacheTag(`topic-${slug}`);
  cacheTag(`topic-${slug}-page-${pageNumber}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  const topic = await payload.find({
    collection: "topics",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const topicId = topic.docs[0]?.id;

  if (!topicId) {
    return null;
  }

  const result = await payload.find({
    collection: "posts",
    depth: 2,
    limit,
    page: pageNumber,
    where: {
      AND: [
        {
          topics: {
            contains: topicId,
          },
        },
        {
          _status: {
            equals: "published",
          },
        },
      ],
    },
    sort: "-publishedAt",
    overrideAccess: true,
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}
