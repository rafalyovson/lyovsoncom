import type { CollectionAfterChangeHook } from "payload";
import { getSimilarPosts } from "@/utilities/get-similar-posts";

/**
 * Hook to pre-compute and store recommended posts after a post is saved.
 * This eliminates the need for runtime queries and caching complexity.
 *
 * Only computes for published posts with embeddings.
 * Runs after the post is saved, so embedding is already generated.
 */
export const computeRecommendations: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  context,
}) => {
  // Prevent infinite loop - skip if this update came from recommendation compute
  if (context?.skipRecommendationCompute) {
    return doc;
  }

  // Only compute for published posts
  if (doc._status !== "published") {
    return doc;
  }

  // Skip if no embedding (shouldn't happen for published posts, but safety check)
  if (!doc.embedding_vector) {
    req.payload.logger.info(
      `Skipping recommendations for post ${doc.id}: no embedding`,
    );
    return doc;
  }

  try {
    req.payload.logger.info(
      `Computing recommendations for post ${doc.id}: "${doc.title}"`,
    );

    // Get similar posts using our existing utility
    const similarPosts = await getSimilarPosts(doc.id, 3);

    // Extract just the IDs
    const recommendedIds = similarPosts.map((post) => post.id);

    req.payload.logger.info(
      `Found ${recommendedIds.length} recommendations for post ${doc.id}: [${recommendedIds.join(", ")}]`,
    );

    // Update the post with pre-computed recommendations
    // Use overrideAccess to bypass access control
    // This is a system operation, not a user action
    await req.payload.update({
      collection: "posts",
      id: doc.id,
      data: {
        recommended_post_ids: recommendedIds,
      },
      overrideAccess: true,
      // Prevent infinite loop by skipping hooks
      context: {
        skipRecommendationCompute: true,
      },
    });

    req.payload.logger.info(
      `✅ Stored ${recommendedIds.length} recommendations for post ${doc.id}`,
    );

    // Return original doc (the update above happens async)
    return doc;
  } catch (error) {
    req.payload.logger.error(
      `Failed to compute recommendations for post ${doc.id}:`,
      error,
    );
    // Don't fail the save if recommendation computation fails
    return doc;
  }
};
