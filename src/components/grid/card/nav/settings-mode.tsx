import { GridCardNavItem } from './grid-card-nav-item'
import { MenuModeType } from './types'
import { X, ShieldUser } from 'lucide-react'
import { ThemeSwitcher } from './theme-switcher'
import Link from 'next/link'

export const SettingsMode = ({
  setMenuMode,
}: {
  setMenuMode: (menuMode: MenuModeType) => void
}) => {
  return (
    <>
      <GridCardNavItem className={`row-start-1 row-end-2 col-start-1 col-end-2`}>
        <AdminLink />
      </GridCardNavItem>
      <ThemeSwitcher className={`row-start-2 row-end-3 col-start-2 col-end-3`} />
      <GridCardNavItem
        className={`col-start-3 col-end-4 row-start-3 row-end-4`}
        onClick={() => setMenuMode('hero')}
      >
        <X className="w-7 h-7" />
        <span>Close</span>
      </GridCardNavItem>
    </>
  )
}

const AdminLink = () => {
  return (
    <Link className="flex flex-col justify-center items-center gap-2" href="/admin">
      <ShieldUser className="w-7 h-7" />
      <span>Admin</span>
    </Link>
  )
}
