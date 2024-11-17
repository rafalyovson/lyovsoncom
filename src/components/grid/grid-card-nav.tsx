import { GridCard } from '@/components/grid/grid-card';
import Link from 'next/link';
import {
  Contact,
  Home,
  LayoutDashboard,
  Newspaper,
  Plus,
  User,
} from 'lucide-react';
import React, { ReactNode } from 'react';
import { auth } from '@/data/auth';
import ThemeSwitch from '@/components/theme-switcher';
import { SignOutButton } from '@/components/grid/sign-out-button';

const GridCardNavItem = ({
  children,
  link,
}: {
  children: ReactNode;
  link?: string;
}) => {
  if (link) {
    return (
      <Link
        href={link}
        className="border flex flex-col gap-2 items-center justify-center h-full"
      >
        {children}
      </Link>
    );
  }
  return (
    <div className="border flex flex-col gap-2 items-center justify-center h-full cursor-pointer ">
      {children}
    </div>
  );
};

export const GridCardNav = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <GridCard>
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
      <GridCardNavItem link={`#`}>
        <ThemeSwitch />
      </GridCardNavItem>
      {user && (
        <>
          <GridCardNavItem link="/dungeon/">
            <LayoutDashboard className="w-7 h-7" />
            <span>Dungeon</span>
          </GridCardNavItem>
          <GridCardNavItem link="/dungeon/posts/create">
            <Plus className="w-7 h-7" />
            <span>New Post</span>
          </GridCardNavItem>
          <GridCardNavItem>
            <SignOutButton />
          </GridCardNavItem>
        </>
      )}
    </GridCard>
  );
};
