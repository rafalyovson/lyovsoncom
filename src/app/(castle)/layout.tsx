import UserModeProvider from "@/app/(castle)/lib/UserModeProvider";
import WindowWidthProvider from "@/app/(castle)/lib/WindowWidthProvider";
import Footer from "@/app/(castle)/ui/Footer";
import Header from "@/app/(castle)/ui/Header";
import Main from "@/app/(castle)/ui/Main";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserModeProvider>
      <WindowWidthProvider>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </WindowWidthProvider>
    </UserModeProvider>
  );
}
