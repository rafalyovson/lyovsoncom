import { LucideMenu, Search } from 'lucide-react'

import Link from 'next/link'
import { GridCardSection } from '../section'
import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { ThemeSwitcher } from './theme-switcher'

export const HeroMode = ({ setMenuMode }: { setMenuMode: (menuMode: MenuModeType) => void }) => {
  return (
    <>
      <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
        <Link className={` flex flex-col h-full justify-center items-center`} href="/">
          <h1 className={`text-3xl text-center`}>Lyovson.com</h1>
        </Link>
      </GridCardSection>

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
      <ThemeSwitcher className={``} />
    </>
  )
}
