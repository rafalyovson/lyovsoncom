import Menu from "@/app/dungeon/ui/Menu";
import Image from "next/image";

const Header = ({ user }) => {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-center gap-4 p-4 border-b-4 md:justify-between bg-light dark:bg-dark border-dark dark:border-light">
      <section className="flex gap-4">
        <Image
          className="rounded size-20"
          alt={user.name + " photo"}
          src={user.image ?? ""}
          width={400}
          height={400}
        />
        <h1 className="flex flex-col gap-4 my-4 text-2xl font-bold text-dark dark:text-light">
          Welcome, {user.name}
          <div className="h-2 w-[100%] mx-auto rounded-lg bg-gradient-to-r from-jess to-rafa"></div>
        </h1>
      </section>
      <Menu />
    </header>
  );
};

export default Header;
