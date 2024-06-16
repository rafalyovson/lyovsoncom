import { Header } from "./ui/header";
import { Sidebar } from "./ui/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex  flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
