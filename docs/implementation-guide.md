# Lyovson.com Implementation Guide

## 🚀 Implementation Overview

**Objective**: Step-by-step guide to implement the grid-first architecture with React 19, Next.js canary, and Tailwind CSS 4.x.

**Timeline**: 4-week implementation plan with clear milestones and validation checkpoints.

---

## Prerequisites & Setup

### Development Environment

```bash
# Required versions
node --version # 18.17+ or 20.9+
npm --version  # 9.0+
git --version  # 2.40+

# Optional but recommended
pnpm --version # 8.0+ (faster than npm)
```

### Repository Setup

```bash
# Clone existing repository
cd lyovsoncom

# Verify current setup
ls -la # Check existing structure
cat package.json # Check current dependencies
cat next.config.ts # Check current configuration
```

---

## Phase 1: Foundation Setup (Week 1)

### Day 1-2: Upgrade Core Dependencies

#### Step 1: Install React 19 & Next.js Canary

```bash
# Remove old versions
pnpm remove react react-dom next

# Install canary versions
pnpm add next@canary react@canary react-dom@canary

# Verify installation
pnpm list next react react-dom
```

#### Step 2: Install Tailwind CSS 4.x

```bash
# Remove Tailwind 3.x and related packages
pnpm remove tailwindcss @tailwindcss/typography autoprefixer

# Install Tailwind 4.x
pnpm add tailwindcss@next @tailwindcss/postcss@next
```

#### Step 3: Update Configuration Files

**Update `next.config.ts`:**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React 19 & Next.js canary features
  experimental: {
    ppr: 'incremental',           // Partial Prerendering
    reactCompiler: true,          // React Compiler
    dynamicIO: true,              // Dynamic IO
    turbo: {
      resolveAlias: {
        'tailwindcss': 'tailwindcss'
      }
    },
    
    // Cache configuration for React 19
    cacheLife: {
      static: {
        stale: 1800,              // 30 minutes stale
        revalidate: 3600,         // 1 hour revalidate
        expire: 86400             // 24 hours max
      },
      posts: {
        stale: 300,               // 5 minutes stale
        revalidate: 600,          // 10 minutes revalidate
        expire: 3600              // 1 hour max
      },
      search: {
        stale: 60,                // 1 minute stale
        revalidate: 300,          // 5 minutes revalidate
        expire: 1800              // 30 minutes max
      }
    }
  },
  
  // CSS optimization for Tailwind 4.x
  cssOptimization: true,
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.tailwind = {
        test: /[\\/]node_modules[\\/]tailwindcss[\\/]/,
        name: 'tailwind',
        chunks: 'all',
        priority: 30
      }
    }
    return config
  }
}

export default nextConfig
```

**Update `postcss.config.js`:**

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
    // Note: autoprefixer built into Tailwind 4.x
  }
}
```

#### Step 4: Create New Global Styles

**Replace `src/styles/globals.css`:**

