import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

export async function getTopicPosts(
  slug: string
): Promise<PaginatedDocs<Post> | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("topics");
  cacheTag(`topic-${slug}`);
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
    limit: 12,
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
    sort: "-createdAt",
    overrideAccess: true,
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}
