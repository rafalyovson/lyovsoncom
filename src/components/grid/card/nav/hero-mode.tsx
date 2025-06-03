import { Filter, LucideMenu, Search, Settings } from 'lucide-react'
import Link from 'next/link'

import { GridCardSection } from '../section'

import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { ThemeSwitcher } from './theme-switcher'
import { SiteTitleSection } from './site-title-section'
import { SettingsMode } from './settings-mode'

export const HeroMode = ({ setMenuMode }: { setMenuMode: (menuMode: MenuModeType) => void }) => {
  return (
    <>
      <SiteTitleSection />

      <GridCardNavItem
        onClick={() => {
          setMenuMode('search')
        }}
        className="row-start-3 row-end-4 col-start-1 col-end-2"
      >
        <Search className="w-7 h-7" />
        <span>Search</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="row-start-3 row-end-4 col-start-2 col-end-3"
        onClick={() => {
          setMenuMode('menu')
        }}
      >
        <LucideMenu className="w-7 h-7" />
        <span>Menu</span>
      </GridCardNavItem>
      <GridCardNavItem
        onClick={() => {
          setMenuMode('settings')
        }}
        className="row-start-3 row-end-4 col-start-3 col-end-4"
      >
        <Settings className="w-7 h-7" />
        <span>Settings</span>
      </GridCardNavItem>
    </>
  )
}