```css
@import "tailwindcss";

@theme {
  /* ===================
     GRID SYSTEM
     =================== */
  --spacing: 0.25rem;
  --grid-gap: 1rem;
  --grid-min-card-size: 120px;
  
  /* Responsive grid columns */
  --grid-cols-mobile: 2;
  --grid-cols-tablet: 6;
  --grid-cols-desktop: 12;
  --grid-cols-wide: 16;
  --grid-cols-ultrawide: 20;
  
  /* ===================
     COLORS (P3 Wide Gamut)
     =================== */
  --color-primary: oklch(0.7 0.15 270);
  --color-secondary: oklch(0.6 0.2 280);
  --color-accent: oklch(0.8 0.12 150);
  
  --color-background: oklch(0.99 0.002 106.42);
  --color-foreground: oklch(0.09 0.005 285.8);
  --color-muted: oklch(0.96 0.006 286.3);
  --color-muted-foreground: oklch(0.45 0.006 286.3);
  
  --color-grid-bg: oklch(0.99 0.002 106.42);
  --color-card-bg: oklch(0.98 0.004 106.42);
  --color-card-border: oklch(0.94 0.012 106.42);
  --color-card-hover: oklch(0.96 0.008 106.42);
  
  /* ===================
     ANIMATION
     =================== */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===================
   CASCADE LAYERS
   =================== */
@layer base, components, utilities;

@layer base {
  :root {
    color-scheme: light dark;
  }
  
  body {
    background: var(--color-grid-bg);
    color: var(--color-foreground);
  }
}

@layer components {
  .grid-container {
    container-type: inline-size;
    display: grid;
    gap: var(--grid-gap);
    grid-template-columns: repeat(var(--grid-cols-mobile), minmax(var(--grid-min-card-size), 1fr));
    
    @container (min-width: 640px) {
      grid-template-columns: repeat(var(--grid-cols-tablet), minmax(var(--grid-min-card-size), 1fr));
    }
    
    @container (min-width: 1024px) {
      grid-template-columns: repeat(var(--grid-cols-desktop), minmax(var(--grid-min-card-size), 1fr));
    }
    
    @container (min-width: 1440px) {
      grid-template-columns: repeat(var(--grid-cols-wide), minmax(var(--grid-min-card-size), 1fr));
    }
    
    @container (min-width: 1920px) {
      grid-template-columns: repeat(var(--grid-cols-ultrawide), minmax(var(--grid-min-card-size), 1fr));
    }
  }
  
  .grid-card {
    container-type: inline-size;
    position: relative;
    overflow: hidden;
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: calc(var(--spacing) * 3);
    transition: all 0.3s var(--ease-smooth);
    
    @starting-style {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 25px color-mix(in oklch, var(--color-primary) 15%, transparent);
      background: var(--color-card-hover);
    }
    
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }
}

@layer utilities {
  /* Grid span utilities */
  .span-1x1 { grid-area: span 1 / span 1; }
  .span-2x1 { grid-area: span 1 / span 2; }
  .span-3x1 { grid-area: span 1 / span 3; }
  .span-1x2 { grid-area: span 2 / span 1; }
  .span-2x2 { grid-area: span 2 / span 2; }
  .span-3x2 { grid-area: span 2 / span 3; }
  .span-4x2 { grid-area: span 2 / span 4; }
  .span-6x3 { grid-area: span 3 / span 6; }
  
  /* Container-aware responsive spans */
  @container (min-width: 640px) {
    .span-auto-hero { grid-area: span 2 / span 4; }
    .span-auto-featured { grid-area: span 2 / span 3; }
    .span-auto-regular { grid-area: span 1 / span 2; }
  }
  
  @container (min-width: 1024px) {
    .span-auto-hero { grid-area: span 3 / span 6; }
    .span-auto-featured { grid-area: span 2 / span 4; }
    .span-auto-regular { grid-area: span 1 / span 2; }
  }
}
```

### Day 3-4: Create Type System

#### Step 1: Create Grid Types

**Create `src/types/grid.ts`:**

```typescript
export type GridSpan = 
  | '1x1' | '2x1' | '3x1' | '4x1' | '6x1' | '8x1' | '12x1'
  | '1x2' | '2x2' | '3x2' | '4x2' | '6x2' | '8x2'
  | '1x3' | '2x3' | '3x3' | '4x3' | '6x3'
  | 'auto'

export type ContentType = 
  | 'navigation'
  | 'hero-post' 
  | 'featured-post'
  | 'regular-post'
  | 'subscribe-card'
  | 'search-widget'
  | 'author-bio'
  | 'pagination'

export type Priority = 'critical' | 'high' | 'normal' | 'low' | 'defer'

export interface GridCardProps {
  // Core grid properties
  span?: GridSpan | 'auto'
  priority?: Priority
  content?: ContentType
  
  // Performance hints
  preload?: boolean
  lazy?: boolean
  prefetch?: 'hover' | 'view' | 'immediate' | 'never'
  
  // Animation
  animate?: 'smooth' | 'spring' | 'instant' | 'none'
  layoutId?: string
  
  // Modern CSS
  useContainerQueries?: boolean
  enableStartingStyle?: boolean
  colorScheme?: 'light' | 'dark' | 'auto'
  
  // Standard props
  children?: React.ReactNode
  className?: string
}

export interface PerformanceMetrics {
  renderTime: number
  layoutTime: number
  visibleCards: number
  totalCards: number
  cacheHitRate: number
  containerQueryUpdates: number
}
```

