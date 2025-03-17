import { GridCardNavItem } from './grid-card-nav-item'

import { Input } from '@/components/ui/input'
import { Search } from '@/search/Component'

export const SearchInput = () => {
  return (
    <GridCardNavItem className={`col-start-1 col-end-4 row-start-1 row-end-2 `}>
      <Search />
    </GridCardNavItem>
  )
}
