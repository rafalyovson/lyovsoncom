# Lyovson.com Design System

## 🎨 Design Philosophy

**Core Principle**: Everything is a card on a uniform grid. Every component, every piece of content, every UI element exists as a grid card that can span 1x1, 2x1, 1x3, 3x2, or any nxm configuration.

This creates:
- **Visual Consistency**: Unified design language across all content
- **Predictable Layouts**: Systematic responsive design 
- **Content Flexibility**: Dynamic sizing based on content importance
- **Enhanced UX**: Smooth, predictable interactions

---

## Grid System Foundation

### Grid Specification
```typescript
// Base grid configuration
export const GridSystem = {
  // Responsive column counts
  columns: {
    mobile: 2,      // 320px+
    tablet: 6,      // 640px+
    desktop: 12,    // 1024px+
    wide: 16,       // 1440px+
    ultrawide: 20   // 1920px+
  },
  
  // Base measurements
  spacing: '0.25rem',     // 4px base unit
  gap: '1rem',            // 16px between cards
  minCardSize: '120px',   // Minimum card width
  
  // Breakpoints (container queries)
  breakpoints: {
    g2: '640px',   // 2-col to 6-col
    g3: '1024px',  // 6-col to 12-col  
    g4: '1440px',  // 12-col to 16-col
    g5: '1920px'   // 16-col to 20-col
  }
}
```

### Card Span Types
```typescript
export type GridSpan = 
  // Single row spans
  | '1x1' | '2x1' | '3x1' | '4x1' | '6x1' | '8x1' | '12x1'
  // Two row spans  
  | '1x2' | '2x2' | '3x2' | '4x2' | '6x2' | '8x2'
  // Three row spans
  | '1x3' | '2x3' | '3x3' | '4x3' | '6x3'
  // Auto-responsive
  | 'auto'
```

### Content Type Grid Mapping
```typescript
export const ContentGridMapping = {
  // Navigation spans full width
  navigation: {
    mobile: '2x1',    // Full width on mobile
    tablet: '6x1',    // Full width on tablet
    desktop: '12x1',  // Full width on desktop
    wide: '16x1',     // Full width on wide
    ultrawide: '20x1' // Full width on ultrawide
  },
  
  // Hero content takes prominence
  'hero-post': {
    mobile: '2x3',    // Full width, tall on mobile
    tablet: '6x4',    // Full width, taller on tablet
    desktop: '8x5',   // 2/3 width, tall on desktop
    wide: '10x6',     // Slightly larger
    ultrawide: '12x6' // Even larger for ultrawide
  },
  
  // Featured posts get good visibility
  'featured-post': {
    mobile: '2x2',    // Full width on mobile
    tablet: '3x2',    // Half width on tablet
    desktop: '4x3',   // 1/3 width on desktop
    wide: '5x3',      // Slightly larger
    ultrawide: '6x3'  // Even larger
  },
  
  // Regular posts are compact but readable
  'regular-post': {
    mobile: '1x1',    // Half width on mobile
    tablet: '2x1',    // 1/3 width on tablet
    desktop: '3x2',   // 1/4 width on desktop
    wide: '4x2',      // Slightly larger
    ultrawide: '4x2'  // Same size
  },
  
  // Subscribe card is prominent but not dominant
  'subscribe-card': {
    mobile: '2x2',    // Full width on mobile
    tablet: '3x2',    // Half width on tablet
    desktop: '4x2',   // 1/3 width on desktop
    wide: '5x2',      // Slightly larger
    ultrawide: '6x2'  // Even larger
  }
}
```

---

## Color System

