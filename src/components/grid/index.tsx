import { ReactNode } from 'react'

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid grid-cols-[400px] g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px] g4:grid-cols-[400px_400px_400px_400px] g5:grid-cols-[400px_400px_400px_400px_400px] g6:grid-cols-[400px_400px_400px_400px_400px_400px] mx-auto gap-4 place-items-center justify-center p-4 g2:[grid-auto-rows:max-content]">
      {children}
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
