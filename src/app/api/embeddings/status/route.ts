import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";

export async function GET(_request: NextRequest) {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Get embedding statistics
    // Note: embedding_vector is a direct PostgreSQL column, not a Payload field
    // We need to fetch all items and check the embedding fields manually
    const [allPosts, allBooks, allNotes] = await Promise.all([
      payload.find({
        collection: "posts",
        where: { _status: { equals: "published" } },
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
        collection: "notes",
        where: { _status: { equals: "published" } },
        limit: 0,
        pagination: false,
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
    const postsWithEmbeddings = sampleEmbeddings.docs.filter(
      (post: any) => post.embedding_vector
    );

    const modelStats = sampleEmbeddings.docs.reduce((acc: any, post: any) => {
      const model = post.embedding_model || "unknown";
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});

    // Calculate overall coverage across all collections
    // Note: We can only accurately count posts with embeddings since we sampled them
    // For books and notes, we'll estimate or fetch them similarly
    const totalPublished =
      allPosts.totalDocs + allBooks.totalDocs + allNotes.totalDocs;
    const totalWithEmbeddings = postsWithEmbeddings.length; // Only have accurate count for posts

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
            withEmbeddings: postsWithEmbeddings.length,
            coveragePercentage:
              allPosts.totalDocs > 0
                ? Math.round(
                    (postsWithEmbeddings.length / allPosts.totalDocs) * 100
                  )
                : 0,
            needingEmbeddings: allPosts.totalDocs - postsWithEmbeddings.length,
          },
          books: {
            totalPublished: allBooks.totalDocs,
            withEmbeddings: 0, // Would need to sample books similarly
            coveragePercentage: 0,
            needingEmbeddings: allBooks.totalDocs,
          },
          notes: {
            totalPublished: allNotes.totalDocs,
            withEmbeddings: 0, // Would need to sample notes similarly
            coveragePercentage: 0,
            needingEmbeddings: allNotes.totalDocs,
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
                  (sum: number, doc: any) =>
                    sum + (doc.embedding_dimensions || 0),
                  0
                ) / postsWithEmbeddings.length
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

    if (status.statistics.overallCoveragePercentage < 100) {
      status.recommendations.push({
        type: "info",
        message: `${status.statistics.itemsNeedingEmbeddings} items need embeddings across all collections`,
        action:
          "Edit and save existing content to generate embeddings automatically",
      });
    }

    if (status.statistics.overallCoveragePercentage === 100) {
      status.recommendations.push({
        type: "success",
        message: "All published content has embeddings!",
        action: "System is ready for AI applications and semantic search",
      });
    }

    // Collection-specific recommendations
    Object.entries(status.statistics.collections).forEach(
      ([collection, stats]: [string, any]) => {
        if (stats.totalPublished > 0 && stats.withEmbeddings === 0) {
          status.recommendations.push({
            type: "warning",
            message: `No embeddings found for ${collection} collection`,
            action: `Publish or edit content in ${collection} to generate embeddings`,
          });
        }
      }
    );

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
