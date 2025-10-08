import configPromise from "@payload-config";
import { Feed } from "feed";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";

export async function GET(_request: NextRequest) {
  "use cache";
  cacheTag("rss");
  cacheTag("posts");
  cacheLife("rss");

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    const posts = await payload.find({
      collection: "posts",
      where: {
        _status: { equals: "published" },
      },
      limit: 50,
      sort: "-publishedAt",
      depth: 2,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        updatedAt: true,
        description: true,
        populatedAuthors: true,
        project: true,
        content: true,
        topics: true,
      },
    });

    const feed = new Feed({
      title: "Lyovson.com - Writing, Projects & Research",
      description:
        "Latest posts and articles from Rafa and Jess Lyovson covering programming, design, philosophy, and technology.",
      id: SITE_URL,
      link: SITE_URL,
      language: "en-US",
      image: `${SITE_URL}/og-image.png`,
      favicon: `${SITE_URL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Lyovson.com`,
      updated: new Date(),
      generator: "Next.js JSON Feed for Lyovson.com",
      feedLinks: {
        rss2: `${SITE_URL}/feed.xml`,
        json: `${SITE_URL}/feed.json`,
        atom: `${SITE_URL}/atom.xml`,
      },
      author: {
        name: "Rafa & Jess Lyovson",
        email: "hello@lyovson.com",
        link: SITE_URL,
      },
    });

    // Add posts to feed (same logic as RSS)
    posts.docs
      .filter((post) => {
        return post.slug;
      })
      .forEach((post) => {
        const title = post.title;
        const description = post.description || "";
        const link = `${SITE_URL}/posts/${post.slug}`;
        const projectSlug = (post.project as any)?.slug || "";
        const author = post.populatedAuthors?.[0]?.name || "Lyovson Team";

        let contentText = description;
        const fullContent: string = "";

        if (!contentText) {
          contentText = "Read the full article on Lyovson.com";
        }

        // Enhanced feed item with AI-friendly metadata
        const feedItem = {
          title,
          id: link,
          link,
          description: contentText,
          content: fullContent || contentText, // Full content for AI consumption
          author: [
            {
              name: author,
              email: "hello@lyovson.com",
              link: `${SITE_URL}/${author.toLowerCase().replace(" ", "")}`,
            },
          ],
          date: new Date(post.publishedAt || post.updatedAt),
          category: [
            {
              name: projectSlug,
              domain: `${SITE_URL}/projects`,
            },
          ],
        };

        // Add topics as additional categories for AI understanding
        if (post.topics && Array.isArray(post.topics)) {
          post.topics.forEach((topic: any) => {
            const topicName =
              typeof topic === "object" ? topic.name || topic.slug : topic;
            if (topicName) {
              feedItem.category.push({
                name: topicName,
                domain: `${SITE_URL}/topics`,
              });
            }
          });
        }

        // Add custom metadata for AI systems
        const customMetadata = {
          wordCount: fullContent
            ? Math.ceil(fullContent.split(" ").length)
            : undefined,
          readingTime: fullContent
            ? Math.ceil(fullContent.split(" ").length / 200)
            : undefined,
          contentType: "article",
          language: "en",
          projectSlug,
          originalUrl: link,
          apiUrl: `${SITE_URL}/api/posts/${post.id}`,
        };

        // Add metadata as extensions (JSON Feed 1.1 supports extensions)
        Object.assign(feedItem, { _lyovson_metadata: customMetadata });

        feed.addItem(feedItem);
      });

    return new Response(feed.json1(), {
      status: 200,
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (_error) {
    const fallbackJson = {
      version: "https://jsonfeed.org/version/1.1",
      title: "Lyovson.com",
      home_page_url: SITE_URL,
      feed_url: `${SITE_URL}/feed.json`,
      description: "Writing, Projects & Research by Rafa and Jess Lyovson",
      authors: [
        {
          name: "Rafa & Jess Lyovson",
          url: SITE_URL,
        },
      ],
      items: [
        {
          id: `${SITE_URL}/feed-error-${Date.now()}`,
          url: SITE_URL,
          title: "Feed Temporarily Unavailable",
          content_text:
            "The JSON feed is temporarily unavailable. Please visit the website directly.",
          date_published: new Date().toISOString(),
        },
      ],
    };

    return new Response(JSON.stringify(fallbackJson, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }
}

function _extractTextFromContent(content: any): string {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(_extractTextFromContent).join(" ");
  }

  if (typeof content === "object") {
    if (content.text) {
      return content.text;
    }
    if (content.children) {
      return _extractTextFromContent(content.children);
    }
    if (content.content) {
      return _extractTextFromContent(content.content);
    }
  }

  return "";
}
