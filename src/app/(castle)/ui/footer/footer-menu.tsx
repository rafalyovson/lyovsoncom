'use client';

import ThemeSwitch from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import {
  faArrowRightFromBracket,
  faDungeon,
  faFileText,
  faGamepad,
  faPlus,
  faRightToBracket,
  faTowerObservation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const FooterMenu = () => {
  const { data: session } = useSession();

  return (
    <nav className=" flex ">
      {session && (
        <section className="flex flex-row items-center  gap-4 text-center flex-wrap">
          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="create a new post"
          >
            <Link href="/dungeon/posts/create">
              <FontAwesomeIcon icon={faPlus} className="rounded-full" />
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="return to the entrance of the dungeon"
          >
            <Link href="/dungeon">
              <FontAwesomeIcon icon={faDungeon} className="rounded-full" />
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="visit the playground"
          >
            <Link href={{ pathname: '/dungeon/playground' }}>
              <FontAwesomeIcon icon={faGamepad} className="rounded-full" />
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="return to the tower"
          >
            <Link href="/">
              <FontAwesomeIcon
                icon={faTowerObservation}
                className="rounded-full"
              />
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="read all the posts"
          >
            <Link href="/posts">
              <FontAwesomeIcon icon={faFileText} className="rounded-full" />
            </Link>
          </Button>

          <ThemeSwitch />

          <Button
            size="icon"
            variant={'secondary'}
            aria-label="sign out"
            onClick={() => signOut()}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="rounded-full"
            />
          </Button>
        </section>
      )}
      {!session && (
        <section className="flex flex-row items-center justify-center gap-4 text-center flex-wrap">
          <Button
            size="icon"
            variant={'secondary'}
            onClick={() => signIn()}
            aria-label="sign in"
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="rounded-full "
            />
          </Button>
          <ThemeSwitch />
        </section>
      )}
    </nav>
  );
};
