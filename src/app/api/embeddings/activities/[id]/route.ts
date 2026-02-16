import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Activity } from "@/payload-types";
import { getActivityPath } from "@/utilities/activity-path";
import { authorizeEmbeddingMutation } from "@/utilities/embedding-auth";
import { extractLexicalText } from "@/utilities/extract-lexical-text";
import { generateEmbedding } from "@/utilities/generate-embedding";

// Extended Activity type with pgvector fields
type ActivityWithEmbedding = Activity & {
  embedding_vector?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
  embedding_generated_at?: string;
  embedding_text_hash?: string;
};

// Activities-specific text extraction for API
function extractActivitiesText(activity: Activity): string {
  const parts: string[] = [];

  const referenceObj =
    typeof activity.reference === "object" && activity.reference !== null
      ? activity.reference
      : null;

  const activityTypeLabels: Record<string, string> = {
    read: "Read",
    watch: "Watched",
    listen: "Listened",
    play: "Played",
  };

  const title = referenceObj?.title
    ? `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceObj.title}`
    : "Activity";

  parts.push(title);

  // Extract content from Lexical JSONB format
  if (activity.notes) {
    const notesText = extractLexicalText(activity.notes);
    if (notesText) {
      parts.push(notesText);
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
  const format = searchParams.get("format") || "full";
  const regenerate = searchParams.get("regenerate") === "true";

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

    const activity = await payload.findByID({
      collection: "activities",
      id: Number.parseInt(id, 10),
      overrideAccess: false,
      depth: 1,
      select: {
        id: true,
        slug: true,
        activityType: true,
        reference: true,
        notes: true,
        startedAt: true,
        finishedAt: true,
        publishedAt: true,
        updatedAt: true,
        embedding_vector: true,
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
        embedding_text_hash: true,
      },
    });

    if (!activity) {
      return new Response(
        JSON.stringify({
          error: "Activity not found",
          id: Number.parseInt(id, 10),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse existing embedding from pgvector format
    const activityWithEmbedding = activity as ActivityWithEmbedding;
    let existingEmbedding: {
      vector: number[];
      model?: string;
      dimensions?: number;
      generatedAt?: string;
      textHash?: string;
    } | null = null;
    if (activityWithEmbedding.embedding_vector) {
      try {
        const vectorString = activityWithEmbedding.embedding_vector.replace(
          /^\[|\]$/g,
          ""
        );
        const vectorArray = vectorString.split(",").map(Number);
        existingEmbedding = {
          vector: vectorArray,
          model: activityWithEmbedding.embedding_model,
          dimensions: activityWithEmbedding.embedding_dimensions,
          generatedAt: activityWithEmbedding.embedding_generated_at,
          textHash: activityWithEmbedding.embedding_text_hash,
        };
      } catch (_error) {
        // Silently fail if vector parsing fails - embedding will be regenerated
      }
    }

    // Handle regeneration or missing embedding
    let embedding = existingEmbedding;
    if (regenerate || !existingEmbedding) {
      const textContent = extractActivitiesText(activity);

      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: "Activity has no content to embed",
            id: Number.parseInt(id, 10),
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
        textHash: activityWithEmbedding.embedding_text_hash,
      };

      // Only update the database if regenerating
      if (regenerate) {
        try {
          await payload.update({
            collection: "activities",
            id: Number.parseInt(id, 10),
            data: {
              embedding_vector: `[${vector.join(",")}]`,
              embedding_model: model,
              embedding_dimensions: dimensions,
              embedding_generated_at: embedding.generatedAt,
            } as Partial<ActivityWithEmbedding>,
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

    const referenceObj =
      typeof activity.reference === "object" && activity.reference !== null
        ? activity.reference
        : null;

    const activityTypeLabels: Record<string, string> = {
      read: "Read",
      watch: "Watched",
      listen: "Listened",
      play: "Played",
    };

    const title = referenceObj?.title
      ? `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceObj.title}`
      : "Activity";

    const baseResponse: {
      id: number | string;
      title?: string;
      slug?: string | null;
      url: string;
      embedding: EmbeddingData;
      publishedAt?: string | null;
      updatedAt: string;
      content?: unknown;
    } = {
      id: activity.id,
      title,
      slug: activity.slug,
      url: (() => {
        const activityPath = getActivityPath(activity);
        return activityPath
          ? `${SITE_URL}${activityPath}`
          : `${SITE_URL}/activities/unknown/${activity.slug}`;
      })(),
      embedding: null,
      publishedAt: activity.publishedAt,
      updatedAt: activity.updatedAt,
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
        if (includeContent && activity.notes) {
          baseResponse.content = activity.notes;
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
