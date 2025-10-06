import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  });

  return (response.docs[0] as Post) || null;
}

export async function getPostByProjectAndSlug(
  projectSlug: string,
  slug: string
): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheTag(`project-${projectSlug}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "posts",
    depth: 2,
    where: {
      AND: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          "project.slug": {
            equals: projectSlug,
          },
        },
      ],
    },
  });

  return (response.docs[0] as Post) || null;
}

export async function getLatestPosts(limit = 12): Promise<PaginatedDocs<Post>> {
  "use cache";
  cacheTag("posts");
  cacheTag("homepage");
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "posts",
    depth: 1,
    limit,
    overrideAccess: false,
    sort: "createdAt:desc",
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}

export async function getPaginatedPosts(
  pageNumber: number,
  limit = 12
): Promise<PaginatedDocs<Post>> {
  "use cache";
  cacheTag("posts");
  cacheTag(`posts-page-${pageNumber}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "posts",
    depth: 1,
    limit,
    page: pageNumber,
    overrideAccess: false,
    sort: "createdAt:desc",
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}

export async function getPostCount() {
  "use cache";
  cacheTag("posts");
  cacheTag("post-count");
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });
  return await payload.count({
    collection: "posts",
    overrideAccess: false,
  });
}
