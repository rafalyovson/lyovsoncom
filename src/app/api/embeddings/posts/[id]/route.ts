import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";
import { authorizeEmbeddingMutation } from "@/utilities/embedding-auth";
import {
  extractTextFromContent,
  generateEmbedding,
} from "@/utilities/generate-embedding";

// Extended Post type with pgvector fields
type PostWithEmbedding = Post & {
  embedding_vector?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
  embedding_generated_at?: string;
  embedding_text_hash?: string;
};

// Posts-specific text extraction for API
function extractPostsText(
  post: Pick<Post, "title" | "description" | "content">
): string {
  const parts: string[] = [];

  if (post.title) {
    parts.push(post.title);
  }

  if (post.description) {
    parts.push(post.description);
  }

  // Extract content from Lexical JSONB format
  if (post.content) {
    const contentText = extractTextFromContent(post.content);
    if (contentText) {
      parts.push(contentText);
    }
  }

  return parts.filter(Boolean).join(" ");
}

type Args = {
  params: Promise<{
    id: string;
  }>;
};

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This endpoint supports multiple output formats and optional regeneration paths */
export async function GET(
  request: NextRequest,
  { params: paramsPromise }: Args
) {
  const { id } = await paramsPromise;
  const { searchParams } = new URL(request.url);
  const includeContent = searchParams.get("content") === "true";
  const format = searchParams.get("format") || "full"; // 'full', 'vector-only', 'metadata-only'
  const regenerate = searchParams.get("regenerate") === "true"; // Force regenerate

  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    if (regenerate) {
      const authResult = await authorizeEmbeddingMutation(request, payload);
      if (!authResult.authorized) {
        return new Response(
          JSON.stringify({
            error: authResult.reason || "Unauthorized",
            id: Number.parseInt(id, 10),
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const post = await payload.findByID({
      collection: "posts",
      id: Number.parseInt(id, 10),
      overrideAccess: false,
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
        embedding_text_hash: true,
      },
    });

    if (!post) {
      return new Response(
        JSON.stringify({
          error: "Post not found",
          id: Number.parseInt(id, 10),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse existing embedding from pgvector format
    const postWithEmbedding = post as PostWithEmbedding;
    let existingEmbedding: {
      vector: number[];
      model?: string;
      dimensions?: number;
      generatedAt?: string;
      textHash?: string;
    } | null = null;
    if (postWithEmbedding.embedding_vector) {
      try {
        const vectorString = postWithEmbedding.embedding_vector.replace(
          /^\[|\]$/g,
          ""
        ); // Remove brackets
        const vectorArray = vectorString.split(",").map(Number);
        existingEmbedding = {
          vector: vectorArray,
          model: postWithEmbedding.embedding_model,
          dimensions: postWithEmbedding.embedding_dimensions,
          generatedAt: postWithEmbedding.embedding_generated_at,
          textHash: postWithEmbedding.embedding_text_hash,
        };
      } catch (_error) {
        // Silently fail if vector parsing fails - embedding will be regenerated
      }
    }

    // Handle regeneration or missing embedding
    let embedding = existingEmbedding;
    if (regenerate || !existingEmbedding) {
      const textContent = extractPostsText(post);

      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: "Post has no content to embed",
            id: Number.parseInt(id, 10),
            title: post.title,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { vector, model, dimensions } =
        await generateEmbedding(textContent);

      embedding = {
        vector,
        model,
        dimensions,
        generatedAt: new Date().toISOString(),
        textHash: postWithEmbedding.embedding_text_hash, // Use existing hash if available
      };

      // Only update the database if regenerating
      if (regenerate) {
        try {
          await payload.update({
            collection: "posts",
            id: Number.parseInt(id, 10),
            data: {
              embedding_vector: `[${vector.join(",")}]`,
              embedding_model: model,
              embedding_dimensions: dimensions,
              embedding_generated_at: embedding.generatedAt,
            } as Partial<PostWithEmbedding>,
          });
        } catch (_updateError) {
          // Database update failed - embedding is still returned in response
        }
      }
    }

    // Format response based on requested format
    type EmbeddingData =
      | {
          vector?: number[];
          model?: string;
          dimensions?: number;
          generatedAt?: string;
          textHash?: string;
        }
      | number[]
      | null;

    const baseResponse: {
      id: number | string;
      title?: string | null;
      slug?: string | null;
      url: string;
      embedding: EmbeddingData;
      publishedAt?: string | null;
      updatedAt: string;
      content?: unknown;
    } = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      url: `${SITE_URL}/${post.slug}`,
      embedding: null,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    };

    switch (format) {
      case "vector-only":
        baseResponse.embedding = embedding?.vector || null;
        break;
      case "metadata-only":
        baseResponse.embedding = embedding
          ? {
              model: embedding.model,
              dimensions: embedding.dimensions,
              generatedAt: embedding.generatedAt,
            }
          : null;
        break;
      default: // 'full'
        baseResponse.embedding = embedding;
        if (includeContent && post.content) {
          baseResponse.content = post.content;
        }
        break;
    }

    const response = new Response(JSON.stringify(baseResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": regenerate
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Note: cacheTag and cacheLife can only be used inside "use cache" functions
    // For now, we'll rely on the Cache-Control headers
    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        id: Number.parseInt(id, 10),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle POST requests for embedding operations
export async function POST(
  request: NextRequest,
  { params: paramsPromise }: Args
) {
  const { id: _id } = await paramsPromise;

  try {
    const body = await request.json();
    const { action = "regenerate" } = body;

    if (action === "regenerate") {
      const payload = await getPayload({ config: configPromise });
      const authResult = await authorizeEmbeddingMutation(request, payload);
      if (!authResult.authorized) {
        return new Response(
          JSON.stringify({
            error: authResult.reason || "Unauthorized",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Redirect to GET with regenerate=true
      const url = new URL(request.url);
      url.searchParams.set("regenerate", "true");

      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action",
        validActions: ["regenerate"],
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
