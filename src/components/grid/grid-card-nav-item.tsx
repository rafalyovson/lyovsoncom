import Link from 'next/link'
import { GridCardSection } from './grid-card-section'
import { ReactNode } from 'react'

export const GridCardNavItem = ({ children, link }: { children: ReactNode; link?: string }) => {
  if (link) {
    return (
      <GridCardSection>
        <Link href={link} className=" flex flex-col gap-2 items-center justify-center h-full">
          {children}
        </Link>
      </GridCardSection>
    )
  }
  return (
    <GridCardSection className=" flex flex-col gap-2 items-center justify-center h-full cursor-pointer ">
      {children}
    </GridCardSection>
  )
}