#### Step 2: Validation Commands

```bash
# Test new configuration
pnpm dev

# Check for TypeScript errors
pnpm run type-check

# Test build process
pnpm build

# Verify Tailwind 4.x is working
# Check browser dev tools for container query support
```

### Day 5-7: Core Grid Components

#### Step 1: Create Grid Container

**Create `src/components/grid/grid-container.tsx`:**

```typescript
'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { GridLayoutOptions } from '@/types/grid'

interface GridContainerProps {
  children: React.ReactNode
  className?: string
  options?: Partial<GridLayoutOptions>
}

export function GridContainer({ 
  children, 
  className,
  options = {}
}: GridContainerProps) {
  return (
    <motion.div
      layout
      className={cn(
        'grid-container',
        '@container',
        'p-4 max-w-7xl mx-auto',
        className
      )}
      transition={{
        layout: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
    >
      {children}
    </motion.div>
  )
}
```

#### Step 2: Create Base Grid Card

**Create `src/components/grid/grid-card.tsx`:**

```typescript
'use client'

import { Suspense } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { GridCardProps } from '@/types/grid'

export function GridCard({
  span = 'auto',
  priority = 'normal',
  content,
  animate = 'smooth',
  useContainerQueries = true,
  enableStartingStyle = true,
  children,
  className,
  ...props
}: GridCardProps) {
  const gridClasses = cn(
    'grid-card',
    useContainerQueries && '@container',
    enableStartingStyle && [
      'starting:opacity-0',
      'starting:scale-95',
      'starting:translate-y-2'
    ],
    getGridSpanClasses(span),
    priority === 'critical' && 'row-start-1',
    priority === 'defer' && 'content-visibility-auto',
    className
  )
  
  const animationConfig = getAnimationConfig(animate, enableStartingStyle)
  
  return (
    <motion.div
      layout
      className={gridClasses}
      {...animationConfig}
    >
      {children}
    </motion.div>
  )
}

function getGridSpanClasses(span: string): string {
  const spanMap = {
    '1x1': 'span-1x1',
    '2x1': 'span-2x1',
    '3x1': 'span-3x1',
    '1x2': 'span-1x2',
    '2x2': 'span-2x2',
    '3x2': 'span-3x2',
    'auto': 'span-auto-regular @[640px]:span-auto-featured @[1024px]:span-auto-hero'
  }
  
  return spanMap[span as keyof typeof spanMap] || 'span-1x1'
}

function getAnimationConfig(animate: string, enableStartingStyle: boolean) {
  if (animate === 'none') return {}
  
  const configs = {
    smooth: {
      initial: enableStartingStyle ? { opacity: 0, scale: 0.95, y: 8 } : undefined,
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    spring: {
      initial: enableStartingStyle ? { opacity: 0, scale: 0.95, y: 8 } : undefined,
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
    },
    instant: {
      transition: { duration: 0 }
    }
  }
  
  return configs[animate as keyof typeof configs] || configs.smooth
}
```

#### Step 3: Create Grid Card Skeleton

**Create `src/components/grid/grid-card-skeleton.tsx`:**

