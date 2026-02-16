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
      overrideAccess: false,
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
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: "topics",
      overrideAccess: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: "notes",
      overrideAccess: false,
      where: {
        _status: { equals: "published" },
        visibility: { equals: "public" },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: "activities",
      overrideAccess: false,
      where: {
        _status: { equals: "published" },
        visibility: { equals: "public" },
      },
      select: {
        slug: true,
        updatedAt: true,
        finishedAt: true,
        startedAt: true,
        publishedAt: true,
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
