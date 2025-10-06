import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Post } from "@/payload-types";
import {
  createTextHash,
  extractTextFromContent,
  generateEmbedding,
} from "./generate-embedding";

// Posts-specific text extraction for admin tools
function extractPostsText(post: any): string {
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

// Get embedding statistics for all posts
export async function getEmbeddingStats() {
  const payload = await getPayload({ config: configPromise });

  const [allPosts, postsWithEmbeddings] = await Promise.all([
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
  ]);

  const coverage =
    allPosts.totalDocs > 0
      ? (postsWithEmbeddings.totalDocs / allPosts.totalDocs) * 100
      : 0;

  return {
    totalPosts: allPosts.totalDocs,
    postsWithEmbeddings: postsWithEmbeddings.totalDocs,
    postsNeedingEmbeddings: allPosts.totalDocs - postsWithEmbeddings.totalDocs,
    coveragePercentage: Math.round(coverage),
  };
}

// Get posts that need embedding generation
export async function getPostsNeedingEmbeddings(limit = 50) {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    where: {
      _status: { equals: "published" },
      embedding_vector: { exists: false },
    },
    limit,
    select: {
      id: true,
      title: true,
      slug: true,
      project: true,
      updatedAt: true,
    },
  });

  return posts.docs;
}

// Regenerate embedding for a specific post
export async function regenerateEmbeddingForPost(postId: number) {
  const payload = await getPayload({ config: configPromise });

  try {
    const post = (await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 2,
    })) as Post;

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post._status !== "published") {
      throw new Error(`Post ${postId} is not published`);
    }

    const textContent = extractPostsText(post);
    if (!textContent.trim()) {
      throw new Error(`Post ${postId} has no content to embed`);
    }

    const { vector, model, dimensions } = await generateEmbedding(textContent);
    const textHash = createTextHash(textContent);

    const _updatedPost = await payload.update({
      collection: "posts",
      id: postId,
      data: {
        embedding_vector: `[${vector.join(",")}]`, // pgvector format
        embedding_model: model,
        embedding_dimensions: dimensions,
        embedding_generated_at: new Date().toISOString(),
        embedding_text_hash: textHash,
      } as any, // Type assertion for new pgvector fields
    });

    return {
      success: true,
      postId,
      title: post.title,
      model,
      dimensions,
      wordCount: textContent.split(" ").length,
    };
  } catch (error) {
    return {
      success: false,
      postId,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Bulk regenerate embeddings for posts that don't have them
export async function bulkGenerateEmbeddings(batchSize = 10) {
  const postsToProcess = await getPostsNeedingEmbeddings(batchSize);

  if (postsToProcess.length === 0) {
    return {
      message: "All published posts already have embeddings!",
      processed: 0,
      results: [],
    };
  }

  const results: Awaited<ReturnType<typeof regenerateEmbeddingForPost>>[] = [];

  for (const post of postsToProcess) {
    const result = await regenerateEmbeddingForPost(post.id);
    results.push(result);

    // Small delay to avoid overwhelming the system
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    message: `Processed ${results.length} posts: ${successful} successful, ${failed} failed`,
    processed: results.length,
    successful,
    failed,
    results,
  };
}

// Health check for the embedding system
export async function embeddingSystemHealthCheck() {
  try {
    const stats = await getEmbeddingStats();
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    // Test embedding generation
    const testResult = await generateEmbedding("test");

    return {
      healthy: true,
      openaiConfigured: hasOpenAI,
      model: testResult.model,
      dimensions: testResult.dimensions,
      stats,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    };
  }
}

// Usage examples:
// console.log(await getEmbeddingStats())
// console.log(await getPostsNeedingEmbeddings(10))
// console.log(await regenerateEmbeddingForPost(1))
// console.log(await bulkGenerateEmbeddings(5))
// console.log(await embeddingSystemHealthCheck())
