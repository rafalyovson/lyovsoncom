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
- `generateEmbedding` - Creates pgvector embeddings on save
- `revalidatePost` - Clears Next.js cache
- `populateAuthors` - Hydrates user data

### File Organization

- **kebab-case** for all files: `grid-card-section.tsx`
- **Path aliases**: `@/` → `src/`, `@payload-config` → `src/payload.config.ts`
- **Named exports** only, avoid defaults
- **Route groups**: `(frontend)` for public, `(payload)` for CMS

### Performance Optimizations

- **React Compiler** enabled - avoid manual `useMemo`/`useCallback`
- **Sharp** image processing with Vercel Blob storage
- **Advanced caching** with Next.js 15 cacheLife configuration
- **Vector search** using pgvector with HNSW indexes for sub-100ms queries

### Critical Patterns

1. **Grid-First Development**: All UI elements must be grid cards
2. **Server-Side Priority**: Minimize client components, use server components for data
3. **Glass Design System**: Use CSS variables for theme-aware glassmorphism
4. **Semantic Search**: Embeddings auto-generated for posts and notes
5. **Type Safety**: Strict TypeScript with generated Payload types

### Database Considerations

The project uses Vercel Postgres with pgvector extension. The configuration filters out PostgreSQL extension objects to prevent Drizzle conflicts (see `tablesFilter` in payload.config.ts).

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