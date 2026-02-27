import type { ReactNode } from "react";

// Preserve existing GridSpan concept but enhance
export type GridSpan =
  | "1x1"
  | "2x1"
  | "1x2"
  | "2x2"
  | "3x1"
  | "1x3"
  | "3x2"
  | "2x3"
  | "3x3";

export type GridCardContent =
  | "navigation"
  | "post"
  | "subscribe"
  | "section"
  | "skeleton"
  | "custom";

export type CacheStrategy = "static" | "posts" | "grid-cards" | "user-session";

export type Priority = "critical" | "high" | "normal" | "low" | "defer";

// Enhanced GridCard props (backwards compatible)
export interface EnhancedGridCardProps {
  cacheStrategy?: CacheStrategy;
  children: ReactNode;
  className?: string;
  content?: GridCardContent;
  defer?: boolean;

  // NEW: Animation controls
  enableHover?: boolean;
  enableStartingStyle?: boolean;
  optimistic?: boolean;

  // NEW: Performance hints
  preload?: boolean;
  priority?: Priority;

  // NEW: Enhanced features
  span?: GridSpan;
}

// Enhanced GridCardSection props
export interface EnhancedGridCardSectionProps {
  children: ReactNode;
  className?: string;

  // NEW: Content-aware features
  contentType?: "text" | "image" | "form" | "action";

  // Preserve existing
  onClick?: () => void;
}

// Performance monitoring types
export interface GridPerformanceMetrics {
  cacheHitRate: number;
  containerQueryUpdates: number;
  optimisticUpdates: number;
  renderTime: number;
  totalCards: number;
  visibleCards: number;
}

// Form action types for React 19 useActionState
export interface ActionState {
  errors?: Record<string, string[]>;
  message: string;
  success: boolean;
}

// Enhanced subscription form data
export interface SubscribeFormData {
  email: string;
  firstName: string;
  lastName?: string;
  projectId?: number;
}

// Grid layout configuration
export interface GridConfig {
  breakpoints: {
    g1: number;
    g2: number;
    g3: number;
    g4: number;
    g5: number;
    g6: number;
  };
  cardSize: number;
  gap: number;
  internalCols: number;
  internalRows: number;
}
