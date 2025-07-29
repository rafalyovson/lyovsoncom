import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  const aiResources = {
    // Standard identification
    site: {
      name: 'Lyovson.com',
      description: 'Website and blog of Rafa and Jess Lyovson',
      url: SITE_URL,
      type: 'blog',
      language: 'en',
      categories: ['technology', 'programming', 'design', 'philosophy', 'research'],
    },

    // Content access methods
    content: {
      // Syndication feeds - recommended for bulk access
      feeds: {
        rss: `${SITE_URL}/feed.xml`,
        json: `${SITE_URL}/feed.json`,
        atom: `${SITE_URL}/atom.xml`,
        updateFrequency: 'hourly',
        contentIncluded: 'full-text',
      },

      // API endpoints
      api: {
        graphql: {
          endpoint: `${SITE_URL}/api/graphql`,
          documentation: `${SITE_URL}/api/graphql-playground`,
          authentication: 'optional',
          capabilities: ['queries', 'filtering', 'sorting', 'relationships'],
        },
        rest: {
          baseUrl: `${SITE_URL}/api`,
          authentication: 'optional',
          collections: ['posts', 'projects', 'topics', 'media', 'search', 'embeddings'],
          capabilities: ['pagination', 'filtering', 'sorting', 'depth-control'],
        },
        embeddings: {
          endpoint: `${SITE_URL}/api/embeddings`,
          collections: {
            posts: `${SITE_URL}/api/embeddings/posts/{id}`,
            books: `${SITE_URL}/api/embeddings/books/{id}`,
            notes: `${SITE_URL}/api/embeddings/notes/{id}`,
          },
          authentication: 'not-required',
          model: 'text-embedding-3-small or fallback',
          dimensions: '1536 or 384',
          capabilities: ['semantic-search', 'similarity-analysis', 'content-clustering'],
          usage: ['query-text', 'bulk-posts', 'individual-items', 'collection-specific'],
        },
      },

      // Search capabilities
      search: {
        endpoint: `${SITE_URL}/search`,
        api: `${SITE_URL}/api/search`,
        type: 'full-text',
        scope: 'all-content',
      },

      // Discovery
      sitemap: `${SITE_URL}/sitemap.xml`,
      robots: `${SITE_URL}/robots.txt`,
    },

    // Documentation for AI systems
    documentation: {
      human: `${SITE_URL}/ai-docs`,
      machine: `${SITE_URL}/api/docs`,
      specification: 'openapi-3.0.3',
    },

    // Rate limits and usage guidelines
    usage: {
      rateLimit: {
        feeds: '1000 requests/hour',
        api: '100 requests/hour',
      },
      bestPractices: [
        'Use feeds for bulk content access',
        'Respect Cache-Control headers',
        'Include descriptive User-Agent',
        'Contact for high-volume usage',
      ],
      contact: 'hello@lyovson.com',
    },

    // Content licensing
    licensing: {
      copyright: 'Rafa & Jess Lyovson',
      year: 2025,
      usage: 'Attribution required for content use',
      contact: 'hello@lyovson.com',
      attribution: 'Lyovson.com - https://lyovson.com',
    },

    // Technical metadata
    technical: {
      structuredData: ['schema.org/Article', 'schema.org/Organization', 'schema.org/WebSite'],
      formats: ['html', 'json', 'rss', 'atom'],
      accessibility: 'wcag-2.1-aa',
      performance: 'optimized',
      mobile: 'responsive',
    },

    // Last updated
    lastUpdated: '2025-01-16T12:00:00Z',
    version: '1.0',
    generator: 'Next.js',
  }

  return new Response(JSON.stringify(aiResources, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
