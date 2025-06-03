import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export async function GET(request: NextRequest) {
  'use cache'
  cacheTag('api-docs')
  cacheLife('static')

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    // Get content statistics for AI context
    const [posts, projects, topics] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: 'projects',
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: 'topics',
        limit: 1,
        pagination: false,
      }),
    ])

    const apiDocumentation = {
      site: {
        name: 'Lyovson.com',
        description: 'Website and blog of Rafa and Jess Lyovson — featuring writing, projects, and research',
        url: SITE_URL,
        authors: ['Rafa Lyovson', 'Jess Lyovson'],
        topics: ['programming', 'design', 'philosophy', 'technology', 'research'],
        contentStats: {
          totalPosts: posts.totalDocs,
          totalProjects: projects.totalDocs,
          totalTopics: topics.totalDocs,
        },
      },
      
      // OpenAPI-style specification for programmatic access
      openapi: '3.0.3',
      info: {
        title: 'Lyovson.com API',
        description: 'API for accessing content from Lyovson.com - optimized for AI and automated consumption',
        version: '1.0.0',
        contact: {
          email: 'hello@lyovson.com',
          url: `${SITE_URL}/contact`,
        },
        license: {
          name: 'Content License',
          url: `${SITE_URL}/privacy-policy`,
        },
      },
      
      servers: [
        {
          url: SITE_URL,
          description: 'Production server',
        },
      ],
      
      // Available content access methods
      contentAccess: {
        feeds: {
          rss: `${SITE_URL}/feed.xml`,
          json: `${SITE_URL}/feed.json`,
          atom: `${SITE_URL}/atom.xml`,
          description: 'Syndication feeds with latest 50 posts, updated hourly',
        },
        
        api: {
          graphql: {
            endpoint: `${SITE_URL}/api/graphql`,
            playground: `${SITE_URL}/api/graphql-playground`,
            description: 'Full GraphQL API for querying all content types',
            authentication: 'Optional for public content, required for drafts',
          },
          
          rest: {
            baseUrl: `${SITE_URL}/api`,
            endpoints: {
              posts: '/api/posts',
              projects: '/api/projects',
              topics: '/api/topics',
              media: '/api/media',
              search: '/api/search',
              embeddings: '/api/embeddings',
            },
            description: 'RESTful API endpoints for all collections',
            authentication: 'Optional for public content',
          },
          
          embeddings: {
            baseUrl: `${SITE_URL}/api/embeddings`,
            endpoints: {
              bulk: '/api/embeddings?type=posts&limit=50',
              individual: '/api/embeddings/posts/{id}',
              query: '/api/embeddings?q={text}',
              status: '/api/embeddings/status',
            },
            description: 'High-performance pre-computed vector embeddings for AI applications',
            authentication: 'Not required',
            model: 'text-embedding-3-small (OpenAI) with fallback system',
            features: [
              'Pre-computed embeddings (~50ms response)',
              'Smart content change detection',
              'Bulk access for training',
              'Semantic search & similarity',
              'Real-time query embedding',
              'System health monitoring'
            ],
            performance: {
              responseTime: 'Sub-100ms for pre-computed, 1-2s for on-demand',
              dimensions: '1536D (OpenAI) or 384D (fallback)',
              coverage: 'Automatic generation on post publish/update'
            },
          },
        },
        
        sitemap: {
          url: `${SITE_URL}/sitemap.xml`,
          description: 'Complete sitemap with all public pages, updated every 2 hours',
        },
        
        search: {
          url: `${SITE_URL}/search`,
          api: `${SITE_URL}/api/search`,
          description: 'Full-text search across all content',
          parameters: {
            q: 'Search query string',
            limit: 'Number of results (max 50)',
            offset: 'Pagination offset',
          },
        },
      },
      
      // Content structure for AI understanding
      contentStructure: {
        posts: {
          description: 'Blog posts and articles',
          fields: [
            'title', 'slug', 'content', 'publishedAt', 'authors', 
            'project', 'topics', 'meta.title', 'meta.description'
          ],
          relationships: ['authors (users)', 'project', 'topics'],
          access: 'Public for published posts',
        },
        
        projects: {
          description: 'Project categories and collections',
          fields: ['name', 'slug', 'description', 'color'],
          relationships: ['posts (many)'],
          access: 'Public',
        },
        
        topics: {
          description: 'Content categorization tags',
          fields: ['name', 'slug', 'description'],
          relationships: ['posts (many)'],
          access: 'Public',
        },
      },
      
      // Usage examples for AI systems
      usageExamples: {
        'Get latest posts': {
          graphql: `
            query LatestPosts {
              Posts(limit: 10, sort: "-publishedAt", where: { _status: { equals: "published" } }) {
                docs {
                  title
                  slug
                  publishedAt
                  populatedAuthors {
                    name
                    username
                  }
                  project {
                    name
                    slug
                  }
                  topics {
                    name
                  }
                  meta {
                    description
                  }
                }
              }
            }
          `,
          rest: `${SITE_URL}/api/posts?limit=10&sort=-publishedAt&where[_status][equals]=published`,
        },
        
        'Search content': {
          graphql: `
            query SearchContent($query: String!) {
              Search(where: { title: { contains: $query } }) {
                docs {
                  title
                  slug
                  doc {
                    relationTo
                    value {
                      ... on Post {
                        title
                        publishedAt
                      }
                    }
                  }
                }
              }
            }
          `,
          rest: `${SITE_URL}/api/search?q={query}`,
        },
        
        'Get all projects': {
          graphql: `
            query AllProjects {
              Projects {
                docs {
                  name
                  slug
                  description
                  posts {
                    title
                    slug
                  }
                }
              }
            }
          `,
          rest: `${SITE_URL}/api/projects?depth=1`,
        },
        
        'Get embeddings for semantic search': {
          individual: `${SITE_URL}/api/embeddings/posts/123`,
          bulk: `${SITE_URL}/api/embeddings?type=posts&limit=10`,
          query: `${SITE_URL}/api/embeddings?q=programming tutorials`,
          withContent: `${SITE_URL}/api/embeddings/posts/123?content=true&format=full`,
        },
        
        'Semantic similarity search': {
          description: 'Use embeddings to find similar content',
          steps: [
            '1. Get query embedding: GET /api/embeddings?q=your-search-query',
            '2. Get all post embeddings: GET /api/embeddings?type=posts',
            '3. Calculate cosine similarity between query and post vectors',
            '4. Return posts with highest similarity scores'
          ],
          example: `
            // 1. Get query embedding
            const queryResponse = await fetch('/api/embeddings?q=machine learning');
            const { embedding: queryVector } = await queryResponse.json();
            
            // 2. Get post embeddings
            const postsResponse = await fetch('/api/embeddings?type=posts');
            const { embeddings } = await postsResponse.json();
            
            // 3. Calculate similarities (pseudo-code)
            const similarities = embeddings.map(post => ({
              ...post.metadata,
              similarity: cosineSimilarity(queryVector, post.embedding)
            })).sort((a, b) => b.similarity - a.similarity);
          `,
        },
      },
      
      // Rate limiting and best practices
      bestPractices: {
        rateLimit: {
          requests: '1000 per hour for feeds, 100 per hour for API',
          respectCacheHeaders: true,
          preferFeeds: 'Use RSS/JSON feeds for bulk content access',
        },
        
        caching: {
          feeds: 'Updated every hour, cache for 1 hour',
          api: 'Varies by endpoint, respect Cache-Control headers',
          sitemap: 'Updated every 2 hours, cache for 2 hours',
        },
        
        authentication: {
          public: 'No auth required for published content',
          headers: 'Include User-Agent identifying your bot/service',
          contact: 'Contact hello@lyovson.com for high-volume access',
        },
      },
      
      // Structured data schema information
      structuredData: {
        organization: 'https://schema.org/Organization',
        website: 'https://schema.org/WebSite',
        article: 'https://schema.org/Article',
        person: 'https://schema.org/Person',
        searchAction: 'https://schema.org/SearchAction',
        breadcrumb: 'https://schema.org/BreadcrumbList',
      },
      
      // Content licensing and usage
      contentLicense: {
        type: 'Copyright',
        owner: 'Rafa & Jess Lyovson',
        year: new Date().getFullYear(),
        usage: 'Content may be referenced with proper attribution',
        contact: 'hello@lyovson.com for licensing questions',
        attribution: 'Lyovson.com - https://lyovson.com',
      },
      
      // Last updated timestamp
      lastUpdated: new Date().toISOString(),
      generated: 'This documentation is generated dynamically',
    }

    return new Response(JSON.stringify(apiDocumentation, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error generating API documentation:', error)
    
    return new Response(
      JSON.stringify({
        error: 'API documentation temporarily unavailable',
        message: 'Please try again later or contact hello@lyovson.com',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      }
    )
  }
} 