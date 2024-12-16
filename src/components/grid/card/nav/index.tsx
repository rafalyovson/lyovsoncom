'use client'

import { Index } from '@/components/grid/card'
import { useState } from 'react'
import { MenuModeType } from './types'
import { HeroMode } from './hero-mode'
import { SearchMode } from './search-mode'
import { MenuMode } from './menu-mode'
export const GridCardNav = ({ className }: { className?: string }) => {
  const [menuMode, setMenuMode] = useState<MenuModeType>('hero')
  return (
    <Index className={`col-start-1 col-end-2 row-start-1 row-end-2  ${className}`}>
      {
        {
          hero: <HeroMode setMenuMode={setMenuMode} />,
          search: <SearchMode setMenuMode={setMenuMode} />,
          menu: <MenuMode setMenuMode={setMenuMode} />,
        }[menuMode]
      }
    </Index>
  )
}

export { GridCardNavItem } from './grid-card-nav-item'
