'use client';

import ThemeSwitch from '@/components/theme-switcher';
import { Button } from '@/components/shadcn/ui/button';
import {
  faArrowRightFromBracket,
  faFileText,
  faRightToBracket,
  faTowerObservation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const FooterMenu = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-center items-center p-6 bg-background text-gray-800 dark:text-gray-200 ">
      {session ? (
        <section className="flex flex-row items-center gap-6 text-center flex-wrap">
          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="Return to the tower"
          >
            <Link href="/public">
              <FontAwesomeIcon
                icon={faTowerObservation}
                className="text-primary dark:text-primary-light"
              />
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            variant={'secondary'}
            aria-label="Read all posts"
          >
            <Link href="/posts">
              <FontAwesomeIcon
                icon={faFileText}
                className="text-primary dark:text-primary-light"
              />
            </Link>
          </Button>

          <ThemeSwitch />

          <Button
            size="icon"
            variant={'secondary'}
            className="hover:bg-red-700/80"
            aria-label="Sign out"
            onClick={() => signOut()}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-primary dark:text-primary-light"
            />
          </Button>
        </section>
      ) : (
        <section className="flex flex-row items-center justify-center gap-6 text-center flex-wrap">
          <Button
            size="icon"
            variant={'secondary'}
            onClick={() => signIn()}
            aria-label="Sign in"
          >
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="text-primary dark:text-primary-light"
            />
          </Button>
          <ThemeSwitch />
        </section>
      )}
    </nav>
  );
};
