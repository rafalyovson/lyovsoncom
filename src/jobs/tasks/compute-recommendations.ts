import type { TaskConfig } from "payload";
import { getSimilarPosts } from "@/utilities/get-similar-posts";

const RECOMMENDATION_LIMIT = 3;

export const ComputeRecommendations: TaskConfig<"computeRecommendations"> = {
  slug: "computeRecommendations",

  inputSchema: [{ name: "postId", type: "number", required: true }],

  outputSchema: [
    { name: "success", type: "checkbox", required: true },
    { name: "count", type: "number" },
    { name: "reason", type: "text" },
  ],

  retries: 2,

  handler: async ({ input, req }) => {
    const { postId } = input;

    // Fetch post to verify it exists and has embedding
    // findByID returns full documents; cast needed because Payload's defaultPopulate narrows types
    const post = (await req.payload.findByID({
      collection: "posts",
      id: postId,
    })) as unknown as { _status?: string; embedding_vector?: string };

    if (!post) {
      return { output: { success: false, reason: "post_not_found" } };
    }

    if (post._status !== "published") {
      return { output: { success: false, reason: "not_published" } };
    }

    if (!post.embedding_vector) {
      return { output: { success: false, reason: "no_embedding" } };
    }

    // Compute similar posts
    req.payload.logger.info(
      `[Job] Computing recommendations for post ${postId}`
    );

    const similarPosts = await getSimilarPosts(postId, RECOMMENDATION_LIMIT);
    const recommendedIds = similarPosts.map((p) => p.id);

    // Update post with recommendations
    await req.payload.update({
      collection: "posts",
      id: postId,
      data: {
        recommended_post_ids: recommendedIds,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRecommendationCompute: true,
        skipRevalidation: true,
      },
    });

    req.payload.logger.info(
      `[Job] ✅ Computed ${recommendedIds.length} recommendations for post ${postId}`
    );

    return {
      output: {
        success: true,
        count: recommendedIds.length,
      },
    };
  },
};
