import configPromise from "@payload-config";
import { Feed } from "feed";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Project } from "@/payload-types";
import { extractLexicalText } from "@/utilities/extract-lexical-text";

// Force dynamic rendering for Atom feeds (2025 best practice)
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
      generator: "Next.js Atom Feed for Lyovson.com",
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
        const projectSlug =
          typeof post.project === "object" && post.project !== null
            ? (post.project as Project).slug || ""
            : "";
        const author = post.populatedAuthors?.[0]?.name || "Lyovson Team";

        // Extract full content from Lexical format for AI consumption
        const fullContent = post.content
          ? extractLexicalText(post.content)
          : "";

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
          date: new Date(post.publishedAt || post.updatedAt),
          category: [
            {
              name: projectSlug,
              domain: `${SITE_URL}/projects`,
            },
          ],
        });
      });

    return new Response(feed.atom1(), {
      status: 200,
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (_error) {
    const fallbackAtom = `<?xml version="1.0" encoding="UTF-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Lyovson.com</title>
  <link href="${SITE_URL}" />
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <id>${SITE_URL}</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Rafa &amp; Jess Lyovson</name>
  </author>
  <entry>
    <title>Feed Temporarily Unavailable</title>
    <link href="${SITE_URL}" />
    <id>${SITE_URL}/feed-error-${Date.now()}</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>The Atom feed is temporarily unavailable. Please visit the website directly.</summary>
  </entry>
</feed>`;

    return new Response(fallbackAtom, {
      status: 200,
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }
}
