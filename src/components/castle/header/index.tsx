import { Toolbar } from '@/components/castle/toolbar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/ui/avatar';
import { Button } from '@/components/shadcn/ui/button';
import { Sheet, SheetTrigger } from '@/components/shadcn/ui/sheet';
import { auth } from '@/data/auth';
import { UserFull } from '@/data/types/user-full';
import { userSelectFullAll } from '@/data/actions/db-actions/user/user-select-full-all';
import { userSelectFullOneById } from '@/data/actions/db-actions/user/user-select-full-one';
import Link from 'next/link';
import { Menu } from './user-menu';

export async function Header() {
  const session = await auth();
  const result = await userSelectFullAll();
  if (!result.success || !result.users) {
    return <div>No users found</div>;
  }

  const users = result.users;
  let user;
  if (session && session.user && session.user.id) {
    const fulluser = await userSelectFullOneById({ id: session.user.id });
    user = fulluser.user;
  }
  return (
    <>
      {user && <Toolbar user={user} />}
      <header
        className={`sticky ${user ? 'top-12' : 'top-0'} z-10 flex items-center justify-between h-24 px-4 border-b-4 bg-background shadow-md`}
      >
        <UserSheet user={users.filter((user) => user.username === 'jess')[0]} />
        <section>
          <Button asChild variant={'link'} className="hover:no-underline">
            <Link href="/public">
              <h1 className="mb-2 text-2xl lg:text-4xl font-bold text-primary">
                Lyovson.com
              </h1>
            </Link>
          </Button>
        </section>
        <UserSheet user={users.filter((user) => user.username === 'rafa')[0]} />
      </header>
    </>
  );
}

async function UserSheet({ user }: { user: UserFull }) {
  return (
    <section className="flex items-center">
      <Sheet>
        <SheetTrigger>
          <Avatar
            className="w-12 h-12 hover:ring-2 ring-primary transition-all rounded-full shadow-md"
            aria-label={`Open ${user.name}'s Menu`}
          >
            <AvatarImage
              src={user.avatar?.url || '/placeholder-avatar.jpg'}
              alt={`${user.name}'s avatar`}
            />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <Menu user={user} />
      </Sheet>
    </section>
  );
}
