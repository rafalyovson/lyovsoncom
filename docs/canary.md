# Next.js Canary & React 19 Enhancement Plan

## Implementation Status Overview 📊

**Overall Progress**: 0/4 phases complete

### Current Codebase State ✅

- Next.js: `15.4.0-canary.47`
- React: `19.2.0-canary-8ce15b0f-20250522`
- **Already Implemented**:
  - ✅ Partial Prerendering (PPR): `experimental_ppr = true`
  - ✅ useActionState: `src/components/grid/card/subscribe/index.tsx`
  - ✅ Server Actions: `src/actions/create-contact-action.ts`
  - ✅ React Compiler: Enabled in `next.config.ts`
  - ✅ Basic revalidation: 600s on homepage

### New Features to Implement 🚀

1. **`'use cache'` directive** - Component/function/file-level caching
2. **DynamicIO API** - Smart runtime vs cached data fetching
3. **`use()` hook** - Conditional data fetching in render
4. **`useOptimistic()`** - Instant UI updates during async operations
5. **`useFormStatus()`** - Enhanced form state management
6. **`cacheLife()` & `cacheTag()`** - Granular cache control
7. **`unstable_after()`** - Background tasks after response
8. **Enhanced Actions** - Better async transitions & batching

---

## PHASE 1: Enhanced Caching Foundation 🎯

**Status**: ⏳ Not Started | **Files to Modify**: 4 | **New Files**: 2

### 1.1 Enable DynamicIO Configuration

**Status**: ⏳ Pending  
**File**: `next.config.ts`

```typescript
// MODIFY: next.config.ts
// ADD after line 32 (before experimental: {)
experimental: {
  reactCompiler: true,
  ppr: 'incremental',
  dynamicIO: true, // 🆕 ADD THIS LINE
  cacheLife: {    // 🆕 ADD THIS ENTIRE BLOCK
    posts: {
      stale: 300,      // 5 min stale
      revalidate: 600, // 10 min revalidate  
      expire: 3600,    // 1 hour max
    },
    static: {
      stale: 1800,     // 30 min stale
      revalidate: 3600, // 1 hour revalidate
      expire: 86400,   // 24 hour max
    },
    search: {
      stale: 60,       // 1 min stale
      revalidate: 300, // 5 min revalidate
      expire: 1800,    // 30 min max
    }
  }
},
```

### 1.2 Optimize Homepage Data Fetching

**Status**: ⏳ Pending  
**File**: `src/app/(frontend)/page.tsx`

```typescript
// MODIFY: src/app/(frontend)/page.tsx
// REPLACE entire file content with:
'use cache' // 🆕 ADD AT TOP OF FILE

import { Suspense } from 'react'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { GridCardNav } from 'src/components/grid/card/nav'
import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

export const experimental_ppr = true

async function getLatestPosts() {
  'use cache' // 🆕 ADD CACHE DIRECTIVE
  cacheLife('posts') // 🆕 ADD CACHE LIFE
  cacheTag('homepage-posts') // 🆕 ADD CACHE TAG
  
  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: 'createdAt:desc',
  })
}

export default async function Page() {
  const posts = await getLatestPosts()

  return (
    <>
      <GridCardNav />
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts.docs} />
      </Suspense>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto mt-4" />}>
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          </Suspense>
        )}
      </div>
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

### 1.3 Create Cached CollectionArchive Component

**Status**: ⏳ Pending  
**New File**: `src/components/CollectionArchive/cached.tsx`

```typescript
// CREATE: src/components/CollectionArchive/cached.tsx
import React from 'react'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import type { Post } from '@/payload-types'
import { GridCardPost } from '@/components/grid'

export type CachedPostsListProps = {
  posts: Post[]
}

