import configPromise from "@payload-config";
import {
  cacheLife,
  cacheTag,
} from "next/cache";
import { getPayload } from "payload";
import type { Post, Project, Topic } from "@/payload-types";

export async function getSitemapData() {
  "use cache";
  cacheTag("sitemap");
  cacheTag("posts");
  cacheTag("projects");
  cacheTag("topics");
  cacheLife("sitemap"); // Sitemap changes less frequently

  const payload = await getPayload({ config: configPromise });

  // Fetch all content with specific fields to optimize query
  const [posts, projects, topics] = await Promise.all([
    payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      depth: 1,
      select: {
        slug: true,
        updatedAt: true,
        project: true,
      },
    }),
    payload.find({
      collection: "projects",
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: "topics",
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    posts: posts.docs as Post[],
    projects: projects.docs as Project[],
    topics: topics.docs as Topic[],
  };
}
