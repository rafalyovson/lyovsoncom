import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { Activity, Note, Post, Project, Topic } from "@/payload-types";

export async function getSitemapData() {
  "use cache";
  cacheTag("sitemap");
  cacheTag("posts");
  cacheTag("projects");
  cacheTag("topics");
  cacheTag("notes");
  cacheTag("activities");
  cacheLife("sitemap");

  const payload = await getPayload({ config: configPromise });

  const [posts, projects, topics, notes, activities] = await Promise.all([
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
    payload.find({
      collection: "notes",
      where: { _status: { equals: "published" } },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: "activities",
      where: { _status: { equals: "published" } },
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
    notes: notes.docs as Note[],
    activities: activities.docs as Activity[],
  };
}
