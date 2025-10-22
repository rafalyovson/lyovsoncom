import crypto from "node:crypto";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import type { CollectionAfterOperationHook } from "payload";

// Re-export extractLexicalText as extractTextFromContent for backwards compatibility
export { extractLexicalText as extractTextFromContent } from "./extract-lexical-text";

// Generate a simple hash-based fallback embedding
function generateFallbackEmbedding(text: string): number[] {
  const hash = crypto.createHash("sha256").update(text).digest("hex");

  // Convert hash to deterministic vector
  const vector = new Array(384).fill(0).map((_, i) => {
    const slice = hash.slice(i % 32, (i % 32) + 8);
    const num = Number.parseInt(slice, 16);
    return (num / 0xff_ff_ff_ff - 0.5) * 2; // Normalize to [-1, 1]
  });

  return vector;
}

// Create a hash of the text content for change detection
export function createTextHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// Main embedding generation function
export async function generateEmbedding(text: string): Promise<{
  vector: number[];
  model: string;
  dimensions: number;
}> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const vector = generateFallbackEmbedding(text);
    return {
      vector,
      model: "fallback-hash",
      dimensions: vector.length,
    };
  }

  try {
    // Use Vercel AI SDK for embeddings
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text.substring(0, 8000), // OpenAI token limit
    });

    return {
      vector: embedding,
      model: "text-embedding-3-small",
      dimensions: embedding.length,
    };
  } catch (_error) {
    // Fallback to hash-based embedding on error
    const vector = generateFallbackEmbedding(text);
    return {
      vector,
      model: "fallback-hash-error",
      dimensions: vector.length,
    };
  }
}

// Check if embedding needs to be regenerated
export function shouldRegenerateEmbedding(
  currentEmbedding: any,
  newTextHash: string
): boolean {
  if (!(currentEmbedding?.vector && currentEmbedding?.textHash)) {
    return true; // No existing embedding
  }

  if (currentEmbedding.textHash !== newTextHash) {
    return true; // Content has changed
  }

  // Check if embedding is too old (regenerate weekly)
  if (currentEmbedding.generatedAt) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const generatedAt = new Date(currentEmbedding.generatedAt);
    if (Date.now() - generatedAt.getTime() > oneWeek) {
      return true;
    }
  }

  return false;
}

// Shared embedding hook factory - creates collection-specific hooks
// Now runs in afterOperation to avoid blocking the HTTP response
export function createEmbeddingHook(
  extractText: (data: any) => string,
  collectionName: string
): CollectionAfterOperationHook {
  return async ({ args, operation, req, result }) => {
    // Only process after create/update operations
    if (operation !== "create" && operation !== "update") {
      return;
    }

    // Get the document from the result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = (result as any).doc || result;

    // Skip if no document or context flag set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!doc || (args as any).context?.skipEmbeddingGeneration) {
      return;
    }

    // Only generate embeddings for published content
    if (doc._status !== "published") {
      return;
    }

    // Skip for autosaves/drafts
    if (req.query?.autosave === "true" || req.query?.draft === "true") {
      return;
    }

    try {
      // Extract text using collection-specific function
      const textContent = extractText(doc);

      if (!textContent.trim()) {
        return; // No content to embed
      }

      // Create hash of current content
      const currentTextHash = createTextHash(textContent);

      // Check if embedding is already up to date
      if (doc.embedding_text_hash === currentTextHash) {
        req.payload.logger.info(
          `${collectionName} embedding is up to date, skipping generation`
        );
        return;
      }

      req.payload.logger.info(
        `[Background] Generating embedding for ${collectionName}: "${doc.title || "untitled"}"`
      );

      // Generate new embedding
      const { vector, model, dimensions } =
        await generateEmbedding(textContent);

      // Update document with embedding (runs in background after response sent)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await req.payload.update({
        collection: collectionName as any,
        id: doc.id,
        data: {
          embedding_vector: `[${vector.join(",")}]`,
          embedding_model: model,
          embedding_dimensions: dimensions,
          embedding_generated_at: new Date().toISOString(),
          embedding_text_hash: currentTextHash,
        },
        overrideAccess: true,
        context: {
          skipEmbeddingGeneration: true, // Prevent infinite loop
          skipRecommendationCompute: true, // Will be triggered separately
          skipRevalidation: true, // No need to revalidate for background update
        },
      });

      req.payload.logger.info(
        `[Background] ✅ Generated ${dimensions}D embedding for ${collectionName}: "${doc.title || "untitled"}"`
      );
    } catch (error) {
      req.payload.logger.error(
        `[Background] Failed to generate ${collectionName} embedding:`,
        error
      );
      // Don't throw - this runs after response sent, so errors shouldn't affect user
    }
  };
}
