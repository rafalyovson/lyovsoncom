import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getActivityPath } from "@/utilities/activity-path";
import { getSitemapData } from "@/utilities/get-sitemap-data";

const POSTS_PER_PAGE = 25;
const NOTES_PER_PAGE = 25;
const ACTIVITIES_PER_PAGE = 25;
const PROJECT_POSTS_PER_PAGE = 25;
const TOPIC_POSTS_PER_PAGE = 25;
const MAX_INDEXED_PAGE = 3;

function getIndexedPaginationPages(totalItems: number, pageSize: number) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxPage = Math.min(totalPages, MAX_INDEXED_PAGE);
  const pages: number[] = [];

  for (let pageNumber = 2; pageNumber <= maxPage; pageNumber++) {
    pages.push(pageNumber);
  }

  return pages;
}

function getSlugFromRelation(
  relation: unknown,
  idToSlugMap: Map<string, string>
) {
  if (typeof relation === "object" && relation !== null && "slug" in relation) {
    const slug = relation.slug;
    if (typeof slug === "string" && slug.length > 0) {
      return slug;
    }
  }

  if (typeof relation === "number" || typeof relation === "string") {
    return idToSlugMap.get(String(relation));
  }

  return null;
}

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Sitemap generation aggregates multiple collections and routes */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheTag("sitemap");
  cacheTag("posts");
  cacheTag("projects");
  cacheTag("topics");
  cacheTag("notes");
  cacheTag("activities");
  cacheTag("lyovsons");
  cacheLife("sitemap");

  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";
  const now = new Date();

  const { posts, projects, topics, notes, activities, lyovsons } =
    await getSitemapData();

  const projectSlugById = new Map<string, string>();
  const topicSlugById = new Map<string, string>();
  const projectPostCounts = new Map<string, number>();
  const topicPostCounts = new Map<string, number>();

  for (const project of projects) {
    if (!(project?.id && project.slug)) {
      continue;
    }
    projectSlugById.set(String(project.id), project.slug);
  }

  for (const topic of topics) {
    if (!(topic?.id && topic.slug)) {
      continue;
    }
    topicSlugById.set(String(topic.id), topic.slug);
  }

  for (const post of posts) {
    const projectSlug = getSlugFromRelation(post?.project, projectSlugById);
    if (projectSlug) {
      projectPostCounts.set(
        projectSlug,
        (projectPostCounts.get(projectSlug) || 0) + 1
      );
    }

    if (!Array.isArray(post?.topics)) {
      continue;
    }

    for (const topicRelation of post.topics) {
      const topicSlug = getSlugFromRelation(topicRelation, topicSlugById);
      if (!topicSlug) {
        continue;
      }
      topicPostCounts.set(topicSlug, (topicPostCounts.get(topicSlug) || 0) + 1);
    }
  }

  const routes: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    // Main section pages - high priority
    {
      url: `${SITE_URL}/posts`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/activities`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Utility pages - medium priority
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // AI and bot documentation - high priority for discovery
    {
      url: `${SITE_URL}/ai-docs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/.well-known/ai-resources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
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

  // Add paginated archive pages that are indexable
  for (const pageNumber of getIndexedPaginationPages(
    posts.length,
    POSTS_PER_PAGE
  )) {
    routes.push({
      url: `${SITE_URL}/posts/page/${pageNumber}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
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

    const projectPostCount = projectPostCounts.get(project.slug) || 0;
    for (const pageNumber of getIndexedPaginationPages(
      projectPostCount,
      PROJECT_POSTS_PER_PAGE
    )) {
      routes.push({
        url: `${SITE_URL}/projects/${project.slug}/page/${pageNumber}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
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

    const topicPostCount = topicPostCounts.get(topic.slug) || 0;
    for (const pageNumber of getIndexedPaginationPages(
      topicPostCount,
      TOPIC_POSTS_PER_PAGE
    )) {
      routes.push({
        url: `${SITE_URL}/topics/${topic.slug}/page/${pageNumber}`,
        lastModified: new Date(topic.updatedAt),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
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

  for (const pageNumber of getIndexedPaginationPages(
    notes.length,
    NOTES_PER_PAGE
  )) {
    routes.push({
      url: `${SITE_URL}/notes/page/${pageNumber}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Add activities
  for (const activity of activities) {
    if (!activity?.slug) {
      continue;
    }

    const activityPath = getActivityPath(activity);
    if (!activityPath) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}${activityPath}`,
      lastModified: new Date(activity.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const pageNumber of getIndexedPaginationPages(
    activities.length,
    ACTIVITIES_PER_PAGE
  )) {
    routes.push({
      url: `${SITE_URL}/activities/page/${pageNumber}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Add author pages discovered from the CMS
  for (const lyovson of lyovsons) {
    if (!lyovson?.username) {
      continue;
    }

    routes.push({
      url: `${SITE_URL}/${lyovson.username}`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/bio`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/portfolio`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/contact`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/posts`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/notes`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    });

    routes.push({
      url: `${SITE_URL}/${lyovson.username}/activities`,
      lastModified: lyovson.updatedAt
        ? new Date(lyovson.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return routes;
}
