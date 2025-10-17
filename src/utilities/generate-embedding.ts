import crypto from "node:crypto";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import type { CollectionBeforeChangeHook } from "payload";

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
export function createEmbeddingHook(
  extractText: (data: any) => string,
  collectionName: string
): CollectionBeforeChangeHook {
  return async ({ data, originalDoc, operation, req }) => {
    // Check for force regeneration flag
    const forceRegenerate = req.query?.regenerateEmbedding === "true";

    // Only generate embeddings for published content
    if (data._status !== "published" && !forceRegenerate) {
      // Clear embedding data for non-published content
      data.embedding_vector = null;
      data.embedding_model = null;
      data.embedding_dimensions = null;
      data.embedding_generated_at = null;
      data.embedding_text_hash = null;
      return data;
    }

    // Skip for autosaves/drafts (unless force regenerating)
    if (
      !forceRegenerate &&
      (req.query?.autosave === "true" || req.query?.draft === "true")
    ) {
      req.payload.logger.info(
        `Skipping embedding generation for ${collectionName} autosave/draft`
      );
      return data;
    }

    try {
      // Extract text using collection-specific function
      const textContent = extractText(data);

      if (!textContent.trim()) {
        return data; // No content to embed
      }

      // Create hash of current content
      const currentTextHash = createTextHash(textContent);

      // Check if we need to regenerate (skip check if force regenerating)
      if (!forceRegenerate) {
        const currentEmbedding = {
          vector: originalDoc?.embedding_vector,
          model: originalDoc?.embedding_model,
          dimensions: originalDoc?.embedding_dimensions,
          generatedAt: originalDoc?.embedding_generated_at,
          textHash: originalDoc?.embedding_text_hash,
        };

        const needsRegeneration = shouldRegenerateEmbedding(
          currentEmbedding,
          currentTextHash
        );

        if (!needsRegeneration) {
          req.payload.logger.info(
            `${collectionName} embedding is up to date, skipping generation`
          );
          return data;
        }
      }

      const action = forceRegenerate ? "Force generating" : "Generating";
      req.payload.logger.info(
        `${action} embedding for ${collectionName}: "${data.title || "untitled"}"`
      );

      // Generate new embedding
      const { vector, model, dimensions } =
        await generateEmbedding(textContent);

      // Store in pgvector format
      data.embedding_vector = `[${vector.join(",")}]`;
      data.embedding_model = model;
      data.embedding_dimensions = dimensions;
      data.embedding_generated_at = new Date().toISOString();
      data.embedding_text_hash = currentTextHash;

      const actionDone = forceRegenerate ? "Force regenerated" : "Generated";
      req.payload.logger.info(
        `✅ ${actionDone} ${dimensions}D embedding for ${collectionName}: "${data.title || "untitled"}"`
      );

      return data;
    } catch (error) {
      req.payload.logger.error(
        `Failed to generate ${collectionName} embedding:`,
        error
      );

      // Keep previous embedding if available
      if (operation === "update" && originalDoc?.embedding_vector) {
        data.embedding_vector = originalDoc.embedding_vector;
        data.embedding_model = originalDoc.embedding_model;
        data.embedding_dimensions = originalDoc.embedding_dimensions;
        data.embedding_generated_at = originalDoc.embedding_generated_at;
        data.embedding_text_hash = originalDoc.embedding_text_hash;
      }

      return data;
    }
  };
}
