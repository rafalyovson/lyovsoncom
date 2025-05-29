import type { ReactNode } from 'react'

// Preserve existing GridSpan concept but enhance
export type GridSpan = '1x1' | '2x1' | '1x2' | '2x2' | '3x1' | '1x3' | '3x2' | '2x3' | '3x3'

export type GridCardContent =
  | 'navigation'
  | 'post'
  | 'subscribe'
  | 'section'
  | 'skeleton'
  | 'custom'

export type CacheStrategy = 'static' | 'posts' | 'grid-cards' | 'user-session'

export type Priority = 'critical' | 'high' | 'normal' | 'low' | 'defer'

// Enhanced GridCard props (backwards compatible)
export interface EnhancedGridCardProps {
  children: ReactNode
  className?: string

  // NEW: Enhanced features
  span?: GridSpan
  content?: GridCardContent
  priority?: Priority
  cacheStrategy?: CacheStrategy
  optimistic?: boolean

  // NEW: Animation controls
  enableHover?: boolean
  enableStartingStyle?: boolean

  // NEW: Performance hints
  preload?: boolean
  defer?: boolean
}

// Enhanced GridCardSection props
export interface EnhancedGridCardSectionProps {
  children: ReactNode
  className?: string

  // NEW: Content-aware features
  contentType?: 'text' | 'image' | 'form' | 'action'

  // Preserve existing
  onClick?: () => void
}

// Performance monitoring types
export interface GridPerformanceMetrics {
  renderTime: number
  cacheHitRate: number
  optimisticUpdates: number
  containerQueryUpdates: number
  totalCards: number
  visibleCards: number
}

// Form action types for React 19 useActionState
export interface ActionState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// Enhanced subscription form data
export interface SubscribeFormData {
  email: string
  firstName: string
  lastName?: string
  projectId?: number
}

// Grid layout configuration
export interface GridConfig {
  cardSize: number
  gap: number
  internalCols: number
  internalRows: number
  breakpoints: {
    g1: number
    g2: number
    g3: number
    g4: number
    g5: number
    g6: number
  }
}
