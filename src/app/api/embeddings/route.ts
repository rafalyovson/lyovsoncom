import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import type { Activity, Note, Post, Project, Topic } from "@/payload-types";
import { generateEmbedding } from "@/utilities/generate-embedding";

// Extended types with pgvector fields
type ItemWithEmbedding = (Post | Note | Activity | Project) & {
  embedding_vector?: string | null;
  embedding_model?: string | null;
  embedding_dimensions?: number | null;
};

const MAX_EMBEDDINGS_LIMIT = 100;

/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Legacy endpoint supports query, item, and bulk embedding modes */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // 'posts', 'projects', 'all' - defaults to 'all'
  const id = searchParams.get("id"); // specific item ID
  const query = searchParams.get("q"); // text query to embed
  const includeContent = searchParams.get("content") === "true";
  const includeVector = searchParams.get("vector") !== "false"; // Include vector by default
  const limit = Math.min(
    Number.parseInt(searchParams.get("limit") || "50", 10),
    MAX_EMBEDDINGS_LIMIT
  );

  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Handle text query embedding - generate on-demand
    if (query) {
      const { vector, model, dimensions } = await generateEmbedding(query);
      return new Response(
        JSON.stringify({
          query,
          embedding: vector,
          dimensions,
          model,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Handle specific item embedding
    if (id && type) {
      // TODO: Properly type this as union of Post | Note | Project with embedding fields
      let item: ItemWithEmbedding | null = null;

      if (type === "posts") {
        item = await payload.findByID({
          collection: "posts",
          id: Number.parseInt(id, 10),
          depth: 2,
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            meta: true,
            topics: true,
            project: true,
            populatedAuthors: true,
            publishedAt: true,
            updatedAt: true,
            embedding_vector: true, // pgvector field
            embedding_model: true,
            embedding_dimensions: true,
            embedding_generated_at: true,
          },
        });
      } else if (type === "notes") {
        item = await payload.findByID({
          collection: "notes",
          id: Number.parseInt(id, 10),
          depth: 1,
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            updatedAt: true,
            embedding_vector: true,
            embedding_model: true,
            embedding_dimensions: true,
          },
        });
      } else if (type === "activities") {
        item = await payload.findByID({
          collection: "activities",
          id: Number.parseInt(id, 10),
          depth: 1,
          select: {
            id: true,
            slug: true,
            activityType: true,
            reference: true,
            notes: true,
            updatedAt: true,
            embedding_vector: true,
            embedding_model: true,
            embedding_dimensions: true,
          },
        });
      } else if (type === "projects") {
        item = await payload.findByID({
          collection: "projects",
          id: Number.parseInt(id, 10),
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            updatedAt: true,
          },
        });
      }

      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Use pre-computed embedding for posts/notes/activities, generate for projects
      let embedding: number[] = [];
      let model = "unknown";
      let dimensions = 0;

      if (
        (type === "posts" || type === "notes" || type === "activities") &&
        item.embedding_vector
      ) {
        // Use pre-computed embedding - parse pgvector format
        const vectorString = item.embedding_vector;
        embedding =
          typeof vectorString === "string"
            ? JSON.parse(vectorString)
            : vectorString;
        model = item.embedding_model || "pre-computed";
        dimensions = item.embedding_dimensions || embedding.length;
      } else {
        // Extract text content for embedding
        let textToEmbed = "";
        if (type === "notes" && "content" in item && item.content) {
          const { extractTextFromContent } = await import(
            "@/utilities/generate-embedding"
          );
          textToEmbed = extractTextFromContent(item.content);
        } else if (type === "activities") {
          const { extractLexicalText } = await import(
            "@/utilities/extract-lexical-text"
          );
          const activity = item as Activity;
          const referenceObj =
            typeof activity.reference === "object" &&
            activity.reference !== null
              ? activity.reference
              : null;
          const activityTypeLabels: Record<string, string> = {
            read: "Read",
            watch: "Watched",
            listen: "Listened",
            play: "Played",
          };
          const title = referenceObj?.title
            ? `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceObj.title}`
            : "Activity";
          const notesText = activity.notes
            ? extractLexicalText(activity.notes)
            : "";
          textToEmbed = [title, notesText].filter(Boolean).join(" ");
        } else {
          let title = "";
          if ("title" in item) {
            title = item.title || "";
          } else if ("name" in item) {
            title = item.name || "";
          }

          const description =
            "description" in item ? item.description || "" : "";
          textToEmbed = [title, description].filter(Boolean).join(" ");
        }

        const result = await generateEmbedding(textToEmbed);
        embedding = result.vector;
        model = result.model;
        dimensions = result.dimensions;
      }

      const result = {
        id: item.id,
        type,
        ...(includeVector && { embedding }),
        dimensions,
        metadata: {
          title: (() => {
            if ("title" in item) {
              return item.title || "";
            }
            if ("name" in item) {
              return item.name || "";
            }
            return "";
          })(),
          slug: item.slug,
          url: (() => {
            if (type === "posts" && "project" in item && item.project) {
              const projectSlug =
                typeof item.project === "object" ? item.project.slug : "posts";
              return `${SITE_URL}/${projectSlug}/${item.slug}`;
            }
            if (type === "notes") {
              return `${SITE_URL}/notes/${item.slug}`;
            }
            if (type === "activities") {
              return `${SITE_URL}/activities/${item.slug}`;
            }
            return `${SITE_URL}/${item.slug}`;
          })(),
          lastModified: item.updatedAt,
          hasPrecomputedEmbedding: !!item.embedding_vector,
        },
        model,
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=7200, s-maxage=7200", // Cache individual embeddings longer
          "Access-Control-Allow-Origin": "*",
          "X-Embedding-Source": item.embedding_vector
            ? "pre-computed"
            : "on-demand",
        },
      });
    }

    // Handle bulk embeddings
    const embeddings: Array<{
      id: number | string;
      type: string;
      embedding?: number[];
      dimensions: number;
      metadata: Record<string, unknown>;
      model: string;
    }> = [];

    if (type === "posts" || type === "all") {
      const posts = await payload.find({
        collection: "posts",
        where: { _status: { equals: "published" } },
        limit,
        depth: 2,
        select: {
          id: true,
          title: true,
          slug: true,
          meta: true,
          topics: true,
          project: true,
          populatedAuthors: true,
          updatedAt: true,
          embedding_vector: true, // pgvector field
          embedding_model: true,
          embedding_dimensions: true,
        },
      });

      for (const post of posts.docs) {
        const postWithEmbedding = post as ItemWithEmbedding;
        let embedding: number[] = [];
        let model = "unknown";
        let dimensions = 0;

        if (postWithEmbedding.embedding_vector) {
          // Use pre-computed embedding - parse pgvector format
          const vectorString = postWithEmbedding.embedding_vector;
          embedding =
            typeof vectorString === "string"
              ? JSON.parse(vectorString)
              : vectorString;
          model = postWithEmbedding.embedding_model || "pre-computed";
          dimensions =
            postWithEmbedding.embedding_dimensions || embedding.length;
        } else {
          // Skip posts without pre-computed embeddings in bulk requests
          // to avoid long response times
          continue;
        }

        embeddings.push({
          id: post.id,
          type: "post",
          ...(includeVector && { embedding }),
          dimensions,
          metadata: {
            title: post.title,
            slug: post.slug,
            url:
              post.project && typeof post.project === "object"
                ? `${SITE_URL}/${post.project.slug}/${post.slug}`
                : `${SITE_URL}/posts/${post.slug}`,
            lastModified: post.updatedAt,
            topics: post.topics
              ?.map((t) =>
                typeof t === "object" && t !== null ? (t as Topic).name : t
              )
              .filter(Boolean),
            authors: post.populatedAuthors
              ?.map((author) => {
                if (!author || typeof author !== "object") {
                  return null;
                }
                if (!("name" in author)) {
                  return null;
                }
                return {
                  name: String(author.name),
                  username: "username" in author ? String(author.username) : "",
                };
              })
              .filter(Boolean),
            project:
              post.project && typeof post.project === "object"
                ? { name: post.project.name, slug: post.project.slug }
                : null,
            hasPrecomputedEmbedding: true,
          },
          model,
        });
      }
    }

    if (type === "notes" || type === "all") {
      const notes = await payload.find({
        collection: "notes",
        where: { _status: { equals: "published" } },
        limit,
        depth: 1,
        select: {
          id: true,
          title: true,
          slug: true,
          updatedAt: true,
          embedding_vector: true,
          embedding_model: true,
          embedding_dimensions: true,
        },
      });

      for (const note of notes.docs) {
        const noteWithEmbedding = note as ItemWithEmbedding;
        let embedding: number[] = [];
        let model = "unknown";
        let dimensions = 0;

        if (noteWithEmbedding.embedding_vector) {
          const vectorString = noteWithEmbedding.embedding_vector;
          embedding =
            typeof vectorString === "string"
              ? JSON.parse(vectorString)
              : vectorString;
          model = noteWithEmbedding.embedding_model || "pre-computed";
          dimensions =
            noteWithEmbedding.embedding_dimensions || embedding.length;
        } else {
          continue;
        }

        embeddings.push({
          id: note.id,
          type: "note",
          ...(includeVector && { embedding }),
          dimensions,
          metadata: {
            title: note.title,
            slug: note.slug,
            url: `${SITE_URL}/notes/${note.slug}`,
            lastModified: note.updatedAt,
            hasPrecomputedEmbedding: true,
          },
          model,
        });
      }
    }

    if (type === "activities" || type === "all") {
      const activities = await payload.find({
        collection: "activities",
        where: { _status: { equals: "published" } },
        limit,
        depth: 1,
        select: {
          id: true,
          slug: true,
          activityType: true,
          reference: true,
          updatedAt: true,
          embedding_vector: true,
          embedding_model: true,
          embedding_dimensions: true,
        },
      });

      for (const activity of activities.docs) {
        const activityWithEmbedding = activity as ItemWithEmbedding;
        let embedding: number[] = [];
        let model = "unknown";
        let dimensions = 0;

        if (activityWithEmbedding.embedding_vector) {
          const vectorString = activityWithEmbedding.embedding_vector;
          embedding =
            typeof vectorString === "string"
              ? JSON.parse(vectorString)
              : vectorString;
          model = activityWithEmbedding.embedding_model || "pre-computed";
          dimensions =
            activityWithEmbedding.embedding_dimensions || embedding.length;
        } else {
          continue;
        }

        const referenceObj =
          typeof activity.reference === "object" && activity.reference !== null
            ? activity.reference
            : null;

        const activityTypeLabels: Record<string, string> = {
          read: "Read",
          watch: "Watched",
          listen: "Listened",
          play: "Played",
        };

        const title = referenceObj?.title
          ? `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceObj.title}`
          : "Activity";

        embeddings.push({
          id: activity.id,
          type: "activity",
          ...(includeVector && { embedding }),
          dimensions,
          metadata: {
            title,
            slug: activity.slug,
            url: `${SITE_URL}/activities/${activity.slug}`,
            lastModified: activity.updatedAt,
            activityType: activity.activityType,
            hasPrecomputedEmbedding: true,
          },
          model,
        });
      }
    }

    const response = {
      embeddings,
      count: embeddings.length,
      dimensions: embeddings[0]?.dimensions || 0,
      model: embeddings.length > 0 ? "mixed" : "none",
      usage: {
        type: type || "all",
        includeContent,
        includeVector,
        limit,
        precomputedOnly: true, // We only return pre-computed embeddings in bulk
      },
      timestamp: new Date().toISOString(),
      endpoints: {
        specificItem: `${SITE_URL}/api/embeddings?type={type}&id={id}`,
        queryEmbedding: `${SITE_URL}/api/embeddings?q={query}`,
        bulk: `${SITE_URL}/api/embeddings?type={type}&limit={limit}`,
        collections: {
          posts: `${SITE_URL}/api/embeddings/posts/{id}`,
          notes: `${SITE_URL}/api/embeddings/notes/{id}`,
          activities: `${SITE_URL}/api/embeddings/activities/{id}`,
        },
      },
      notes: {
        performance: "Using pre-computed embeddings for fast response times",
        coverage:
          "Only items with pre-computed embeddings are included in bulk requests",
        onDemand: "Use individual endpoints for on-demand embedding generation",
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Embeddings-Source": "pre-computed",
        "X-Total-Items-With-Embeddings": embeddings.length.toString(),
      },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate embeddings",
        message: "Please try again later or contact hello@lyovson.com",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