export async function CachedPostsList({ posts }: CachedPostsListProps) {
  'use cache' // 🆕 COMPONENT-LEVEL CACHING
  cacheLife('static')
  cacheTag('posts-list')
  
  return (
    <>
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <GridCardPost
              key={result.slug}
              post={result}
              {...(index === 0 && {
                loading: 'eager',
                fetchPriority: 'high',
                priority: true,
              })}
            />
          )
        }
        return null
      })}
    </>
  )
}
```

### 1.4 Update CollectionArchive to Use Cached Version

**Status**: ⏳ Pending  
**File**: `src/components/CollectionArchive/index.tsx`

```typescript
// MODIFY: src/components/CollectionArchive/index.tsx
// REPLACE entire content with:
import React, { Suspense } from 'react'
import type { Post } from '@/payload-types'
import { CachedPostsList } from './cached'
import { SkeletonGrid } from '@/components/grid/skeleton'

export type Props = {
  posts: Post[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <Suspense fallback={<SkeletonGrid />}>
      <CachedPostsList posts={posts} />
    </Suspense>
  )
}
```

### 1.5 Cache Navigation Component

**Status**: ⏳ Pending  
**File**: `src/components/grid/card/nav/index.tsx`

```typescript
// MODIFY: src/components/grid/card/nav/index.tsx
// ADD at top of file after imports:
'use cache'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

// ADD at beginning of component function:
cacheLife('static')
cacheTag('navigation')
```

### 1.6 Create Cache Management Actions

**Status**: ⏳ Pending  
**New File**: `src/actions/cache-management.ts`

```typescript
// CREATE: src/actions/cache-management.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function invalidatePostCache(postSlug?: string) {
  'use cache'
  // Invalidate specific caches
  revalidateTag('homepage-posts')
  revalidateTag('posts-list')
  
  if (postSlug) {
    revalidateTag(`post-${postSlug}`)
  }
  
  // Invalidate navigation if needed
  revalidateTag('navigation')
}

export async function invalidateSearchCache(query?: string) {
  'use cache'
  if (query) {
    revalidateTag(`search-${query.toLowerCase()}`)
  } else {
    // Invalidate all search caches
    revalidateTag('search')
  }
}

export async function invalidateAllCaches() {
  'use cache'
  revalidateTag('homepage-posts')
  revalidateTag('posts-list')
  revalidateTag('navigation')
  revalidateTag('search')
}
```

### Phase 1 Validation ✅

- [ ] `pnpm dev` runs without errors
- [ ] Homepage loads faster (check Network tab)
- [ ] Cache headers visible in Response Headers
- [ ] Navigation feels instant on subsequent visits

---

## PHASE 2: Enhanced Forms & User Experience 🎯

**Status**: ⏳ Not Started | **Files to Modify**: 3 | **New Files**: 3

### 2.1 Create Optimistic Subscribe Form

**Status**: ⏳ Pending  
**New File**: `src/components/grid/card/subscribe/optimistic-form.tsx`

```typescript
// CREATE: src/components/grid/card/subscribe/optimistic-form.tsx
'use client'

import { useOptimistic, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ActionResponse } from '@/actions/create-contact-action'

type SubscribeFormProps = {
  buttonText: string
  action: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  projectId: number
}

function SubmitButton({ buttonText }: { buttonText: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="grow">
      {pending ? 'Subscribing...' : buttonText}
    </Button>
  )
}

