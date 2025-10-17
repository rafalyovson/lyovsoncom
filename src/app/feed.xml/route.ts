import configPromise from "@payload-config";
import { Feed } from "feed";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Project } from "@/payload-types";
import { extractLexicalText } from "@/utilities/extract-lexical-text";

// Force dynamic rendering for RSS feeds (2025 best practice)
// This ensures fresh content on every request while HTTP Cache-Control handles caching
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    const posts = await payload.find({
      collection: "posts",
      where: {
        _status: { equals: "published" },
      },
      limit: 50, // Latest 50 posts
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
      },
    });

    // Create feed instance with site information
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
      generator: "Next.js RSS for Lyovson.com",
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

    // Add posts to feed
    posts.docs
      .filter((post) => {
        return post.slug;
      })
      .forEach((post) => {
        const title = post.title;
        const description = post.description || "";
        const link = `${SITE_URL}/posts/${post.slug}`;
        const projectSlug =
          typeof post.project === "object" && post.project !== null
            ? (post.project as Project).slug || ""
            : "";
        const author = post.populatedAuthors?.[0]?.name || "Lyovson Team";

        // Extract full content from Lexical format for AI consumption
        const fullContent = post.content
          ? extractLexicalText(post.content)
          : "";

        // Use description as summary, full content as main content
        let contentText = description || fullContent;
        if (!contentText) {
          contentText = "Read the full article on Lyovson.com";
        }

        feed.addItem({
          title,
          id: link,
          link,
          description: contentText,
          content: fullContent || contentText,
          author: [
            {
              name: author,
              email: "hello@lyovson.com",
              link: `${SITE_URL}/${author.toLowerCase().replace(" ", "")}`,
            },
          ],
          contributor: [
            {
              name: "Lyovson.com",
              email: "hello@lyovson.com",
              link: SITE_URL,
            },
          ],
          date: new Date(post.publishedAt || post.updatedAt),
          category: [
            {
              name: projectSlug,
              domain: `${SITE_URL}/projects`,
            },
          ],
        });
      });

    return new Response(feed.rss2(), {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (_error) {
    // Fallback RSS feed
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Lyovson.com</title>
    <link>${SITE_URL}</link>
    <description>Writing, Projects & Research by Rafa and Jess Lyovson</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS for Lyovson.com</generator>
    <item>
      <title>RSS Feed Temporarily Unavailable</title>
      <link>${SITE_URL}</link>
      <description>The RSS feed is temporarily unavailable. Please visit the website directly.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="false">${SITE_URL}/rss-error-${Date.now()}</guid>
    </item>
  </channel>
</rss>`;

    return new Response(fallbackRss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "no-cache", // Don't cache error responses
      },
    });
  }
}
