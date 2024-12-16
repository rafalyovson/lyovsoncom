import { X } from 'lucide-react'
import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { SearchInput } from './search-input'

export const SearchMode = ({ setMenuMode }: { setMenuMode: (menuMode: MenuModeType) => void }) => {
  return (
    <>
      <GridCardNavItem
        className={`col-start-2 col-end-3 row-start-2 row-end-3`}
        onClick={() => setMenuMode('hero')}
      >
        <X className="w-7 h-7" />
        <span>Close</span>
      </GridCardNavItem>
      <SearchInput />
    </>
  )
}