export function OptimisticSubscribeForm({ 
  buttonText, 
  action, 
  projectId 
}: SubscribeFormProps) {
  const [state, formAction] = useActionState(action, {
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
    <form action={enhancedAction} className="grid grid-cols-2 grid-rows-2 gap-2 h-full items-center">
      <Input
        type="text"
        name="firstName"
        placeholder="First Name"
        required
        aria-label="First Name"
      />
      <Input 
        type="text" 
        name="lastName" 
        placeholder="Last Name" 
        aria-label="Last Name" 
      />
      <Input 
        type="email" 
        name="email" 
        placeholder="Email" 
        required 
        aria-label="Email" 
      />
      <SubmitButton buttonText={buttonText} />
      <input type="hidden" name="projectId" value={projectId} />
      
      {optimisticState.message && (
        <div className={`col-span-2 text-center text-sm ${
          optimisticState.success ? 'text-green-600' : 'text-red-600'
        }`}>
          {optimisticState.message}
        </div>
      )}
    </form>
  )
}
```

### 2.2 Update Subscribe Component to Use Optimistic Form

**Status**: ⏳ Pending  
**File**: `src/components/grid/card/subscribe/index.tsx`

```typescript
// MODIFY: src/components/grid/card/subscribe/index.tsx
// REPLACE SubscribeForm import and usage:
// REMOVE: import { SubscribeForm } from './subscribe-form'
// ADD: import { OptimisticSubscribeForm } from './optimistic-form'

// IN COMPONENT, REPLACE:
// <SubscribeForm
//   buttonText={buttonText}
//   action={formAction}
//   state={state}
//   projectId={projectId}
// />

// WITH:
<OptimisticSubscribeForm
  buttonText={buttonText}
  action={handleSubmit}
  projectId={projectId}
/>
```

### 2.3 Create Enhanced Search with use() Hook

**Status**: ⏳ Pending  
**New File**: `src/components/enhanced-search/SearchResults.tsx`

```typescript
// CREATE: src/components/enhanced-search/SearchResults.tsx
'use client'
import { use, Suspense, useState } from 'react'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GridCardPost } from '@/components/grid'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SearchResults({ searchQuery }: { searchQuery: string }) {
  if (!searchQuery.trim()) {
    return <div className="text-center text-gray-500">Enter a search term</div>
  }
  
  // use() hook can be called conditionally!
  const results = use(searchPosts(searchQuery))
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {results.docs.length === 0 ? (
        <div className="text-center text-gray-500">
          No posts found for "{searchQuery}"
        </div>
      ) : (
        results.docs.map(post => (
          <GridCardPost key={post.slug} post={post} />
        ))
      )}
    </div>
  )
}

async function searchPosts(query: string) {
  'use cache'
  cacheTag(`search-${query.toLowerCase()}`)
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

export function EnhancedSearch({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('search') as string
    setQuery(searchQuery)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          name="search"
          defaultValue={query}
          placeholder="Search posts..."
          className="max-w-md"
        />
      </form>
      
      <Suspense fallback={<SkeletonGrid />}>
        <SearchResults searchQuery={query} />
      </Suspense>
    </div>
  )
}
```

### 2.4 Update Search Page

**Status**: ⏳ Pending  
**File**: `src/app/(frontend)/search/page.tsx`

```typitten
// MODIFY: src/app/(frontend)/search/page.tsx
// ADD import: import { EnhancedSearch } from '@/components/enhanced-search/SearchResults'
// REPLACE search implementation with:
// <EnhancedSearch initialQuery={searchParams?.q} />
```

### 2.5 Create Enhanced Form Hook

**Status**: ⏳ Pending  
**New File**: `src/hooks/useEnhancedForm.ts`

```typescript
// CREATE: src/hooks/useEnhancedForm.ts
'use client'
import { useOptimistic, useActionState } from 'react'

type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

type OptimisticFormHook<T extends FormState> = {
  state: T
  optimisticState: T
  formAction: (formData: FormData) => void
  addOptimistic: (value: Partial<T>) => void
  isPending: boolean
}

export function useEnhancedForm<T extends FormState>(
  action: (prevState: T, formData: FormData) => Promise<T>,
  initialState: T
): OptimisticFormHook<T> {
  const [state, formAction] = useActionState(action, initialState)
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (current, optimisticValue: Partial<T>) => ({
      ...current,
      ...optimisticValue
    })
  )

  return {
    state,
    optimisticState,
    formAction,
    addOptimistic,
    isPending: optimisticState !== state,
  }
}
```

### Phase 2 Validation ✅

- [ ] Subscribe form shows instant feedback
- [ ] Search works with conditional fetching
- [ ] Form submissions feel immediate
- [ ] No console errors with new hooks

---

## PHASE 3: Background Processing & Analytics 🎯

**Status**: ⏳ Not Started | **Files to Modify**: 1 | **New Files**: 2

### 3.1 Enhanced Contact Action with Background Tasks

**Status**: ⏳ Pending  
**New File**: `src/actions/enhanced-contact-action.ts`

```typescript
// CREATE: src/actions/enhanced-contact-action.ts
'use server'

