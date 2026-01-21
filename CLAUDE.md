# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix

# Payload CMS
pnpm payload          # Access Payload CLI
pnpm generate:types   # Generate TypeScript types from Payload collections
pnpm generate:importmap # Generate import map for Payload admin

# Maintenance
pnpm reinstall        # Clean reinstall of dependencies
```

## Architecture Overview

This is a **Next.js 15 + Payload CMS 3** personal website with a unique **400px grid-based layout system**.

### Core Stack
- **Next.js 15** with App Router, React 19, and experimental features (useCache, reactCompiler)
- **Payload CMS 3** with Lexical rich text editor
- **Vercel Postgres** with pgvector extension for semantic search
- **Tailwind CSS 4** with custom glassmorphism design system
- **Motion** (Framer Motion successor) for animations
- **TypeScript** in strict mode

### Grid System Architecture

The entire UI is built on a responsive grid system using fixed 400px cards:

```typescript
// Grid breakpoints (defined in globals.css)
grid-cols-[400px] g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px]
```

**Key principles:**
- All content lives inside `GridCard` components (400x400px base)
- Cards use 3x3 internal grid: `grid-cols-3 grid-rows-3`
- Glassmorphism styling with `glass-card` and `glass-interactive` classes
- Grid components located in `src/components/grid/card/`

### Data Flow & Fetching

**Server Components First:**
```typescript
// Always use Payload's local API in server components
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const posts = await payload.find({
  collection: 'posts',
  where: { _status: { equals: 'published' } }
})
```

**Form Handling:**
- Use server actions instead of API routes
- Implement with `useActionState` hook in client components
- Server actions should be in separate files with `'use server'` directive

### Payload CMS Collections

Main collections with relationships:
- **Posts** - Blog articles with embeddings, references to books/movies/people
- **Notes** - Zettelkasten notes (permanent, literature, fleeting, index types)
- **Media Collections** - Books, Movies, TvShows, Music, Podcasts, VideoGames
- **People** - Multi-role registry (authors, directors, actors, hosts)
- **Projects/Topics** - Content taxonomy and organization

**Collection Hooks:**
- `generateEmbeddingForPost` / `generateEmbeddingForNote` / `generateEmbeddingForActivity` - Fire-and-forget embedding generation on publish
- `computeRecommendationsForPost` - Generates similar post recommendations (Posts only, called after embedding)
- `revalidatePost` / `revalidateNote` / `revalidateActivity` - Clears Next.js cache on publish/update
- `populateAuthors` - Hydrates user data

### Lexical Editor Configuration

The project uses **shared Lexical editor configurations** for consistency across collections. All configs are defined in `src/fields/lexical-configs.ts`.

**Available Configurations:**

1. **`richEditorConfig`** - Full-featured editor for Posts
   - All heading sizes (h1-h4)
   - All custom blocks: Banner, Code, Media, YouTube, XPost, Quote, GIF
   - Text formatting: Bold, Italic, Underline, Strikethrough
   - Fixed and inline toolbars

2. **`bioEditorConfig`** - Profile/bio editor for Lyovsons
   - Section headings (h2-h4, no h1 for semantic hierarchy)
   - Limited blocks: Media, YouTube, Quote
   - All text formatting features

3. **`noteEditorConfig`** - Minimal editor for Notes
   - Basic text formatting only
   - No headings or blocks (keeps notes lightweight)

**Adding New Features:**

To add a feature to all editors, update `src/fields/defaultLexical.ts` (the root config):

```typescript
export const defaultLexical = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    NewFeature(),  // ← Add here
    LinkFeature({...}),
  ],
});
```

All editors inherit from `rootFeatures`, so changes propagate automatically.

**Regenerating Admin Bundle:**

After modifying editor configs:
```bash
pnpm payload generate:importmap  # Regenerate client bundle references
rm -rf .next                     # Clear Next.js cache
pnpm dev                         # Restart server
```

**Keyboard Shortcuts:**
- Bold: `Ctrl/Cmd + B`
- Italic: `Ctrl/Cmd + I`
- Underline: `Ctrl/Cmd + U`
- Strikethrough: `Ctrl/Cmd + Shift + S`
- Create link: `Ctrl/Cmd + K`
- Insert block: Type `/` in editor

### File Organization

- **kebab-case** for all files: `grid-card-section.tsx`
- **Path aliases**: `@/` → `src/`, `@payload-config` → `src/payload.config.ts`
- **Named exports** only, avoid defaults
- **Route groups**: `(frontend)` for public, `(payload)` for CMS

### Performance Optimizations

- **React Compiler** enabled - avoid manual `useMemo`/`useCallback`
- **Sharp** image processing with Vercel Blob storage
- **Advanced caching** with Next.js 15 cacheLife configuration
- **Vector search** using pgvector with VARCHAR storage and runtime casts

### Critical Patterns

1. **Grid-First Development**: All UI elements must be grid cards
2. **Server-Side Priority**: Minimize client components, use server components for data
3. **Glass Design System**: Use CSS variables for theme-aware glassmorphism
4. **Semantic Search**: Embeddings auto-generated for posts and notes
5. **Type Safety**: Strict TypeScript with generated Payload types

### Embedding & Recommendation System

This project implements a sophisticated **semantic search and recommendation system** using OpenAI embeddings and PostgreSQL pgvector.

#### Architecture - Fire-and-Forget Hooks ✅

**Current Implementation:** Event-driven embedding generation via `afterChange` hooks

**Generation Workflow:**

1. User publishes/updates post/note/activity in Payload admin
2. `afterChange` hook fires immediately (non-blocking)
3. Helper function called asynchronously (fire-and-forget):
   - **Posts:** `generateEmbeddingForPost()` → generates embedding → computes recommendations
   - **Notes:** `generateEmbeddingForNote()` → generates embedding only
   - **Activities:** `generateEmbeddingForActivity()` → generates embedding only
4. Embedding generated via OpenAI API (text-embedding-3-small, 1536 dimensions)
5. Results stored in document fields, errors logged but don't block publish response

**Helper Functions** ([src/utilities/generate-embedding-helpers.ts](src/utilities/generate-embedding-helpers.ts)):
- Collection-specific wrappers that handle validation, text extraction, and storage
- Content hash optimization: Skips regeneration if `embedding_text_hash` unchanged
- Context flags prevent infinite loops: `skipEmbeddingGeneration`, `skipRecommendationCompute`, `skipRevalidation`
- Posts compute recommendations after embedding is saved

**Collection Hooks:**
- [Posts](src/collections/Posts/index.ts#L336-L352): Fire-and-forget `generateEmbeddingForPost()` on publish/update
- [Notes](src/collections/Notes/index.ts#L274-290): Fire-and-forget `generateEmbeddingForNote()` on publish/update
- [Activities](src/collections/Activities/index.ts#L378-392): Fire-and-forget `generateEmbeddingForActivity()` on publish/update

**Note:** Jobs infrastructure exists (`src/jobs/tasks/`, `src/jobs/workflows/`) but is **not actively used**. The system uses direct function calls for immediate processing.

**Similarity Search** ([get-similar-posts.ts](src/utilities/get-similar-posts.ts))
- Direct database query using pgvector's `<=>` cosine distance operator
- Critical: Requires `::vector(1536)` casting since embeddings stored as VARCHAR
- Sequential scan performance: ~2.7ms for current scale (14 posts)
- Returns post IDs in order of similarity
- HNSW index not present but not needed at current scale

#### Database Setup

**pgvector Extension:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**Storage Format:**
- Embeddings stored as **VARCHAR** (not native `vector` type) due to Drizzle ORM limitations
- Format: JSON array string `"[0.123, -0.456, ...]"`
- Cast to vector type at query time: `embedding_vector::vector(1536)`
- No HNSW index currently - sequential scan is acceptable at current scale (~2.7ms for 14 posts)

**Future Optimization:**
If scale grows to hundreds/thousands of posts, HNSW expression index could be added:
```sql
CREATE INDEX posts_embedding_hnsw_idx 
ON posts USING hnsw ((embedding_vector::vector(1536)) vector_cosine_ops);
```
This would require adding via `afterSchemaInit` hook in Payload config to prevent schema push from dropping it.

#### Hook Context Flags

To prevent infinite loops and unwanted side effects during migrations:

- **`skipRecommendationCompute`** - Prevents computeRecommendations hook from running
- **`skipRevalidation`** - Prevents revalidatePost hook from running (Next.js cache clearing)

Example usage in migrations:
```typescript
await payload.update({
  collection: 'posts',
  id: post.id,
  data: { recommended_post_ids: ids },
  context: {
    skipRecommendationCompute: true,
    skipRevalidation: true,
  },
});
```

#### Migration Scripts

**Populate Recommendations for Existing Posts:**
```bash
pnpm tsx src/utilities/migrate-recommendations.ts
```

This script:
1. Finds all published posts with embeddings
2. Computes 3 similar posts for each
3. Updates `recommended_post_ids` field
4. Bypasses both recommendation and revalidation hooks

**Test Similarity Search:**
```bash
pnpm tsx src/utilities/test-similar-posts.ts
```

#### Key Files

- [src/collections/Posts/hooks/generateEmbedding.ts](src/collections/Posts/hooks/generateEmbedding.ts) - Embedding generation
- [src/collections/Posts/hooks/computeRecommendations.ts](src/collections/Posts/hooks/computeRecommendations.ts) - Recommendation computation
- [src/utilities/generate-embedding.ts](src/utilities/generate-embedding.ts) - OpenAI API integration
- [src/utilities/get-similar-posts.ts](src/utilities/get-similar-posts.ts) - Similarity search query
- [src/utilities/extract-lexical-text.ts](src/utilities/extract-lexical-text.ts) - Lexical to plain text
- [src/utilities/migrate-recommendations.ts](src/utilities/migrate-recommendations.ts) - Migration script

#### Performance

- **Current Scale**: 14 posts, 2 notes, 10 activities (all with embeddings)
- **Query Time**: ~2.7ms via sequential scan (acceptable at current scale)
- **Coverage**: 100% - all published content has embeddings
- **Future**: HNSW index could be added if scale grows significantly

#### Notes Collection

Notes also have embeddings generated via the same `generateEmbedding` hook, but do NOT have recommendations computed (Notes collection doesn't have `recommended_post_ids` field).

### Database Considerations

**PostgreSQL with pgvector Extension:**
- Database: Vercel Postgres (pgvector version 0.8.0)
- Connection: Use Neon MCP to interact with database
- Configuration: Filters out PostgreSQL extension objects to prevent Drizzle conflicts (see `tablesFilter` in payload.config.ts)

**Accessing the Database via Neon MCP:**

The database is NOT in the default Neon organization. Follow this workflow:

1. **List Organizations:**
   ```
   mcp__neon__list_organizations → Find "Vercel: RoadCorp" (org-dry-credit-92650987)
   ```

2. **List Projects in Organization:**
   ```
   mcp__neon__list_projects with org_id: "org-dry-credit-92650987"
   → Find "lyovsoncom-postgres" (silent-recipe-86860418)
   ```

3. **Database Identifiers:**
   - Organization: `org-dry-credit-92650987` (Vercel: RoadCorp)
   - Project ID: `silent-recipe-86860418` (lyovsoncom-postgres)
   - Main Branch: `br-frosty-field-04223759` (main)
   - Database Name: Use default (usually `neondb`) or omit parameter

4. **Execute SQL Operations:**
   ```
   mcp__neon__run_sql(projectId, branchId, sql)
   mcp__neon__run_sql_transaction(projectId, branchId, sqlStatements)
   ```

**Important:** Always use `org_id` filter when listing projects, as the default organization is different from where the database actually lives.

### SEO Architecture

This project implements comprehensive SEO features with aggressive caching to minimize Neon database compute costs.

#### Sitemap Generation

**File:** `src/app/sitemap.ts`

- Uses Next.js 15 `MetadataRoute.Sitemap` API
- Caching: `"use cache"` + `cacheTag("sitemap")` + `cacheLife("sitemap")`
- Cache profile: 4h stale, 8h revalidate, 48h expire
- Event-driven invalidation: Collection hooks call `revalidateTag("sitemap")` on publish
- Queries database only on cache miss
- Includes: Posts, Notes, Activities, Projects, Topics, Author pages, utility pages

#### RSS/Atom/JSON Feeds

**Files:**
- `src/app/feed.xml/route.ts` (RSS 2.0)
- `src/app/atom.xml/route.ts` (Atom 1.0)
- `src/app/feed.json/route.ts` (JSON Feed 1.1)

- HTTP Cache-Control: `max-age=21600, s-maxage=43200` (6-12 hours)
- CDN caching: Feeds cached at edge, not invalidated on content changes
- Design goal: Minimize database wake-ups from feed readers
- New content appears in feeds within 6-12 hours (natural cache expiry)
- Note: `revalidateTag("rss")` calls in hooks are no-ops (API routes don't support cache tags)

#### JSON-LD Structured Data

**Files:**
- `src/utilities/generate-json-ld.ts` - Centralized schema generators
- `src/components/JsonLd.tsx` - Rendering component

**Schema Types:**
- WebSite (root layout with SearchAction)
- Article (posts, notes, activities)
- Person (author profiles)
- Organization (publisher info)
- BreadcrumbList (navigation)
- CollectionPage (listing pages)

**Pattern:** Each page generates its own schemas using centralized utility functions for consistency.

#### Cache Strategy Summary

| Feature | Cache Method | Invalidation | Goal |
|---------|-------------|--------------|------|
| Sitemap | Next.js cache tags | Event-driven on publish | Immediate SEO indexing |
| Feeds | HTTP Cache-Control | Natural expiry (6-12hr) | Minimize DB wake-ups |
| Pages | ISR + cache tags | Event-driven on publish | Fast page loads |
| JSON-LD | Generated at render | N/A (no caching) | Always fresh |

**Design Philosophy:** Aggressive caching with event-driven invalidation only for critical paths (sitemap, pages). Feeds rely on natural cache expiry to prevent feed readers from waking the database.

### Environment Variables

Required environment variables:
- `DATABASE_URL` or `POSTGRES_URL` - Database connection
- `PAYLOAD_SECRET` - Payload CMS secret
- `OPENAI_API_KEY` - For embedding generation
- `RESEND_API_KEY` - Email service
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage

### Development Workflow

1. Run `pnpm dev` to start development server
2. Access Payload admin at `/admin`
3. Types are auto-generated on collection changes
4. Embeddings generate automatically on post/note save
5. Use grid components for all UI development