'use client';

import { Button } from '@/components/shadcn/ui/button';
import { UserFull } from '@/data/types/user-full';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faDungeon,
} from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';

export function Toolbar(props: { user: UserFull }) {
  const { user } = props;

  const pathName = usePathname();

  return (
    <>
      {user && (
        <header
          className={`sticky top-0 z-10 flex items-center justify-between h-12 px-4 border-b-4 bg-background `}
        >
          <Button variant="outline" size="icon">
            <Link href={`/dungeon/users/${user.username}`}>
              <Image
                className="overflow-hidden rounded-md aspect-square object-cover"
                src={user.avatar?.url || ''}
                width={36}
                height={36}
                alt={user.avatar?.altText || ''}
              />
            </Link>
          </Button>
          <section className="flex  gap-2 items-center">
            <Button asChild variant={'secondary'} size="icon">
              <Link href={`/dungeon`}>
                <FontAwesomeIcon
                  icon={faDungeon}
                  className="text-primary dark:text-primary-light"
                />
              </Link>
            </Button>
            {/^\/posts\/[^\/]+$/.test(pathName) && (
              <Button asChild variant={'default'} size="icon">
                <Link href={`/dungeon/posts/update/${pathName.split('/')[2]}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            )}
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
        </header>
      )}
    </>
  );
}
