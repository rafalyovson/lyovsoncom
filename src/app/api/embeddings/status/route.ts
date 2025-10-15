import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Payload } from "payload";

// Cached data-fetching function (idiomatic Next.js 15/16 pattern)
// This works around Next.js 16 canary bug #76612 where "use cache" on route handlers causes serialization errors
// Pattern: Extract data-fetching logic into separate cached function, route handler returns Response
async function getEmbeddingStatus(
  payload: Payload,
  SITE_URL: string
): Promise<Record<string, unknown>> {
  "use cache";
  cacheTag("embedding-status");
  cacheLife("static");

    // Get embedding statistics using new pgvector schema
    const [
      allPosts,
      postsWithEmbeddings,
      allBooks,
      booksWithEmbeddings,
      allNotes,
      notesWithEmbeddings,
    ] = await Promise.all([
      payload.find({
        collection: "posts",
        where: { _status: { equals: "published" } },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: "posts",
        where: {
          _status: { equals: "published" },
          embedding_vector: { exists: true },
        },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: "books",
        where: { _status: { equals: "published" } },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: "books",
        where: {
          _status: { equals: "published" },
          embedding_vector: { exists: true },
        },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: "notes",
        where: { _status: { equals: "published" } },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: "notes",
        where: {
          _status: { equals: "published" },
          embedding_vector: { exists: true },
        },
        limit: 0,
        pagination: false,
      }),
    ]);

    // Sample a few embeddings to check models from multiple collections
    const sampleEmbeddings = await payload.find({
      collection: "posts",
      where: {
        _status: { equals: "published" },
        embedding_vector: { exists: true },
      },
      limit: 5,
      select: {
        id: true,
        title: true,
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
      },
    });

    const modelStats = sampleEmbeddings.docs.reduce((acc: any, post: any) => {
      const model = post.embedding_model || "unknown";
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});

    // Calculate overall coverage across all collections
    const totalPublished =
      allPosts.totalDocs + allBooks.totalDocs + allNotes.totalDocs;
    const totalWithEmbeddings =
      postsWithEmbeddings.totalDocs +
      booksWithEmbeddings.totalDocs +
      notesWithEmbeddings.totalDocs;

    const status = {
      system: {
        healthy: true,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        preferredModel: process.env.OPENAI_API_KEY
          ? "text-embedding-3-small"
          : "fallback-hash",
        dimensions: process.env.OPENAI_API_KEY ? 1536 : 384,
        pgvectorEnabled: true,
        collectionsSupported: ["posts", "books", "notes"],
      },

      statistics: {
        // Overall stats
        totalPublishedItems: totalPublished,
        itemsWithEmbeddings: totalWithEmbeddings,
        overallCoveragePercentage:
          totalPublished > 0
            ? Math.round((totalWithEmbeddings / totalPublished) * 100)
            : 0,
        itemsNeedingEmbeddings: totalPublished - totalWithEmbeddings,

        // Collection-specific stats
        collections: {
          posts: {
            totalPublished: allPosts.totalDocs,
            withEmbeddings: postsWithEmbeddings.totalDocs,
            coveragePercentage:
              allPosts.totalDocs > 0
                ? Math.round(
                    (postsWithEmbeddings.totalDocs / allPosts.totalDocs) * 100
                  )
                : 0,
            needingEmbeddings:
              allPosts.totalDocs - postsWithEmbeddings.totalDocs,
          },
          books: {
            totalPublished: allBooks.totalDocs,
            withEmbeddings: booksWithEmbeddings.totalDocs,
            coveragePercentage:
              allBooks.totalDocs > 0
                ? Math.round(
                    (booksWithEmbeddings.totalDocs / allBooks.totalDocs) * 100
                  )
                : 0,
            needingEmbeddings:
              allBooks.totalDocs - booksWithEmbeddings.totalDocs,
          },
          notes: {
            totalPublished: allNotes.totalDocs,
            withEmbeddings: notesWithEmbeddings.totalDocs,
            coveragePercentage:
              allNotes.totalDocs > 0
                ? Math.round(
                    (notesWithEmbeddings.totalDocs / allNotes.totalDocs) * 100
                  )
                : 0,
            needingEmbeddings:
              allNotes.totalDocs - notesWithEmbeddings.totalDocs,
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
        sampleSize: sampleEmbeddings.docs.length,
        averageDimensions:
          sampleEmbeddings.docs.length > 0
            ? Math.round(
                sampleEmbeddings.docs.reduce(
                  (sum: number, doc: any) =>
                    sum + (doc.embedding_dimensions || 0),
                  0
                ) / sampleEmbeddings.docs.length
              )
            : 0,
      },

      endpoints: {
        status: `${SITE_URL}/api/embeddings/status`,
        bulk: `${SITE_URL}/api/embeddings?type=posts`,
        collections: {
          posts: `${SITE_URL}/api/embeddings/posts/{id}`,
          books: `${SITE_URL}/api/embeddings/books/{id}`,
          notes: `${SITE_URL}/api/embeddings/notes/{id}`,
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

    // Add recommendations based on status (must be inside cached function for immutability)
    const recommendations = [];

    if (!process.env.OPENAI_API_KEY) {
      recommendations.push({
        type: "warning" as const,
        message:
          "No OpenAI API key configured - using fallback hash-based embeddings",
        action:
          "Add OPENAI_API_KEY to environment variables for higher quality embeddings",
      });
    }

    const overallCoveragePercentage = status.statistics.overallCoveragePercentage as number;
    const itemsNeedingEmbeddings = status.statistics.itemsNeedingEmbeddings as number;

    if (overallCoveragePercentage < 100) {
      recommendations.push({
        type: "info" as const,
        message: `${itemsNeedingEmbeddings} items need embeddings across all collections`,
        action:
          "Edit and save existing content to generate embeddings automatically",
      });
    }

    if (overallCoveragePercentage === 100) {
      recommendations.push({
        type: "success" as const,
        message: "All published content has embeddings!",
        action: "System is ready for AI applications and semantic search",
      });
    }

    // Collection-specific recommendations
    const collections = status.statistics.collections as Record<string, any>;
    Object.entries(collections).forEach(([collection, stats]) => {
      if (stats.totalPublished > 0 && stats.withEmbeddings === 0) {
        recommendations.push({
          type: "warning" as const,
          message: `No embeddings found for ${collection} collection`,
          action: `Publish or edit content in ${collection} to generate embeddings`,
        });
      }
    });

    status.recommendations = recommendations;

    return status;
  }

// Route handler - thin wrapper that calls cached function and returns Response
export async function GET(_request: NextRequest) {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });
    const status = await getEmbeddingStatus(payload, SITE_URL);

    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300", // Cache for 5 minutes
        "Access-Control-Allow-Origin": "*",
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
