import type { TaskConfig } from "payload";
import type { Activity, Note, Post } from "@/payload-types";
import {
  createTextHash,
  EMBEDDING_MODEL,
  EMBEDDING_VECTOR_DIMENSIONS,
  generateEmbedding,
} from "@/utilities/generate-embedding";
import {
  buildActivityEmbeddingText,
  buildNoteEmbeddingText,
  buildPostEmbeddingText,
} from "@/utilities/generate-embedding-helpers";

const EMBEDDABLE_COLLECTIONS = ["activities", "notes", "posts"] as const;

type EmbeddableCollection = (typeof EMBEDDABLE_COLLECTIONS)[number];

type EmbeddableDoc = {
  _status?: "draft" | "published" | null;
  visibility?: "public" | "private" | null;
  embedding_text_hash?: string | null;
};

function isEmbeddableCollection(value: string): value is EmbeddableCollection {
  return EMBEDDABLE_COLLECTIONS.includes(value as EmbeddableCollection);
}

export const GenerateEmbedding: TaskConfig<"generateEmbedding"> = {
  slug: "generateEmbedding",

  // Input schema - collection agnostic
  inputSchema: [
    { name: "collection", type: "text", required: true },
    { name: "docId", type: "number", required: true },
  ],

  // Output schema
  outputSchema: [
    { name: "success", type: "checkbox", required: true },
    { name: "skipped", type: "checkbox" },
    { name: "reason", type: "text" },
    { name: "dimensions", type: "number" },
  ],

  // Retry up to 2 times on failure (OpenAI API can be flaky)
  retries: 2,

  // The actual task logic
  handler: async ({ input, req }) => {
    const { collection: collectionInput, docId } = input;

    if (!isEmbeddableCollection(collectionInput)) {
      return { output: { success: false, reason: "unsupported_collection" } };
    }

    const collection = collectionInput;

    const depth = collection === "posts" ? 2 : 1;

    // Fetch the document
    const doc = (await req.payload.findByID({
      collection,
      id: docId,
      depth,
    })) as ((Post | Note | Activity) & EmbeddableDoc) | null;

    // Validation checks
    if (!doc) {
      return { output: { success: false, reason: "document_not_found" } };
    }

    if (doc._status !== "published") {
      return { output: { success: false, reason: "not_published" } };
    }

    if (
      (collection === "notes" || collection === "activities") &&
      doc.visibility !== "public"
    ) {
      return { output: { success: false, reason: "not_public" } };
    }

    let textContent = "";
    if (collection === "posts") {
      textContent = buildPostEmbeddingText(doc as Post);
    } else if (collection === "notes") {
      textContent = buildNoteEmbeddingText(doc as Note);
    } else {
      textContent = buildActivityEmbeddingText(doc as Activity);
    }

    if (!textContent.trim()) {
      return { output: { success: false, reason: "no_text_content" } };
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent);
    if (doc.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Job] Embedding already up to date for ${collection}:${docId}`
      );
      return { output: { success: true, skipped: true } };
    }

    // Generate embedding
    req.payload.logger.info(
      `[Job] Generating embedding for ${collection}:${docId}`
    );

    const { vector, model, dimensions } = await generateEmbedding(textContent);
    if (
      model !== EMBEDDING_MODEL ||
      dimensions !== EMBEDDING_VECTOR_DIMENSIONS
    ) {
      return { output: { success: false, reason: "invalid_embedding_output" } };
    }

    // Update document with embedding
    await req.payload.update({
      collection,
      id: docId,
      data: {
        embedding_vector: `[${vector.join(",")}]`,
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
    });

    req.payload.logger.info(
      `[Job] ✅ Generated ${dimensions}D embedding for ${collection}:${docId}`
    );

    return {
      output: {
        success: true,
        dimensions,
        skipped: false,
      },
    };
  },
};
