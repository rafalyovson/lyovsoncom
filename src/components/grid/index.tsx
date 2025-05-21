import React, { ReactNode } from 'react'

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid grid-cols-1 g2:grid-cols-2 g3:grid-cols-3 g4:grid-cols-4 g5:grid-cols-5 g6:grid-cols-6 mx-auto gap-4 place-items-center p-4 g2:[grid-auto-rows:max-content]">
      {children}
    </main>
  )
}

export { GridCard } from './card'
export { GridCardHero } from './card/hero'
export { GridCardNav, GridCardNavItem } from './card/nav'
export { GridCardPost } from './card/post'
export { GridCardRelatedPosts } from './card/related'
export { GridCardSection } from './card/section'
export { GridCardSubscribe } from './card/subscribe'
export { GridCardNotFound } from './card/not-found'
export { GridCardSubscribeConfirmed } from './card/subscribe/confirmed'
