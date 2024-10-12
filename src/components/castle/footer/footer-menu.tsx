'use client';

import ThemeSwitch from '@/components/theme-switcher';
import { Button } from '@/components/shadcn/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const FooterMenu = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-center  items-center p-6 bg-background text-gray-800 dark:text-gray-200 ">
      {session ? (
        <section className="flex flex-row items-center gap-6 text-center flex-wrap">
          <Button asChild size="icon" variant={'secondary'} aria-label="Home">
            <Link href="/public" className={`text-xl`}>
              🏰
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="Read all posts"
          >
            <Link href="/posts" className={`text-xl`}>
              📰
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="Rafa Lyovson"
          >
            <Link href="/rafa" className={`text-xl`}>
              🧔🏻
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="Jess Lyovson"
          >
            <Link href="/jess" className={`text-xl`}>
              👩🏻‍🦱
            </Link>
          </Button>

          <Button
            size="icon"
            variant={'secondary'}
            className="hover:bg-red-700/80"
            aria-label="Sign out"
            onClick={() => signOut()}
          >
            <Link href="#" className={`text-xl`}>
              🪪
            </Link>
          </Button>
        </section>
      ) : (
        <section className="flex flex-row items-center justify-center gap-6 text-center flex-wrap">
          <ThemeSwitch />
          <Button
            size="icon"
            variant={'secondary'}
            onClick={() => signIn()}
            aria-label="Sign in"
          >
            <Link href="#" className={`text-xl`}>
              🪪
            </Link>
          </Button>
        </section>
      )}
    </nav>
  );
};
