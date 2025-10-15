import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Note, Post, Project } from "@/payload-types";
import { generateEmbedding } from "@/utilities/generate-embedding";

// Extended types with pgvector fields
type ItemWithEmbedding = (Post | Note | Project) & {
  embedding_vector?: string | null;
  embedding_model?: string | null;
  embedding_dimensions?: number | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'posts', 'projects', 'all'
  const id = searchParams.get("id"); // specific item ID
  const query = searchParams.get("q"); // text query to embed
  const includeContent = searchParams.get("content") === "true";
  const includeVector = searchParams.get("vector") !== "false"; // Include vector by default
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") || "50", 10),
    100
  );

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Handle text query embedding - generate on-demand
    if (query) {
      const { vector, model, dimensions } = await generateEmbedding(query);
      return new Response(
        JSON.stringify({
          query,
          embedding: vector,
          dimensions,
          model,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Handle specific item embedding
    if (id && type) {
      // TODO: Properly type this as union of Post | Note | Project with embedding fields
      let item: ItemWithEmbedding | null = null as any;

      if (type === "posts") {
        item = await payload.findByID({
          collection: "posts",
          id: Number.parseInt(id, 10),
          depth: 2,
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            meta: true,
            topics: true,
            project: true,
            populatedAuthors: true,
            publishedAt: true,
            updatedAt: true,
            embedding_vector: true, // pgvector field
            embedding_model: true,
            embedding_dimensions: true,
            embedding_generated_at: true,
          },
        });
      } else if (type === "projects") {
        item = await payload.findByID({
          collection: "projects",
          id: Number.parseInt(id, 10),
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            updatedAt: true,
          },
        });
      }

      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Use pre-computed embedding for posts, generate for projects
      let embedding: number[] = [];
      let model = "unknown";
      let dimensions = 0;

      if (type === "posts" && item.embedding_vector) {
        // Use pre-computed embedding - parse pgvector format
        const vectorString = item.embedding_vector;
        embedding =
          typeof vectorString === "string"
            ? JSON.parse(vectorString)
            : vectorString;
        model = item.embedding_model || "pre-computed";
        dimensions = item.embedding_dimensions || embedding.length;
      } else {
        // Extract text content for embedding
        const title =
          "title" in item ? item.title : "name" in item ? item.name : "";
        const description = "description" in item ? item.description : "";
        const textToEmbed = [title, description].filter(Boolean).join(" ");

        const result = await generateEmbedding(textToEmbed);
        embedding = result.vector;
        model = result.model;
        dimensions = result.dimensions;
      }

      const result = {
        id: item.id,
        type,
        ...(includeVector && { embedding }),
        dimensions,
        metadata: {
          title: "title" in item ? item.title : "name" in item ? item.name : "",
          slug: item.slug,
          ...(includeContent &&
            type === "posts" && {
              wordCount: (item as any).embedding_generated_at
                ? "available"
                : "not-computed",
              readingTime: "available-on-individual-endpoint",
            }),
          url:
            type === "posts" && "project" in item && item.project
              ? `${SITE_URL}/${typeof item.project === "object" ? item.project.slug : "posts"}/${item.slug}`
              : `${SITE_URL}/${item.slug}`,
          lastModified: item.updatedAt,
          ...(type === "posts" &&
            "populatedAuthors" in item && {
              authors: item.populatedAuthors?.map((author: any) => ({
                name: author.name,
                username: author.username,
              })),
              project:
                "project" in item &&
                item.project &&
                typeof item.project === "object"
                  ? { name: item.project.name, slug: item.project.slug }
                  : null,
              topics:
                "topics" in item
                  ? item.topics
                      ?.map((t: any) =>
                        typeof t === "object"
                          ? { name: t.name, slug: t.slug }
                          : t
                      )
                      .filter(Boolean)
                  : undefined,
              hasPrecomputedEmbedding: !!item.embedding_vector,
            }),
        },
        model,
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=7200, s-maxage=7200", // Cache individual embeddings longer
          "Access-Control-Allow-Origin": "*",
          "X-Embedding-Source": (item as any).embedding_vector
            ? "pre-computed"
            : "on-demand",
        },
      });
    }

    // Handle bulk embeddings
    const embeddings: Array<{
      id: number | string;
      type: string;
      embedding?: number[];
      dimensions: number;
      metadata: Record<string, unknown>;
      model: string;
    }> = [];

    if (type === "posts" || type === "all") {
      const posts = await payload.find({
        collection: "posts",
        where: { _status: { equals: "published" } },
        limit,
        depth: 2,
        select: {
          id: true,
          title: true,
          slug: true,
          meta: true,
          topics: true,
          project: true,
          populatedAuthors: true,
          updatedAt: true,
          embedding_vector: true, // pgvector field
          embedding_model: true,
          embedding_dimensions: true,
        },
      });

      for (const post of posts.docs) {
        let embedding: number[] = [];
        let model = "unknown";
        let dimensions = 0;

        if ((post as any).embedding_vector) {
          // Use pre-computed embedding - parse pgvector format
          const vectorString = (post as any).embedding_vector;
          embedding =
            typeof vectorString === "string"
              ? JSON.parse(vectorString)
              : vectorString;
          model = (post as any).embedding_model || "pre-computed";
          dimensions = (post as any).embedding_dimensions || embedding.length;
        } else {
          // Skip posts without pre-computed embeddings in bulk requests
          // to avoid long response times
          continue;
        }

        embeddings.push({
          id: post.id,
          type: "post",
          ...(includeVector && { embedding }),
          dimensions,
          metadata: {
            title: post.title,
            slug: post.slug,
            url:
              post.project && typeof post.project === "object"
                ? `${SITE_URL}/${post.project.slug}/${post.slug}`
                : `${SITE_URL}/posts/${post.slug}`,
            lastModified: post.updatedAt,
            topics: post.topics
              ?.map((t: any) => (typeof t === "object" ? t.name : t))
              .filter(Boolean),
            authors: post.populatedAuthors?.map((author: any) => ({
              name: author.name,
              username: author.username,
            })),
            project:
              post.project && typeof post.project === "object"
                ? { name: post.project.name, slug: post.project.slug }
                : null,
            hasPrecomputedEmbedding: true,
          },
          model,
        });
      }
    }

    // Projects don't have pre-computed embeddings yet, but we can add them later
    // For now, skip projects in bulk requests to keep responses fast

    const response = {
      embeddings,
      count: embeddings.length,
      dimensions: embeddings[0]?.dimensions || 0,
      model: embeddings.length > 0 ? "mixed" : "none",
      usage: {
        type: type || "all",
        includeContent,
        includeVector,
        limit,
        precomputedOnly: true, // We only return pre-computed embeddings in bulk
      },
      timestamp: new Date().toISOString(),
      endpoints: {
        specificItem: `${SITE_URL}/api/embeddings?type={type}&id={id}`,
        queryEmbedding: `${SITE_URL}/api/embeddings?q={query}`,
        bulk: `${SITE_URL}/api/embeddings?type={type}&limit={limit}`,
        collections: {
          posts: `${SITE_URL}/api/embeddings/posts/{id}`,
          books: `${SITE_URL}/api/embeddings/books/{id}`,
          notes: `${SITE_URL}/api/embeddings/notes/{id}`,
        },
      },
      notes: {
        performance: "Using pre-computed embeddings for fast response times",
        coverage:
          "Only posts with pre-computed embeddings are included in bulk requests",
        onDemand: "Use individual endpoints for on-demand embedding generation",
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Embeddings-Source": "pre-computed",
        "X-Total-Posts-With-Embeddings": embeddings.length.toString(),
      },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate embeddings",
        message: "Please try again later or contact hello@lyovson.com",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