```typescript
import { Skeleton } from '@/components/ui/skeleton'
import { GridCard } from './grid-card'
import type { GridSpan } from '@/types/grid'

interface GridCardSkeletonProps {
  span?: GridSpan
  includeImage?: boolean
  includeText?: boolean
}

export function GridCardSkeleton({ 
  span = '1x1',
  includeImage = true,
  includeText = true 
}: GridCardSkeletonProps) {
  return (
    <GridCard span={span} className="p-4">
      <div className="space-y-3">
        {includeImage && (
          <Skeleton className="w-full h-32 @[480px]:h-40 @[640px]:h-48" />
        )}
        
        {includeText && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center space-x-2 pt-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        )}
      </div>
    </GridCard>
  )
}
```

#### Step 4: Create Grid Index

**Create `src/components/grid/index.ts`:**

```typescript
export { GridContainer } from './grid-container'
export { GridCard } from './grid-card'
export { GridCardSkeleton } from './grid-card-skeleton'
export type { GridCardProps } from '@/types/grid'
```

---

## Phase 2: Content Components (Week 2)

### Day 1-3: Navigation Card with React 19

#### Step 1: Create Enhanced Navigation

**Create `src/components/cards/navigation-card.tsx`:**

```typescript
'use cache'

import { GridCard } from '@/components/grid'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

export async function NavigationCard() {
  cacheLife('static')
  cacheTag('navigation', 'ui-critical')
  
  const navigation = await fetchNavigation()
  
  return (
    <GridCard 
      span="auto"
      content="navigation"
      priority="critical"
      preload
      className="sticky top-0 z-50 backdrop-blur-sm bg-background/80"
    >
      <nav className="p-4">
        <NavigationMenu className="w-full max-w-none">
          <NavigationMenuList className="flex items-center justify-between w-full">
            <NavigationMenuItem>
              <Logo />
            </NavigationMenuItem>
            
            <div className="flex items-center space-x-2 @[640px]:space-x-4">
              {navigation.items.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:text-[oklch(0.7_0.15_270)]">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-80 @[800px]:w-96">
                      {/* Dynamic menu content */}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              
              <NavigationMenuItem>
                <ThemeToggle />
              </NavigationMenuItem>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </GridCard>
  )
}

async function fetchNavigation() {
  'use cache'
  cacheTag('navigation-data')
  
  // Replace with actual navigation data fetching
  return {
    items: [
      { id: '1', label: 'Projects', href: '/projects' },
      { id: '2', label: 'Posts', href: '/posts' },
      { id: '3', label: 'About', href: '/about' }
    ]
  }
}
```

### Day 4-5: Post Cards with Optimistic Updates

#### Step 1: Create Enhanced Post Card

**Create `src/components/cards/post-card.tsx`:**

```typescript
'use cache'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { GridCard } from '@/components/grid'
import { cn } from '@/lib/utils'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import Image from 'next/image'
import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
  featured?: boolean
  hero?: boolean
  index: number
}

export function PostCard({ 
  post, 
  featured = false, 
  hero = false,
  index 
}: PostCardProps) {
  cacheTag(`post-${post.slug}`, 'posts')
  cacheLife('posts')
  
  const cardType = hero ? 'hero-post' : featured ? 'featured-post' : 'regular-post'
  const priority = hero ? 'critical' : featured ? 'high' : 'normal'
  
  return (
    <GridCard
      span="auto"
      content={cardType}
      priority={priority}
      prefetch={index < 3 ? 'immediate' : 'hover'}
      layoutId={`post-${post.slug}`}
      useContainerQueries
    >
      <Card className="h-full group overflow-hidden">
        <CardContent className="p-0">
          <div className="relative @container">
            <Image
              src={typeof post.featuredImage === 'string' ? post.featuredImage : post.featuredImage?.url || ''}
              alt={post.title}
              width={800}
              height={600}
              className={cn(
                'w-full object-cover transition-all duration-300',
                'h-32 @[320px]:h-40 @[480px]:h-48 @[640px]:h-56 @[800px]:h-64',
                'group-hover:scale-105 not-group-hover:scale-100'
              )}
              priority={priority === 'critical'}
            />
            
            <Badge 
              variant="secondary" 
              className={cn(
                'absolute top-2 left-2 backdrop-blur-sm',
                'bg-[oklch(0.95_0.05_270)]/80 border-[oklch(0.9_0.1_270)]/30'
              )}
            >
              {/* Category would come from post data */}
              Article
            </Badge>
          </div>
          
          <div className="p-4 @container">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className={cn(
                'line-clamp-2 transition-colors duration-200',
                'text-base @[320px]:text-lg @[480px]:text-xl @[640px]:text-2xl',
                'text-foreground/90 hover:text-[color-mix(in_oklch,_var(--foreground)_85%,_var(--primary)_15%)]'
              )}>
                {post.title}
              </CardTitle>
              
              <CardDescription className={cn(
                'line-clamp-3 transition-all duration-200',
                'text-sm @[320px]:text-base @[480px]:line-clamp-4'
              )}>
                {post.meta?.description || ''}
              </CardDescription>
            </CardHeader>
            
            <CardFooter className="p-0 pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6 @[480px]:h-8 @[480px]:w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      AL
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm @[480px]:text-base text-muted-foreground">
                    Author
                  </span>
                </div>
                
                <time className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </GridCard>
  )
}
```

