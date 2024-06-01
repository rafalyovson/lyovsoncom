import Header from "./ui/Header";
import Sidebar from "./ui/Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
