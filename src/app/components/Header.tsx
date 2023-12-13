"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../Providers";
import { ImageButton } from "./ImageButton";
import ThemeSwitch from "./ThemeSwitcher";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <header className="border-b border-dark dark:border-light flex items-center justify-between h-20 sticky px-4 top-0 z-10">
      <ImageButton src="/jess.png" handleImageClick={() => setUser("Jess")} />
      <section className="flex gap-4 items-baseline">
        <ThemeSwitch />
        <Link href="/">
          <h1 onClick={() => setUser("Both")} className="text-4xl mb-2">
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
