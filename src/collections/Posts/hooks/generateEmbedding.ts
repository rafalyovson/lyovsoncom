import type { CollectionBeforeChangeHook } from 'payload'
import {
  generateEmbedding,
  extractPostText,
  createTextHash,
  shouldRegenerateEmbedding,
} from '@/utilities/generate-embedding'

export const generateEmbeddingHook: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  // Only generate embeddings for published posts with content
  if (data._status !== 'published' || !data.content) {
    return data
  }

  try {
    // Extract text content for embedding
    const textContent = extractPostText(data)

    if (!textContent.trim()) {
      return data // No content to embed
    }

    // Create hash of current content
    const currentTextHash = createTextHash(textContent)

    // Check if we need to regenerate the embedding
    const needsRegeneration = shouldRegenerateEmbedding(originalDoc?.embedding, currentTextHash)

    if (!needsRegeneration) {
      req.payload.logger.info('Embedding is up to date, skipping generation')
      return data
    }

    req.payload.logger.info('Generating embedding for post...')

    // Generate new embedding
    const { vector, model, dimensions } = await generateEmbedding(textContent)

    // Update the post data with the new embedding
    data.embedding = {
      vector,
      model,
      dimensions,
      generatedAt: new Date().toISOString(),
      textHash: currentTextHash,
    }

    req.payload.logger.info(
      `Generated ${dimensions}D embedding using ${model} for post "${data.title}"`,
    )

    return data
  } catch (error) {
    // Log error but don't fail the post save
    req.payload.logger.error('Failed to generate embedding:', error)

    // If this is an update and we had a previous embedding, keep it
    if (operation === 'update' && originalDoc?.embedding) {
      data.embedding = originalDoc.embedding
    }

    return data
  }
}

// Background hook to regenerate embeddings for existing posts
export const regenerateEmbeddingHook: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  // This hook can be called manually to force regeneration
  // Only run if explicitly requested via admin or API
  const forceRegenerate = req.query?.regenerateEmbedding === 'true'

  if (!forceRegenerate || !data.content || data._status !== 'published') {
    return data
  }

  try {
    const textContent = extractPostText(data)
    const currentTextHash = createTextHash(textContent)

    req.payload.logger.info('Force regenerating embedding for post...')

    const { vector, model, dimensions } = await generateEmbedding(textContent)

    data.embedding = {
      vector,
      model,
      dimensions,
      generatedAt: new Date().toISOString(),
      textHash: currentTextHash,
    }

    req.payload.logger.info(
      `Force regenerated ${dimensions}D embedding using ${model} for post "${data.title}"`,
    )

    return data
  } catch (error) {
    req.payload.logger.error('Failed to force regenerate embedding:', error)
    return data
  }
}
