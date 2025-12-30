import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";

type EmbeddingDoc = {
  embedding_dimensions?: number | null;
  embedding_model?: string | null;
  embedding_vector?: string | null;
};

type CollectionEmbeddingStats = {
  totalPublished: number;
  withEmbeddings: number;
  coveragePercentage: number;
  needingEmbeddings: number;
};

const EMBEDDING_DIMENSIONS_OPENAI = 1536;
const EMBEDDING_DIMENSIONS_FALLBACK = 384;
const PERCENT_MULTIPLIER = 100;

function asEmbeddingDoc(value: unknown): EmbeddingDoc | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  return value as EmbeddingDoc;
}

function hasEmbeddingVector(doc: EmbeddingDoc): boolean {
  return Boolean(doc.embedding_vector);
}

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Status endpoint aggregates multiple collection metrics and recommendations */
export async function GET(_request: NextRequest) {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Get embedding statistics using count() instead of fetching all records
    // This prevents expensive limit: 0 queries that fetch entire collections
    const [allPostsCount, allNotesCount, allActivitiesCount] =
      await Promise.all([
        payload.count({
          collection: "posts",
          where: { _status: { equals: "published" } },
        }),
        payload.count({
          collection: "notes",
          where: { _status: { equals: "published" } },
        }),
        payload.count({
          collection: "activities",
          where: { _status: { equals: "published" } },
        }),
      ]);

    // Sample a few embeddings to check models from multiple collections
    // Fetch actual posts to check which ones have embeddings
    const sampleEmbeddings = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 50, // Get more to ensure we find some with embeddings
      select: {
        id: true,
        title: true,
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
        embedding_vector: true,
      },
    });

    // Filter to only posts with embeddings
    const postDocs = sampleEmbeddings.docs
      .map(asEmbeddingDoc)
      .filter((doc): doc is EmbeddingDoc => Boolean(doc));

    const postsWithEmbeddings = postDocs.filter(hasEmbeddingVector);

    const modelStats: Record<string, number> = {};
    for (const doc of postDocs) {
      const model = doc.embedding_model || "unknown";
      modelStats[model] = (modelStats[model] || 0) + 1;
    }

    // Sample activities to check embeddings
    const sampleActivities = await payload.find({
      collection: "activities",
      where: { _status: { equals: "published" } },
      limit: 50,
    });

    const activitiesWithEmbeddings = sampleActivities.docs
      .map(asEmbeddingDoc)
      .filter((doc): doc is EmbeddingDoc => Boolean(doc))
      .filter(hasEmbeddingVector);

    // Sample notes to check embeddings
    const sampleNotes = await payload.find({
      collection: "notes",
      where: { _status: { equals: "published" } },
      limit: 50,
    });

    const notesWithEmbeddings = sampleNotes.docs
      .map(asEmbeddingDoc)
      .filter((doc): doc is EmbeddingDoc => Boolean(doc))
      .filter(hasEmbeddingVector);

    // Calculate overall coverage across all collections
    const totalPublished =
      allPostsCount.totalDocs +
      allNotesCount.totalDocs +
      allActivitiesCount.totalDocs;
    const totalWithEmbeddings =
      postsWithEmbeddings.length +
      notesWithEmbeddings.length +
      activitiesWithEmbeddings.length;

    const status = {
      system: {
        healthy: true,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        preferredModel: process.env.OPENAI_API_KEY
          ? "text-embedding-3-small"
          : "fallback-hash",
        dimensions: process.env.OPENAI_API_KEY
          ? EMBEDDING_DIMENSIONS_OPENAI
          : EMBEDDING_DIMENSIONS_FALLBACK,
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
            withEmbeddings: postsWithEmbeddings.length,
            coveragePercentage:
              allPostsCount.totalDocs > 0
                ? Math.round(
                    (postsWithEmbeddings.length / allPostsCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allPostsCount.totalDocs - postsWithEmbeddings.length,
          },
          notes: {
            totalPublished: allNotesCount.totalDocs,
            withEmbeddings: notesWithEmbeddings.length,
            coveragePercentage:
              allNotesCount.totalDocs > 0
                ? Math.round(
                    (notesWithEmbeddings.length / allNotesCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allNotesCount.totalDocs - notesWithEmbeddings.length,
          },
          activities: {
            totalPublished: allActivitiesCount.totalDocs,
            withEmbeddings: activitiesWithEmbeddings.length,
            coveragePercentage:
              allActivitiesCount.totalDocs > 0
                ? Math.round(
                    (activitiesWithEmbeddings.length /
                      allActivitiesCount.totalDocs) *
                      PERCENT_MULTIPLIER
                  )
                : 0,
            needingEmbeddings:
              allActivitiesCount.totalDocs - activitiesWithEmbeddings.length,
          },
        },
      },

      // Add cache performance monitoring
      performance: {
        status: "optimized",
        embeddingStorage: "pgvector (1536D)",
        indexType: "HNSW cosine similarity",
        versionManagement: "automatic (5 per document)",
        computeOptimization: "published content only",
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
        sampleSize: postsWithEmbeddings.length,
        averageDimensions:
          postsWithEmbeddings.length > 0
            ? Math.round(
                postsWithEmbeddings.reduce(
                  (sum, doc) => sum + (doc.embedding_dimensions || 0),
                  0
                ) / postsWithEmbeddings.length
              )
            : 0,
      },

      endpoints: {
        status: `${SITE_URL}/api/embeddings/status`,
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
          "No OpenAI API key configured - using fallback hash-based embeddings",
        action:
          "Add OPENAI_API_KEY to environment variables for higher quality embeddings",
      });
    }

    if (status.statistics.overallCoveragePercentage < PERCENT_MULTIPLIER) {
      status.recommendations.push({
        type: "info",
        message: `${status.statistics.itemsNeedingEmbeddings} items need embeddings across all collections`,
        action:
          "Edit and save existing content to generate embeddings automatically",
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
