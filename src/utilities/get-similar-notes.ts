import configPromise from "@payload-config";
import {
  and,
  asc,
  eq,
  isNotNull,
  ne,
  sql,
} from "@payloadcms/db-vercel-postgres/drizzle";
import { getPayload } from "payload";
import type { Note } from "@/payload-types";
import { EMBEDDING_VECTOR_DIMENSIONS } from "@/utilities/generate-embedding";

/**
 * Find the most similar notes using pgvector cosine similarity.
 *
 * @param noteId - Current note ID to find similar notes for
 * @param limit - Number of similar notes to return (default: 3)
 * @returns Array of similar Note objects, ordered by similarity (most similar first)
 */
export async function getSimilarNotes(
  noteId: number,
  limit = 3
): Promise<Note[]> {
  const payload = await getPayload({ config: configPromise });

  // Get current note's embedding
  const currentNote = await payload.findByID({
    collection: "notes",
    id: noteId,
    select: {
      embedding_vector: true,
    },
  });

  // Early return if no embedding exists
  if (!currentNote?.embedding_vector) {
    return [];
  }

  // Parse pgvector string format "[1.0,2.0,...]" to array
  let embedding: number[];
  try {
    embedding = JSON.parse(currentNote.embedding_vector);
  } catch {
    return [];
  }

  if (embedding.length !== EMBEDDING_VECTOR_DIMENSIONS) {
    return [];
  }

  // Access notes table from generated schema
  const notesTable = payload.db.tables.notes;

  // Query similar notes using cosine distance
  // Order by distance ASC (not 1-distance DESC) for index usage
  const similarNotes = await payload.db.drizzle
    .select({
      id: notesTable.id,
    })
    .from(notesTable)
    .where(
      and(
        ne(notesTable.id, noteId), // Exclude current note
        eq(notesTable._status, "published"), // Only published notes
        eq(notesTable.visibility, "public"), // Keep parity with public note access
        isNotNull(notesTable.embedding_vector) // Only notes with embeddings
      )
    )
    // Order by cosine distance ascending = most similar first
    // IMPORTANT: Cast VARCHAR to vector type for <=> operator
    .orderBy(
      asc(
        sql`${notesTable.embedding_vector}::vector <=> ${JSON.stringify(embedding)}::vector`
      )
    )
    .limit(limit);

  // Fetch full Note objects with relationships via Payload
  const fullNotes = await Promise.all(
    similarNotes.map((n) =>
      payload.findByID({
        collection: "notes",
        id: n.id,
        depth: 1,
      })
    )
  );

  // Filter out any null results and return typed array
  return fullNotes.filter(Boolean) as Note[];
}
