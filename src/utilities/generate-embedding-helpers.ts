import type { PayloadRequest } from "payload";
import type { Activity } from "@/payload-types";
import { extractLexicalText } from "@/utilities/extract-lexical-text";
import {
  createTextHash,
  generateEmbedding,
} from "@/utilities/generate-embedding";
import { getSimilarNotes } from "@/utilities/get-similar-notes";
import { getSimilarPosts } from "@/utilities/get-similar-posts";

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
      collection: "posts",
      id: postId,
    });

    // Validation checks
    if (!post) {
      req.payload.logger.error(`[Embedding] Post ${postId} not found`);
      return { success: false, error: "Post not found" };
    }

    if (post._status !== "published") {
      req.payload.logger.info(
        `[Embedding] Post ${postId} is not published, skipping`
      );
      return { success: false, error: "Post is not published" };
    }

    if (!post.content) {
      req.payload.logger.info(
        `[Embedding] Post ${postId} has no content, skipping`
      );
      return { success: false, error: "Post has no content" };
    }

    // Build rich embedding text from all relevant fields
    const contentText = extractLexicalText(post.content);
    const topicNames = post.topics
      ?.filter((t): t is Exclude<typeof t, number> => typeof t === "object" && t !== null)
      .map((t) => t.name)
      .filter(Boolean)
      .join(", ");
    const projectName =
      typeof post.project === "object" && post.project !== null
        ? post.project.name
        : null;

    const textParts = [
      post.title,
      post.description,
      projectName ? `Project: ${projectName}` : null,
      topicNames ? `Topics: ${topicNames}` : null,
      contentText,
    ].filter(Boolean);

    const textContent = textParts.join("\n\n");

    if (!textContent.trim()) {
      req.payload.logger.info(
        `[Embedding] Post ${postId} has no text content, skipping`
      );
      return { success: false, error: "Post has no text content" };
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent);
    if (post.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Embedding] Post ${postId} embedding already up to date, skipping generation`
      );
      // Still compute recommendations in case other posts changed
      await computeRecommendationsForPost(postId, req);
      return { success: true };
    }

    // Generate embedding
    req.payload.logger.info(
      `[Embedding] Generating embedding for post ${postId}`
    );

    const { vector, model, dimensions } = await generateEmbedding(textContent);

    // Update post with embedding
    await req.payload.update({
      collection: "posts",
      id: postId,
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
      `[Embedding] ✅ Generated ${dimensions}D embedding for post ${postId}`
    );

    // Compute recommendations after embedding is saved
    await computeRecommendationsForPost(postId, req);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    req.payload.logger.error(
      `[Embedding] Failed to generate embedding for post ${postId}: ${errorMessage}`
    );
    return { success: false, error: errorMessage };
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
      collection: "notes",
      id: noteId,
    });

    // Validation checks
    if (!note) {
      req.payload.logger.error(`[Embedding] Note ${noteId} not found`);
      return { success: false, error: "Note not found" };
    }

    if (note._status !== "published") {
      req.payload.logger.info(
        `[Embedding] Note ${noteId} is not published, skipping`
      );
      return { success: false, error: "Note is not published" };
    }

    if (!note.content) {
      req.payload.logger.info(
        `[Embedding] Note ${noteId} has no content, skipping`
      );
      return { success: false, error: "Note has no content" };
    }

    // Build rich embedding text from all relevant fields
    const contentText = extractLexicalText(note.content);
    const noteTypeLabel = note.type === "quote" ? "Quote" : "Thought";
    const topicNames = note.topics
      ?.filter((t): t is Exclude<typeof t, number> => typeof t === "object" && t !== null)
      .map((t) => t.name)
      .filter(Boolean)
      .join(", ");

    const textParts = [
      note.title,
      `Type: ${noteTypeLabel}`,
      note.author ? `Author: ${note.author}` : null,
      note.quotedPerson ? `Quoted: ${note.quotedPerson}` : null,
      topicNames ? `Topics: ${topicNames}` : null,
      contentText,
    ].filter(Boolean);

    const textContent = textParts.join("\n\n");

    if (!textContent.trim()) {
      req.payload.logger.info(
        `[Embedding] Note ${noteId} has no text content, skipping`
      );
      return { success: false, error: "Note has no text content" };
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent);
    if (note.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Embedding] Note ${noteId} embedding already up to date, skipping generation`
      );
      // Still compute recommendations in case other notes changed
      await computeRecommendationsForNote(noteId, req);
      return { success: true };
    }

    // Generate embedding
    req.payload.logger.info(
      `[Embedding] Generating embedding for note ${noteId}`
    );

    const { vector, model, dimensions } = await generateEmbedding(textContent);

    // Update note with embedding
    await req.payload.update({
      collection: "notes",
      id: noteId,
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
      `[Embedding] ✅ Generated ${dimensions}D embedding for note ${noteId}`
    );

    // Compute recommendations after embedding is saved
    await computeRecommendationsForNote(noteId, req);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    req.payload.logger.error(
      `[Embedding] Failed to generate embedding for note ${noteId}: ${errorMessage}`
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Generate embedding for an activity
 */
export async function generateEmbeddingForActivity(
  activityId: number,
  req: PayloadRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch the activity
    const activity = await req.payload.findByID({
      collection: "activities",
      id: activityId,
      depth: 1, // Need reference for title
    });

    // Validation checks
    if (!activity) {
      req.payload.logger.error(`[Embedding] Activity ${activityId} not found`);
      return { success: false, error: "Activity not found" };
    }

    if (activity._status !== "published") {
      req.payload.logger.info(
        `[Embedding] Activity ${activityId} is not published, skipping`
      );
      return { success: false, error: "Activity is not published" };
    }

    // Build rich embedding text from activity and reference
    const referenceObj =
      typeof activity.reference === "object" && activity.reference !== null
        ? activity.reference
        : null;

    const activityTypeLabels: Record<string, string> = {
      read: "Read",
      watch: "Watched",
      listen: "Listened",
      play: "Played",
      visit: "Visited",
    };

    const referenceTypeLabels: Record<string, string> = {
      book: "Book",
      movie: "Movie",
      tvShow: "TV Show",
      videoGame: "Video Game",
      music: "Music",
      podcast: "Podcast",
      series: "Series",
      person: "Person",
      company: "Company",
      video: "Video",
      match: "Match",
    };

    const activityLabel = activityTypeLabels[activity.activityType] || activity.activityType;
    const referenceType = referenceObj?.type ? referenceTypeLabels[referenceObj.type] || referenceObj.type : null;
    const notesText = activity.notes ? extractLexicalText(activity.notes) : "";

    // Get participant reviews/notes
    const reviewTexts = activity.reviews
      ?.filter((r) => r.note && r.note.trim().length > 0)
      .map((r) => {
        const lyovsonName =
          typeof r.lyovson === "object" && r.lyovson !== null
            ? r.lyovson.name
            : null;
        return lyovsonName ? `${lyovsonName}'s note: ${r.note}` : r.note;
      })
      .filter(Boolean) || [];

    const textParts = [
      referenceObj?.title ? `${activityLabel} ${referenceObj.title}` : "Activity",
      referenceType ? `Type: ${referenceType}` : null,
      referenceObj?.description ? referenceObj.description : null,
      notesText ? `Notes: ${notesText}` : null,
      ...reviewTexts,
    ].filter(Boolean);

    const textContent = textParts.join("\n\n");

    if (!textContent.trim()) {
      req.payload.logger.info(
        `[Embedding] Activity ${activityId} has no text content, skipping`
      );
      return { success: false, error: "Activity has no text content" };
    }

    // Check if embedding already up to date
    const currentTextHash = createTextHash(textContent);
    const activityWithEmbedding = activity as Activity & {
      embedding_text_hash?: string | null;
    };
    if (activityWithEmbedding.embedding_text_hash === currentTextHash) {
      req.payload.logger.info(
        `[Embedding] Activity ${activityId} embedding already up to date, skipping generation`
      );
      return { success: true };
    }

    // Generate embedding
    req.payload.logger.info(
      `[Embedding] Generating embedding for activity ${activityId}`
    );

    const { vector, model, dimensions } = await generateEmbedding(textContent);

    // Update activity with embedding
    await req.payload.update({
      collection: "activities",
      id: activityId,
      data: {
        embedding_vector: `[${vector.join(",")}]`,
        embedding_model: model,
        embedding_dimensions: dimensions,
        embedding_generated_at: new Date().toISOString(),
        embedding_text_hash: currentTextHash,
      } as any,
      context: {
        skipEmbeddingGeneration: true,
        skipRevalidation: true,
      },
    });

    req.payload.logger.info(
      `[Embedding] ✅ Generated ${dimensions}D embedding for activity ${activityId}`
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    req.payload.logger.error(
      `[Embedding] Failed to generate embedding for activity ${activityId}: ${errorMessage}`
    );
    return { success: false, error: errorMessage };
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
      collection: "posts",
      id: postId,
      select: {
        embedding_vector: true,
      },
    });

    if (!post?.embedding_vector) {
      req.payload.logger.info(
        `[Recommendations] Post ${postId} has no embedding, skipping recommendations`
      );
      return;
    }

    // Compute similar posts
    req.payload.logger.info(
      `[Recommendations] Computing recommendations for post ${postId}`
    );

    const similarPosts = await getSimilarPosts(postId, 3);
    const recommendedIds = similarPosts.map((p) => p.id);

    // Update post with recommendations
    await req.payload.update({
      collection: "posts",
      id: postId,
      data: {
        recommended_post_ids: recommendedIds,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRecommendationCompute: true,
        skipRevalidation: true,
      },
    });

    req.payload.logger.info(
      `[Recommendations] ✅ Computed ${recommendedIds.length} recommendations for post ${postId}`
    );
  } catch (error) {
    req.payload.logger.error(
      `[Recommendations] Failed to compute recommendations for post ${postId}: ${error instanceof Error ? error.message : String(error)}`
    );
    // Don't throw - recommendations are non-critical
  }
}

