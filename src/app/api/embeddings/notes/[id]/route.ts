import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Note } from "@/payload-types";
import {
  extractTextFromContent,
  generateEmbedding,
} from "@/utilities/generate-embedding";

// Regex for word counting
const WORD_SPLIT_REGEX = /\s+/;

// Extended Note type with pgvector fields
type NoteWithEmbedding = Note & {
  embedding_vector?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
  embedding_generated_at?: string;
  embedding_text_hash?: string;
};

// Notes-specific text extraction for API
function extractNotesText(note: Pick<Note, "title" | "content">): string {
  const parts: string[] = [];

  if (note.title) {
    parts.push(note.title);
  }

  // Extract content from Lexical JSONB format
  if (note.content) {
    const contentText = extractTextFromContent(note.content);
    if (contentText) {
      parts.push(contentText);
    }
  }

  return parts.filter(Boolean).join(" ");
}

type Args = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: Args
) {
  const { id } = await paramsPromise;
  const { searchParams } = new URL(request.url);
  const includeContent = searchParams.get("content") === "true";
  const format = searchParams.get("format") || "full"; // 'full', 'vector-only', 'metadata-only'
  const regenerate = searchParams.get("regenerate") === "true"; // Force regenerate

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    const note = await payload.findByID({
      collection: "notes",
      id: Number.parseInt(id, 10),
      depth: 2,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        publishedAt: true,
        updatedAt: true,
        embedding_vector: true, // pgvector field
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
        embedding_text_hash: true,
      },
    });

    if (!note) {
      return new Response(
        JSON.stringify({
          error: "Note not found",
          id: Number.parseInt(id, 10),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse existing embedding from pgvector format
    const noteWithEmbedding = note as NoteWithEmbedding;
    let existingEmbedding: {
      vector: number[];
      model?: string;
      dimensions?: number;
      generatedAt?: string;
      textHash?: string;
    } | null = null;
    if (noteWithEmbedding.embedding_vector) {
      try {
        const vectorString = noteWithEmbedding.embedding_vector.replace(
          /^\[|\]$/g,
          ""
        ); // Remove brackets
        const vectorArray = vectorString.split(",").map(Number);
        existingEmbedding = {
          vector: vectorArray,
          model: noteWithEmbedding.embedding_model,
          dimensions: noteWithEmbedding.embedding_dimensions,
          generatedAt: noteWithEmbedding.embedding_generated_at,
          textHash: noteWithEmbedding.embedding_text_hash,
        };
      } catch (_error) {
        // Silently fail if vector parsing fails - embedding will be regenerated
      }
    }

    // Handle regeneration or missing embedding
    let embedding = existingEmbedding;
    if (regenerate || !existingEmbedding) {
      const textContent = extractNotesText(note);

      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: "Note has no content to embed",
            id: Number.parseInt(id, 10),
            title: note.title,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { vector, model, dimensions } =
        await generateEmbedding(textContent);

      embedding = {
        vector,
        model,
        dimensions,
        generatedAt: new Date().toISOString(),
        textHash: noteWithEmbedding.embedding_text_hash, // Use existing hash if available
      };

      // Only update the database if regenerating
      if (regenerate) {
        try {
          await payload.update({
            collection: "notes",
            id: Number.parseInt(id, 10),
            data: {
              embedding_vector: `[${vector.join(",")}]`,
              embedding_model: model,
              embedding_dimensions: dimensions,
              embedding_generated_at: embedding.generatedAt,
            } as Partial<NoteWithEmbedding>,
          });
        } catch (_updateError) {
          // Database update failed - embedding is still returned in response
        }
      }
    }

    // Calculate content statistics for Notes
    const contentText = extractNotesText(note);
    const wordCount = contentText.split(WORD_SPLIT_REGEX).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute

    // Format response based on requested format
    type EmbeddingData =
      | {
          vector?: number[];
          model?: string;
          dimensions?: number;
          generatedAt?: string;
          textHash?: string;
        }
      | number[]
      | null;

    const baseResponse: {
      id: number | string;
      title?: string | null;
      slug?: string | null;
      url: string;
      embedding: EmbeddingData;
      publishedAt?: string | null;
      updatedAt: string;
      metadata: {
        type: string;
        wordCount: number;
        readingTime: number;
        contentFormat: string;
        hasContent: boolean;
      };
      content?: unknown;
    } = {
      id: note.id,
      title: note.title,
      slug: note.slug,
      url: `${SITE_URL}/notes/${note.slug}`, // Notes collection URL structure
      embedding: null,
      publishedAt: note.publishedAt,
      updatedAt: note.updatedAt,
      // Notes-specific metadata
      metadata: {
        type: "note",
        wordCount,
        readingTime,
        contentFormat: "lexical",
        hasContent: !!note.content,
      },
    };

    switch (format) {
      case "vector-only":
        baseResponse.embedding = embedding?.vector || null;
        break;
      case "metadata-only":
        baseResponse.embedding = embedding
          ? {
              model: embedding.model,
              dimensions: embedding.dimensions,
              generatedAt: embedding.generatedAt,
            }
          : null;
        break;
      default: // 'full'
        baseResponse.embedding = embedding;
        if (includeContent && note.content) {
          baseResponse.content = note.content;
        }
        break;
    }

    const response = new Response(JSON.stringify(baseResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": regenerate
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Note: cacheTag and cacheLife can only be used inside "use cache" functions
    // For now, we'll rely on the Cache-Control headers
    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        id: Number.parseInt(id, 10),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle POST requests for embedding operations
export async function POST(
  request: NextRequest,
  { params: paramsPromise }: Args
) {
  const { id: _id } = await paramsPromise;

  try {
    const body = await request.json();
    const { action = "regenerate" } = body;

    if (action === "regenerate") {
      // Redirect to GET with regenerate=true
      const url = new URL(request.url);
      url.searchParams.set("regenerate", "true");

      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action",
        validActions: ["regenerate"],
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
