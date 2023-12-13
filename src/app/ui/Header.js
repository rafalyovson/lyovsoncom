"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../Providers";
import { ImageButton } from "./ImageButton";
import ThemeSwitch from "./ThemeSwitcher";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-20 px-4 border-b-4 bg-light dark:bg-dark border-dark dark:border-light">
      <ImageButton src="/jess.png" handleImageClick={() => setUser("Jess")} />
      <section className="flex items-baseline gap-4">
        <ThemeSwitch />
        <Link href="/">
          <h1 onClick={() => setUser("Both")} className="mb-2 text-4xl ">
            Lyovson.com
          </h1>
          <div className="h-2 w-[100%] mx-auto rounded-lg bg-gradient-to-r from-jess to-rafa"></div>
        </Link>

        <ThemeSwitch />
      </section>

      <ImageButton src="/rafa.png" handleImageClick={() => setUser("Rafa")} />
    </header>
  );
};

export default Header;
