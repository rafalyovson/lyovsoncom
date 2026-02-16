/**
 * Hybrid Search API Endpoint
 *
 * Combines semantic (pgvector), full-text (tsvector), and fuzzy (trigram) search
 * using Reciprocal Rank Fusion (RRF) for optimal ranking.
 *
 * GET /api/search?q=query&limit=10
 */

import configPromise from "@payload-config";
import { sql } from "@payloadcms/db-vercel-postgres/drizzle";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { generateEmbedding } from "@/utilities/generate-embedding";

const MIN_SEARCH_LIMIT = 1;
const MAX_SEARCH_LIMIT = 50;
const EMBEDDING_DIMENSIONS = 1536;

type SearchResult = {
  collection: string;
  id: number;
  title: string;
  slug: string;
  description: string | null;
  featured_image_id: number | null;
  created_at: string;
  updated_at: string;
  semantic_rank: number | null;
  fts_rank: number | null;
  fuzzy_rank: number | null;
  combined_score: number;
};

type HybridSearchRow = {
  collection: string;
  id: number;
  title: string;
  slug: string;
  description: string | null;
  featured_image_id: number | null;
  created_at: Date;
  updated_at: Date;
  semantic_rank: bigint | null;
  fts_rank: bigint | null;
  fuzzy_rank: bigint | null;
  combined_score: string; // PostgreSQL numeric type comes as string
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

    // Validate query
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          results: [],
          query: "",
          count: 0,
          message: "No search query provided",
        },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Validate limit
    if (limit < MIN_SEARCH_LIMIT || limit > MAX_SEARCH_LIMIT) {
      return NextResponse.json(
        {
          results: [],
          query: trimmedQuery,
          count: 0,
          message: "Limit must be between 1 and 50",
        },
        { status: 400 }
      );
    }

    // Generate embedding for semantic search
    const embeddingResult = await generateEmbedding(trimmedQuery);

    if (
      !embeddingResult?.vector ||
      embeddingResult.vector.length !== EMBEDDING_DIMENSIONS
    ) {
      return NextResponse.json(
        {
          results: [],
          query: trimmedQuery,
          count: 0,
          message: "Failed to generate search embedding",
        },
        { status: 500 }
      );
    }

    const embedding = embeddingResult.vector;

    // Get Payload instance to access database
    const payload = await getPayload({ config: configPromise });

    // Call hybrid search function via a parameterized Drizzle SQL template.
    const vectorString = `[${embedding.join(",")}]`;
    const result = await payload.db.drizzle.execute(
      sql`SELECT * FROM hybrid_search_content(
        ${trimmedQuery},
        ${vectorString}::vector,
        ${limit},
        60
      )`
    );

    const rows = result.rows as unknown as HybridSearchRow[];

    // Transform results
    const results: SearchResult[] = rows.map((row) => ({
      collection: row.collection || "posts",
      id: row.id,
      title: row.title || "",
      slug: row.slug || "",
      description: row.description || null,
      featured_image_id: row.featured_image_id || null,
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date(row.created_at).toISOString(),
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : new Date(row.updated_at).toISOString(),
      semantic_rank: row.semantic_rank ? Number(row.semantic_rank) : null,
      fts_rank: row.fts_rank ? Number(row.fts_rank) : null,
      fuzzy_rank: row.fuzzy_rank ? Number(row.fuzzy_rank) : null,
      combined_score: Number.parseFloat(row.combined_score),
    }));

    return NextResponse.json(
      {
        results,
        query: trimmedQuery,
        count: results.length,
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=600, stale-while-revalidate=1800", // Cache 5-10 min, stale up to 30 min
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        results: [],
        query: "",
        count: 0,
        message: "Search failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
