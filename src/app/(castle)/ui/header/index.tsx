import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from './user-menu';
import { userSelectFullAll } from '@/lib/actions/db-actions/user/user-select-full-all';
import { UserFull } from '@/data/types/user-full';

export async function Header() {
  const result = await userSelectFullAll();
  if (!result.success || !result.users) {
    return <div>No users found</div>;
  }
  const users = result.users;
  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between h-24 px-4 border-b-4 bg-background ">
        <UserSheet user={users.filter((user) => user.username === 'jess')[0]} />
        <section>
          <Button asChild variant={'link'}>
            <Link href="/">
              <h1 className="mb-2 text-2xl lg:text-4xl ">Lyovson.com</h1>
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
    <section>
      <Sheet>
        <SheetTrigger>
          <Avatar className="w-12 h-14" aria-label="Open Rafa Menu">
            <AvatarImage src={user.avatar?.url || ''} />
            <AvatarFallback>RL</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <Menu user={user} />
      </Sheet>
    </section>
  );
}
