import { ReactNode } from 'react'

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative min-h-screen grid grid-cols-[400px] g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px] g4:grid-cols-[400px_400px_400px_400px] g5:grid-cols-[400px_400px_400px_400px_400px] g6:grid-cols-[400px_400px_400px_400px_400px_400px] mx-auto gap-4 place-items-center justify-center p-4 g2:[grid-auto-rows:max-content]">
      {/* Theme-aware glassmorphism background context */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, var(--grid-bg-start), var(--grid-bg-middle), var(--grid-bg-end))`,
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% -20%, var(--grid-bg-middle), transparent)`,
        }}
      />

      {/* Enhanced children with staggered animations */}
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div key={index} className={`glass-stagger-${Math.min(index + 1, 6)} contents`}>
              {child}
            </div>
          ))
        : children}
    </main>
  )
}

export { GridCard } from './card'
export { GridCardHero } from './card/hero'
export { GridCardNav, GridCardNavItem } from './card/nav'
export { GridCardNotFound } from './card/not-found'
export { GridCardPostFull, GridCardPostSearch } from './card/post'
export { GridCardRelatedPosts } from './card/related'
export { GridCardSection } from './card/section'
export { GridCardSubscribe } from './card/subscribe'
export { GridCardSubscribeConfirmed } from './card/subscribe/confirmed'
export { SkeletonCard, SkeletonGrid } from './skeleton'
export { GridCardUserSocial } from './card/user-social'
export { GridCardJess, GridCardRafa } from './card/user'