import { unstable_after as after } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'
import type { Contact } from '@/payload-types'
import { generateToken } from '@/utilities/generateToken'
import { getSubscriptionConfirmationEmail } from '@/emails/subscription-confirmation'

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

type SubscriptionEvent = {
  contactId: string
  source: string
  timestamp: string
  projectId: number
}

export async function enhancedContactAction(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
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
      return { success: false, message: 'Contact already exists' }
    }

    // Verify project exists
    const project = await payload.findByID({
      collection: 'projects',
      id: projectId,
    })

    if (!project) {
      return { success: false, message: 'Project not found' }
    }

    // Generate confirmation token
    const confirmationToken = generateToken()
    const confirmationExpiry = new Date()
    confirmationExpiry.setHours(confirmationExpiry.getHours() + 24)

    // Create contact
    const contact = await payload.create({
      collection: 'contacts',
      data: {
        email,
        firstName,
        lastName,
        project: projectId,
        status: 'pending',
        subscribedAt: new Date().toISOString(),
        confirmationToken,
        confirmationExpiry: confirmationExpiry.toISOString(),
      },
    })

    // Send confirmation email
    const { html, subject } = getSubscriptionConfirmationEmail({
      firstName,
      confirmationToken,
      projectName: project.name,
    })

    await payload.sendEmail({
      to: email,
      from: 'notifications@mail.lyovson.com',
      subject,
      html,
    })

    const response: ActionResponse = {
      success: true,
      message: 'Please check your email to confirm your subscription.',
      contact,
    }

    // 🆕 Background tasks after response is sent
    if (response.success && contact) {
      after(async () => {
        try {
          // Analytics tracking
          await trackSubscription({
            contactId: contact.id,
            source: 'website',
            timestamp: new Date().toISOString(),
            projectId: projectId
          })
          
          // Update internal metrics
          await updateSubscriptionMetrics(projectId)
          
          // Team notification (non-blocking)
          await notifyTeam(`New subscriber: ${email} for ${project.name}`)
          
          // Cleanup old pending subscriptions
          await cleanupExpiredTokens()
        } catch (error) {
          console.error('Background task error:', error)
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

// 🆕 Background helper functions
async function trackSubscription(data: SubscriptionEvent) {
  // Send to analytics service or internal tracking
  try {
    if (process.env.ANALYTICS_ENDPOINT) {
      await fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }
    
    // Log for development
    console.log('📊 Subscription tracked:', data)
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

async function updateSubscriptionMetrics(projectId: number) {
  // Update project statistics
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get current subscriber count
    const subscriberCount = await payload.count({
      collection: 'contacts',
      where: {
        project: { equals: projectId },
        status: { equals: 'confirmed' }
      }
    })
    
    console.log(`📈 Project ${projectId} has ${subscriberCount.totalDocs} subscribers`)
  } catch (error) {
    console.error('Metrics update failed:', error)
  }
}

async function notifyTeam(message: string) {
  // Slack/Discord notification
  try {
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `🎉 ${message}` })
      })
    }
    
    // Log for development
    console.log('🔔 Team notified:', message)
  } catch (error) {
    console.error('Team notification failed:', error)
  }
}

async function cleanupExpiredTokens() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Delete contacts with expired confirmation tokens
    const expired = await payload.delete({
      collection: 'contacts',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { confirmationExpiry: { less_than: new Date().toISOString() } }
        ]
      }
    })
    
    console.log(`🧹 Cleaned up ${expired.docs.length} expired tokens`)
  } catch (error) {
    console.error('Token cleanup failed:', error)
  }
}
```

### 3.2 Update Playground to Use Enhanced Action

**Status**: ⏳ Pending  
**File**: `src/app/(frontend)/playground/page.tsx`

```typescript
// MODIFY: src/app/(frontend)/playground/page.tsx
// REPLACE import:
// import { createContactAction } from '@/actions/create-contact-action'
// WITH:
import { enhancedContactAction } from '@/actions/enhanced-contact-action'