/**
 * Compute recommendations for a note (helper function)
 */
async function computeRecommendationsForNote(
  noteId: number,
  req: PayloadRequest
): Promise<void> {
  try {
    // Verify note has embedding
    const note = await req.payload.findByID({
      collection: "notes",
      id: noteId,
      select: {
        embedding_vector: true,
      },
    });

    if (!note?.embedding_vector) {
      req.payload.logger.info(
        `[Recommendations] Note ${noteId} has no embedding, skipping recommendations`
      );
      return;
    }

    // Compute similar notes
    req.payload.logger.info(
      `[Recommendations] Computing recommendations for note ${noteId}`
    );

    const similarNotes = await getSimilarNotes(noteId, 3);
    const recommendedIds = similarNotes.map((n) => n.id);

    // Update note with recommendations
    await req.payload.update({
      collection: "notes",
      id: noteId,
      data: {
        recommended_note_ids: recommendedIds,
      },
      context: {
        skipEmbeddingGeneration: true,
        skipRecommendationCompute: true,
        skipRevalidation: true,
      },
    });

    req.payload.logger.info(
      `[Recommendations] ✅ Computed ${recommendedIds.length} recommendations for note ${noteId}`
    );
  } catch (error) {
    req.payload.logger.error(
      `[Recommendations] Failed to compute recommendations for note ${noteId}: ${error instanceof Error ? error.message : String(error)}`
    );
    // Don't throw - recommendations are non-critical
  }
}
