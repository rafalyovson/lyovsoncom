import { X } from 'lucide-react'
import Link from 'next/link'

import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { SearchInput } from './search-input'
import { GridCardSection } from '../section'
import { SiteTitleSection } from './site-title-section'

export const SearchMode = ({ setMenuMode }: { setMenuMode: (menuMode: MenuModeType) => void }) => {
  return (
    <>
      <SiteTitleSection />
      <GridCardNavItem
        className={`col-start-1 col-end-2 row-start-3 row-end-4`}
        onClick={() => setMenuMode('hero')}
      >
        <X className="w-7 h-7" />
        <span>Close</span>
      </GridCardNavItem>
      <SearchInput className="col-start-2 col-end-4 row-start-3 row-end-4" />
    </>
  )
}
