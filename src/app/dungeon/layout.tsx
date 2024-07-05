import { Header } from './ui/header';
import { Sidebar } from './ui/sidebar';
import { auth } from '@/data/auth';
import { userSelectFullOneById } from '@/lib/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }
  const result = await userSelectFullOneById({ id: session.user.id! });
  if (!result.success || !result.user) {
    redirect('/login');
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
