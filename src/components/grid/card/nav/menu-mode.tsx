import { Atom, Flower, Newspaper } from 'lucide-react'
import { User } from 'lucide-react'
import { X } from 'lucide-react'

import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { ThemeSwitcher } from './theme-switcher'

export const MenuMode = ({ setMenuMode }: { setMenuMode: (menuMode: MenuModeType) => void }) => {
  return (
    <>
      <GridCardNavItem
        className={`col-start-2 col-end-3 row-start-1 row-end-2`}
        onClick={() => setMenuMode('hero')}
      >
        <Newspaper className="w-7 h-7" />
        <span>Posts</span>
      </GridCardNavItem>
      <GridCardNavItem link="/jess" className="row-start-2 row-end-3 col-start-1 col-end-2">
        <Flower className="w-7 h-7" />
        <span>Jess</span>
      </GridCardNavItem>
      <GridCardNavItem
        className={`col-start-2 col-end-3 row-start-3 row-end-4`}
        onClick={() => setMenuMode('hero')}
      >
        <X className="w-7 h-7" />
        <span>Close</span>
      </GridCardNavItem>
      <GridCardNavItem link="/rafa" className="row-start-2 row-end-3 col-start-3 col-end-4">
        <Atom className="w-7 h-7" />
        <span>Rafa</span>
      </GridCardNavItem>
    </>
  )
}
