import type { Metadata } from 'next'
import { GridCard, GridCardSection } from '@/components/grid'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: 'AI & Bot Access Documentation | Lyovson.com',
  description:
    'Comprehensive guide for AI systems, bots, and crawlers to access and consume content from Lyovson.com. Includes API endpoints, feeds, and best practices.',
  keywords: [
    'AI access',
    'bot documentation',
    'API',
    'RSS feeds',
    'GraphQL',
    'crawler friendly',
    'machine readable',
  ],
  alternates: {
    canonical: '/ai-docs',
  },
  openGraph: {
    title: 'AI & Bot Access Documentation',
    description: 'Comprehensive guide for AI systems and bots to access content from Lyovson.com',
    type: 'website',
    url: '/ai-docs',
  },
  twitter: {
    card: 'summary',
    title: 'AI & Bot Access Documentation',
    description: 'Guide for AI systems to access Lyovson.com content',
    site: '@lyovson',
  },
  robots: {
    index: true,
    follow: true,
  },
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-4">
      {title && <h4 className="text-sm font-medium mb-2 text-gray-600">{title}</h4>}
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      {children} ↗
    </a>
  )
}

export default function AIDocsPage() {
  const SITE_URL = getServerSideURL()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI & Bot Access Documentation</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Comprehensive guide for AI systems, research bots, and automated tools to access and
          consume content from Lyovson.com.
        </p>
      </div>

      {/* Quick Access Links */}
      <GridCard className="mb-8">
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Programmatic Access</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  📊 <ExternalLink href={`${SITE_URL}/api/docs`}>API Documentation</ExternalLink>
                </li>
                <li>
                  🔍 <ExternalLink href={`${SITE_URL}/api/graphql`}>GraphQL Endpoint</ExternalLink>
                </li>
                <li>
                  🗺️ <ExternalLink href={`${SITE_URL}/sitemap.xml`}>XML Sitemap</ExternalLink>
                </li>
                <li>
                  🤖 <ExternalLink href={`${SITE_URL}/robots.txt`}>Robots.txt</ExternalLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Content Feeds</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  📡 <ExternalLink href={`${SITE_URL}/feed.xml`}>RSS Feed</ExternalLink>
                </li>
                <li>
                  📋 <ExternalLink href={`${SITE_URL}/feed.json`}>JSON Feed</ExternalLink>
                </li>
                <li>
                  ⚛️ <ExternalLink href={`${SITE_URL}/atom.xml`}>Atom Feed</ExternalLink>
                </li>
                <li>
                  🔎 <ExternalLink href={`${SITE_URL}/search`}>Search Interface</ExternalLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">AI & Embeddings</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  🧠{' '}
                  <ExternalLink href={`${SITE_URL}/api/embeddings`}>Vector Embeddings</ExternalLink>
                </li>
                <li>
                  📰{' '}
                  <ExternalLink href={`${SITE_URL}/api/embeddings/posts/1`}>Posts API</ExternalLink>
                </li>
                <li>
                  📚{' '}
                  <ExternalLink href={`${SITE_URL}/api/embeddings/books/1`}>Books API</ExternalLink>
                </li>
                <li>
                  📝{' '}
                  <ExternalLink href={`${SITE_URL}/api/embeddings/notes/1`}>Notes API</ExternalLink>
                </li>
                <li>
                  📈{' '}
                  <ExternalLink href={`${SITE_URL}/api/embeddings/status`}>
                    System Status
                  </ExternalLink>
                </li>
                <li>
                  🔧{' '}
                  <ExternalLink href={`${SITE_URL}/.well-known/ai-resources`}>
                    AI Resources
                  </ExternalLink>
                </li>
                <li>
                  ⚡ <span className="text-green-600">pgvector + OpenAI</span>
                </li>
              </ul>
            </div>
          </div>
        </GridCardSection>
      </GridCard>

      {/* Content Access Methods */}
      <GridCard className="mb-8">
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">Content Access Methods</h2>

          <h3 className="text-lg font-medium mb-3">1. RSS/JSON/Atom Feeds (Recommended)</h3>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            For bulk content consumption, use our syndication feeds. They include full article
            content, metadata, and are updated hourly.
          </p>

          <CodeBlock title="JSON Feed with Enhanced Metadata">
            {`GET ${SITE_URL}/feed.json

// Returns JSON with full content + AI-friendly metadata:
{
  "items": [{
    "title": "Article Title",
    "content_text": "Full article content...",
    "_lyovson_metadata": {
      "wordCount": 1200,
      "readingTime": 6,
      "contentType": "article",
      "language": "en",
      "projectSlug": "next",
      "apiUrl": "${SITE_URL}/api/posts/123"
    }
  }]
}`}
          </CodeBlock>

          <h3 className="text-lg font-medium mb-3 mt-6">2. GraphQL API</h3>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            For structured queries and real-time data access. Supports filtering, sorting, and
            relationship traversal.
          </p>

          <CodeBlock title="GraphQL Query Example">
            {`POST ${SITE_URL}/api/graphql

query LatestPosts {
  Posts(limit: 10, sort: "-publishedAt", where: { _status: { equals: "published" } }) {
    docs {
      title
      slug
      content
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
        slug
      }
      meta {
        title
        description
      }
    }
  }
}`}
          </CodeBlock>

          <h3 className="text-lg font-medium mb-3 mt-6">3. REST API</h3>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            Standard REST endpoints for all content types. Supports pagination, filtering, and depth
            control.
          </p>

          <CodeBlock title="REST API Examples">
            {`# Get latest posts
GET ${SITE_URL}/api/posts?limit=10&sort=-publishedAt&where[_status][equals]=published

# Get all projects with related posts
GET ${SITE_URL}/api/projects?depth=1

# Search content
GET ${SITE_URL}/api/search?q=programming&limit=20

# Get specific post with full depth
GET ${SITE_URL}/api/posts/[id]?depth=2`}
          </CodeBlock>

          <h3 className="text-lg font-medium mb-3 mt-6">4. Vector Embeddings API</h3>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            Get vector embeddings for semantic search, content similarity, and AI applications.
            Supports both OpenAI embeddings and fallback hash-based vectors.
          </p>

          <CodeBlock title="Embeddings API Examples">
            {`# Collection-specific endpoints (pre-computed, ~50ms)
GET ${SITE_URL}/api/embeddings/posts/123      # Articles & blog posts
GET ${SITE_URL}/api/embeddings/books/456      # Books with quotes
GET ${SITE_URL}/api/embeddings/notes/789      # Personal notes

# Bulk access for training/analysis
GET ${SITE_URL}/api/embeddings?type=posts&limit=50

# Real-time query embedding
GET ${SITE_URL}/api/embeddings?q=programming tutorials

# System health across all collections
GET ${SITE_URL}/api/embeddings/status

# Advanced options
GET ${SITE_URL}/api/embeddings/posts/123?content=true&format=full
GET ${SITE_URL}/api/embeddings/books/456?regenerate=true

# Response structure:
{
  "id": 123,
  "embedding": [0.1, -0.2, 0.3, ...], // 1536-dimensional vector
  "dimensions": 1536,
  "metadata": {
    "type": "post", // or "book", "note"
    "title": "Post Title",
    "url": "${SITE_URL}/project/post-slug",
    "wordCount": 1200,
    "readingTime": 6,
    "topics": ["programming", "javascript"]
  },
  "model": "text-embedding-3-small"
}`}
          </CodeBlock>
        </GridCardSection>
      </GridCard>

      {/* Vector Embeddings System */}
      <GridCard className="mb-8">
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">🧠 Advanced Vector Embeddings System</h2>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">⚡ High-Performance Pre-computed Embeddings</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Our embedding system uses pgvector + OpenAI&apos;s text-embedding-3-small model with
              collection-specific endpoints and automatic pre-computation for lightning-fast API
              responses (&lt;100ms vs 1-3s traditional).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">🚀 Performance Features</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>pgvector storage</strong> - 44% smaller than JSONB
                </li>
                <li>
                  • <strong>HNSW indexes</strong> - Sub-millisecond similarity search
                </li>
                <li>
                  • <strong>Collection-specific</strong> - Posts, Books, Notes endpoints
                </li>
                <li>
                  • <strong>1536-dimensional</strong> OpenAI text-embedding-3-small
                </li>
                <li>
                  • <strong>Smart regeneration</strong> - Only when content changes
                </li>
                <li>
                  • <strong>Fallback system</strong> - Works without OpenAI API key
                </li>
                <li>
                  • <strong>Sub-100ms responses</strong> for individual items
                </li>
                <li>
                  • <strong>Bulk access</strong> for training and analysis
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">🔧 AI Applications</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  • <strong>Semantic search</strong> - Find related content
                </li>
                <li>
                  • <strong>Content clustering</strong> - Group similar articles
                </li>
                <li>
                  • <strong>Recommendation engines</strong> - Suggest related posts
                </li>
                <li>
                  • <strong>Content analysis</strong> - Theme and topic discovery
                </li>
                <li>
                  • <strong>Similarity scoring</strong> - Measure content relationships
                </li>
                <li>
                  • <strong>AI training data</strong> - High-quality labeled vectors
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">📊 Monitor System Health</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Check embedding coverage and system status:
            </p>
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-sm">
              GET{' '}
              <ExternalLink href={`${SITE_URL}/api/embeddings/status`}>
                {SITE_URL}/api/embeddings/status
              </ExternalLink>
            </code>
          </div>
        </GridCardSection>
      </GridCard>

      {/* Best Practices */}
      <GridCard className="mb-8">
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">Best Practices for AI Systems</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">🚀 Performance</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>Use feeds for bulk content access (rate limit: 1000/hour)</li>
                <li>Respect Cache-Control headers for optimal performance</li>
                <li>API endpoints have lower rate limits (100/hour)</li>
                <li>Include descriptive User-Agent header identifying your service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">📝 Content Understanding</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>All content includes structured metadata (JSON-LD)</li>
                <li>Articles are categorized by project and tagged with topics</li>
                <li>Full-text search available across all content</li>
                <li>Content relationships are explicit (author, project, topics)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">🤝 Attribution</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>Content copyright: Rafa & Jess Lyovson</li>
                <li>Attribution required: &quot;Lyovson.com - https://lyovson.com&quot;</li>
                <li>Contact hello@lyovson.com for licensing questions</li>
                <li>Academic and research use generally permitted with attribution</li>
              </ul>
            </div>
          </div>
        </GridCardSection>
      </GridCard>

      {/* Structured Data */}
      <GridCard className="mb-8">
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">Structured Data & Metadata</h2>

          <p className="mb-4 text-gray-700 dark:text-gray-300">
            All pages include comprehensive structured data following Schema.org standards:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Schema Types</h3>
              <ul className="space-y-1">
                <li>📄 Article (posts)</li>
                <li>🏢 Organization (site info)</li>
                <li>🌐 WebSite (global metadata)</li>
                <li>👤 Person (authors)</li>
                <li>🔍 SearchAction (search capability)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Metadata Fields</h3>
              <ul className="space-y-1">
                <li>📅 Publication/modification dates</li>
                <li>📖 Word count & reading time</li>
                <li>🏷️ Topics and categories</li>
                <li>👥 Author information</li>
                <li>🔗 Canonical URLs</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Article Schema includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Context and type information</li>
              <li>Headline and description</li>
              <li>Publication and modification dates</li>
              <li>Author information with URLs</li>
              <li>Publisher organization data</li>
              <li>Word count and reading time</li>
            </ul>
          </div>
        </GridCardSection>
      </GridCard>

      {/* Contact */}
      <GridCard>
        <GridCardSection>
          <h2 className="text-xl font-semibold mb-4">Contact & Support</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Need higher rate limits, custom access, or have questions about using our content?
          </p>
          <div className="space-y-2">
            <p>
              📧 Email:{' '}
              <ExternalLink href="mailto:hello@lyovson.com">hello@lyovson.com</ExternalLink>
            </p>
            <p>
              🐛 Issues: <ExternalLink href="https://github.com/lyovson">GitHub</ExternalLink>
            </p>
            <p>
              📱 Twitter: <ExternalLink href="https://twitter.com/lyovson">@lyovson</ExternalLink>
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Last updated: January 16, 2025 •{' '}
            <ExternalLink href={`${SITE_URL}/api/docs`}>Machine-readable version</ExternalLink>
          </p>
        </GridCardSection>
      </GridCard>
    </div>
  )
}
