'use client';

import { Button } from '@/components/ui/button';
import { FooterMenu } from '@/app/(castle)/ui/footer/footer-menu';
import Image from 'next/image';
import { UserFull } from '@/data/types/user-full';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';

export function Toolbar(props: { user: UserFull }) {
  const { user } = props;
  console.log('🐤', user);

  const pathName = usePathname();
  console.log('🐤', pathName);

  return (
    <>
      {user && (
        <header
          className={`sticky top-0 z-10 flex items-center justify-between h-12 px-4 border-b-4 bg-background `}
        >
          <Button variant="outline" size="icon">
            <Image
              className="overflow-hidden rounded-md aspect-square object-cover"
              src={user.avatar?.url || ''}
              width={36}
              height={36}
              alt={user.avatar?.altText || ''}
            />
          </Button>
          {/^\/posts\/[^\/]+$/.test(pathName) && (
            <Button asChild variant={'secondary'} size="icon">
              <Link href={`/dungeon/posts/update/${pathName.split('/')[2]}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          )}

          <FooterMenu />
        </header>
      )}
    </>
  );
}
