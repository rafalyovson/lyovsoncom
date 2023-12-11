"use client";

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../Providers";
import { ImageButton } from "./ImageButton";
import ThemeSwitch from "./ThemeSwitcher";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <header className="bg-gradient-to-r from-jess from-[400px] to-[calc(100vw-400px)] to-rafa text-light flex items-center justify-between h-20 sticky px-4 top-0 z-10">
      <ImageButton src="/jess.png" handleImageClick={() => setUser("Jess")} />
      <section className="flex gap-2 items-center">
        <ThemeSwitch />
        <Link href="/">
          <h1 onClick={() => setUser("Both")} className="text-4xl">
            Lyovson.com
          </h1>
        </Link>

        <ThemeSwitch />
      </section>
      <ImageButton src="/rafa.png" handleImageClick={() => setUser("Rafa")} />
    </header>
  );
};

export default Header;
