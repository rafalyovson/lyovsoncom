import configPromise from "@payload-config";
import {
  cacheLife,
  cacheTag,
} from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Lyovson, Post } from "@/payload-types";

type AuthorPostsResponse = {
  posts: PaginatedDocs<Post>;
  user: Lyovson;
};

export async function getAuthorPosts(
  username: string
): Promise<AuthorPostsResponse | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  // First get the lyovson
  const userResult = await payload.find({
    collection: "lyovsons",
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

  const user = userResult.docs[0] as Lyovson;
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