### Day 6-7: Subscribe Card with useActionState

#### Step 1: Create Optimistic Subscribe Form

**Create `src/components/cards/subscribe-card.tsx`:**

```typescript
'use client'

import { useActionState, useOptimistic } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GridCard } from '@/components/grid'
import { Mail } from 'lucide-react'
import { createContactAction } from '@/actions/create-contact-action'
import type { ActionResponse } from '@/actions/create-contact-action'

export function SubscribeCard() {
  const [state, formAction] = useActionState(createContactAction, {
    success: false,
    message: '',
  })
  
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (current, optimisticValue: { message: string; success: boolean }) => ({
      ...current,
      ...optimisticValue
    })
  )

  const enhancedAction = async (formData: FormData) => {
    // Show optimistic state immediately
    addOptimistic({ 
      message: '✅ Subscribing! Check your email...', 
      success: true 
    })
    
    // Then call actual server action
    return formAction(formData)
  }

  return (
    <GridCard
      span="auto"
      content="subscribe-card"
      priority="high"
      useContainerQueries
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Subscribe to Updates
          </CardTitle>
          <CardDescription>
            Get notified about new posts and projects.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={enhancedAction} className="grid grid-cols-2 grid-rows-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <Button type="submit" className="col-span-2">
              Subscribe
            </Button>
            
            <input type="hidden" name="projectId" value="1" />
            
            {optimisticState.message && (
              <div className={`col-span-2 text-center text-sm mt-2 ${
                optimisticState.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {optimisticState.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </GridCard>
  )
}
```

---

## Phase 3: Page Integration (Week 3)

### Day 1-2: Homepage Implementation

#### Step 1: Update Homepage with Grid System

**Update `src/app/(frontend)/page.tsx`:**

```typescript
'use cache'

import { Suspense } from 'react'
import { GridContainer, GridCardSkeleton } from '@/components/grid'
import { NavigationCard } from '@/components/cards/navigation-card'
import { PostCard } from '@/components/cards/post-card'
import { SubscribeCard } from '@/components/cards/subscribe-card'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Metadata } from 'next/types'

export const experimental_ppr = true

async function getLatestPosts() {
  'use cache'
  cacheLife('posts')
  cacheTag('homepage-posts', 'featured-content')
  
  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: 'createdAt:desc',
  })
}

