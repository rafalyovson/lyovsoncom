# Copilot Instructions for Lyóvson.com

## Architecture Overview

This is a **Next.js 15 + Payload CMS 3** personal website featuring a unique **400px grid-based layout system**. The site uses **Vercel Postgres**, **Vercel Blob storage**, and deploys to **Vercel**.

### Core Technologies

- **Next.js 15** (App Router, React 19, Turbopack)
- **Payload CMS 3** (Headless CMS with Lexical editor)
- **TypeScript** (strict mode) + **Tailwind CSS 4**
- **Vercel Postgres** (with pgvector for embeddings)
- **Motion** (Framer Motion successor) for animations
- **Shadcn/ui** + **Radix** for components

## Grid System (Core Pattern)

The entire site is built around a **responsive grid system** using fixed 400px cards:

```typescript
// Grid responsive breakpoints (defined in globals.css)
grid-cols-[400px] g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px] // etc.
```

### Grid Components Hierarchy

- `Grid` (main container) → `GridCard` (400x400px base) → `GridCardSection` (content areas)
- **All content** lives inside grid cards, never outside
- Cards use **3x3 internal grid** system: `grid-cols-3 grid-rows-3`
- **Glassmorphism styling** with `glass-card` and `glass-interactive` classes

### Grid Card Types

Located in `src/components/grid/card/`:

- `GridCardNav` - Navigation/header
- `GridCardHero` - Landing sections
- `GridCardPost*` - Blog content variants
- `GridCardSection` - Generic content container
- `GridCardSubscribe` - Email signup

## Payload CMS Integration

### Collections Structure

Main collections in `src/collections/`:

- **Posts** - Blog articles with Lexical rich text, embeddings for search
- **Media** - Images/files with Sharp optimization
- **Topics/Types/Projects** - Content taxonomy
- **Books/Movies/TvShows/VideoGames** - Reference content for reviews
- **People/Notes/Links** - Knowledge graph connections

### Content Relationships

Posts connect to multiple collections:

```typescript
// Example from Posts collection
references: ['books', 'movies', 'tvShows', 'videoGames']
personsMentioned: 'people'
notesReferenced: 'notes'
topics: 'topics'
project: 'projects'
```

### Hooks Pattern

Collections use custom hooks for:

- **Embedding generation** (`generateEmbeddingHook`) - Creates pgvector embeddings
- **Cache revalidation** (`revalidatePost`) - Clears Next.js cache
- **Author population** (`populateAuthors`) - Hydrates user data

## Development Workflows

### Essential Commands

```bash
pnpm dev              # Development server (Turbopack)
pnpm build            # Production build
pnpm payload          # Payload CLI access
pnpm generate:types   # Regenerate Payload types
```

### File Organization Conventions

- **kebab-case** for all files: `grid-card-section.tsx`
- **Path aliases**: `@/` → `src/`, `@payload-config` → `payload.config.ts`
- **Component exports**: Always named exports, avoid defaults
- **Route groups**: `(frontend)` vs `(payload)` in app directory

## Styling System

### Tailwind + CSS Variables

- **Tailwind CSS 4** with `@import 'tailwindcss'` in globals.css
- **Theme-aware glassmorphism** using CSS custom properties
- **Responsive grid breakpoints**: `g2:`, `g3:`, `g4:`, etc.

### Glass Design System

Key CSS variables in `globals.css`:

```css
--glass-bg-refined: oklch(0.985 0.008 320 / 0.8) --glass-border-refined: oklch(0.4 0.1 320 / 0.15)
  --glass-text-refined: oklch(0.25 0.05 320);
```

### Animation with Motion

- **Leaf-level animations** to minimize `'use client'` usage
- **Layout animations** with `layoutId` for seamless transitions
- **Stagger effects** on grid children with `glass-stagger-*` classes

## Data Patterns

### Server Components First

- Fetch data in **server components** via Payload's local API
- Use **React 19 `use()` hook** with Suspense for client-side fetching
- **Server actions** for form handling instead of API routes

### Search & Embeddings

- **Vector search** using pgvector with OpenAI embeddings
- **Text embeddings** auto-generated on post save
- **Search API** at `/api/embeddings` for semantic queries

### Cache Strategy

Advanced Next.js 15 caching in `next.config.ts`:

```typescript
cacheLife: {
  posts: { stale: 1800, revalidate: 3600 },
  'grid-cards': { stale: 1800, revalidate: 3600 },
  // etc.
}
```

## Performance Optimizations

### Image Handling

- **Sharp** processing via Payload CMS
- **Vercel Blob** storage with automatic WebP conversion
- **Next.js Image** component with quality configurations

### Bundle Optimization

- **Webpack code splitting** for Tailwind/Motion in `next.config.ts`
- **React Compiler** enabled (avoid `useMemo`/`useCallback`)
- **Turbopack** for fast dev builds

## Common Patterns

### Component Structure

```typescript
// Always include children and className props
export function GridCardExample({
  children,
  className,
  // ... other props
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <GridCard className={cn('specific-grid-layout', className)}>
      <GridCardSection>
        {children}
      </GridCardSection>
    </GridCard>
  )
}
```

### Form Handling

Use **server actions** with `useActionState`:

```typescript
'use client'
import { useActionState } from 'react'

// Server action in separate file
async function createContactAction(formData: FormData) {
  'use server'
  // Handle form submission
}
```

### Content Fetching

```typescript
// Server component data fetching
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const posts = await payload.find({
  collection: 'posts',
  where: { _status: { equals: 'published' } },
})
```

## Key Integration Points

- **Email**: Resend adapter configured in `payload.config.ts`
- **Analytics**: Vercel Analytics in root layout
- **SEO**: Comprehensive meta tags with AI-friendly annotations
- **PWA**: Service worker with Serwist (currently disabled in Next 15)
- **Feeds**: RSS/JSON/Atom feeds with full content for AI consumption

## When Working on This Codebase

1. **Always work within the grid system** - content goes in grid cards
2. **Use TypeScript strictly** - no `any` types, prefer types over interfaces
3. **Follow Payload patterns** - use local API, not REST endpoints
4. **Optimize for server-side rendering** - minimize client components
5. **Respect the glassmorphism aesthetic** - use glass classes and CSS variables
6. **Test responsive grid behavior** - ensure cards work across all breakpoints
