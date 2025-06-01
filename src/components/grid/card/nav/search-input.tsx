import { GridCardNavItem } from './grid-card-nav-item'

import { Input } from '@/components/ui/input'
import { Search } from '@/search/Component'
import { cn } from '@/utilities/cn'

export const SearchInput = ({ className }: { className?: string }) => {
  return (
    <GridCardNavItem className={cn(' ', className)}>
      <Search className="w-full" />
    </GridCardNavItem>
  )
}
