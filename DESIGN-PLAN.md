# Master Plan: Uniform Card-Grid, Edgy Personal Aesthetic, Full Card-System Optimization

## Summary
This is the single consolidated plan for your redesign. It preserves the **uniform grid + uniform card system everywhere** as the site’s core gimmick, increases personality/flair with an **edgy editorial glass** direction, and applies the system to **all card types**, **all frontend routes**, and **all Lexical-rendered longform text**.

## Locked Decisions
1. Grid/card geometry is non-negotiable and remains the structural foundation across all frontend pages.
2. Visual direction is **High Edge with Guardrails**: bold contrast, expressive styling, strong identity, but readable for longform.
3. Motion is expressive but controlled and performance-safe.
4. Utility/document pages are brought into the same card-grid system, not left as standalone styles.
5. Lexical output and content blocks are first-class citizens of the new design system.
6. Delivery is implementation-ready in staged execution (foundation first, then full adoption).

## In-Scope Surfaces
1. Frontend routes in `src/app/(frontend)/**`.
2. Grid and card primitives in `src/components/grid/**`.
3. All card families in `src/components/grid/card/**`.
4. Archive and pagination adapters: `src/components/CollectionArchive/index.tsx`, `src/components/NotesArchive/index.tsx`, `src/components/ActivitiesArchive/index.tsx`, `src/components/Pagination/index.tsx`.
5. Lexical rendering and content styling: `src/components/RichText/index.tsx`, `src/components/RichText/serialize.tsx`.
6. Block components that render inside longform content: `src/blocks/Banner/Component.tsx`, `src/blocks/Quote/Component.tsx`, `src/blocks/MediaBlock/Component.tsx`, `src/blocks/YouTube/Component.tsx`, `src/blocks/YouTube/YouTubePlayer.tsx`, `src/blocks/XPost/Component.tsx`, `src/blocks/GIF/Component.tsx`, `src/blocks/Code/Component.client.tsx`.

## Out of Scope
1. Shadcn internals in `src/components/ui/**` (usage updates allowed, internal redesign not required).
2. Payload admin route group `(payload)` except indirect styling integration needs.

## Public API / Interface Changes
1. `GridCardSection` in `src/components/grid/card/section/index.tsx` will move to explicit interaction modes and eliminate ambiguous wrapper-button behavior.
2. `GridCardNavItem` in `src/components/grid/card/nav/grid-card-nav-item.tsx` will move to explicit variants (`link`, `button`, `static`) to prevent nested interactive conflicts.
3. No Payload schema changes.
4. No URL scheme changes, but incorrect card links/navigation behavior will be corrected.

## Master Execution Plan

## Phase 1: Design Token and CSS Foundation
1. Reorganize `src/app/(frontend)/globals.css` into token layers, component layers, utilities, and accessibility/media overrides.
2. Keep fixed card sizing as tokens and make all geometry consume tokens rather than repeated literals.
3. Introduce compatibility aliases for currently referenced legacy glass vars so migration is non-breaking.
4. Standardize card surface tiers: base, interactive, hero/premium.
5. Increase flare with stronger accent contrast and richer highlights while tightening text contrast and readability.
6. Reduce effect cost by default and reserve heaviest blur/glow for premium/hero states only.
7. Normalize and deduplicate `glass-*` utility behavior.

## Phase 2: Grid/Card Primitive Hardening
1. Refactor `src/components/grid/index.tsx` to consume shared geometry tokens consistently.
2. Refactor `src/components/grid/card/index.tsx` so base card behavior is token-driven and responsive-safe.
3. Refactor `GridCardSection` semantics for clean keyboard/focus behavior with no accidental role misuse.
4. Refactor `GridCardNavItem` composition so links/buttons are structurally valid and consistent.