export default async function HomePage() {
  const posts = await getLatestPosts()

  return (
    <>
      <NavigationCard />
      
      <GridContainer>
        {/* Hero post */}
        {posts.docs[0] && (
          <Suspense fallback={<GridCardSkeleton span="auto" />}>
            <PostCard 
              post={posts.docs[0]} 
              hero 
              index={0}
            />
          </Suspense>
        )}
        
        {/* Featured posts */}
        {posts.docs.slice(1, 4).map((post, index) => (
          <Suspense key={post.slug} fallback={<GridCardSkeleton span="auto" />}>
            <PostCard 
              post={post} 
              featured 
              index={index + 1}
            />
          </Suspense>
        ))}
        
        {/* Subscribe card */}
        <Suspense fallback={<GridCardSkeleton span="auto" />}>
          <SubscribeCard />
        </Suspense>
        
        {/* Regular posts */}
        {posts.docs.slice(4).map((post, index) => (
          <Suspense key={post.slug} fallback={<GridCardSkeleton span="auto" />}>
            <PostCard 
              post={post} 
              index={index + 4}
            />
          </Suspense>
        ))}
      </GridContainer>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lyovson.com',
    description: 'Official website of Rafa and Jess Lyovsons',
  }
}
```

### Day 3-4: Enhanced Server Actions

#### Step 1: Create Enhanced Contact Action

**Create `src/actions/enhanced-contact-action.ts`:**

```typescript
'use server'

import { unstable_after as after } from 'next/server'
import { unstable_cacheLife as cacheLife } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'
import type { Contact } from '@/payload-types'

const contactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  projectId: z.coerce.number().positive(),
})

export type ActionResponse = {
  success: boolean
  message: string
  contact?: Contact
  errors?: Record<string, string>
}

export async function enhancedContactAction(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  'use cache'
  cacheLife('user-session')
  
  try {
    const payload = await getPayload({ config: configPromise })

    // Validate input
    const result = contactSchema.safeParse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      projectId: formData.get('projectId'),
    })

    if (!result.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] || '']),
        ),
      }
    }

    const { email, firstName, lastName, projectId } = result.data

    // Check existing contact
    const existingContact = await payload.find({
      collection: 'contacts',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existingContact.docs.length) {
      return { success: false, message: 'You are already subscribed!' }
    }

    // Create contact
    const contact = await payload.create({
      collection: 'contacts',
      data: {
        email,
        firstName,
        lastName,
        project: projectId,
        status: 'confirmed', // For demo purposes
        subscribedAt: new Date().toISOString(),
      },
    })

    const response: ActionResponse = {
      success: true,
      message: 'Successfully subscribed! Welcome to our community.',
      contact,
    }

    // Background tasks after response is sent
    if (response.success && contact) {
      after(async () => {
        try {
          // Analytics tracking
          await trackSubscription({
            contactId: contact.id,
            source: 'website',
            timestamp: new Date().toISOString(),
            projectId
          })
          
          // Team notification
          await notifyTeam(`New subscriber: ${email}`)
          
          console.log('✅ Background tasks completed for:', email)
        } catch (error) {
          console.error('❌ Background task error:', error)
        }
      })
    }
    
    return response
  } catch (error) {
    console.error('Error creating contact:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// Background helper functions
async function trackSubscription(data: any) {
  console.log('📊 Subscription tracked:', data)
  // Implement analytics tracking
}

async function notifyTeam(message: string) {
  console.log('🔔 Team notified:', message)
  // Implement team notification
}
```

### Day 5-7: Search Implementation with use() Hook

#### Step 1: Create Enhanced Search

**Create `src/components/cards/search-card.tsx`:**

```typescript
'use client'

import { useState, use, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GridCard, GridCardSkeleton } from '@/components/grid'
import { PostCard } from './post-card'
import { Search } from 'lucide-react'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

function SearchResults({ searchQuery }: { searchQuery: string }) {
  if (!searchQuery.trim()) {
    return <div className="text-center text-muted-foreground">Enter a search term</div>
  }
  
  // use() hook can be called conditionally!
  const results = use(searchPosts(searchQuery))
  
  return (
    <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-4">
      {results.docs.length === 0 ? (
        <div className="text-center text-muted-foreground col-span-full">
          No posts found for "{searchQuery}"
        </div>
      ) : (
        results.docs.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))
      )}
    </div>
  )
}

