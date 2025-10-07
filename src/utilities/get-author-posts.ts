import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post, User } from "@/payload-types";

type AuthorPostsResponse = {
  posts: PaginatedDocs<Post>;
  user: User;
};

export async function getAuthorPosts(
  username: string
): Promise<AuthorPostsResponse | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("users");
  cacheTag(`author-${username}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  // First get the user
  const userResult = await payload.find({
    collection: "users",
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
  });

  if (!userResult?.docs?.[0]) {
    return null;
  }

  const user = userResult.docs[0] as User;
  const authorId = user.id;

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
    sort: "-publishedAt",
  });

  return {
    posts: {
      ...result,
      docs: result.docs as Post[],
    },
    user,
  };
}
