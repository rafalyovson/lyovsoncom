import Footer from "./ui/Footer";
import Header from "./ui/Header";
import Main from "./ui/Main";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-col justify-between">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </section>
  );
}
