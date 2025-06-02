import Link from 'next/link'
import { ReactNode } from 'react'

import { GridCardSection } from '../section'

type GridCardNavItemProps = {
  children: ReactNode
  link?: string
  onClick?: () => void
  className?: string
}

export const GridCardNavItem = ({ children, link, onClick, className }: GridCardNavItemProps) => {
  if (link) {
    return (
      <GridCardSection interactive className={`group glass-interactive ${className}`}>
        <Link
          href={link}
          className="flex flex-col gap-2 items-center justify-center h-full glass-text group-hover:text-[var(--glass-text-secondary)] transition-colors duration-300"
        >
          {children}
        </Link>
      </GridCardSection>
    )
  }
  return (
    <GridCardSection
      onClick={onClick}
      interactive
      className={`flex flex-col gap-2 items-center justify-center h-full cursor-pointer glass-interactive glass-text ${className}`}
    >
      {children}
    </GridCardSection>
  )
}
