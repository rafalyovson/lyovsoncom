import { Toolbar } from '@/components/castle/toolbar';
import { Button } from '@/components/shadcn/ui/button';
import { auth } from '@/data/auth';
import { userSelectFullOneById } from '@/data/actions/db-actions/user/user-select-full-one';
import Link from 'next/link';

export async function Header() {
  const session = await auth();
  let user;
  if (session && session.user && session.user.id) {
    const fulluser = await userSelectFullOneById({ id: session.user.id });
    user = fulluser.user;
  }

  return (
    <>
      {user && <Toolbar user={user} />}
      <header
        className={`sticky ${user ? 'top-12' : 'top-0'} z-10 flex items-center justify-center h-24 px-4 border-b-4 bg-background shadow-md`}
      >
        <Button asChild variant={'link'} className="hover:no-underline">
          <Link href="/public">
            <h1 className="mb-2 text-2xl lg:text-4xl font-bold text-primary">
              Lyovson.com
            </h1>
          </Link>
        </Button>
      </header>
    </>
  );
}
