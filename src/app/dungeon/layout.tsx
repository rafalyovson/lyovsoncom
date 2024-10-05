import { Header } from '@/components/dungeon/header';
import { Sidebar } from '@/components/dungeon/sidebar';
import { auth } from '@/data/auth';
import { userSelectFullOneById } from '@/data/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/');
  }
  const result = await userSelectFullOneById({ id: session.user.id! });
  if (!result.success || !result.user) {
    redirect('/');
  }

  return (
    <div className="flex  flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={result.user} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
