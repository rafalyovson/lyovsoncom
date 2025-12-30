import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getSitemapData } from "@/utilities/get-sitemap-data";

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Sitemap generation aggregates multiple collections and routes */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheTag("sitemap");
  cacheTag("posts");
  cacheTag("projects");
  cacheTag("topics");
  cacheTag("notes");
  cacheTag("activities");
  cacheLife("sitemap");

  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";

  const { posts, projects, topics, notes, activities } = await getSitemapData();

  const routes: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Main section pages - high priority
    {
      url: `${SITE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/activities`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Author pages - high priority for personal branding
    {
      url: `${SITE_URL}/rafa`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/jess`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Utility pages - medium priority
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/playground`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/subscription-confirmed`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    // AI and bot documentation - high priority for discovery
    {
      url: `${SITE_URL}/ai-docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/.well-known/ai-resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Note: API endpoints removed from sitemap to prevent crawler-induced database wake-ups
    // API docs are still accessible but not indexed as sitemap entries
  ];

  // Add posts with enhanced metadata
  for (const post of posts) {
    if (!post?.slug) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly", // Articles change less frequently after publication
      priority: 0.8,
    });
  }

  // Add projects with better change frequency
  for (const project of projects) {
    if (!project?.slug) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Add topics with appropriate priority
  for (const topic of topics) {
    if (!topic?.slug) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/topics/${topic.slug}`,
      lastModified: new Date(topic.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Add notes
  for (const note of notes) {
    if (!note?.slug) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/notes/${note.slug}`,
      lastModified: new Date(note.updatedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Add activities
  for (const activity of activities) {
    if (!activity?.slug) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/activities/${activity.slug}`,
      lastModified: new Date(activity.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return routes;
}