async function searchPosts(query: string) {
  'use cache'
  cacheTag(`search-${query.toLowerCase()}`, 'search-results')
  cacheLife('search')
  
  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'posts',
    where: {
      or: [
        { title: { contains: query } },
        { meta: { description: { contains: query } } }
      ]
    },
    limit: 20,
  })
}

export function SearchCard({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('search') as string
    setQuery(searchQuery)
  }

  return (
    <GridCard
      span="auto"
      content="search-widget"
      priority="normal"
      useContainerQueries
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Posts
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                id="search"
                name="search"
                defaultValue={query}
                placeholder="Search posts..."
                className="w-full"
              />
            </div>
          </form>
          
          <Suspense fallback={<GridCardSkeleton span="auto" />}>
            <SearchResults searchQuery={query} />
          </Suspense>
        </CardContent>
      </Card>
    </GridCard>
  )
}
```

---

## Phase 4: Performance & Polish (Week 4)

### Day 1-2: Performance Monitoring

#### Step 1: Create Performance Hooks

**Create `src/hooks/use-performance.ts`:**

```typescript
'use client'

import { useEffect, useState } from 'react'

export interface PerformanceMetrics {
  LCP: number
  FID: number
  CLS: number
  renderTime: number
  cacheHitRate: number
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    LCP: 0,
    FID: 0,
    CLS: 0,
    renderTime: 0,
    cacheHitRate: 0
  })

  useEffect(() => {
    let cacheHits = 0
    let cacheMisses = 0

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, LCP: entry.startTime }))
            break
          case 'first-input':
            setMetrics(prev => ({ ...prev, FID: (entry as any).processingStart - entry.startTime }))
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ ...prev, CLS: prev.CLS + (entry as any).value }))
            }
            break
        }
      })
    })

    // Observe Core Web Vitals
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

    // Monitor cache performance
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      
      if (response.headers.get('x-cache-status') === 'hit') {
        cacheHits++
      } else {
        cacheMisses++
      }
      
      const cacheHitRate = (cacheHits / (cacheHits + cacheMisses)) * 100
      setMetrics(prev => ({ ...prev, cacheHitRate }))
      
      return response
    }

    return () => {
      observer.disconnect()
      window.fetch = originalFetch
    }
  }, [])

  return metrics
}
```

#### Step 2: Add Performance Dashboard (Development)

**Create `src/components/dev/performance-dashboard.tsx`:**

```typescript
'use client'

