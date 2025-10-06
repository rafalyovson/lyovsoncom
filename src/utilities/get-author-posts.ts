import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

export async function getAuthorPosts(
  username: string
): Promise<PaginatedDocs<Post> | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("users");
  cacheTag(`author-${username}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  // First get the user ID
  const user = await payload.find({
    collection: "users",
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
    sort: "createdAt:desc",
  });

  if (!user?.docs?.[0]) {
    return null;
  }

  const authorId = user.docs[0]?.id;

  // Then query posts using the author ID
  const result = await payload.find({
    collection: "posts",
    depth: 1,
    limit: 12,
    where: {
      authors: {
        contains: authorId,
      },
    },
    overrideAccess: false,
    sort: "createdAt:desc",
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}
