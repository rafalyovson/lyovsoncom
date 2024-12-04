import { GridCard } from '@/components/grid/grid-card'
import { Contact, Home, Newspaper, User } from 'lucide-react'
import React from 'react'
import { GridCardNavItem } from './grid-card-nav-item'

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
