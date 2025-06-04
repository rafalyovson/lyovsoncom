'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MenuModeType } from './types'
import { HeroMode } from './hero-mode'
import { SearchMode } from './search-mode'
import { MenuMode } from './menu-mode'
import { SettingsMode } from './settings-mode'
import { GridCard } from '@/components/grid'

export const GridCardNav = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')
  const [menuMode, setMenuMode] = useState<MenuModeType>(search ? 'search' : 'hero')
  return (
    <GridCard className={`  ${className}`}>
      {
        {
          hero: <HeroMode setMenuMode={setMenuMode} />,
          search: <SearchMode setMenuMode={setMenuMode} />,
          menu: <MenuMode setMenuMode={setMenuMode} />,
          settings: <SettingsMode setMenuMode={setMenuMode} />,
        }[menuMode]
      }
    </GridCard>
  )
}

export { GridCardNavItem } from './grid-card-nav-item'
