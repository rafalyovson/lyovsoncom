import type { TaskConfig } from 'payload'
import { generateEmbedding } from '@/utilities/generate-embedding'
import { extractLexicalText } from '@/utilities/extract-lexical-text'
import { createTextHash } from '@/utilities/generate-embedding'

export const GenerateEmbedding: TaskConfig<'generateEmbedding'> = {
  slug: 'generateEmbedding',

  // Input schema - collection agnostic
  inputSchema: [
    { name: 'collection', type: 'text', required: true },
    { name: 'docId', type: 'number', required: true },
  ],

  // Output schema
  outputSchema: [
    { name: 'success', type: 'checkbox', required: true },
    { name: 'skipped', type: 'checkbox' },
    { name: 'reason', type: 'text' },
    { name: 'dimensions', type: 'number' },
  ],

  // Retry up to 2 times on failure (OpenAI API can be flaky)
  retries: 2,

  // The actual task logic
  handler: async ({ input, req }) => {
    const { collection, docId } = input

    // Fetch the document
    const doc = await req.payload.findByID({
      collection: collection as any,
      id: docId,
    })

    // Validation checks
    if (!doc) {
      return { output: { success: false, reason: 'document_not_found' } }
    }

    if (doc._status !== 'published') {
      return { output: { success: false, reason: 'not_published' } }
    }

    if (!doc.content) {
      return { output: { success: false, reason: 'no_content' } }
    }

    // Extract text from Lexical content
    const textContent = extractLexicalText(doc.content)
    if (!textContent.trim()) {
      return { output: { success: false, reason: 'no_text_content' } }
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent)
    if (doc.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Job] Embedding already up to date for ${collection}:${docId}`,
      )
      return { output: { success: true, skipped: true } }
    }

    // Generate embedding
    req.payload.logger.info(`[Job] Generating embedding for ${collection}:${docId}`)

    const { vector, model, dimensions } = await generateEmbedding(textContent)

    // Update document with embedding
    await req.payload.update({
      collection: collection as any,
      id: docId,
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
      `[Job] ✅ Generated ${dimensions}D embedding for ${collection}:${docId}`,
    )

    return {
      output: {
        success: true,
        dimensions,
        skipped: false,
      },
    }
  },
}
