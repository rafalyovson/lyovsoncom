import configPromise from "@payload-config";
import type { Metadata } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { Suspense } from "react";
import { GridCardHero } from "src/components/grid/card/hero";

import { GridCardRelatedPosts } from "@/components/grid/card/related";
import RichText from "@/components/RichText";
import { Skeleton } from "@/components/ui/skeleton";
import type { Media, Post, User } from "@/payload-types";
import { getPostByProjectAndSlug } from "@/utilities/get-post";
import { getProject } from "@/utilities/get-project";
import { getServerSideURL } from "@/utilities/getURL";

// Lexical content node types
type LexicalContentNode =
  | string
  | {
      text?: string;
      children?: LexicalContentNode[];
      content?: LexicalContentNode;
    }
  | LexicalContentNode[];

// Helper function to extract text from rich content
function _extractTextFromContent(content: LexicalContentNode): string {
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

type Args = {
  params: Promise<{
    project: string;
    slug: string;
  }>;
};

export default async function PostPage({ params: paramsPromise }: Args) {
  "use cache";

  const { project: projectSlug, slug } = await paramsPromise;

  // Add cache tags for this specific post and project
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheTag(`project-${projectSlug}`);
  cacheLife("posts");

  const project = await getProject(projectSlug);
  if (!project) {
    return notFound();
  }

  const post = await getPostByProjectAndSlug(projectSlug, slug);
  if (!post?.content) {
    return notFound();
  }

  return (
    <>
      <SchemaArticle
        post={post}
        url={`https://lyovson.com/${projectSlug}/${slug}`}
      />

      <GridCardHero
        className={
          "g2:col-start-2 g3:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-start-1 g2:row-end-2 g4:self-start"
        }
        post={post}
      />
      <article className="glass-card glass-interactive g2:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-auto g2:row-start-2 g3:w-[816px] w-[400px] rounded-lg p-6">
        <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
          <RichText
            className="h-full"
            content={post.content}
            enableGutter={false}
            enableProse={true}
          />
        </div>
      </article>

      <aside
        className={
          "g2:col-start-1 g4:col-start-4 g2:col-end-2 g4:col-end-5 g2:row-start-2 g4:row-start-1 g2:row-end-3 g4:row-end-2 g2:self-start"
        }
      >
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Suspense
            fallback={
              <div className="glass-section glass-loading h-[400px] w-[400px] animate-pulse rounded-xl">
                <Skeleton className="glass-badge h-full w-full" />
              </div>
            }
          >
            <GridCardRelatedPosts posts={post.relatedPosts} />
          </Suspense>
        )}
      </aside>
    </>
  );
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("posts");
  cacheTag("projects");
  cacheLife("static"); // Build-time data doesn't change often

  const payload = await getPayload({ config: configPromise });
  const projects = await payload.find({
    collection: "projects",
    limit: 1000,
  });

  const paths: { project: string; slug: string }[] = [];

  for (const project of projects.docs) {
    if (typeof project === "object" && "slug" in project && project.slug) {
      const posts = await payload.find({
        collection: "posts",
        where: {
          "project.id": {
            equals: project.id,
          },
        },
        limit: 1000,
      });

      for (const post of posts.docs) {
        if (typeof post === "object" && "slug" in post && post.slug) {
          paths.push({
            project: project.slug as string,
            slug: post.slug as string,
          });
        }
      }
    }
  }

  return paths;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Metadata generation requires many conditional fields for SEO/social media
