import configPromise from "@payload-config";
import type { Metadata } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { Suspense } from "react";
import { createContactAction } from "@/actions/create-contact-action";
import {
  GridCardContent,
  GridCardHero,
  GridCardRelatedPosts,
  GridCardSubscribe,
} from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import RichText from "@/components/RichText";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Lyovson, Media, Post } from "@/payload-types";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/utilities/generate-json-ld";
import { getPost } from "@/utilities/get-post";
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
    slug: string;
  }>;
};

export default async function PostPage({ params: paramsPromise }: Args) {
  "use cache";

  const { slug } = await paramsPromise;

  // Add cache tags for this specific post
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheLife("posts");

  const post = await getPost(slug);
  if (!post?.content) {
    return notFound();
  }

  // Extract data for JSON-LD schemas
  const postImage =
    post.featuredImage && typeof post.featuredImage === "object"
      ? (post.featuredImage as Media)
      : null;
  const imageUrl = postImage?.url
    ? `${getServerSideURL()}${postImage.url}`
    : undefined;

  // Generate Article schema
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description || undefined,
    slug,
    publishedAt: post.publishedAt || undefined,
    updatedAt: post.updatedAt || undefined,
    imageUrl,
    imageWidth: postImage?.width || undefined,
    imageHeight: postImage?.height || undefined,
    authors: post.populatedAuthors
      ?.filter((author) => author.name && author.username)
      .map((author) => ({
        name: author.name as string,
        username: author.username as string,
      })),
    keywords: post.topics
      ?.map((topic) => {
        if (typeof topic === "object" && topic !== null) {
          return topic.name || topic.slug || "";
        }
        return "";
      })
      .filter(Boolean),
  });

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: getServerSideURL() },
    { name: "Posts", url: `${getServerSideURL()}/posts` },
    { name: post.title },
  ]);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SchemaArticle post={post} url={`${getServerSideURL()}/posts/${slug}`} />

      <GridCardHero className={""} post={post} />
      <GridCardContent
        className={cn(
          "g2:col-start-2 g2:col-end-3 g2:row-auto g2:row-start-3",
          "g3:col-end-4 g3:row-start-2 g3:w-[816px]"
        )}
      >
        <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
          <RichText
            className="h-full"
            content={post.content}
            enableGutter={false}
            enableProse={true}
          />
        </div>
      </GridCardContent>

      <aside
        className={cn(
          "col-start-1 col-end-2 row-start-6 row-end-7 grid grid-rows-2 gap-4 self-start",
          "g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-4"
        )}
      >
        <Suspense
          fallback={
            <div className="glass-section glass-loading h-[400px] w-[400px] animate-pulse rounded-xl">
              <Skeleton className="glass-badge h-full w-full" />
            </div>
          }
        >
          <RecommendedPosts
            recommendedIds={post.recommended_post_ids as number[] | undefined}
          />
        </Suspense>

        <GridCardSubscribe handleSubmit={createContactAction} />
      </aside>
    </>
  );
}

async function RecommendedPosts({
  recommendedIds,
}: {
  recommendedIds?: number[];
}) {
  // Early return if no recommendations stored
  if (!recommendedIds || recommendedIds.length === 0) {
    return null;
  }

  // Fetch the recommended posts by their stored IDs
  // No caching needed - these are pre-computed and stored in DB
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    where: {
      id: {
        in: recommendedIds,
      },
    },
    depth: 1, // Include featuredImage, etc.
    limit: recommendedIds.length,
  });

  if (posts.docs.length === 0) {
    return null;
  }

  return <GridCardRelatedPosts posts={posts.docs} />;
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("posts");
  cacheLife("static"); // Build-time data doesn't change often

  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    where: {
      _status: {
        equals: "published",
      },
    },
    limit: 1000,
  });

  return posts.docs
    .filter((post) => typeof post === "object" && "slug" in post && post.slug)
    .map((post) => ({
      slug: (post as { slug: string }).slug,
    }));
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Metadata generation requires many conditional fields for SEO/social media
export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { slug } = await paramsPromise;

  // Add cache tags for metadata
  cacheTag("posts");
  cacheTag(`post-${slug}`);
  cacheLife("posts");

  const post = await getPost(slug);
  if (!post) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested post could not be found",
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
  const canonicalUrl = `/posts/${slug}`;

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
            const author = a as Partial<Lyovson> & {
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
