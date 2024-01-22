import UserModeProvider from "@/app/(castle)/lib/UserModeProvider.js";
import WindowWidthProvider from "@/app/(castle)/lib/WindowWidthProvider";
import Footer from "@/app/(castle)/ui/Footer.js";
import Header from "@/app/(castle)/ui/Header.js";
import Main from "@/app/(castle)/ui/Main.js";

export default async function Layout({ children }) {
  return (
    <>
      <UserModeProvider>
        <WindowWidthProvider>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </WindowWidthProvider>
      </UserModeProvider>
    </>
  );
}
