import configPromise from "@payload-config";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";

export async function GET(_request: NextRequest) {
  // NOTE: "use cache" removed due to Next.js 16 canary bug
  // See: https://github.com/vercel/next.js/issues/76612
  // Route handlers with "use cache" throw: "Only plain objects can be passed to Client Components"
  // Additionally, cached functions cannot accept non-serializable parameters like Payload instances
  // Using traditional HTTP caching via Cache-Control headers instead (line 365)

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://lyovson.com";

  try {
    const payload = await getPayload({ config: configPromise });

    // Get content statistics for AI context
    const [posts, projects, topics] = await Promise.all([
      payload.find({
        collection: "posts",
        where: { _status: { equals: "published" } },
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: "projects",
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: "topics",
        limit: 1,
        pagination: false,
      }),
    ]);

    const apiDocumentation = {
      site: {
        name: "Lyovson.com",
        description:
          "Website and blog of Rafa and Jess Lyovson — featuring writing, projects, and research",
        url: SITE_URL,
        authors: ["Rafa Lyovson", "Jess Lyovson"],
        topics: [
          "programming",
          "design",
          "philosophy",
          "technology",
          "research",
        ],
        contentStats: {
          totalPosts: posts.totalDocs,
          totalProjects: projects.totalDocs,
          totalTopics: topics.totalDocs,
        },
      },
      openapi: "3.1.0",
      contentAccess: {
        description:
          "All content is accessible via standard HTTP GET requests to documented endpoints",
        api: {
          type: "REST",
          description: "RESTful API for accessing posts, projects, and topics",
          rest: {
            endpoints: [
              {
                path: "/",
                method: "GET",
                description: "Homepage with latest posts and featured projects",
                response: "HTML page",
                access: "public",
              },
              {
                path: "/{projectSlug}/{postSlug}",
                method: "GET",
                description: "Individual post pages",
                parameters: {
                  projectSlug: "URL-friendly project identifier",
                  postSlug: "URL-friendly post identifier",
                },
                response: "HTML page with full post content",
                access: "public",
              },
              {
                path: "/api/docs",
                method: "GET",
                description: "API documentation (this endpoint)",
                response: "JSON",
                access: "public",
                caching: "3600s",
              },
            ],
          },
        },
        collections: {
          description:
            "Content organized into collections accessible through Payload CMS",
          available: [
            {
              name: "posts",
              endpoint: `${SITE_URL}/posts`,
              description: "Blog posts and articles",
              fields: [
                "title",
                "content",
                "authors",
                "project",
                "topics",
                "meta",
              ],
              access: "published posts are public",
              sorting: "newest first by default",
            },
            {
              name: "projects",
              endpoint: `${SITE_URL}/projects`,
              description: "Project collections and categories",
              fields: ["name", "slug", "description"],
              access: "public",
            },
            {
              name: "topics",
              endpoint: `${SITE_URL}/topics`,
              description: "Content categorization tags",
              fields: ["name", "description", "color"],
              access: "public",
            },
          ],
        },
        embeddings: {
          description:
            "Semantic search using pgvector embeddings for posts, notes, and books",
          model: "text-embedding-3-small (OpenAI)",
          dimensions: 1536,
          endpoints: {
            embeddings: {
              path: "/api/embeddings",
              methods: {
                bulk: {
                  description:
                    "Get embeddings for multiple items (posts, books, notes)",
                  parameters: {
                    type: "posts | books | notes | all (optional, defaults to 'all')",
                    limit: "number (optional, max 100, defaults to 50)",
                    vector:
                      "boolean (optional, include vector data, defaults to true)",
                    content:
                      "boolean (optional, include full content, defaults to false)",
                  },
                  examples: [
                    `${SITE_URL}/api/embeddings?type=posts&limit=10`,
                    `${SITE_URL}/api/embeddings?type=books&vector=false`,
                    `${SITE_URL}/api/embeddings?type=all&limit=25`,
                  ],
                  caching: "3600s",
                  notes:
                    "Returns pre-computed embeddings only for fast response times",
                },
                specific: {
                  description: "Get embedding for a specific item by ID",
                  parameters: {
                    type: "posts | books | notes (required)",
                    id: "item ID (required)",
                  },
                  example: `${SITE_URL}/api/embeddings?type=posts&id=123`,
                  caching: "3600s",
                },
                query: {
                  description:
                    "Generate embedding for a text query (on-demand)",
                  parameters: {
                    q: "text query (required)",
                  },
                  example: `${SITE_URL}/api/embeddings?q=programming+philosophy`,
                  caching: "3600s",
                  notes: "Generates embedding on-the-fly using OpenAI API",
                },
              },
            },
            status: {
              path: "/api/embeddings/status",
              description:
                "Get embedding system health and coverage statistics",
              response: {
                system: "health status and configuration",
                statistics: "coverage percentages per collection",
                recommendations: "actionable improvement suggestions",
              },
              caching: "300s",
            },
            search: {
              path: "/api/search",
              description: "Semantic search across all content using embeddings",
              parameters: {
                q: "search query (required)",
                limit: "number of results (optional, defaults to 10)",
                threshold:
                  "similarity threshold 0-1 (optional, defaults to 0.7)",
              },
              example: `${SITE_URL}/api/search?q=web+development&limit=5`,
              response: "ranked results with similarity scores",
              caching: "300s",
            },
          },
          features: [
            "Pre-computed embeddings for fast bulk access",
            "On-demand embedding generation for queries",
            "Automatic embedding updates on content changes",
            "HNSW indexing for sub-100ms vector search",
            "Cosine similarity ranking",
            "Collection-specific coverage tracking",
          ],
          storage: "PostgreSQL with pgvector extension",
          indexing: "HNSW (Hierarchical Navigable Small World)",
        },
      },
      dataFormat: {
        posts: {
          structure: "Lexical rich text format (JSON)",
          features: [
            "Nested block structure",
            "Custom components (banners, code blocks, media)",
            "Relationship links to other content",
            "Version control via _status field",
          ],
          serialization: {
            internal: "Lexical JSON",
            public: "Converted to HTML/Markdown for display",
          },
        },
      },
      rateLimits: {
        default: "No explicit limits in development",
        production: "Subject to Vercel edge function limits",
        caching: "Aggressive caching via Cache-Control headers",
      },
      metadata: {
        framework: "Next.js 15 with App Router",
        cms: "Payload CMS 3.x",
        database: "Vercel Postgres with pgvector",
        hosting: "Vercel",
        search: "Semantic search via OpenAI embeddings",
      },
      usage: {
        aiAgents: {
          description:
            "This API is designed for AI agents to understand and access site content",
          recommendations: [
            "Use /api/docs to understand available endpoints",
            "Use /api/embeddings for semantic search",
            "Use /api/search for natural language queries",
            "Use /api/embeddings/status to check system health",
            "Access individual posts via /{projectSlug}/{postSlug}",
            "Respect Cache-Control headers for optimal performance",
          ],
          bestPractices: [
            "Start with /api/search for content discovery",
            "Use embeddings similarity scores to rank relevance",
            "Filter by topics for focused content areas",
            "Check embedding coverage before bulk operations",
            "Use vector=false parameter when vectors aren't needed",
          ],
        },
        humanDevelopers: {
          description: "Standard REST API access patterns apply",
          recommendations: [
            "All GET endpoints return JSON",
            "CORS enabled for public endpoints",
            "Standard HTTP status codes (200, 404, 500)",
            "Errors include descriptive messages",
          ],
        },
      },
      contact: {
        general: "hello@lyovson.com",
        technical: "rafa@lyovson.com",
        github: "https://github.com/rafalyovson",
      },
      links: {
        documentation: `${SITE_URL}/api/docs`,
        embeddingStatus: `${SITE_URL}/api/embeddings/status`,
        search: `${SITE_URL}/api/search`,
        home: SITE_URL,
      },
      version: "3.0.0",
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(apiDocumentation, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "API documentation temporarily unavailable",
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
