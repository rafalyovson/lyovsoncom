import { Newspaper } from 'lucide-react'
import { User } from 'lucide-react'
import { X } from 'lucide-react'

import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'

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
        <User className="w-7 h-7" />
        <span>Jess</span>
      </GridCardNavItem>
      <GridCardNavItem
        className={`col-start-2 col-end-3 row-start-2 row-end-3`}
        onClick={() => setMenuMode('hero')}
      >
        <X className="w-7 h-7" />
        <span>Close</span>
      </GridCardNavItem>
      <GridCardNavItem link="/rafa" className="row-start-2 row-end-3 col-start-3 col-end-4">
        <User className="w-7 h-7" />
        <span>Rafa</span>
      </GridCardNavItem>
    </>
  )
}