### Wide Gamut P3 Color Palette
```css
/* Primary brand colors using P3 wide gamut */
:root {
  /* Base Colors */
  --color-primary: oklch(0.7 0.15 270);      /* Rich purple */
  --color-secondary: oklch(0.6 0.2 280);     /* Deep blue-purple */
  --color-accent: oklch(0.8 0.12 150);       /* Vibrant green */
  
  /* Neutral Colors */
  --color-background: oklch(0.99 0.002 106.42);  /* Near white */
  --color-foreground: oklch(0.09 0.005 285.8);   /* Near black */
  --color-muted: oklch(0.96 0.006 286.3);        /* Light gray */
  --color-muted-foreground: oklch(0.45 0.006 286.3); /* Dark gray */
  
  /* Grid System Colors */
  --color-grid-bg: oklch(0.99 0.002 106.42);     /* Grid background */
  --color-card-bg: oklch(0.98 0.004 106.42);     /* Card background */
  --color-card-border: oklch(0.94 0.012 106.42); /* Card borders */
  --color-card-hover: oklch(0.96 0.008 106.42);  /* Card hover state */
  
  /* Semantic Colors */
  --color-success: oklch(0.65 0.15 145);     /* Success green */
  --color-warning: oklch(0.75 0.15 65);      /* Warning yellow */
  --color-error: oklch(0.6 0.2 15);          /* Error red */
  --color-info: oklch(0.7 0.12 240);         /* Info blue */
}
```

