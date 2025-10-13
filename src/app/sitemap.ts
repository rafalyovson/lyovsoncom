import type { MetadataRoute } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { Post, Project, Topic } from "@/payload-types";
import { getSitemapData } from "@/utilities/get-sitemap-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheTag("sitemap");
  cacheTag("posts");
  cacheTag("projects");
  cacheTag("topics");
  cacheLife("sitemap"); // Use sitemap-specific cache life

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  // Get all cached sitemap data
  const { posts, projects, topics } = await getSitemapData();

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
      url: `${SITE_URL}/api/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
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
    // Embeddings API documentation
    {
      url: `${SITE_URL}/api/embeddings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/api/embeddings/status`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  // Add posts with enhanced metadata
  posts
    .filter((post): post is Post => Boolean(post?.slug))
    .forEach((post) => {
      routes.push({
        url: `${SITE_URL}/posts/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly", // Articles change less frequently after publication
        priority: 0.8,
      });
    });

  // Add projects with better change frequency
  projects
    .filter((project): project is Project => Boolean(project?.slug))
    .forEach((project) => {
      routes.push({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

  // Add topics with appropriate priority
  topics
    .filter((topic): topic is Topic => Boolean(topic?.slug))
    .forEach((topic) => {
      routes.push({
        url: `${SITE_URL}/topics/${topic.slug}`,
        lastModified: new Date(topic.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

  return routes;
}