## Phase 3: Optimize Every Card Type
1. Optimize nav cards in `src/components/grid/card/nav/*`.
2. Optimize hero cards in `src/components/grid/card/hero/index.tsx`.
3. Optimize content cards in `src/components/grid/card/post/grid-card-post-full.tsx`, `src/components/grid/card/note/grid-card-note-full.tsx`, `src/components/grid/card/activity/grid-card-activity-full.tsx`, `src/components/grid/card/activity/grid-card-activity-review.tsx`.
4. Optimize relational cards in `src/components/grid/card/references/grid-card-references.tsx`, `src/components/grid/card/related/index.tsx`, `src/components/grid/card/related/grid-card-related-notes.tsx`.
5. Optimize identity cards in `src/components/grid/card/user/index.tsx`, `src/components/grid/card/user-social/index.tsx`, `src/components/grid/card/project/index.tsx`.
6. Optimize utility cards in `src/components/grid/card/subscribe/*`, `src/components/grid/card/not-found/index.tsx`, `src/components/grid/card/admin/index.tsx`.
7. Optimize loading cards in `src/components/grid/skeleton/*`.
8. Remove duplicate/dead card implementation paths (for example legacy duplicate hero file) so one source of truth remains.

## Phase 4: Page-Wide Uniformity
1. Bring all frontend pages into the same card-grid language, including `src/app/(frontend)/ai-docs/page.tsx`, `src/app/(frontend)/privacy-policy/page.tsx`, and `src/app/(frontend)/offline/page.tsx`.
2. Preserve feed/detail structure on home/posts/notes/activities/projects/topics/search while enforcing consistent card hierarchy and spacing.
3. Ensure pagination cards visually and behaviorally match primary cards.

## Phase 5: Lexical and Longform Styling Integration
1. Establish a dedicated longform typography wrapper driven by design tokens in `src/components/RichText/index.tsx`.
2. Re-style Lexical node rendering in `src/components/RichText/serialize.tsx` so headings/body/lists/quotes/links/inline code all fit the new system.
3. Align all rendered blocks to the same surface, spacing, and typography conventions.
4. Ensure legal/global text pages and article bodies share one longform system, not separate ad hoc prose styles.

## Phase 6: UX and Correctness Fixes Included
1. Fix hero post destination in `src/components/grid/card/hero/index.tsx`.
2. Fix project card destination in `src/components/grid/card/project/index.tsx`.
3. Replace client misuse of `redirect()` with router navigation in `src/components/grid/card/nav/menu-mode.tsx`.
4. Resolve nested interactive markup in cards where anchors are wrapped by interactive wrappers.
5. Remove invalid role usage patterns where present.

## Test Cases and Scenarios
1. Route validation: `/`, `/page/[pageNumber]`, `/posts`, `/posts/[slug]`, `/notes`, `/notes/[slug]`, `/activities`, `/activities/[date]/[slug]`, `/projects`, `/projects/[project]`, `/topics/[slug]`, `/search?q=test`, `/ai-docs`, `/privacy-policy`, `/offline`, `/subscription-confirmed`, `/playground`.
2. Card family validation: each card type renders with consistent hierarchy, interaction states, and token-compliant styling.
3. Navigation validation: nav menu actions, hero CTAs, project CTAs, pagination transitions.
4. Accessibility validation: keyboard traversal, focus-visible clarity, semantic interaction roles, contrast checks in light/dark.
5. Responsive validation: 320, 375, 768, 1260, 1680 widths with no horizontal overflow and preserved card geometry.
6. Motion validation: default expressive motion plus clean `prefers-reduced-motion` behavior.
7. Longform validation: post/note/activity notes, privacy policy, and AI docs all render with the same typographic system.
8. Build/lint validation: `pnpm build` must pass; touched frontend files must not introduce new lint regressions.

## Assumptions and Defaults
1. Fixed card unit and grid rhythm remain unchanged as the core identity.
2. Existing non-related dirty git changes remain untouched.
3. IBM Plex stack remains the base font system; expression comes from hierarchy, spacing, contrast, motion, and surfaces.
4. Edginess is intentional and preserved, with readability as the hard guardrail for longform content.