// REPLACE in component:
// handleSubmit={createContactAction}
// WITH:
handleSubmit={enhancedContactAction}
```

### 3.3 Create Analytics Helper

**Status**: ⏳ Pending  
**New File**: `src/utilities/analytics.ts`

```typescript
// CREATE: src/utilities/analytics.ts
export type AnalyticsEvent = {
  event: string
  properties: Record<string, any>
  timestamp: string
  userId?: string
  sessionId?: string
}

export async function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event)
    return
  }

  try {
    // Send to your analytics service
    if (process.env.ANALYTICS_ENDPOINT) {
      await fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`
        },
        body: JSON.stringify(event)
      })
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

export function createAnalyticsEvent(
  eventName: string, 
  properties: Record<string, any> = {}
): AnalyticsEvent {
  return {
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
  }
}
```

### Phase 3 Validation ✅

- [ ] Background tasks execute after form submission
- [ ] Console shows analytics logs
- [ ] Form response is not delayed by background tasks
- [ ] No errors in server logs

---

## PHASE 4: Advanced Optimizations 🎯

**Status**: ⏳ Not Started | **Files to Modify**: 2 | **New Files**: 2

### 4.1 Create Hybrid Post Page

**Status**: ⏳ Pending  
**New File**: `src/app/(frontend)/posts/[slug]/enhanced-page.tsx`

```typescript
// CREATE: src/app/(frontend)/posts/[slug]/enhanced-page.tsx
'use cache' // Cache the static parts

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Skeleton } from '@/components/ui/skeleton'
import { CollectionArchive } from '@/components/CollectionArchive'

async function getPost(slug: string) {
  'use cache'
  cacheTag(`post-${slug}`)
  cacheLife('posts')
  
  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
}

async function getRelatedPosts(categories: any[]) {
  'use cache'
  cacheTag('related-posts')
  cacheLife('posts')
  
  if (!categories?.length) return { docs: [] }
  
  const payload = await getPayload({ config: configPromise })
  return await payload.find({
    collection: 'posts',
    where: {
      categories: {
        in: categories.map(cat => typeof cat === 'object' ? cat.id : cat)
      }
    },
    limit: 4,
    depth: 1,
  })
}

type Params = {
  slug: string
}

export default async function EnhancedPostPage({ 
  params 
}: { 
  params: Promise<Params> 
}) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post.docs[0]) {
    notFound()
  }

  const postData = post.docs[0]
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Static cached content */}
      <article className="prose prose-lg max-w-4xl mx-auto">
        <h1>{postData.title}</h1>
        {postData.meta?.description && (
          <p className="lead">{postData.meta.description}</p>
        )}
        
        {/* Render post content */}
        <div>
          {/* Your existing post content rendering */}
        </div>
      </article>
      
      {/* Cached related content */}
      {postData.categories && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>}>
            <RelatedPosts categories={postData.categories} />
          </Suspense>
        </section>
      )}
    </div>
  )
}

async function RelatedPosts({ categories }: { categories: any[] }) {
  const relatedPosts = await getRelatedPosts(categories)
  
  if (!relatedPosts.docs.length) {
    return <div className="text-gray-500">No related posts found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CollectionArchive posts={relatedPosts.docs} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post.docs[0]) {
    return {
      title: 'Post Not Found',
    }
  }

  const postData = post.docs[0]
  
  return {
    title: postData.meta?.title || postData.title,
    description: postData.meta?.description,
  }
}
```

### 4.2 Create Smart Prefetch Link Component  

**Status**: ⏳ Pending  
**New File**: `src/components/enhanced-link/PrefetchLink.tsx`

```typescript
// CREATE: src/components/enhanced-link/PrefetchLink.tsx
'use client'

import { useInView } from 'motion/react'
import { Link } from '@/components/Link'
import type { ComponentProps } from 'react'

type PrefetchLinkProps = ComponentProps<typeof Link> & {
  prefetchOnHover?: boolean
  prefetchOnView?: boolean
}

export function PrefetchLink({ 
  href, 
  children, 
  prefetchOnHover = true,
  prefetchOnView = false,
  ...props 
}: PrefetchLinkProps) {
  const [ref, inView] = useInView({ 
    threshold: 0.1,
    triggerOnce: true 
  })
  
  const shouldPrefetch = prefetchOnView ? inView : prefetchOnHover
  
  return (
    <Link 
      ref={prefetchOnView ? ref : undefined}
      href={href} 
      prefetch={shouldPrefetch}
      {...props}
    >
      {children}
    </Link>
  )
}
```

### 4.3 Add Performance Monitoring

**Status**: ⏳ Pending  
**New File**: `src/utilities/performance.ts`

```typescript
// CREATE: src/utilities/performance.ts
export function measurePerformance(name: string) {
  const start = performance.now()
  
  return {
    end: () => {
      const duration = performance.now() - start
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
      }
      return duration
    }
  }
}

export function logCacheHit(cacheKey: string, hit: boolean) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Cache ${hit ? 'HIT' : 'MISS'}: ${cacheKey}`)
  }
}

