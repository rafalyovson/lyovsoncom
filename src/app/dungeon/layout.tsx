import Sidebar from "./ui/Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow">{children}</main>
    </section>
  );
}
