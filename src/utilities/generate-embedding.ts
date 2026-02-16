import crypto from "node:crypto";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import type { CollectionAfterOperationHook, PayloadRequest } from "payload";

// Re-export extractLexicalText as extractTextFromContent for backwards compatibility
export { extractLexicalText as extractTextFromContent } from "./extract-lexical-text";

const EMBEDDING_TEXT_LIMIT = 8000;
const DAYS_PER_WEEK = 7;
const FALLBACK_VECTOR_DIMENSIONS = 384;
const HASH_PREFIX_LENGTH = 16;
const HASH_SLICE_LENGTH = 8;
const HASH_WINDOW_MODULO = 32;
const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_SECOND = 1000;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_IN_WEEK =
  DAYS_PER_WEEK *
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;
const NORMALIZATION_OFFSET = 0.5;
const NORMALIZATION_SCALE = 2;
const UINT32_MAX = 0xff_ff_ff_ff;
const UNTITLED_LABEL = "untitled";

type EmbeddableCollection = "activities" | "notes" | "posts";

type EmbeddingDoc = {
  id: number | string;
  _status?: "draft" | "published" | null;
  title?: string | null;
  embedding_text_hash?: string | null;
  [key: string]: unknown;
};

type CurrentEmbedding = {
  generatedAt?: string | null;
  textHash?: string | null;
  vector?: number[] | null;
};

function generateFallbackEmbedding(text: string): number[] {
  const hash = crypto.createHash("sha256").update(text).digest("hex");

  return new Array(FALLBACK_VECTOR_DIMENSIONS).fill(0).map((_, index) => {
    const hashWindowStart = index % HASH_WINDOW_MODULO;
    const slice = hash.slice(
      hashWindowStart,
      hashWindowStart + HASH_SLICE_LENGTH
    );
    const num = Number.parseInt(slice, 16);
    return (num / UINT32_MAX - NORMALIZATION_OFFSET) * NORMALIZATION_SCALE;
  });
}

function getDocFromResult(result: unknown): EmbeddingDoc | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  if ("doc" in result && result.doc && typeof result.doc === "object") {
    return result.doc as EmbeddingDoc;
  }

  return result as EmbeddingDoc;
}

function shouldSkipFromContext(args: unknown): boolean {
  if (!(args && typeof args === "object" && "context" in args)) {
    return false;
  }

  const context = args.context;
  return Boolean(
    context &&
      typeof context === "object" &&
      "skipEmbeddingGeneration" in context &&
      context.skipEmbeddingGeneration
  );
}

function shouldSkipEmbeddingGeneration({
  args,
  doc,
  operation,
  req,
}: {
  args: unknown;
  doc: EmbeddingDoc | null;
  operation: string;
  req: PayloadRequest;
}): boolean {
  if (operation !== "create" && operation !== "update") {
    return true;
  }

  if (!doc || shouldSkipFromContext(args)) {
    return true;
  }

  if (doc._status !== "published") {
    return true;
  }

  return req.query?.autosave === "true" || req.query?.draft === "true";
}

function getDocTitle(doc: Pick<EmbeddingDoc, "title">): string {
  return doc.title?.trim() || UNTITLED_LABEL;
}

async function persistEmbedding({
  collection,
  doc,
  model,
  req,
  textHash,
  vector,
}: {
  collection: EmbeddableCollection;
  doc: EmbeddingDoc;
  model: string;
  req: PayloadRequest;
  textHash: string;
  vector: number[];
}) {
  await req.payload.update({
    collection,
    id: doc.id,
    data: {
      embedding_vector: `[${vector.join(",")}]`,
      embedding_model: model,
      embedding_dimensions: vector.length,
      embedding_generated_at: new Date().toISOString(),
      embedding_text_hash: textHash,
    },
    overrideAccess: true,
    context: {
      skipEmbeddingGeneration: true,
      skipRecommendationCompute: true,
      skipRevalidation: true,
    },
  });
}

// Create a hash of the text content for change detection
export function createTextHash(text: string): string {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex")
    .slice(0, HASH_PREFIX_LENGTH);
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
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text.substring(0, EMBEDDING_TEXT_LIMIT),
    });

    return {
      vector: embedding,
      model: "text-embedding-3-small",
      dimensions: embedding.length,
    };
  } catch {
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
  currentEmbedding: CurrentEmbedding | null | undefined,
  newTextHash: string
): boolean {
  if (!(currentEmbedding?.vector && currentEmbedding.textHash)) {
    return true;
  }

  if (currentEmbedding.textHash !== newTextHash) {
    return true;
  }

  if (!currentEmbedding.generatedAt) {
    return false;
  }

  const generatedAt = new Date(currentEmbedding.generatedAt);
  return Date.now() - generatedAt.getTime() > MILLISECONDS_IN_WEEK;
}

// Shared embedding hook factory - creates collection-specific hooks
// Runs in afterOperation to avoid blocking the HTTP response.
export function createEmbeddingHook(
  extractText: (data: unknown) => string,
  collectionName: EmbeddableCollection
): CollectionAfterOperationHook {
  return async ({ args, operation, req, result }) => {
    const doc = getDocFromResult(result);

    if (
      shouldSkipEmbeddingGeneration({
        args,
        doc,
        operation,
        req,
      })
    ) {
      return;
    }

    if (!doc) {
      return;
    }

    const textContent = extractText(doc).trim();
    if (!textContent) {
      return;
    }

    const currentTextHash = createTextHash(textContent);

    if (doc.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `${collectionName} embedding is up to date, skipping generation`
      );
      return;
    }

    const docTitle = getDocTitle(doc);
    req.payload.logger.info(
      `[Background] Generating embedding for ${collectionName}: "${docTitle}"`
    );

    try {
      const { model, vector } = await generateEmbedding(textContent);
      await persistEmbedding({
        collection: collectionName,
        doc,
        model,
        req,
        textHash: currentTextHash,
        vector,
      });

      req.payload.logger.info(
        `[Background] ✅ Generated ${vector.length}D embedding for ${collectionName}: "${docTitle}"`
      );
    } catch (error) {
      req.payload.logger.error(
        `[Background] Failed to generate ${collectionName} embedding: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}
