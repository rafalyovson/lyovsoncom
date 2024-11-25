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

export const GridCardHeader = async ({ className }: { className?: string }) => {
  return (
    <GridCard className={`col-start-1 col-end-2 row-start-1 row-end-2 ${className}`}>
      <Link
        className={`border row-start-1 row-end-3 col-start-1 col-end-4 flex flex-col justify-center items-center p-2 bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1c1c1e] dark:to-[#121212] rounded-lg shadow-md hover:shadow-lg `}
        href="/"
      >
        <h1 className={`text-3xl text-center my-10`}>Lyovson.com</h1>
      </Link>

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
      {/* <GridCardNavItem link="/posts">
        <Newspaper className="w-7 h-7" />
        <span>Posts</span>
      </GridCardNavItem>
      <GridCardNavItem link="/contact">
        <Contact className="w-7 h-7" />
        <span>Contact</span>
      </GridCardNavItem> */}
    </GridCard>
  )
}