### Dark Mode Variations
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Inverted base colors */
    --color-background: oklch(0.09 0.005 285.8);
    --color-foreground: oklch(0.98 0.004 106.42);
    --color-muted: oklch(0.15 0.006 286.3);
    --color-muted-foreground: oklch(0.65 0.006 286.3);
    
    /* Adjusted grid colors */
    --color-grid-bg: oklch(0.09 0.005 285.8);
    --color-card-bg: oklch(0.12 0.006 285.8);
    --color-card-border: oklch(0.18 0.012 285.8);
    --color-card-hover: oklch(0.15 0.008 285.8);
  }
}
```

### Color Usage Guidelines
```typescript
export const ColorUsage = {
  // Primary actions and CTAs
  primary: {
    usage: 'Subscribe buttons, main navigation links, primary CTAs',
    contrast: 'Ensure 4.5:1 contrast ratio minimum',
    hover: 'Lighten by 10% for hover states'
  },
  
  // Secondary actions
  secondary: {
    usage: 'Secondary buttons, less important links',
    contrast: 'Maintain readability with 3:1 minimum',
    hover: 'Subtle color shift or opacity change'
  },
  
  // Grid system colors
  grid: {
    background: 'Page background, never text',
    cardBackground: 'Card backgrounds, container fills',
    cardBorder: 'Subtle borders, dividers',
    cardHover: 'Hover states for interactive cards'
  }
}
```

---

## Typography System

### Type Scale with Container Queries
```css
/* Responsive typography using container queries */
.typography-scale {
  /* Base mobile typography */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Container query responsive scaling */
  @container (min-width: 480px) {
    --text-lg: 1.25rem;   /* Bump up on larger cards */
    --text-xl: 1.5rem;
    --text-2xl: 1.875rem;
    --text-3xl: 2.25rem;
    --text-4xl: 3rem;
  }
  
  @container (min-width: 640px) {
    --text-2xl: 2rem;     /* Even larger on desktop cards */
    --text-3xl: 2.5rem;
    --text-4xl: 3.5rem;
  }
}
```

### Typography Hierarchy
```typescript
export const TypographyHierarchy = {
  // Grid card headings
  cardTitle: {
    regular: 'text-lg @[320px]:text-xl @[480px]:text-2xl',
    featured: 'text-xl @[320px]:text-2xl @[480px]:text-3xl', 
    hero: 'text-2xl @[480px]:text-3xl @[640px]:text-4xl'
  },
  
  // Body text with container awareness
  cardBody: {
    compact: 'text-sm @[320px]:text-base',
    regular: 'text-base @[480px]:text-lg',
    expanded: 'text-lg @[640px]:text-xl'
  },
  
  // Metadata and secondary text
  cardMeta: {
    small: 'text-xs @[320px]:text-sm',
    regular: 'text-sm @[480px]:text-base'
  }
}
```

---

## Component Design Patterns

### Grid Card Base Pattern
```typescript
// Standard grid card structure
export const GridCardPattern = {
  structure: `
    <GridCard>
      <Card>
        <CardHeader>   // Title, meta information
        <CardContent>  // Main content area
        <CardFooter>   // Actions, secondary info
      </Card>
    </GridCard>
  `,
  
  // Consistent spacing within cards
  spacing: {
    padding: 'p-4 @[320px]:p-6',    // Responsive padding
    gap: 'space-y-3 @[480px]:space-y-4', // Responsive gaps
    margin: 'mb-2 @[320px]:mb-3'    // Responsive margins
  }
}
```

### Navigation Card Pattern
```typescript
export const NavigationCardPattern = {
  layout: 'horizontal-menu',
  responsiveBehavior: {
    mobile: 'hamburger-menu-with-drawer',
    tablet: 'horizontal-compact',
    desktop: 'horizontal-full'
  },
  
  visualStyle: {
    background: 'backdrop-blur-sm bg-background/80',
    border: 'border-b border-border/40',
    position: 'sticky top-0 z-50'
  }
}
```

### Post Card Pattern
```typescript
export const PostCardPattern = {
  imageAspectRatio: '16:9',
  contentHierarchy: [
    'featured-image',
    'category-badge', 
    'title',
    'excerpt',
    'author-meta',
    'publish-date'
  ],
  
  responsiveImage: {
    mobile: 'h-32',
    tablet: 'h-40 @[480px]:h-48',
    desktop: 'h-48 @[640px]:h-56 @[800px]:h-64'
  },
  
  interactionStates: {
    hover: 'scale-[1.02] shadow-lg transition-all duration-300',
    focus: 'ring-2 ring-primary ring-offset-2',
    active: 'scale-[0.98]'
  }
}
```

### Subscribe Card Pattern
```typescript
export const SubscribeCardPattern = {
  layout: 'form-grid-2x2',
  formStructure: [
    'first-name-input',   // Top left
    'last-name-input',    // Top right  
    'email-input',        // Bottom left
    'submit-button'       // Bottom right
  ],
  
  optimisticFeedback: {
    pending: 'opacity-80 bg-blue-50',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200'
  }
}
```

---

## Animation & Interaction Design

### Entry Animations with @starting-style
```css
/* Modern CSS entry animations */
@layer components {
  .grid-card {
    /* Starting state for new cards */
    @starting-style {
      opacity: 0;
      transform: scale(0.95) translateY(8px);
    }
    
    /* Animate to final state */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Hover & Focus States
```css
/* Interactive states with modern CSS */
.grid-card {
  /* Base state */
  transition: all 0.3s ease-out;
  
  /* Hover enhancement */
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px color-mix(in oklch, var(--primary) 15%, transparent);
  }
  
  /* Focus for accessibility */
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  /* Not-hover for stable states */
  &:not(:hover) {
    transform: scale(1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}
```

### Layout Animations with Motion
```typescript
// Layout animations for grid changes
export const LayoutAnimations = {
  gridReflow: {
    layout: true,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  
  cardEntry: {
    initial: { opacity: 0, scale: 0.95, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -8 },
    transition: { duration: 0.2 }
  },
  
  cardHover: {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }
}
```

---

## Responsive Design Strategy

### Container Query-First Approach
```css
/* Container queries replace media queries */
.grid-card {
  container-type: inline-size;
  
  /* Base mobile layout */
  .card-content {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  /* Larger card containers */
  @container (min-width: 320px) {
    .card-content {
      padding: 1.5rem;
      gap: 1rem;
    }
  }
  
  @container (min-width: 480px) {
    .card-content {
      padding: 2rem;
      gap: 1.5rem;
    }
  }
  
  @container (min-width: 640px) {
    .card-content {
      padding: 2.5rem;
      gap: 2rem;
    }
  }
}
```

### Adaptive Content Strategy
```typescript
export const AdaptiveContentStrategy = {
  // Content adapts to card size, not viewport
  textContent: {
    compact: 'line-clamp-2',
    regular: 'line-clamp-3 @[480px]:line-clamp-4',
    expanded: 'line-clamp-4 @[640px]:line-clamp-6'
  },
  
  imageContent: {
    compact: 'aspect-[4/3]',
    regular: 'aspect-[16/9]', 
    expanded: 'aspect-[21/9] @[800px]:aspect-[3/1]'
  },
  
  actionElements: {
    compact: 'hidden @[240px]:block',
    regular: 'block',
    expanded: 'flex @[480px]:flex-row @[640px]:justify-between'
  }
}
```

---

## Accessibility Design

### WCAG 2.1 AA Compliance
```typescript
export const AccessibilityStandards = {
  // Color contrast requirements
  colorContrast: {
    normalText: '4.5:1 minimum',
    largeText: '3:1 minimum',
    uiComponents: '3:1 minimum'
  },
  
  // Interactive element sizing
  touchTargets: {
    minimum: '44px x 44px',
    recommended: '48px x 48px',
    spacing: '8px minimum between targets'
  },
  
  // Focus management
  focusManagement: {
    visibleFocus: 'always visible, 2px minimum',
    logicalOrder: 'follows reading order',
    trapFocus: 'within modals and menus'
  }
}
```

### Semantic HTML Structure
```html
<!-- Semantic grid card structure -->
<article class="grid-card" role="article">
  <header class="card-header">
    <h2 class="card-title">Article Title</h2>
    <p class="card-meta">Published on <time datetime="2024-01-01">Jan 1, 2024</time></p>
  </header>
  
  <main class="card-content">
    <p class="card-excerpt">Article excerpt content...</p>
  </main>
  
  <footer class="card-footer">
    <nav class="card-actions" aria-label="Article actions">
      <a href="/posts/article-slug" aria-describedby="card-title">Read More</a>
    </nav>
  </footer>
</article>
```

---

## Design Tokens

### Spacing Scale
```typescript
export const SpacingTokens = {
  // Base 4px scale
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
}
```

### Border Radius Scale
```typescript
export const RadiusTokens = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
}
```

### Shadow Scale
```typescript
export const ShadowTokens = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000'
}
```

---

## Component Library Guidelines

### shadcn/ui Integration
```typescript
export const ComponentIntegration = {
  // Use shadcn/ui as base, extend with grid patterns
  baseComponents: [
    'Card', 'Button', 'Input', 'Badge', 'Avatar',
    'NavigationMenu', 'Select', 'Form', 'Skeleton'
  ],
  
  // Grid-specific enhancements
  gridEnhancements: {
    'Card': 'Add container query support and grid span classes',
    'Button': 'Add responsive sizing and grid-aware spacing',
    'Form': 'Add optimistic updates and grid layout patterns'
  },
  
  // Custom grid components
  customComponents: [
    'GridContainer', 'GridCard', 'GridCardSkeleton',
    'PostCard', 'NavigationCard', 'SubscribeCard'
  ]
}
```

---

## Performance Guidelines

### Design Performance Principles
```typescript
export const DesignPerformance = {
  // Minimize layout shifts
  layoutStability: {
    reserveSpace: 'Use aspect ratios and min-heights',
    skeletonLoading: 'Match final content dimensions',
    fontDisplay: 'Use font-display: swap with fallbacks'
  },
  
  // Optimize animations
  animationPerformance: {
    properties: 'Only animate transform and opacity',
    willChange: 'Use sparingly and remove after animation',
    reducedMotion: 'Respect prefers-reduced-motion'
  },
  
  // Image optimization
  imagePerformance: {
    formats: 'Use WebP/AVIF with fallbacks',
    sizing: 'Responsive images with srcset',
    lazyLoading: 'Load images below fold lazily'
  }
}
```

---

## Design System Validation

### Visual Consistency Checklist
- [ ] All content uses grid card structure
- [ ] Consistent spacing using 4px scale
- [ ] Typography scales appropriately with container queries
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Interactive states are consistent across components
- [ ] Animation timing is uniform across the system

### Performance Validation
- [ ] Layout shifts < 0.1 CLS
- [ ] Animations run at 60fps
- [ ] Color calculations use CSS color-mix when possible
- [ ] Container queries eliminate JavaScript for responsive behavior
- [ ] Font loading doesn't cause FOUT/FOIT

### Accessibility Validation
- [ ] Focus indicators are visible and consistent
- [ ] Interactive elements meet minimum size requirements
- [ ] Color is not the only means of conveying information
- [ ] Semantic HTML structure is maintained
- [ ] Screen reader navigation is logical

This design system creates a cohesive, accessible, and performant visual foundation for the lyovson.com rebuild while embracing modern CSS capabilities and grid-first thinking. 