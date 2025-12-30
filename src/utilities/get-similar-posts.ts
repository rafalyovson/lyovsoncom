import configPromise from "@payload-config";
import {
  and,
  asc,
  eq,
  isNotNull,
  ne,
  sql,
} from "@payloadcms/db-vercel-postgres/drizzle";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";

/**
 * Find the most similar posts using pgvector cosine similarity.
 * Uses HNSW index for sub-100ms queries.
 *
 * IMPORTANT: Orders by cosineDistance ASC (not 1-distance DESC) to ensure
 * HNSW index is used. This is critical for performance.
 *
 * @param postId - Current post ID to find similar posts for
 * @param limit - Number of similar posts to return (default: 3)
 * @returns Array of similar Post objects, ordered by similarity (most similar first)
 *
 * @example
 * ```typescript
 * const similar = await getSimilarPosts(123, 3);
 * // Returns: [Post, Post, Post] or []
 * ```
 */
export async function getSimilarPosts(
  postId: number,
  limit = 3
): Promise<Post[]> {
  const payload = await getPayload({ config: configPromise });

  // Get current post's embedding
  const currentPost = await payload.findByID({
    collection: "posts",
    id: postId,
    select: {
      embedding_vector: true,
    },
  });

  // Early return if no embedding exists
  if (!currentPost?.embedding_vector) {
    return [];
  }

  // Parse pgvector string format "[1.0,2.0,...]" to array
  const embedding = JSON.parse(currentPost.embedding_vector);

  // Access posts table from generated schema
  const postsTable = payload.db.tables.posts;

  // Query similar posts using cosine distance
  // CRITICAL: Order by distance ASC (not 1-distance DESC) for HNSW index usage
  // See: https://github.com/drizzle-team/drizzle-orm-docs/issues/436
  const similarPosts = await payload.db.drizzle
    .select({
      id: postsTable.id,
    })
    .from(postsTable)
    .where(
      and(
        ne(postsTable.id, postId), // Exclude current post
        eq(postsTable._status, "published"), // Only published posts
        isNotNull(postsTable.embedding_vector) // Only posts with embeddings
      )
    )
    // Order by cosine distance ascending = most similar first
    // Uses HNSW index for O(log n) performance
    // IMPORTANT: Cast VARCHAR to vector type for <=> operator
    .orderBy(
      asc(
        sql`${postsTable.embedding_vector}::vector <=> ${JSON.stringify(embedding)}::vector`
      )
    )
    .limit(limit);

  // Fetch full Post objects with relationships via Payload
  // This two-phase approach combines Drizzle speed with Payload features
  const fullPosts = await Promise.all(
    similarPosts.map((p) =>
      payload.findByID({
        collection: "posts",
        id: p.id,
        depth: 1, // Include related data like featuredImage, topics
      })
    )
  );

  // Filter out any null results and return typed array
  return fullPosts.filter(Boolean) as Post[];
}
