import { GridCard } from '@/components/grid/grid-card'
import Link from 'next/link'
import { Contact, Home, Newspaper, User } from 'lucide-react'
import React, { ReactNode } from 'react'

const GridCardNavItem = ({ children, link }: { children: ReactNode; link?: string }) => {
  if (link) {
    return (
      <Link href={link} className="border flex flex-col gap-2 items-center justify-center h-full">
        {children}
      </Link>
    )
  }
  return (
    <div className="border flex flex-col gap-2 items-center justify-center h-full cursor-pointer ">
      {children}
    </div>
  )
}

export const GridCardNav = async ({ className }: { className?: string }) => {
  return (
    <GridCard className={`${className}`}>
      <GridCardNavItem link="/jess">
        <User className="w-7 h-7" />
        <span>Jess</span>
      </GridCardNavItem>
      <GridCardNavItem link="/">
        <Home className="w-7 h-7" />
        <span>Home</span>
      </GridCardNavItem>
      <GridCardNavItem link="/rafa">
        <User className="w-7 h-7" />
        <span>Rafa</span>
      </GridCardNavItem>
      <GridCardNavItem link="/posts">
        <Newspaper className="w-7 h-7" />
        <span>Posts</span>
      </GridCardNavItem>
      <GridCardNavItem link="/contact">
        <Contact className="w-7 h-7" />
        <span>Contact</span>
      </GridCardNavItem>
    </GridCard>
  )
}
