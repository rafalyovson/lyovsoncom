import type { CollectionBeforeChangeHook } from "payload";

type MarkEmbeddingStaleOptions = {
  trackedFields: readonly string[];
  requirePublicVisibility?: boolean;
};

type EmbeddableDoc = {
  _status?: "draft" | "published" | null;
  visibility?: "public" | "private" | null;
};

type MutableDoc = Record<string, unknown> & EmbeddableDoc;

function shouldSkipFromContext(context: unknown): boolean {
  if (!(context && typeof context === "object")) {
    return false;
  }

  return Boolean(
    "skipEmbeddingGeneration" in context && context.skipEmbeddingGeneration
  );
}

function hasTrackedFieldChanges(
  data: Record<string, unknown>,
  trackedFields: readonly string[]
): boolean {
  return trackedFields.some((field) => field in data);
}

function createMarkEmbeddingStaleHook({
  requirePublicVisibility = false,
  trackedFields,
}: MarkEmbeddingStaleOptions): CollectionBeforeChangeHook {
  return ({ context, data, operation, originalDoc, req }) => {
    if (operation !== "create" && operation !== "update") {
      return data;
    }

    if (!data || typeof data !== "object") {
      return data;
    }

    if (shouldSkipFromContext(context)) {
      return data;
    }

    if (req.query?.autosave === "true" || req.query?.draft === "true") {
      return data;
    }

    const mutableData = data as MutableDoc;
    const original =
      originalDoc && typeof originalDoc === "object"
        ? (originalDoc as MutableDoc)
        : null;

    const nextStatus = mutableData._status ?? original?._status;
    if (nextStatus !== "published") {
      return data;
    }

    if (requirePublicVisibility) {
      const nextVisibility = mutableData.visibility ?? original?.visibility;
      if (nextVisibility !== "public") {
        return data;
      }
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
