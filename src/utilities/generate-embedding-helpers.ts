import type { PayloadRequest } from 'payload'
import { extractLexicalText } from '@/utilities/extract-lexical-text'
import { generateEmbedding, createTextHash } from '@/utilities/generate-embedding'
import { getSimilarPosts } from '@/utilities/get-similar-posts'

/**
 * Generate embedding for a post and optionally compute recommendations
 */
export async function generateEmbeddingForPost(
  postId: number,
  req: PayloadRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch the post
    const post = await req.payload.findByID({
      collection: 'posts',
      id: postId,
    })

    // Validation checks
    if (!post) {
      req.payload.logger.error(`[Embedding] Post ${postId} not found`)
      return { success: false, error: 'Post not found' }
    }

    if (post._status !== 'published') {
      req.payload.logger.info(`[Embedding] Post ${postId} is not published, skipping`)
      return { success: false, error: 'Post is not published' }
    }

    if (!post.content) {
      req.payload.logger.info(`[Embedding] Post ${postId} has no content, skipping`)
      return { success: false, error: 'Post has no content' }
    }

    // Extract text from Lexical content
    const textContent = extractLexicalText(post.content)
    if (!textContent.trim()) {
      req.payload.logger.info(`[Embedding] Post ${postId} has no text content, skipping`)
      return { success: false, error: 'Post has no text content' }
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent)
    if (post.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Embedding] Post ${postId} embedding already up to date, skipping generation`
      )
      // Still compute recommendations in case other posts changed
      await computeRecommendationsForPost(postId, req)
      return { success: true }
    }

    // Generate embedding
    req.payload.logger.info(`[Embedding] Generating embedding for post ${postId}`)

    const { vector, model, dimensions } = await generateEmbedding(textContent)

    // Update post with embedding
    await req.payload.update({
      collection: 'posts',
      id: postId,
      data: {
        embedding_vector: `[${vector.join(',')}]`,
        embedding_model: model,
        embedding_dimensions: dimensions,
        embedding_generated_at: new Date().toISOString(),
        embedding_text_hash: currentTextHash,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRecommendationCompute: true,
        skipRevalidation: true,
      },
    })

    req.payload.logger.info(
      `[Embedding] ✅ Generated ${dimensions}D embedding for post ${postId}`
    )

    // Compute recommendations after embedding is saved
    await computeRecommendationsForPost(postId, req)

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    req.payload.logger.error(`[Embedding] Failed to generate embedding for post ${postId}: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

/**
 * Generate embedding for a note
 */
export async function generateEmbeddingForNote(
  noteId: number,
  req: PayloadRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch the note
    const note = await req.payload.findByID({
      collection: 'notes',
      id: noteId,
    })

    // Validation checks
    if (!note) {
      req.payload.logger.error(`[Embedding] Note ${noteId} not found`)
      return { success: false, error: 'Note not found' }
    }

    if (note._status !== 'published') {
      req.payload.logger.info(`[Embedding] Note ${noteId} is not published, skipping`)
      return { success: false, error: 'Note is not published' }
    }

    if (!note.content) {
      req.payload.logger.info(`[Embedding] Note ${noteId} has no content, skipping`)
      return { success: false, error: 'Note has no content' }
    }

    // Extract text from Lexical content
    const textContent = extractLexicalText(note.content)
    if (!textContent.trim()) {
      req.payload.logger.info(`[Embedding] Note ${noteId} has no text content, skipping`)
      return { success: false, error: 'Note has no text content' }
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent)
    if (note.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Embedding] Note ${noteId} embedding already up to date, skipping generation`
      )
      return { success: true }
    }

    // Generate embedding
    req.payload.logger.info(`[Embedding] Generating embedding for note ${noteId}`)

    const { vector, model, dimensions } = await generateEmbedding(textContent)

    // Update note with embedding
    await req.payload.update({
      collection: 'notes',
      id: noteId,
      data: {
        embedding_vector: `[${vector.join(',')}]`,
        embedding_model: model,
        embedding_dimensions: dimensions,
        embedding_generated_at: new Date().toISOString(),
        embedding_text_hash: currentTextHash,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRevalidation: true,
      },
    })

    req.payload.logger.info(
      `[Embedding] ✅ Generated ${dimensions}D embedding for note ${noteId}`
    )

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    req.payload.logger.error(`[Embedding] Failed to generate embedding for note ${noteId}: ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

/**
 * Compute recommendations for a post (helper function)
 */
async function computeRecommendationsForPost(
  postId: number,
  req: PayloadRequest
): Promise<void> {
  try {
    // Verify post has embedding
    const post = await req.payload.findByID({
      collection: 'posts',
      id: postId,
      select: {
        embedding_vector: true,
      },
    })

    if (!post?.embedding_vector) {
      req.payload.logger.info(
        `[Recommendations] Post ${postId} has no embedding, skipping recommendations`
      )
      return
    }

    // Compute similar posts
    req.payload.logger.info(`[Recommendations] Computing recommendations for post ${postId}`)

    const similarPosts = await getSimilarPosts(postId, 3)
    const recommendedIds = similarPosts.map((p) => p.id)

    // Update post with recommendations
    await req.payload.update({
      collection: 'posts',
      id: postId,
      data: {
        recommended_post_ids: recommendedIds,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRecommendationCompute: true,
        skipRevalidation: true,
      },
    })

    req.payload.logger.info(
      `[Recommendations] ✅ Computed ${recommendedIds.length} recommendations for post ${postId}`
    )
  } catch (error) {
    req.payload.logger.error(
      `[Recommendations] Failed to compute recommendations for post ${postId}: ${error instanceof Error ? error.message : String(error)}`
    )
    // Don't throw - recommendations are non-critical
  }
}