import { usePerformanceMonitoring } from '@/hooks/use-performance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PerformanceDashboard() {
  const metrics = usePerformanceMonitoring()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-black/90 text-white border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-xs font-mono space-y-1">
          <div>LCP: {metrics.LCP.toFixed(0)}ms</div>
          <div>FID: {metrics.FID.toFixed(0)}ms</div>
          <div>CLS: {metrics.CLS.toFixed(3)}</div>
          <div>Cache Hit Rate: {metrics.cacheHitRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Day 3-4: Cache Optimization

#### Step 1: Create Cache Management

**Create `src/lib/cache-manager.ts`:**

```typescript
import { revalidateTag, revalidatePath } from 'next/cache'

export class CacheManager {
  static async invalidatePost(postSlug: string) {
    await Promise.all([
      revalidateTag(`post-${postSlug}`),
      revalidateTag('homepage-posts'),
      revalidateTag('featured-content'),
      revalidatePath('/'),
      revalidatePath(`/posts/${postSlug}`)
    ])
  }

  static async invalidateSearch(query?: string) {
    if (query) {
      await revalidateTag(`search-${query.toLowerCase()}`)
    } else {
      await revalidateTag('search-results')
    }
  }

  static async invalidateNavigation() {
    await Promise.all([
      revalidateTag('navigation'),
      revalidateTag('ui-critical'),
      revalidatePath('/')
    ])
  }

  static async invalidateAll() {
    await Promise.all([
      revalidateTag('homepage-posts'),
      revalidateTag('posts'),
      revalidateTag('navigation'),
      revalidateTag('search-results'),
      revalidatePath('/')
    ])
  }
}
```

### Day 5-7: Final Testing & Deployment

#### Step 1: Create Validation Script

**Create `scripts/validate-system.ts`:**

```typescript
import { execSync } from 'child_process'

async function validateSystem() {
  console.log('🔍 Validating lyovson.com system...\n')

  const checks = [
    {
      name: 'TypeScript Compilation',
      command: 'pnpm run type-check',
      description: 'Checking for TypeScript errors'
    },
    {
      name: 'Build Process',
      command: 'pnpm build',
      description: 'Testing production build'
    },
    {
      name: 'Lint Check',
      command: 'pnpm lint',
      description: 'Checking code quality'
    }
  ]

  for (const check of checks) {
    try {
      console.log(`⏳ ${check.description}...`)
      execSync(check.command, { stdio: 'pipe' })
      console.log(`✅ ${check.name} passed\n`)
    } catch (error) {
      console.log(`❌ ${check.name} failed`)
      console.error(error)
      process.exit(1)
    }
  }

  console.log('🎉 All validation checks passed!')
  console.log('\n📋 Manual verification checklist:')
  console.log('- [ ] Container queries working in browser')
  console.log('- [ ] @starting-style animations visible')
  console.log('- [ ] React 19 features functioning')
  console.log('- [ ] Cache hit rates > 80%')
  console.log('- [ ] Lighthouse score > 90')
}

validateSystem()
```

#### Step 2: Run Validation

```bash
# Run validation script
pnpm tsx scripts/validate-system.ts

# Manual testing
pnpm dev
# Visit http://localhost:3000
# Test all functionality
# Check browser dev tools for:
# - Container query usage
# - Cache headers
# - Performance metrics
```

#### Step 3: Production Deployment

```bash
# Final build
pnpm build

# Start production server locally (test)
pnpm start

# Deploy to Vercel
vercel --prod
```

---

## Success Validation Checklist

### ✅ Technical Validation

- [ ] React 19 canary features working (`'use cache'`, `useActionState`, `useOptimistic`)
- [ ] Next.js canary features enabled (PPR, DynamicIO, `unstable_after`)
- [ ] Tailwind CSS 4.x working (container queries, @starting-style, P3 colors)
- [ ] Grid system responsive across all breakpoints
- [ ] Server actions with optimistic updates
- [ ] Background task processing
- [ ] Cache invalidation working correctly

### ✅ Performance Validation  

- [ ] Build time < 15 seconds (down from ~45s)
- [ ] Dev server start < 1 second
- [ ] Hot reload < 100ms
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Cache hit rate > 85%

### ✅ User Experience Validation

- [ ] Smooth animations and interactions
- [ ] Instant form feedback with optimistic updates
- [ ] Fast navigation between pages
- [ ] Responsive design across all devices
- [ ] Accessible navigation and interactions
- [ ] Search functionality working

### ✅ Code Quality Validation

- [ ] Zero TypeScript errors
- [ ] Zero ESLint violations
- [ ] All components properly typed
- [ ] Comprehensive error boundaries
- [ ] Performance monitoring active

---

## Troubleshooting Common Issues

### React 19 Issues

```bash
# If React 19 features not working
pnpm list react react-dom
# Ensure versions are 19.x canary

# Clear cache
rm -rf .next
pnpm dev
```

### Tailwind 4.x Issues

```bash
# If container queries not working
# Check PostCSS config
cat postcss.config.js

# Verify Tailwind installation
pnpm list tailwindcss
# Should show 4.x version
```

### Cache Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear Payload cache (if applicable)
rm -rf .payload

# Restart dev server
pnpm dev
```

### Performance Issues

```bash
# Analyze bundle
pnpm run build:analyze

# Check for large dependencies
pnpm ls --depth=0

# Monitor performance
# Use browser dev tools Performance tab
```

This implementation guide provides a complete roadmap for building the lyovson.com system with all the modern technologies and patterns defined in the architecture and design documents.
