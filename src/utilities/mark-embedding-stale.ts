import type { CollectionBeforeChangeHook } from "payload";

interface MarkEmbeddingStaleOptions {
  requirePublicVisibility?: boolean;
  trackedFields: readonly string[];
}

interface EmbeddableDoc {
  _status?: "draft" | "published" | null;
  visibility?: "public" | "private" | null;
}

type MutableDoc = Record<string, unknown> & EmbeddableDoc;

function shouldSkipFromContext(context: unknown): boolean {
  if (!(context && typeof context === "object")) {
    return false;
  }

  return Boolean(
    "skipEmbeddingGeneration" in context && context.skipEmbeddingGeneration
  );
}

function isAutoSaveOrDraft(req: { query?: Record<string, unknown> }): boolean {
  return req.query?.autosave === "true" || req.query?.draft === "true";
}

function resolveField<K extends keyof EmbeddableDoc>(
  data: MutableDoc,
  original: MutableDoc | null,
  field: K
): EmbeddableDoc[K] {
  return data[field] ?? original?.[field];
}

function hasTrackedFieldChanges(
  data: Record<string, unknown>,
  trackedFields: readonly string[]
): boolean {
  return trackedFields.some((field) => field in data);
}

function isWriteOperation(operation: string): boolean {
  return operation === "create" || operation === "update";
}

function toMutableDoc(doc: unknown): MutableDoc | null {
  return doc && typeof doc === "object" ? (doc as MutableDoc) : null;
}

function createMarkEmbeddingStaleHook({
  requirePublicVisibility = false,
  trackedFields,
}: MarkEmbeddingStaleOptions): CollectionBeforeChangeHook {
  return ({ context, data, operation, originalDoc, req }) => {
    if (!(isWriteOperation(operation) && data) || typeof data !== "object") {
      return data;
    }

    if (shouldSkipFromContext(context) || isAutoSaveOrDraft(req)) {
      return data;
    }

    const mutableData = data as MutableDoc;
    const original = toMutableDoc(originalDoc);

    if (resolveField(mutableData, original, "_status") !== "published") {
      return data;
    }

    if (
      requirePublicVisibility &&
      resolveField(mutableData, original, "visibility") !== "public"
    ) {
      return data;
    }

    const becamePublished = original?._status !== "published";
    const hasMeaningfulChanges =
      operation === "create" ||
      hasTrackedFieldChanges(mutableData, trackedFields);

    if (!(becamePublished || hasMeaningfulChanges)) {
      return data;
    }

    mutableData.embedding_text_hash = null;
    return mutableData;
  };
}

export const markPostEmbeddingStaleHook = createMarkEmbeddingStaleHook({
  trackedFields: ["title", "description", "content", "topics", "project"],
});

export const markNoteEmbeddingStaleHook = createMarkEmbeddingStaleHook({
  trackedFields: [
    "title",
    "type",
    "author",
    "quotedPerson",
    "topics",
    "content",
  ],
  requirePublicVisibility: true,
});

export const markActivityEmbeddingStaleHook = createMarkEmbeddingStaleHook({
  trackedFields: ["reference", "activityType", "notes", "reviews"],
  requirePublicVisibility: true,
});
