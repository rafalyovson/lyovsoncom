import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import {
  EMBEDDING_MODEL,
  EMBEDDING_VECTOR_DIMENSIONS,
} from "@/utilities/generate-embedding";

interface EmbeddingDoc {
  embedding_dimensions?: number | null;
  embedding_model?: string | null;
  embedding_vector?: string | null;
}

interface CollectionEmbeddingStats {
  coveragePercentage: number;
  needingEmbeddings: number;
  totalPublished: number;
  withEmbeddings: number;
}

const PERCENT_MULTIPLIER = 100;
const PUBLIC_QUERY_EMBEDDINGS_ENABLED =
  process.env.ENABLE_PUBLIC_QUERY_EMBEDDINGS === "true";

function asEmbeddingDoc(value: unknown): EmbeddingDoc | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  return value as EmbeddingDoc;
}

function hasEmbeddingVector(doc: EmbeddingDoc): boolean {
  return Boolean(doc.embedding_vector);
}

export async function GET(_request: NextRequest) {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Get collection totals and exact embedding coverage counts.
    const [
      allPostsCount,
      allNotesCount,
      allActivitiesCount,
      postsWithEmbeddingsCount,
      notesWithEmbeddingsCount,
      activitiesWithEmbeddingsCount,
    ] = await Promise.all([
      payload.count({
        collection: "posts",
        overrideAccess: false,
        where: { _status: { equals: "published" } },
      }),
      payload.count({
        collection: "notes",
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          visibility: { equals: "public" },
        },
      }),
      payload.count({
        collection: "activities",
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          visibility: { equals: "public" },
        },
      }),
      payload.count({
        collection: "posts",
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          embedding_vector: { exists: true },
        },
      }),
      payload.count({
        collection: "notes",
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          visibility: { equals: "public" },
          embedding_vector: { exists: true },
        },
      }),
      payload.count({
        collection: "activities",
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          visibility: { equals: "public" },
          embedding_vector: { exists: true },
        },
      }),
    ]);

    // Sample a subset of post embeddings only for model/dimension telemetry.
    const sampledPostEmbeddings = await payload.find({
      collection: "posts",
      overrideAccess: false,
      where: {
        _status: { equals: "published" },
        embedding_vector: { exists: true },
      },
      limit: 50,
      select: {
        embedding_model: true,
        embedding_dimensions: true,
        embedding_vector: true,
      },
    });

    const sampledPostsWithEmbeddings = sampledPostEmbeddings.docs
      .map(asEmbeddingDoc)
      .filter((doc): doc is EmbeddingDoc => Boolean(doc))
      .filter(hasEmbeddingVector);

    const modelStats: Record<string, number> = {};
    for (const doc of sampledPostsWithEmbeddings) {
      const model = doc.embedding_model || "unknown";
      modelStats[model] = (modelStats[model] || 0) + 1;
    }

    // Calculate overall coverage across all collections
    const totalPublished =
      allPostsCount.totalDocs +
      allNotesCount.totalDocs +
      allActivitiesCount.totalDocs;
    const totalWithEmbeddings =
      postsWithEmbeddingsCount.totalDocs +
      notesWithEmbeddingsCount.totalDocs +
      activitiesWithEmbeddingsCount.totalDocs;

    const status = {
      system: {
        healthy: true,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        preferredModel: process.env.OPENAI_API_KEY ? EMBEDDING_MODEL : null,
        dimensions: EMBEDDING_VECTOR_DIMENSIONS,
        queryEmbeddingPublic: PUBLIC_QUERY_EMBEDDINGS_ENABLED,
        pgvectorEnabled: true,
        collectionsSupported: ["posts", "notes", "activities"],
      },

      statistics: {
        // Overall stats
        totalPublishedItems: totalPublished,
        itemsWithEmbeddings: totalWithEmbeddings,
        overallCoveragePercentage:
          totalPublished > 0
            ? Math.round(
                (totalWithEmbeddings / totalPublished) * PERCENT_MULTIPLIER
              )
            : 0,
        itemsNeedingEmbeddings: totalPublished - totalWithEmbeddings,

        // Collection-specific stats
        collections: {
          posts: {
            totalPublished: allPostsCount.totalDocs,
            withEmbeddings: postsWithEmbeddingsCount.totalDocs,
            coveragePercentage:
              allPostsCount.totalDocs > 0
                ? Math.round(
                    (postsWithEmbeddingsCount.totalDocs /
                      allPostsCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allPostsCount.totalDocs - postsWithEmbeddingsCount.totalDocs,
          },
          notes: {
            totalPublished: allNotesCount.totalDocs,
            withEmbeddings: notesWithEmbeddingsCount.totalDocs,
            coveragePercentage:
              allNotesCount.totalDocs > 0
                ? Math.round(
                    (notesWithEmbeddingsCount.totalDocs /
                      allNotesCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allNotesCount.totalDocs - notesWithEmbeddingsCount.totalDocs,
          },
          activities: {
            totalPublished: allActivitiesCount.totalDocs,
            withEmbeddings: activitiesWithEmbeddingsCount.totalDocs,
            coveragePercentage:
              allActivitiesCount.totalDocs > 0
                ? Math.round(
                    (activitiesWithEmbeddingsCount.totalDocs /
                      allActivitiesCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allActivitiesCount.totalDocs -
              activitiesWithEmbeddingsCount.totalDocs,
          },
        },
      },

      // Add cache performance monitoring
      performance: {
        status: "optimized",
        embeddingStorage: `pgvector (${EMBEDDING_VECTOR_DIMENSIONS}D)`,
        indexType: "HNSW expression index on casted vectors",
        versionManagement: "automatic (5 per document)",
        computeOptimization: "batched sync endpoint with stale-only mode",
        cacheStrategy: {
          rssCache: "4-8 hours",
          sitemapCache: "4-8 hours",
          staticCache: "2-4 hours",
          postsCache: "30-60 minutes",
          autosaveInterval: "30 seconds",
        },
        note: "Cache times extended to reduce database wake-ups from bot crawling",
      },

      models: {
        modelsInUse: modelStats,
        sampleSize: sampledPostsWithEmbeddings.length,
        averageDimensions:
          sampledPostsWithEmbeddings.length > 0
            ? Math.round(
                sampledPostsWithEmbeddings.reduce(
                  (sum, doc) => sum + (doc.embedding_dimensions || 0),
                  0
                ) / sampledPostsWithEmbeddings.length
              )
            : 0,
      },

      endpoints: {
        status: `${SITE_URL}/api/embeddings/status`,
        sync: `${SITE_URL}/api/embeddings/sync`,
        bulk: `${SITE_URL}/api/embeddings?type=posts|notes|activities|all`,
        collections: {
          posts: `${SITE_URL}/api/embeddings/posts/{id}`,
          notes: `${SITE_URL}/api/embeddings/notes/{id}`,
          activities: `${SITE_URL}/api/embeddings/activities/{id}`,
        },
        query: `${SITE_URL}/api/embeddings?q={text}`,
        documentation: `${SITE_URL}/ai-docs`,
        apiDocs: `${SITE_URL}/api/docs`,
      },

      recommendations: [] as Array<{
        type: "success" | "info" | "warning" | "error";
        message: string;
        action: string;
      }>,

      timestamp: new Date().toISOString(),
    };

    // Add recommendations based on status
    if (!process.env.OPENAI_API_KEY) {
      status.recommendations.push({
        type: "warning",
        message:
          "No OpenAI API key configured - embeddings cannot be generated",
        action:
          "Add OPENAI_API_KEY, then run POST /api/embeddings/sync to backfill vectors",
      });
    }

    if (status.statistics.overallCoveragePercentage < PERCENT_MULTIPLIER) {
      status.recommendations.push({
        type: "info",
        message: `${status.statistics.itemsNeedingEmbeddings} items need embeddings across all collections`,
        action: "Run POST /api/embeddings/sync (recommended daily via cron)",
      });
    }

    if (!PUBLIC_QUERY_EMBEDDINGS_ENABLED) {
      status.recommendations.push({
        type: "info",
        message:
          "Public query embedding endpoint is disabled to reduce compute cost",
        action:
          "Set ENABLE_PUBLIC_QUERY_EMBEDDINGS=true only if public on-demand query vectors are required",
      });
    }

    if (status.statistics.overallCoveragePercentage === PERCENT_MULTIPLIER) {
      status.recommendations.push({
        type: "success",
        message: "All published content has embeddings!",
        action: "System is ready for AI applications and semantic search",
      });
    }

    // Collection-specific recommendations
    for (const [collection, stats] of Object.entries(
      status.statistics.collections
    ) as [string, CollectionEmbeddingStats][]) {
      if (stats.totalPublished > 0 && stats.withEmbeddings === 0) {
        status.recommendations.push({
          type: "warning",
          message: `No embeddings found for ${collection} collection`,
          action: `Publish or edit content in ${collection} to generate embeddings`,
        });
      }
    }

    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control":
          "public, max-age=7200, s-maxage=14400, stale-while-revalidate=28800", // Cache for 2-4 hours, stale up to 8 hours
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "noindex, nofollow", // Prevent search engine indexing
      },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({
        system: {
          healthy: false,
          error: "Failed to get embedding status",
        },
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
