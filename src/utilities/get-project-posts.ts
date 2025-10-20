import configPromise from "@payload-config";
import {
  cacheLife,
  cacheTag,
} from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

export async function getProjectPosts(
  slug: string
): Promise<PaginatedDocs<Post> | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("projects");
  cacheTag(`project-${slug}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  const project = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  if (!project?.docs?.[0]) {
    return null;
  }

  const projectId = project.docs[0].id;

  const result = await payload.find({
    collection: "posts",
    depth: 1,
    limit: 12,
    where: {
      project: {
        equals: projectId,
      },
    },
    overrideAccess: false,
    sort: "-publishedAt",
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}

export async function getPaginatedProjectPosts(
  slug: string,
  pageNumber: number,
  limit = 12
): Promise<PaginatedDocs<Post> | null> {
  "use cache";
  cacheTag("posts");
  cacheTag("projects");
  cacheTag(`project-${slug}`);
  cacheTag(`project-${slug}-page-${pageNumber}`);
  cacheLife("posts");

  const payload = await getPayload({ config: configPromise });

  const project = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  if (!project?.docs?.[0]) {
    return null;
  }

  const projectId = project.docs[0].id;

  const result = await payload.find({
    collection: "posts",
    depth: 1,
    limit,
    page: pageNumber,
    where: {
      project: {
        equals: projectId,
      },
    },
    overrideAccess: false,
    sort: "-publishedAt",
  });

  return {
    ...result,
    docs: result.docs as Post[],
  };
}