export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { project: projectSlug, slug } = await paramsPromise;

  // Add cache tags for metadata
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheTag(`project-${projectSlug}`);
  cacheLife("posts");

  const post = await getPostByProjectAndSlug(projectSlug, slug);
  if (!post) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested project could not be found",
    };
  }

  // Use main fields with fallbacks to old meta fields during migration
  type PostWithLegacyMeta = typeof post & {
    meta?: { description?: string; image?: unknown };
  };

  const title = post.title;
  const description =
    post.description || (post as PostWithLegacyMeta).meta?.description || "";
  const postImage =
    post.featuredImage || (post as PostWithLegacyMeta).meta?.image;
  const metaImage: Media | null =
    postImage && typeof postImage === "object" ? (postImage as Media) : null;

  // Since metadataBase is set in layout, we can use the URL directly
  const imageUrl = metaImage?.url || null;

  const ogImageAlt = metaImage?.alt || title;

  // Fix the topic mapping
  const keywords = post.topics
    ?.map((topic) => {
      if (typeof topic === "object" && topic !== null) {
        return topic.name || topic.slug || "";
      }
      return "";
    })
    .filter(Boolean);

  // Relative URL path - metadataBase will be prepended automatically
  const canonicalUrl = `/${projectSlug}/${slug}`;

  return {
    title: `${title} | Lyovson.com`,
    description,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl, // Let metadataBase handle the domain
      siteName: "Lyovson.com",
      images: imageUrl
        ? [
            {
              url: imageUrl, // Relative URL since metadataBase is set
              width: 1200,
              height: 630,
              alt: ogImageAlt || "",
            },
          ]
        : undefined,
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors:
        post.populatedAuthors?.map((author) => `/${author.username}`) || [], // Make author URLs relative
    },
    twitter: {
      card: "summary_large_image",
      site: "@lyovson",
      creator: post.populatedAuthors?.[0]?.username
        ? `@${post.populatedAuthors[0].username}`
        : "@lyovson",
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: ogImageAlt || "",
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    other: {
      // Only include defined values to satisfy TypeScript
      ...(process.env.FACEBOOK_APP_ID
        ? { "fb:app_id": process.env.FACEBOOK_APP_ID }
        : {}),
      ...(post.populatedAuthors?.length
        ? {
            "article:author": post.populatedAuthors
              .map((author) => author.name)
              .join(", "),
          }
        : {}),
      ...(post.publishedAt
        ? { "article:published_time": post.publishedAt }
        : {}),
      ...(post.updatedAt ? { "article:modified_time": post.updatedAt } : {}),
      ...(post.project && typeof post.project === "object" && post.project.slug
        ? { "article:section": post.project.slug }
        : {}),
      ...(keywords?.length ? { "article:tag": keywords.join(", ") } : {}),
      // AI-specific meta tags for individual articles
      "ai-content-type": "article",
      "ai-content-license": "attribution-required",
      "ai-content-language": "en",
      "ai-api-url": `${getServerSideURL()}/api/posts/${post.id}`,
      "ai-embedding-url": `${getServerSideURL()}/api/embeddings/posts/${post.id}`,
      ...(post.project && typeof post.project === "object" && post.project.slug
        ? { "ai-project": post.project.slug }
        : {}),
      ...(keywords?.length ? { "ai-topics": keywords.join(",") } : {}),
      ...(post.populatedAuthors?.length
        ? {
            "ai-authors": post.populatedAuthors
              .map((author) => author.username || author.name)
              .join(","),
          }
        : {}),
    },
  };
}

function SchemaArticle({ post, url }: { post: Post; url: string }) {
  // Use main fields with fallbacks to old meta fields during migration
  type PostWithMeta = Post & {
    meta?: { description?: string; image?: unknown };
  };
  const description =
    post.description || (post as PostWithMeta).meta?.description || "";
  const postImageRaw = post.featuredImage || (post as PostWithMeta).meta?.image;
  const postImage: Media | null =
    postImageRaw && typeof postImageRaw === "object"
      ? (postImageRaw as Media)
      : null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author:
      post.populatedAuthors
        ?.map((a) => {
          if (typeof a === "object" && a !== null) {
            const author = a as Partial<User> & {
              socialLinks?: Record<string, string>;
            };
            return {
              "@type": "Person" as const,
              name: author.name,
              url: `https://lyovson.com/${author.username}`,
              sameAs: author.socialLinks
                ? Object.values(author.socialLinks).filter(Boolean)
                : undefined,
            };
          }
          return null;
        })
        .filter(Boolean) || [],
    publisher: {
      "@type": "Organization",
      name: "Lyovson.com",
      url: "https://lyovson.com",
      logo: {
        "@type": "ImageObject",
        url: "https://lyovson.com/logo-black.webp",
        width: 600,
        height: 60,
      },
      sameAs: ["https://twitter.com/lyovson", "https://github.com/lyovson"],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: postImage?.url
      ? {
          "@type": "ImageObject",
          url: postImage.url,
          width: 1200,
          height: 630,
          alt: postImage.alt || post.title,
        }
      : undefined,
    url,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Lyovson.com",
      url: "https://lyovson.com",
    },
    about:
      post.topics
        ?.map((topic) => {
          if (typeof topic === "object" && topic !== null) {
            return topic.name || topic.slug;
          }
          return typeof topic === "string" ? topic : null;
        })
        .filter(Boolean)
        .map((name) => ({
          "@type": "Thing" as const,
          name,
        })) || undefined,
    keywords:
      post.topics
        ?.map((topic) => {
          if (typeof topic === "object" && topic !== null) {
            return topic.name || topic.slug;
          }
          return typeof topic === "string" ? topic : null;
        })
        .filter(Boolean)
        .join(", ") || undefined,
    articleSection:
      post.project && typeof post.project === "object"
        ? post.project.slug
        : undefined,
    ...(post.content &&
      typeof post.content === "object" &&
      "root" in post.content && {
        wordCount: undefined, // Lexical content doesn't have simple length
      }),
    ...(post.content &&
      typeof post.content === "object" &&
      "root" in post.content && {
        timeRequired: undefined, // Would need to extract text first
      }),
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - JSON.stringify on controlled structured data for SEO
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      type="application/ld+json"
    />
  );
}