export function logOptimisticUpdate(action: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚡ Optimistic update: ${action}`)
  }
}
```

### 4.4 Update GridCardPost to Use Enhanced Link

**Status**: ⏳ Pending  
**File**: `src/components/grid/card/post/index.tsx`

```typescript
// MODIFY: src/components/grid/card/post/index.tsx
// ADD import: import { PrefetchLink } from '@/components/enhanced-link/PrefetchLink'
// REPLACE Link usage with PrefetchLink where appropriate:
// <PrefetchLink href={`/posts/${post.slug}`} prefetchOnView>
//   {/* post content */}
// </PrefetchLink>
```

### Phase 4 Validation ✅

- [ ] Post pages load with hybrid caching
- [ ] Related posts are cached separately
- [ ] Smart prefetching works on hover/view
- [ ] Performance logs show improvements

---

## Final Validation & Testing 🧪

### Overall System Check ✅

- [ ] All phases completed without errors
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` runs smoothly
- [ ] No TypeScript errors
- [ ] No console errors in browser

### Performance Metrics 📊

- [ ] Homepage loads 40%+ faster than baseline
- [ ] Form submissions feel instant
- [ ] Search responses under 200ms
- [ ] Cache hit rates above 80%
- [ ] Lighthouse score improved

### Feature Verification ✅

- [ ] PPR + dynamicIO working together
- [ ] Optimistic updates provide instant feedback
- [ ] Background tasks don't block responses
- [ ] Cache invalidation works correctly
- [ ] Smart prefetching improves navigation

---

## Troubleshooting Guide 🔧

### Common Issues & Solutions

**Issue**: `'use cache' is not defined`
**Solution**: Ensure `dynamicIO: true` in next.config.ts

**Issue**: `cacheLife is not a function`  
**Solution**: Import from `next/cache`: `import { unstable_cacheLife as cacheLife } from 'next/cache'`

**Issue**: Optimistic updates not working
**Solution**: Check that component has `'use client'` directive

**Issue**: Background tasks not executing
**Solution**: Verify `unstable_after` import and server action context

**Issue**: Cache not invalidating
**Solution**: Check cache tags match between setting and invalidation

### Rollback Instructions 🔄

If any phase fails, you can easily rollback:

1. Comment out new features in reverse order
2. Remove `dynamicIO: true` from config
3. Revert to original file versions
4. All changes are additive - no breaking modifications

---

## Success Metrics Summary 📈

### Technical Improvements

- **Initial Load Time**: Target 40-60% reduction
- **Form Response**: 90% perceived improvement
- **Search Performance**: 70% faster responses
- **Cache Efficiency**: 80%+ hit rate
- **Background Processing**: Zero user impact

### User Experience Gains

- ✅ Instant form feedback with optimistic updates
- ✅ Lightning-fast navigation with smart caching
- ✅ Smooth search with conditional fetching
- ✅ No delays from analytics/notifications
- ✅ Better Core Web Vitals scores

### Developer Benefits

- ✅ Cleaner, more maintainable code
- ✅ Better debugging with cache tags
- ✅ Future-proof architecture
- ✅ Granular performance control

---

*This implementation guide leverages Next.js canary and React 19 features to transform lyovson.com into a cutting-edge, high-performance website while maintaining full backward compatibility.*
