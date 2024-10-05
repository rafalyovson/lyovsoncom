import { Footer } from '@/components/castle/footer';
import { Header } from '@/components/castle/header';
import { Main } from '@/components/castle/main';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <section className="min-h-screen flex flex-col">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </section>
  );
};

export default Layout;
