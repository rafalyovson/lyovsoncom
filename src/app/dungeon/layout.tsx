import { getCurrentUser } from "../../lib/getCurrentUser";
import Footer from "./ui/Footer";
import Header from "./ui/Header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Header user={currentUser} />
      {children}
      <Footer />
    </>
  );
}
