import UserModeProvider from "@/app/(tower)/lib/UserModeProvider.js";
import Footer from "@/app/(tower)/ui/Footer.js";
import Header from "@/app/(tower)/ui/Header.js";
import Main from "@/app/(tower)/ui/Main.js";
export default async function Layout({ children }) {
  return (
    <>
      <UserModeProvider>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </UserModeProvider>
    </>
  );
}
