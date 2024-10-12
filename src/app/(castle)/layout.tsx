import { Main } from '@/components/castle/main';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <section className="min-h-screen flex flex-col">
      <Main>{children}</Main>
    </section>
  );
};

export default Layout;
